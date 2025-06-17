import { useState } from 'react';
import { login as apiLogin, register as apiRegister } from '../api';


export default function LoginModal({ onClose, onLogin, setAlert, onForgotPassword }) {
    const [isSignup, setIsSignup] = useState(false);
    const [loginOrEmail, setLoginOrEmail] = useState('');
    const [password, setPassword] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const [signupData, setSignupData] = useState({
        email: '',
        login: '',
        password: '',
        image: '',
        role: 'user'
    });
    const [imagePreview, setImagePreview] = useState('');
    const [loading, setLoading] = useState(false);

    const isLightMode = document.body.classList.contains('light-mode');

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { user, token } = await apiLogin(loginOrEmail, password);
            localStorage.setItem('token', token);
            onLogin(user);
            setAlert({ type: 'success', message: 'Login successful!' });
        } catch (err) {
            setAlert({ type: 'error', message: err.response?.data?.error || 'Login failed' });
        } finally {
            setLoading(false);
        }
    };

    const handleSignupSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await apiRegister({
                email: signupData.email,
                login: signupData.login,
                password: signupData.password,
                imageFile
            });
            setAlert({ type: 'success', message: 'Registration successful! You can now log in.' });
            setIsSignup(false);
            setSignupData({ email: '', login: '', password: '', image: '', role: 'user' });
            setImagePreview('');
            setImageFile(null);
        } catch (err) {
            setAlert({ type: 'error', message: err.response?.data?.error || 'Registration failed' });
        } finally {
            setLoading(false);
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setSignupData({ ...signupData, image: url });
            setImagePreview(url);
            setImageFile(file);
        }
    };



    return (
        <>
            <h2>{isSignup ? 'Sign Up' : 'Login'}</h2>
            <form onSubmit={isSignup ? handleSignupSubmit : handleLoginSubmit}>
                {isSignup ? (
                    <>
                        <div className="form-group">
                            <label>Email</label>
                            <input
                                type="email"
                                className="neumorph-input"
                                placeholder="Enter email"
                                value={signupData.email}
                                onChange={e => setSignupData({ ...signupData, email: e.target.value })}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Login</label>
                            <input
                                type="text"
                                className="neumorph-input"
                                placeholder="Choose a username"
                                value={signupData.login}
                                onChange={e => setSignupData({ ...signupData, login: e.target.value })}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Password</label>
                            <input
                                type="password"
                                className="neumorph-input"
                                placeholder="Enter password"
                                value={signupData.password}
                                onChange={e => setSignupData({ ...signupData, password: e.target.value })}
                                required
                            />
                        </div>
                        <div className="form-group" style={{ textAlign: 'center' }}>
                            <label>Profile Image</label>
                            <input
                                type="file"
                                accept="image/*"
                                className="neumorph-input"
                                style={{ padding: 0 }}
                                onChange={handleImageChange}
                            />
                            {imagePreview && (
                                <img
                                    src={imagePreview}
                                    alt="Preview"
                                    style={{ marginTop: 10, width: 60, height: 60, borderRadius: '50%' }}
                                />
                            )}
                        </div>
                        <button type="submit" className="neumorph-btn" style={{ width: '100%' }} disabled={loading}>
                            {loading ? 'Signing Up...' : 'Sign Up'}
                        </button>
                    </>
                ) : (
                    <>
                        <div className="form-group">
                            <label>Email or Username</label>
                            <input
                                type="text"
                                className="neumorph-input"
                                placeholder="Enter email or username"
                                value={loginOrEmail}
                                onChange={e => setLoginOrEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Password</label>
                            <input
                                type="password"
                                className="neumorph-input"
                                placeholder="Enter password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit" className="neumorph-btn" style={{ width: '100%' }} disabled={loading}>
                            {loading ? 'Logging in...' : 'Login'}
                        </button>
                    </>
                )}
            </form>
            <div
                style={{
                    width: '100%',
                    marginTop: '1em',
                    textAlign: 'center',
                    cursor: 'pointer',
                    color: isLightMode ? '#23272f' : '#fff',
                    fontWeight: 500,
                    userSelect: 'none',
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '1.5em'
                }}

            >
                <span onClick={() => setIsSignup((prev) => !prev)}>
                    {isSignup ? 'switch to login' : 'switch to signup'}
                </span>
                {!isSignup && (
                    <span
                        style={{ textDecoration: 'underline', cursor: 'pointer' }}
                        onClick={onForgotPassword}
                    >
                        forgot password.
                    </span>
                )}
            </div>
            <button className="close-btn" onClick={onClose} type="button">✖</button>
        </>

    );
}