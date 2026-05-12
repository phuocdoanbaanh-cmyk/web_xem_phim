import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Mail, Lock, Eye, EyeOff, ArrowRight, X, User } from 'lucide-react';
import './DangNhap.css';

interface DangNhapProps {
  onClose: () => void;
}

export const DangNhap: React.FC<DangNhapProps> = ({ onClose }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);
  
  // Form fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  // Errors
  const [errors, setErrors] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const rememberedEmail = localStorage.getItem('rememberedEmail');
    if (rememberedEmail) {
      setEmail(rememberedEmail);
      setRememberMe(true);
    }
  }, []);

  const validate = () => {
    const newErrors: Record<string, boolean> = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email || !emailRegex.test(email)) newErrors.email = true;
    if (!password || password.length < 6) newErrors.password = true;
    
    if (isSignUp) {
      if (!name) newErrors.name = true;
      if (password !== confirmPassword) newErrors.confirmPassword = true;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setMessage(null);

    // Simulate API call
    setTimeout(() => {
      if (rememberMe) {
        localStorage.setItem('rememberedEmail', email);
      } else {
        localStorage.removeItem('rememberedEmail');
      }

      if (isSignUp) {
        setMessage({ text: 'Account created successfully! Please sign in.', type: 'success' });
        setTimeout(() => {
          setIsSignUp(false);
          setIsSubmitting(false);
          setPassword('');
          setConfirmPassword('');
        }, 1500);
      } else {
        setMessage({ text: 'Login successful!', type: 'success' });
        setTimeout(() => {
          onClose();
        }, 1500);
      }
    }, 1500);
  };

  return (
    <div className="login-modal-overlay" onClick={onClose}>
      <motion.div 
        className="login-card"
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="border-glow-line"></div>
        
        <button className="close-btn" onClick={onClose}>
          <X size={18} />
        </button>

        <div className="login-content">
          <div className="welcome-section">
            <p className="welcome-label">{isSignUp ? 'Join us today' : 'Welcome back'}</p>
            <h2 className="form-title">{isSignUp ? 'Create account' : 'Sign in'}</h2>
          </div>

          {message && (
            <div className={`status-message ${message.type}`}>
              {message.text}
            </div>
          )}

          <form className="login-form" onSubmit={handleSubmit}>
            {isSignUp && (
              <div className="form-group">
                <div className="input-wrapper">
                  <User size={18} className="icon-left" />
                  <input 
                    type="text" 
                    placeholder="Full name" 
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      setErrors(prev => ({ ...prev, name: false }));
                    }}
                    className={errors.name ? 'input-error' : ''}
                  />
                </div>
              </div>
            )}

            <div className="form-group">
              <div className="input-wrapper">
                <Mail size={18} className="icon-left" />
                <input 
                  type="email" 
                  placeholder="Email address" 
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setErrors(prev => ({ ...prev, email: false }));
                  }}
                  className={errors.email ? 'input-error' : ''}
                />
              </div>
            </div>

            <div className="form-group">
              <div className="input-wrapper">
                <Lock size={18} className="icon-left" />
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  placeholder="Password" 
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setErrors(prev => ({ ...prev, password: false }));
                  }}
                  className={errors.password ? 'input-error' : ''}
                />
                <button 
                  type="button" 
                  className="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {isSignUp && (
              <div className="form-group">
                <div className="input-wrapper">
                  <Lock size={18} className="icon-left" />
                  <input 
                    type={showPassword ? 'text' : 'password'} 
                    placeholder="Confirm password" 
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      setErrors(prev => ({ ...prev, confirmPassword: false }));
                    }}
                    className={errors.confirmPassword ? 'input-error' : ''}
                  />
                </div>
              </div>
            )}

            {!isSignUp && (
              <div className="form-footer">
                <label className="remember-me">
                  <input 
                    type="checkbox" 
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <span>Remember me</span>
                </label>
                <a href="#" className="forgot-password">Forgot password?</a>
              </div>
            )}

            <button type="submit" className="btn-signin" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/30 border-t-white" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <span>{isSignUp ? 'Create account' : 'Sign in'}</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <div className="social-login">
            <p>Or continue with</p>
            <div className="social-buttons">
              <button className="social-btn google-btn" title="Google" onClick={(e) => e.preventDefault()}>
                <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
                  <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
                    <path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z"/>
                    <path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z"/>
                    <path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z"/>
                    <path fill="#EA4335" d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z"/>
                  </g>
                </svg>
              </button>
              <button className="social-btn apple-btn" title="Apple" onClick={(e) => e.preventDefault()}>
                <svg viewBox="0 0 384 512" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
                  <path fill="#000000" d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"/>
                </svg>
              </button>
              <button className="social-btn microsoft-btn" title="Microsoft" onClick={(e) => e.preventDefault()}>
                <svg viewBox="0 0 21 21" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
                  <rect x="1" y="1" width="9" height="9" fill="#f25022"/>
                  <rect x="11" y="1" width="9" height="9" fill="#7fba00"/>
                  <rect x="1" y="11" width="9" height="9" fill="#00a4ef"/>
                  <rect x="11" y="11" width="9" height="9" fill="#ffb900"/>
                </svg>
              </button>
            </div>
          </div>

          <div className="signup-link">
            <p>
              {isSignUp ? 'Already have an account?' : "Don't have an account?"}
              <button onClick={() => {
                setIsSignUp(!isSignUp);
                setMessage(null);
                setErrors({});
              }}>
                {isSignUp ? 'Sign in' : 'Create one'}
              </button>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
