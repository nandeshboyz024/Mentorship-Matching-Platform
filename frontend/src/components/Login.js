import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { userContext } from '../context/UserContext';
import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/App.css';

const API_BASE_URL = process.env.REACT_APP_PROXY_URL;

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const {updateUser, UpdateIsAuthenticated, updateBio, setSkills} = useContext(userContext);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); 

  const handleLogin = async (e) => {
    e.preventDefault();    

    if(username.length === 0 ){
      toast.warning("Username cannot be empty");
      return;
    }
    if(password.length === 0){
      toast.warning("Password cannot be empty");
      return;
    }

    const loginData = {
      username,
      password,
    };

    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/find-user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
      });
      const data = await response.json();
      
      if (data.success) {
        updateUser(data.user);
        updateBio(data.bio);
        setSkills(data.skills);
        UpdateIsAuthenticated(true);
        setLoading(false);
        navigate('/profile');
      } else {
        setLoading(false);
        toast.error('Invalid credentials. Please try again.');
      }
    } catch (error) {
      setLoading(false);
      toast.error('An error occurred during login. Please try again later.');
    }
  };

  return (
    <div className="container" style={{ width: '400px' }}>
      <ToastContainer/>
      <div className="signup-form">
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit" className="btn-login">
            {loading ? 'Logging in...' : 'Login'}
          </button>
          <p>Don't have an account? <Link to="/signup">Signup</Link> </p>
        </form>
      </div>
    </div>
  );
}

export default Login;
