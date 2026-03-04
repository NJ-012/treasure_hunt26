import pool from '../db/db.js';

export const calculateTeamPoints = async (username) => {
  try {
    // FIXED: Double quotes around table name handle special characters (@ and .)
    // FIXED: Using "IS TRUE" ensures existing NULL values in Supabase don't break the sum
    const query = `
      SELECT COALESCE(SUM(qb.points), 0) as total_points
      FROM "user_answers_${username}" ua
      JOIN question_bank qb ON ua.question_id = qb.id
      WHERE ua.is_accepted IS TRUE
    `;
    
    const { rows } = await pool.query(query);
    return rows[0]?.total_points || 0;
  } catch (error) {
    console.error(`Error calculating points for ${username}:`, error);
    return 0;
  }
};