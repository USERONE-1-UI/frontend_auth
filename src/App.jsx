import { useState, useEffect } from 'react';
import './App.css';
import LoginModal from './components/LoginModal';
import UsersList from './components/UsersList';
import CustomAlert from './components/CustomAlert';
import { updateUser, logout, getUser } from './api';
import { motion, AnimatePresence } from "framer-motion";
import AnimatedModal from "./components/AnimatedModal";
import ForgotPasswordModal from './components/ForgotPasswordModal';
import NewPasswordModal from './components/NewPasswordModal';



function App() {
  const API = import.meta.env.VITE_APP_API;
  const [darkMode, setDarkMode] = useState(true);
  const [showLogin, setShowLogin] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetCode, setResetCode] = useState("");
  const [loggedUser, setLoggedUser] = useState(null);
  const [sideMenuOpen, setSideMenuOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState({ email: '', login: '', password: '', image: '' });
  const [showUsersList, setShowUsersList] = useState(false);
  const [alert, setAlert] = useState({ type: '', message: '' });
  const [editImageFile, setEditImageFile] = useState(null);

  useEffect(() => {
    getUser()
      .then(user => setLoggedUser(user))
      .catch(() => setLoggedUser(null));
  }, []);

  const handleToggleMode = () => {
    setDarkMode((prev) => !prev);
    document.body.classList.toggle('light-mode', darkMode);
  };

  const handleLogin = (user) => {
    setLoggedUser(user);
    setShowLogin(false);
  };

  const handleLogout = () => {
    logout();
    setLoggedUser(null);
    setSideMenuOpen(false);
    setEditMode(false);
    setShowUsersList(false);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editData.email || !editData.login) {
      setAlert({ type: 'error', message: 'Email and login are required.' });
      return;
    }
    try {
      let updatedUser;
      if (editImageFile) {
        const formData = new FormData();
        formData.append('email', editData.email);
        formData.append('login', editData.login);
        if (editData.password) formData.append('password', editData.password);
        formData.append('image', editImageFile);
        updatedUser = await updateUser(loggedUser._id || loggedUser.id, formData, true);
      } else {
        const dataToSend = { email: editData.email, login: editData.login };
        if (editData.password) dataToSend.password = editData.password;
        updatedUser = await updateUser(loggedUser._id || loggedUser.id, dataToSend);
      }
      setLoggedUser(updatedUser);
      setEditMode(false);
      setEditImageFile(null);
      setAlert({ type: 'success', message: 'User info updated!' });
    } catch (err) {
      setAlert({ type: 'error', message: 'Failed to update user info.' });
    }
  };

  const openEditForm = () => {
    setEditData({
      email: loggedUser.email,
      login: loggedUser.login,
      password: loggedUser.password,
      image: loggedUser.image
    });
    setEditMode(true);
  };

  const isAdmin = loggedUser && loggedUser.role === 'admin';
  const navbarClass = `neumorph-navbar full-width${isAdmin ? ' admin-navbar' : ''}`;
  const burgerClass = `burger-btn${isAdmin ? ' admin-burger' : ''}${sideMenuOpen ? ' open' : ''}`;
  const sideMenuClass = `side-menu${isAdmin ? ' admin-side-menu' : ''}`;

  return (
    <>
      <motion.nav
        className="navbarClass"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 1, ease: "easeOut",

        }}
        style={{ overflow: "hidden" }}
      >
        <nav className={navbarClass}>
          <div className="navbar-left">
            {loggedUser && (
              <>
                <button
                  className={burgerClass}
                  onClick={() => setSideMenuOpen((prev) => !prev)}
                  aria-label="Open menu"
                >
                  <span />
                  <span />
                  <span />
                </button>
                <div className="profile-info neumorph-profile">
                  <img src={`${API}/${loggedUser.image}`} alt="Profile" className="profile-img" />
                  <span className="profile-name">{loggedUser.login}</span>
                </div>
              </>
            )}
          </div>
          <div className="navbar-right">
            <button className="neumorph-btn mode-toggle-btn" onClick={handleToggleMode}>
              {darkMode ? '🌙 Dark' : '☀️ Light'}
            </button>
            {loggedUser ? (
              <button
                className="neumorph-btn"
                style={{ marginLeft: '1em' }}
                onClick={handleLogout}
              >
                Logout
              </button>
            ) : (
              <button
                className="neumorph-btn"
                style={{ marginLeft: '1em' }}
                onClick={() => setShowLogin(true)}
              >
                Login
              </button>
            )}
          </div>
        </nav>
      </motion.nav >
      <AnimatePresence>
        {
          showLogin && (
            <AnimatedModal onClose={() => setShowLogin(false)}>
              <LoginModal
                onClose={() => setShowLogin(false)}
                onLogin={handleLogin}
                setAlert={setAlert}
                onForgotPassword={() => {
                  setShowLogin(false);
                  setShowForgot(true);
                }}
              />
            </AnimatedModal>
          )
        }
      </AnimatePresence>
      <AnimatePresence>
        {showForgot && (
          <AnimatedModal onClose={() => setShowForgot(false)}>
            <ForgotPasswordModal
              onClose={() => setShowForgot(false)}
              onCodeVerified={(email, code) => {
                setShowForgot(false);
                setResetEmail(email);
                setResetCode(code);
                setShowNewPassword(true);
              }}
            />
          </AnimatedModal>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {showNewPassword && (
          <AnimatedModal onClose={() => setShowNewPassword(false)}>
            <NewPasswordModal
              email={resetEmail}
              code={resetCode}
              onClose={() => setShowNewPassword(false)}
              onSuccess={() => setShowNewPassword(false)}
            />
          </AnimatedModal>
        )}
      </AnimatePresence>
      {
        loggedUser && sideMenuOpen && (
          <div className="side-menu-overlay" onClick={() => setSideMenuOpen(false)}>
            <div className={sideMenuClass} onClick={e => e.stopPropagation()}>
              <div className="side-menu-header">
                <img src={`${API}/${loggedUser.image}`} alt="Profile" className="profile-img" />
                <span className="profile-name">{loggedUser.login}</span>
              </div>
              {isAdmin ? (
                <div
                  className="side-menu-item"
                  onClick={() => {
                    setShowUsersList(true);
                    setEditMode(false);
                    setSideMenuOpen(false);
                  }}
                  style={{ cursor: 'pointer', marginTop: '1em' }}
                >
                  Users List
                </div>
              ) : (
                <div
                  className="side-menu-item"
                  onClick={openEditForm}
                  style={{ cursor: 'pointer', marginTop: '1em' }}
                >
                  User Information
                </div>
              )}
              <button
                className="neumorph-btn"
                style={{ marginTop: '2em', width: '100%' }}
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          </div>
        )
      }

      <AnimatePresence>
        {
          showUsersList && isAdmin && (
            <AnimatedModal onClose={() => setShowUsersList(false)}>
              <UsersList onClose={() => setShowUsersList(false)} setAlert={setAlert} />
            </AnimatedModal>
          )
        }
      </AnimatePresence >
      <AnimatePresence>
        {
          editMode && (
            <AnimatedModal onClose={() => setShowUsersList(false)}>
              <h2>Edit User Info</h2>
              <div style={{ textAlign: 'center', marginBottom: 24 }}>
                <img
                  src={
                    editData.image
                      ? (editData.image.startsWith('blob:')
                        ? editData.image
                        : `${API}/${editData.image}`)
                      : 'https://i.pravatar.cc/120'
                  }
                  alt="Preview"
                  style={{
                    width: 120,
                    height: 120,
                    borderRadius: '50%',
                    objectFit: 'cover',
                    boxShadow: '0 2px 16px rgba(0,0,0,0.12)',
                    marginBottom: 10,
                    border: '4px solid #eee'
                  }}
                />
              </div>
              <form onSubmit={handleEditSubmit}>
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    className="neumorph-input"
                    value={editData.email}
                    onChange={e => setEditData({ ...editData, email: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Login</label>
                  <input
                    type="text"
                    className="neumorph-input"
                    value={editData.login}
                    onChange={e => setEditData({ ...editData, login: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Password</label>
                  <input
                    type="password"
                    className="neumorph-input"
                    value={editData.password}
                    onChange={e => setEditData({ ...editData, password: e.target.value })}
                  />
                </div>
                <div className="form-group" style={{ textAlign: 'center' }}>
                  <label>Profile Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    className="neumorph-input"
                    style={{ padding: 0 }}
                    onChange={e => {
                      const file = e.target.files[0];
                      if (file) {
                        const url = URL.createObjectURL(file);
                        console.log("message to show blob :", url);
                        setEditData({ ...editData, image: url });
                        setEditImageFile(file);
                      }
                    }}
                  />
                </div>
                <button type="submit" className="neumorph-btn" style={{ width: '100%' }}>
                  Save
                </button>
              </form>
              <button className="close-btn" onClick={() => setEditMode(false)} type="button">✖</button>

            </AnimatedModal >
          )
        }
      </AnimatePresence >
      < CustomAlert
        type={alert.type}
        message={alert.message}
        onClose={() => setAlert({ type: '', message: '' })}
      />
    </>
  );
}

export default App;