import { Navigate } from 'react-router-dom';
import React, { useEffect } from 'react';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('userRole');

  useEffect(() => {
    console.log('Protected Route Check:', {
      token: token ? 'Exists' : 'Missing',
      userRole,
      allowedRoles,
      authorized: allowedRoles.includes(userRole)
    });
  }, [token, userRole, allowedRoles]);

  if (!token) {
    console.log('No authentication token found, redirecting to login');
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(userRole)) {
    console.log(`User role (${userRole}) not authorized for this route. Allowed roles:`, allowedRoles);
    if (allowedRoles.includes('admin')) {
      return (
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          height: '100vh', backgroundColor: 'var(--color-bg-primary)', padding: '2rem', textAlign: 'center'
        }}>
          <h2 style={{ color: 'var(--color-red)', fontFamily: 'var(--font-heading)', fontSize: '2rem' }}>ACCESS DENIED</h2>
          <p style={{ marginTop: '1rem', fontFamily: 'var(--font-body)', fontSize: '1.2rem', color: 'var(--color-brown)' }}>
            Only Admins are allowed to access this panel.
          </p>
          <button
            onClick={() => window.location.href = '/login'}
            style={{
              marginTop: '2rem', padding: '0.8rem 1.5rem', background: 'var(--color-green)',
              color: 'white', fontFamily: 'var(--font-heading)', border: 'none', borderRadius: '8px',
              cursor: 'pointer', boxShadow: '4px 4px 0 var(--color-green-dim)'
            }}
          >
            Go Back
          </button>
        </div>
      );
    }
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;