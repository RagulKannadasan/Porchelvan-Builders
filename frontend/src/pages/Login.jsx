import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API_BASE_URL from '../utils/api';
import { Loader2 } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';

const Login = () => {
    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [step, setStep] = useState(1); // 1 = request email, 2 = verify code
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const from = location.state?.from?.pathname || "/admin";

    const handleRequestOTP = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        try {
            const res = await fetch(`${API_BASE_URL}/api/auth/request-otp`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Failed to send OTP');
            setStep(2);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerifyOTP = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        try {
            const res = await fetch(`${API_BASE_URL}/api/auth/verify-otp`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, code })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Invalid OTP');
            
            login(data.token, data.user);
            
            // Redirect based on role
            if (data.user.role === 'Client') {
                navigate('/client');
            } else {
                navigate(from, { replace: true });
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleSuccess = async (credentialResponse) => {
        setIsLoading(true);
        setError('');
        try {
            const res = await fetch(`${API_BASE_URL}/api/auth/google`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ credential: credentialResponse.credential })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Google Login failed');
            
            login(data.token, data.user);
            
            if (data.user.role === 'Client') {
                navigate('/client');
            } else {
                navigate(from, { replace: true });
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-overlay"></div>
            
            <div className="login-card-wrapper animate-slide-up">
                <div className="login-brand-header">
                    <div className="login-logo-mark">PB</div>
                    <h1>Porchelvan Builders</h1>
                    <p className="subtitle">Admin & Client Secure Portal</p>
                </div>

                <div className="login-card glass-effect">
                    {error && (
                        <div className="login-error animate-shake">
                            {error}
                        </div>
                    )}

                    {step === 1 ? (
                        <form onSubmit={handleRequestOTP} className="login-form">
                            <div className="input-group">
                                <label>Email Address</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="name@company.com"
                                    required
                                    className="modern-input"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="login-btn primary-btn"
                            >
                                {isLoading ? <><Loader2 className="spinner" size={20} /> Sending Code...</> : 'Send Login Code'}
                            </button>
                            
                            <div className="login-divider">
                                <span>OR</span>
                            </div>
                            
                            <div className="google-btn-wrapper">
                                <GoogleLogin
                                    onSuccess={handleGoogleSuccess}
                                    onError={() => setError('Google Login Failed')}
                                    theme="filled_black"
                                    size="large"
                                    width="100%"
                                />
                            </div>
                        </form>
                    ) : (
                        <form onSubmit={handleVerifyOTP} className="login-form">
                            <div className="input-group">
                                <label>Enter 6-Digit Code</label>
                                <input
                                    type="text"
                                    value={code}
                                    onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                                    placeholder="------"
                                    maxLength="6"
                                    required
                                    className="modern-input otp-input"
                                />
                                <p className="otp-helper">
                                    We sent a code to <span>{email}</span>
                                </p>
                            </div>
                            <button
                                type="submit"
                                disabled={isLoading || code.length !== 6}
                                className="login-btn secondary-btn"
                            >
                                {isLoading ? <><Loader2 className="spinner" size={20} /> Verifying...</> : 'Verify & Secure Login'}
                            </button>
                            <button
                                type="button"
                                onClick={() => setStep(1)}
                                className="text-btn"
                            >
                                Back to email entry
                            </button>
                        </form>
                    )}
                </div>
                
                <div className="login-footer">
                    &copy; {new Date().getFullYear()} Porchelvan Builders. All rights reserved.
                </div>
            </div>

            <style>{`
                .login-container {
                    min-height: 100vh;
                    width: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    position: relative;
                    background: #0a0a0a url('/images/login-bg.png') no-repeat center center/cover;
                    font-family: 'Inter', sans-serif;
                    overflow: hidden;
                }

                .login-overlay {
                    position: absolute;
                    inset: 0;
                    background: linear-gradient(135deg, rgba(0,0,0,0.85) 0%, rgba(15,23,42,0.7) 100%);
                    backdrop-filter: blur(8px);
                    z-index: 1;
                }

                .login-card-wrapper {
                    position: relative;
                    z-index: 10;
                    width: 100%;
                    max-width: 440px;
                    padding: 2rem;
                }

                .login-brand-header {
                    text-align: center;
                    margin-bottom: 2.5rem;
                    color: white;
                }

                .login-logo-mark {
                    width: 54px;
                    height: 54px;
                    background: linear-gradient(135deg, #F97316 0%, #EA580C 100%);
                    color: white;
                    border-radius: 14px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 1.5rem;
                    font-weight: 800;
                    margin: 0 auto 1.25rem auto;
                    box-shadow: 0 10px 25px rgba(249, 115, 22, 0.4);
                    letter-spacing: -1px;
                }

                .login-brand-header h1 {
                    font-size: 1.8rem;
                    font-weight: 800;
                    letter-spacing: -0.5px;
                    margin-bottom: 0.25rem;
                }

                .subtitle {
                    color: rgba(255, 255, 255, 0.6);
                    font-size: 0.95rem;
                    font-weight: 400;
                }

                .glass-effect {
                    background: rgba(255, 255, 255, 0.03);
                    backdrop-filter: blur(20px);
                    -webkit-backdrop-filter: blur(20px);
                    border: 1px solid rgba(255, 255, 255, 0.08);
                    border-radius: 24px;
                    box-shadow: 0 30px 60px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1);
                    padding: 2.5rem;
                }

                .login-form {
                    display: flex;
                    flex-direction: column;
                    gap: 1.5rem;
                }

                .login-divider {
                    display: flex;
                    align-items: center;
                    text-align: center;
                    color: rgba(255, 255, 255, 0.3);
                    font-size: 0.85rem;
                    font-weight: 600;
                    margin: 0.5rem 0;
                }

                .login-divider::before,
                .login-divider::after {
                    content: '';
                    flex: 1;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                }

                .login-divider span {
                    padding: 0 1rem;
                }

                .google-btn-wrapper {
                    display: flex;
                    justify-content: center;
                    width: 100%;
                }

                .input-group label {
                    display: block;
                    font-size: 0.85rem;
                    font-weight: 600;
                    color: rgba(255, 255, 255, 0.8);
                    margin-bottom: 0.5rem;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }

                .modern-input {
                    width: 100%;
                    background: rgba(0, 0, 0, 0.2);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    color: white;
                    padding: 1rem 1.25rem;
                    border-radius: 12px;
                    font-size: 1rem;
                    transition: all 0.3s ease;
                    outline: none;
                }

                .modern-input::placeholder {
                    color: rgba(255, 255, 255, 0.3);
                }

                .modern-input:focus {
                    background: rgba(0, 0, 0, 0.4);
                    border-color: #F97316;
                    box-shadow: 0 0 0 4px rgba(249, 115, 22, 0.15);
                }

                .otp-input {
                    text-align: center;
                    letter-spacing: 0.5rem;
                    font-size: 1.5rem;
                    font-weight: 700;
                }

                .otp-helper {
                    text-align: center;
                    font-size: 0.85rem;
                    color: rgba(255, 255, 255, 0.5);
                    margin-top: 1rem;
                }

                .otp-helper span {
                    color: white;
                    font-weight: 600;
                }

                .login-btn {
                    width: 100%;
                    padding: 1rem;
                    border-radius: 12px;
                    font-size: 1rem;
                    font-weight: 600;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 0.5rem;
                    transition: all 0.3s ease;
                    border: none;
                }

                .primary-btn {
                    background: white;
                    color: #0F172A;
                }

                .primary-btn:hover:not(:disabled) {
                    background: #f1f5f9;
                    transform: translateY(-2px);
                    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
                }

                .secondary-btn {
                    background: linear-gradient(135deg, #F97316 0%, #EA580C 100%);
                    color: white;
                    box-shadow: 0 10px 20px rgba(249, 115, 22, 0.3);
                }

                .secondary-btn:hover:not(:disabled) {
                    box-shadow: 0 15px 30px rgba(249, 115, 22, 0.4);
                    transform: translateY(-2px);
                }

                .login-btn:disabled {
                    opacity: 0.6;
                    cursor: not-allowed;
                }

                .text-btn {
                    background: none;
                    border: none;
                    color: rgba(255, 255, 255, 0.6);
                    font-size: 0.9rem;
                    cursor: pointer;
                    transition: color 0.3s ease;
                }

                .text-btn:hover {
                    color: white;
                }

                .login-error {
                    background: rgba(239, 68, 68, 0.1);
                    border: 1px solid rgba(239, 68, 68, 0.2);
                    color: #FCA5A5;
                    padding: 1rem;
                    border-radius: 10px;
                    font-size: 0.9rem;
                    text-align: center;
                    margin-bottom: 1.5rem;
                }

                .login-footer {
                    text-align: center;
                    margin-top: 2rem;
                    font-size: 0.75rem;
                    color: rgba(255, 255, 255, 0.4);
                }

                .spinner {
                    animation: spin 1s linear infinite;
                }

                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }

                .animate-slide-up {
                    animation: slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                }

                @keyframes slideUp {
                    from { opacity: 0; transform: translateY(30px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                .animate-shake {
                    animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
                }

                @keyframes shake {
                    10%, 90% { transform: translate3d(-1px, 0, 0); }
                    20%, 80% { transform: translate3d(2px, 0, 0); }
                    30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
                    40%, 60% { transform: translate3d(4px, 0, 0); }
                }
            `}</style>
        </div>
    );
};

export default Login;
