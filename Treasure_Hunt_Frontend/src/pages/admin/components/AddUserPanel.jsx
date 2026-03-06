import { useState } from 'react';
import { registerUser } from '../../../services/api';

const s = {
    label: {
        display: 'block',
        fontSize: '0.85rem',
        fontWeight: 800,
        color: 'var(--color-green)',
        fontFamily: 'var(--font-body)',
        marginBottom: '0.5rem',
        letterSpacing: '0.5px',
        textTransform: 'uppercase',
    },
    input: {
        width: '100%',
        padding: '0.75rem 1rem',
        borderRadius: '10px',
        border: '2.5px solid var(--color-green)',
        fontSize: '1rem',
        fontFamily: 'var(--font-body)',
        background: 'var(--color-bg-primary)',
        color: 'var(--color-text-primary)',
        outline: 'none',
        boxSizing: 'border-box',
        transition: 'border-color 0.2s',
    },
    select: {
        width: '100%',
        padding: '0.75rem 1rem',
        borderRadius: '10px',
        border: '2.5px solid var(--color-green)',
        fontSize: '1rem',
        fontFamily: 'var(--font-body)',
        background: 'var(--color-bg-primary)',
        color: 'var(--color-text-primary)',
        outline: 'none',
        boxSizing: 'border-box',
        transition: 'border-color 0.2s',
    },
    successBar: {
        padding: '0.75rem 1rem',
        borderRadius: '10px',
        border: '2px solid #2e7d32',
        background: '#e8f5e9',
        color: '#2e7d32',
        fontWeight: 700,
        fontSize: '0.9rem',
        marginBottom: '1rem',
    },
    errorBar: {
        padding: '0.75rem 1rem',
        borderRadius: '10px',
        border: '2px solid var(--color-red)',
        background: '#ffebee',
        color: 'var(--color-red)',
        fontWeight: 700,
        fontSize: '0.9rem',
        marginBottom: '1rem',
    },
};

const AddUserPanel = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        role: 'participant',
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        if (!formData.username || !formData.password) {
            setError('Username and password are required');
            return;
        }
        setLoading(true);

        try {
            // registerUser handles the standard POST /users/register call from frontend
            // which now requires a Bearer token (supplied by interceptor)
            const response = await registerUser(formData);
            if (response.success) {
                setSuccess('✅ User account created successfully!');
                setFormData({ ...formData, username: '', password: '' });
            } else {
                setError(response.message || 'Failed to create user');
            }
        } catch {
            setError('An error occurred while creating the user account');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
            {/* Section heading */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: '1.5rem' }}>
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                    <rect x="2" y="2" width="24" height="24" rx="6" fill="var(--color-bg-secondary)" stroke="var(--color-green)" strokeWidth="2.5" />
                    <path d="M14 13C16.2 13 18 11.2 18 9C18 6.8 16.2 5 14 5C11.8 5 10 6.8 10 9C10 11.2 11.8 13 14 13ZM14 15C11 15 5 16.5 5 19.5V21H23V19.5C23 16.5 17 15 14 15Z" fill="var(--color-green)" />
                </svg>
                <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', color: 'var(--color-green)', margin: 0 }}>
                    Create New Participant / Admin
                </h2>
            </div>

            <div style={{ background: '#fff', padding: '2rem', borderRadius: '16px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                {error && <div style={s.errorBar}>{error}</div>}
                {success && <div style={s.successBar}>{success}</div>}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                        <div>
                            <label style={s.label}>Username</label>
                            <input
                                type="text"
                                value={formData.username}
                                onChange={e => setFormData({ ...formData, username: e.target.value })}
                                placeholder="e.g. thecluemafia"
                                style={s.input}
                            />
                        </div>

                        <div>
                            <label style={s.label}>Password</label>
                            <input
                                type="text"
                                value={formData.password}
                                onChange={e => setFormData({ ...formData, password: e.target.value })}
                                placeholder="Passcode..."
                                style={s.input}
                            />
                        </div>
                    </div>

                    <div>
                        <label style={s.label}>Account Role</label>
                        <select
                            value={formData.role}
                            onChange={e => setFormData({ ...formData, role: e.target.value })}
                            style={s.select}
                        >
                            <option value="participant">Participant</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>

                    <div style={{ paddingTop: '1rem', borderTop: '2px dashed var(--color-bg-secondary)' }}>
                        <button
                            type="submit"
                            disabled={loading}
                            style={{
                                width: '100%',
                                padding: '1rem',
                                fontSize: '1.1rem',
                                borderRadius: '12px',
                                background: 'var(--color-red)',
                                color: '#fff',
                                fontWeight: 800,
                                border: 'none',
                                cursor: loading ? 'not-allowed' : 'pointer',
                                opacity: loading ? 0.7 : 1,
                                boxShadow: '4px 4px 0 var(--color-brown-dim)',
                                transition: 'transform 0.1s',
                            }}
                            onMouseDown={e => { if (!loading) e.currentTarget.style.transform = 'translate(2px, 2px)' }}
                            onMouseUp={e => { if (!loading) e.currentTarget.style.transform = 'none' }}
                            onMouseLeave={e => { if (!loading) e.currentTarget.style.transform = 'none' }}
                        >
                            {loading ? 'CREATING...' : 'CREATE ACCOUNT'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddUserPanel;
