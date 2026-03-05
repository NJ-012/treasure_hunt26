import pool from '../db/db.js';
import { calculateTeamPoints } from '../utils/pointsCalculator.js';
import { uploadToCloudinary } from '../utils/cloudinaryUploader.js';

export const getTeams = async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT id, username FROM users WHERE role = $1', ['participant']);

    const teamsWithPoints = await Promise.all(
      rows.map(async (user) => {
        let answers_count = 0;
        try {
          const countResult = await pool.query(`SELECT COUNT(*) FROM "user_answers_${user.username}"`);
          answers_count = parseInt(countResult.rows[0].count) || 0;
        } catch { /* table might not exist yet */ }

        return {
          ...user,
          total_points: await calculateTeamPoints(user.username),
          answers_count,
        };
      })
    );

    res.json({
      success: true,
      teams: teamsWithPoints
    });
  } catch (error) {
    console.error('Error in getTeams:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch teams',
      error: error.message
    });
  }
};

export const getTeamAnswers = async (req, res) => {
  try {
    const { username } = req.params;

    // Table names with special characters like '@' must be double-quoted
    const answersQuery = `
      SELECT 
        ua.*,
        qb.question as question_text,
        qb.points,
        qb.requires_image,
        u.username as reviewed_by_username
      FROM "user_answers_${username}" ua
      JOIN question_bank qb ON ua.question_id = qb.id
      LEFT JOIN users u ON ua.reviewed_by = u.id
      ORDER BY ua.submitted_at DESC
    `;

    const { rows } = await pool.query(answersQuery);
    res.json({
      success: true,
      answers: rows
    });
  } catch (error) {
    console.error('Error fetching team answers:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// --- PERSISTENCE FIX: ensure is_accepted is not saved as NULL ---
export const reviewAnswer = async (req, res) => {
  try {
    const { username, answerId } = req.params;

    // Check for both frontend (isAccepted) and backend (is_accepted) naming
    const isAcceptedValue = req.body.isAccepted !== undefined ? req.body.isAccepted : req.body.is_accepted;

    // Explicitly convert to boolean to prevent NULL in database
    const isAccepted = isAcceptedValue === true || isAcceptedValue === 'true';
    const feedback = req.body.feedback || req.body.admin_feedback || null;

    // Ensure admin ID exists from token
    const adminId = req.user?.id;
    if (!adminId) {
      return res.status(401).json({ success: false, message: 'Admin ID missing' });
    }

    const updateQuery = `
      UPDATE "user_answers_${username}"
      SET 
        is_reviewed = true,
        is_accepted = $1,
        admin_feedback = $2,
        reviewed_at = CURRENT_TIMESTAMP,
        reviewed_by = $3
      WHERE id = $4
      RETURNING *
    `;

    const { rows } = await pool.query(updateQuery, [
      isAccepted,
      feedback,
      adminId,
      answerId
    ]);

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Answer not found'
      });
    }

    res.json({
      success: true,
      message: `Answer ${isAccepted ? 'accepted' : 'rejected'} successfully`,
      answer: rows[0]
    });
  } catch (error) {
    console.error('Error reviewing answer:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const createTeam = async (req, res) => {
  try {
    const { username } = req.user;

    const userResult = await pool.query(
      'SELECT id FROM users WHERE username = $1',
      [username]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const userId = userResult.rows[0].id;

    const existingAssignments = await pool.query(
      'SELECT COUNT(*) FROM question_assignments WHERE user_id = $1',
      [userId]
    );

    if (parseInt(existingAssignments.rows[0].count) > 0) {
      return res.status(400).json({
        success: false,
        message: 'Questions already assigned to this user'
      });
    }

    const questions = await pool.query(
      'SELECT id FROM question_bank ORDER BY RANDOM()'
    );

    for (const question of questions.rows) {
      await pool.query(
        'INSERT INTO question_assignments (user_id, question_id) VALUES ($1, $2)',
        [userId, question.id]
      );
    }

    res.status(201).json({
      success: true,
      message: 'Questions assigned successfully'
    });
  } catch (error) {
    console.error('Error creating team:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const getCurrentQuestion = async (req, res) => {
  try {
    const { id: userId, username } = req.user;

    // ── EVENT START GATE — DISABLED FOR TESTING ──
    const EVENT_START = new Date('2026-03-06T05:30:00.000Z');
    const now = new Date();
    if (now < EVENT_START) {
      return res.json({
        success: true,
        not_started: true,
        event_start: EVENT_START.toISOString(),
        message: 'The treasure hunt has not started yet!'
      });
    }

    // 1. AUTO-ASSIGNMENT: If user has no questions, assign ALL questions in random order
    const checkAssignments = await pool.query(
      'SELECT COUNT(*) FROM question_assignments WHERE user_id = $1',
      [userId]
    );

    if (parseInt(checkAssignments.rows[0].count) === 0) {
      const questions = await pool.query(
        'SELECT id FROM question_bank ORDER BY RANDOM()'
      );

      for (const question of questions.rows) {
        await pool.query(
          'INSERT INTO question_assignments (user_id, question_id) VALUES ($1, $2)',
          [userId, question.id]
        );
      }
    }

    // 2. Check if the user's answer table exists
    const tableCheckQuery = `
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = $1
      )
    `;
    const tableExists = await pool.query(tableCheckQuery, [`user_answers_${username}`]);

    // Check if requesting bonus question
    const isBonusReq = req.query.is_bonus === 'true';
    const pointCondition = isBonusReq ? 'qb.points = 15' : 'qb.points != 15';

    // 3. Get answered count for normal vs bonus questions
    let normalAnsweredCount = 0;
    let bonusAnsweredCount = 0;
    if (tableExists.rows[0].exists) {
      const answeredResult = await pool.query(
        `SELECT 
          SUM(CASE WHEN qb.points != 15 THEN 1 ELSE 0 END) as normal_count,
          SUM(CASE WHEN qb.points = 15 THEN 1 ELSE 0 END) as bonus_count
         FROM "user_answers_${username}" ua
         JOIN question_bank qb ON ua.question_id = qb.id`
      );
      normalAnsweredCount = parseInt(answeredResult.rows[0].normal_count || 0);
      bonusAnsweredCount = parseInt(answeredResult.rows[0].bonus_count || 0);
    }

    let questionResult;

    if (tableExists.rows[0].exists) {
      questionResult = await pool.query(
        `SELECT qa.id as assignment_id, qb.* FROM question_assignments qa
           JOIN question_bank qb ON qa.question_id = qb.id
           WHERE qa.user_id = $1
           AND ${pointCondition}
           AND NOT EXISTS (
             SELECT 1 
             FROM "user_answers_${username}" ua 
             WHERE ua.question_id = qb.id
           )
           ORDER BY qa.id
           LIMIT 1`,
        [userId]
      );
    } else {
      questionResult = await pool.query(
        `SELECT qa.id as assignment_id, qb.* FROM question_assignments qa
           JOIN question_bank qb ON qa.question_id = qb.id
           WHERE qa.user_id = $1
           AND ${pointCondition}
           ORDER BY qa.id
           LIMIT 1`,
        [userId]
      );
    }

    if (questionResult.rows.length === 0) {
      return res.json({
        success: true,
        completed: true,
        message: 'All questions completed'
      });
    }

    res.json({
      success: true,
      question: { ...questionResult.rows[0], is_bonus: isBonusReq },
      question_number: isBonusReq ? bonusAnsweredCount + 1 : normalAnsweredCount + 1,
      completed_bonus: bonusAnsweredCount,
      // Per-question time limit in seconds (5 minutes per question)
      time_limit: 300
    });
  } catch (error) {
    console.error('Error fetching question:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const submitAnswer = async (req, res) => {
  try {
    const { questionId } = req.params;
    const { username, id: userId } = req.user;
    const { text_answer } = req.body;

    if (!questionId) {
      return res.status(400).json({
        success: false,
        message: 'Question ID is required'
      });
    }

    // Upload image to Cloudinary if present
    let image_answer_url = null;
    if (req.file) {
      try {
        image_answer_url = await uploadToCloudinary(req.file.buffer, 'treasure_hunt');
      } catch (uploadErr) {
        console.error('Cloudinary upload failed:', uploadErr.message);
        return res.status(500).json({ success: false, message: 'Image upload failed. Please try again.' });
      }
    }

    const assignmentCheck = await pool.query(
      `SELECT * FROM question_assignments WHERE user_id = $1 AND question_id = $2`,
      [userId, questionId]
    );

    if (assignmentCheck.rows.length === 0) {
      return res.status(403).json({
        success: false,
        message: 'Question not assigned to user'
      });
    }

    await pool.query(
      `INSERT INTO "user_answers_${username}" 
          (question_id, text_answer, image_answer_url) 
          VALUES ($1, $2, $3)`,
      [questionId, text_answer || null, image_answer_url]
    );

    res.json({
      success: true,
      message: 'Answer submitted successfully'
    });
  } catch (error) {
    console.error('Error submitting answer:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const getTeamResults = async (req, res) => {
  try {
    const usersQuery = 'SELECT id, username FROM users WHERE role = $1';
    const { rows: users } = await pool.query(usersQuery, ['participant']);

    const results = await Promise.all(users.map(async (user) => {
      const pointsQuery = `
        SELECT 
          u.id,
          u.username,
          COALESCE(
            (SELECT COUNT(*)
               FROM "user_answers_${user.username}" ua
               WHERE ua.is_accepted IS TRUE), 0
          ) as questions_solved,
          COALESCE(
            (SELECT SUM(qb.points)
               FROM "user_answers_${user.username}" ua
               JOIN question_bank qb ON ua.question_id = qb.id
               WHERE ua.is_accepted IS TRUE), 0
          ) as total_points
        FROM users u
        WHERE u.id = $1
      `;

      const { rows } = await pool.query(pointsQuery, [user.id]);
      return rows[0];
    }));

    const sortedResults = results.sort((a, b) => {
      if (b.total_points !== a.total_points) {
        return b.total_points - a.total_points;
      }
      return b.questions_solved - a.questions_solved;
    });

    res.json({
      success: true,
      results: sortedResults
    });
  } catch (error) {
    console.error('Error getting team results:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch team results',
      error: error.message
    });
  }
};