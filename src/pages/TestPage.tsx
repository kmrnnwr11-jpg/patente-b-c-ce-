import { FC } from 'react';

export const TestPage: FC = () => {
  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(to bottom, #5FB894, #4AA9D0, #3B9ED9)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem'
    }}>
      <div style={{
        background: 'rgba(255, 255, 255, 0.9)',
        borderRadius: '24px',
        padding: '3rem',
        maxWidth: '600px',
        textAlign: 'center',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
      }}>
        <h1 style={{ 
          fontSize: '3rem', 
          fontWeight: 'bold',
          color: '#1e3a8a',
          marginBottom: '1rem'
        }}>
          ✅ App Funzionante!
        </h1>
        <p style={{ 
          fontSize: '1.25rem',
          color: '#475569',
          marginBottom: '2rem'
        }}>
          Se vedi questo messaggio, React sta funzionando correttamente.
        </p>
        <div style={{
          background: '#f1f5f9',
          padding: '1.5rem',
          borderRadius: '12px',
          marginBottom: '1.5rem'
        }}>
          <p style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '0.5rem' }}>
            <strong>Test completati:</strong>
          </p>
          <ul style={{ textAlign: 'left', color: '#475569', fontSize: '0.875rem' }}>
            <li>✓ React rendering</li>
            <li>✓ CSS inline styles</li>
            <li>✓ Gradient background</li>
            <li>✓ Component mounting</li>
          </ul>
        </div>
        <button
          onClick={() => window.location.href = '/'}
          style={{
            background: '#3b82f6',
            color: 'white',
            padding: '0.75rem 2rem',
            borderRadius: '12px',
            border: 'none',
            fontSize: '1rem',
            fontWeight: '600',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)'
          }}
        >
          Vai alla Dashboard
        </button>
      </div>
    </div>
  );
};

