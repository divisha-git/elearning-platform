import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

export default function AuthError() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const errorMessage = searchParams.get('message') || 'Authentication failed';

  const handleRetry = () => {
    navigate('/auth', { replace: true });
  };

  return (
    <div className="container-fluid" style={{
      background: 'linear-gradient(135deg, #1a1a1a 0%, #2c3e50 50%, #34495e 100%)',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div className="text-center">
        <div className="d-inline-flex align-items-center justify-content-center rounded-circle mb-4 shadow-lg" 
             style={{
               width: '120px', 
               height: '120px', 
               background: 'linear-gradient(135deg, #dc3545 0%, #c82333 100%)',
               boxShadow: '0 0 30px rgba(220, 53, 69, 0.5)'
             }}>
          <i className="fa fa-times fa-3x" style={{color: '#FFFFFF'}}></i>
        </div>
        <h2 className="text-white fw-bold mb-3">Authentication Failed</h2>
        <p className="text-light fs-5 mb-4">{errorMessage}</p>
        <button 
          onClick={handleRetry}
          className="btn btn-lg shadow-sm"
          style={{
            borderRadius: '15px',
            height: '60px',
            background: 'linear-gradient(135deg, #ffd700 0%, #ffed4e 100%)',
            border: 'none',
            fontSize: '18px',
            fontWeight: '700',
            color: '#000000',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            paddingLeft: '30px',
            paddingRight: '30px'
          }}
        >
          <i className="fa fa-arrow-left me-2"></i>
          Try Again
        </button>
      </div>
    </div>
  );
}
