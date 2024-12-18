import React, { useContext, useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/Dashboard.css';
import { userContext } from '../context/UserContext';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/UserCards.css';

const API_BASE_URL = process.env.REACT_APP_PROXY_URL;

function SearchUser() {
  const { user, isAuthenticated } = useContext(userContext);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [skill, setSkill] = useState('all');
  
  const fetchUsers = async (skill) => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/get_all_users?skill=${skill}`);
      if (response.data.success) {
        setUsers(response.data.data);
      } else {
        toast.error(response.data.message);
      }
    } catch (err) {
      toast.error('Failed to fetch users.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(skill);
  }, [skill]);

  const handleSkillChange = (e) => {
    setSkill(e.target.value);
  };

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm("Are you sure you want to delete your account? This action cannot be undone.");
    if (!confirmed) return;
    
    try {
      const response = await fetch(`${API_BASE_URL}/delete_account`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: user.username }),
      });

      const data = await response.json();
      if (data.success) {
        navigate('/login');
      } else {
        toast.error('Failed to delete account.');
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.');
    }
  };

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="dashboard-container">      
      <nav className="navbar">
        <ul>
          <li><Link to="/mentor-mentee">{user.role === 'mentor' ? 'Mentees' : 'Mentors'}</Link></li>
          <li><Link to="/notifications">Notifications</Link></li>
          <li><Link to="/requests">Requests</Link></li>
        </ul>
      </nav>
      <div className="main-content">
        <aside className="sidebar">
          <ul>
            <li><Link to="/profile">Profile</Link></li>
            <li><Link to="/edit-profile">Edit Profile</Link></li>
            {user.role === 'mentee' && (
              <li><Link to="/create-request">Create Request</Link></li>
            )}
            <li><Link to="/search-user">Search User</Link></li>
            <li><Link to="/login">Logout</Link></li>
            <li>
              <Link 
                to="#" 
                onClick={handleDeleteAccount} 
                style={{ color: 'red', textDecoration: 'none', cursor: 'pointer' }}
              >
                Delete Account
              </Link>
            </li>
          </ul>
        </aside>
        <section className="content">
          <ToastContainer />
          <div style={{ padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '8px', maxWidth: '400px', margin: '20px auto' }}>
            <h2 style={{ color: '#333', fontSize: '24px', marginBottom: '15px', textAlign: 'center' }}>Search Users by Skill</h2>
            <form style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <label htmlFor="skill" style={{ fontSize: '18px', color: '#555' }}>Select Skill: </label>
              <select 
                id="skill" 
                value={skill} 
                onChange={handleSkillChange} 
                style={{ 
                  padding: '10px', 
                  fontSize: '16px', 
                  borderRadius: '4px', 
                  border: '1px solid #ccc', 
                  width: '100%' 
                }}
              >
                <option value="all">All Users</option>
                <option value="c">C</option>
                <option value="cplusplus">C++</option>
                <option value="python">Python</option>
                <option value="java">Java</option>
                <option value="javascript">JavaScript</option>
                <option value="sql">SQL</option>
                <option value="html">HTML</option>
                <option value="css">CSS</option>
                <option value="react">React.js</option>
                <option value="nodejs">Node.js</option>
                <option value="flask">Flask</option>
                <option value="django">Django</option>
                <option value="android">Android</option>
                <option value="ios">IOS</option>
                <option value="flutter">Flutter</option>
                <option value="machine_learning">Machine Learning</option>
                <option value="data_analytics">Data Analytics</option>
                <option value="deep_learning">Deep Learning</option>
                <option value="docker">Docker</option>
                <option value="kubernetes">Kubernetes</option>
                <option value="aws">AWS</option>
                <option value="azure">Azure</option>
                <option value="git">Git</option>
                <option value="github">GitHub</option>
              </select>
            </form>
          </div>

          <div className="user-cards">
            {loading ? (
              <p>Loading users...</p>
            ) : users.length > 0 ? (
              users.map((user) => (
                <div className="user-card" key={user.username}>
                  <div className="row">
                    <div className="col-md-4 col-6">
                      <h5 style={{ color: '#7f8000' }}>{user.first_name} {user.last_name}</h5>
                    </div>
                    <div className="col-md-3 col-6">
                      <p style={{ color: 'green' }}>@{user.username}</p>
                    </div>
                    <div className="col-md-3 col-6">
                      <p style={{ color: 'red' }}>Role: {user.role}</p>
                    </div>
                    <div className="col-md-2 col-6">
                      <Link to={`/view-profile/${user.username}`} className="profile-btn">See Profile</Link>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p>No users found.</p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

export default SearchUser;
