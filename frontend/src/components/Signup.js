import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/App.css';

const API_BASE_URL = process.env.REACT_APP_PROXY_URL;

function Signup() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('mentor');

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();

    if (username.length < 6 || username.length > 12) {
      toast.warning("Username must contain between 6 and 12 characters.");
      return;
    }
    if (email.length < 11 || !email.endsWith('@gmail.com')) {
      toast.warning("Email must be a valid Gmail address");
      return;
    }
    if (password.length < 6 || password.length > 12) {
      toast.warning("Password must contain between 6 and 12 characters.");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }
    const formData = {
      username,
      email,
      password,
      firstName,
      lastName,
      role
    };

    setLoading(true);

    try {
      const response = await axios.post(`${API_BASE_URL}/create_account`, formData);
      if (response.data.success) {
        navigate('/login');
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error('Signup failed. Please try again.');
    } finally{
      setLoading(false);
    }
  };
  return (
    <div>
      <ToastContainer />
    <div className="container" style={{width:'400px'}}>
      <div className="signup-form">
        <h2>Signup</h2>
        <form onSubmit={handleSignup}>
          <input
            type="text"
            placeholder="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Last Name (Optional)"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Email (must be valid gmail address)"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Create password (at least 6 characters)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <div className="role-selection">
            <label>
              <input
                type="radio"
                name="role"
                value="mentor"
                checked={role === 'mentor'}
                onChange={(e) => setRole(e.target.value)}
              />
              Mentor
            </label>
            <label>
              <input
                type="radio"
                name="role"
                value="mentee"
                checked={role === 'mentee'}
                onChange={(e) => setRole(e.target.value)}
              />
              Mentee
            </label>
          </div>
          <button type="submit" className="btn-signup" disabled={loading}>
            {loading ? 'Processing...':'Signup'}
          </button>
          <p>Already have an account? <Link to="/login">Login</Link></p>
        </form>
      </div>
    </div>
    </div>
  );
}
export default Signup;
