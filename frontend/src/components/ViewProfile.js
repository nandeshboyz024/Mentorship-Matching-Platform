import React, { useContext, useEffect, useState } from 'react';
import '../styles/Dashboard.css';
import { userContext } from '../context/UserContext';
import { useParams, Link, Navigate, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function ViewProfile() {
  const { isAuthenticated, user } = useContext(userContext);
  const { username } = useParams();
  const [SelecetedUser, setSelectedUser] = useState(null);
  const [skills, setSkills] = useState(null);
  const [bio, setBio] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`/get-user?username=${username}`);
        setSelectedUser(response.data.user);
        setSkills(response.data.skills);
        setBio(response.data.bio);
      } catch (err) {
        toast.error("Error in fetching user data");
      }
    };
    if (isAuthenticated) fetchUserData();
  }, [isAuthenticated, username]);

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm("Are you sure you want to delete your account? This action cannot be undone.");
    if (!confirmed) return;
    
    try {
        const response = await fetch('/delete_account', {
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
          <li>
            <Link to="/mentor-mentee">
              {user.role === 'mentor' ? 'Mentees' : 'Mentors'}
            </Link>
          </li>
          <li><Link to="/notifications"> Notifications </Link></li>
          <li><Link to="/requests"> Requests </Link></li>
        </ul>
      </nav>

      <div className="main-content">
        <aside className="sidebar">
          <ul>
            <li><Link to="/profile"> Profile </Link></li>
            <li><Link to="/edit-profile"> Edit Profile </Link></li>
            {user.role === 'mentee' && (
              <li><Link to="/create-request"> Create Request </Link></li>
            )}
            <li><Link to="/search-user"> Search User </Link></li>
            <li><Link to="/login"> Logout </Link></li>
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
        <ToastContainer/>
        { !SelecetedUser ? (
            <h5 style={{ color: '#555', marginLeft:'20px', marginTop:'20px',textAlign: 'center' }}>  loading...</h5>
        ):(
        <section
          style={{
            flex: 1,
            marginLeft: '20px',
            backgroundColor: '#fff',
            padding: '20px',
            borderRadius: '10px',
            boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
          }}
        >
          <div
            style={{
              marginBottom: '15px',
              paddingBottom: '10px',
              borderBottom: '1px solid #ddd',
            }}
          >
            <h4 style={{ color: 'green', marginBottom: '5px' }}>
              @{SelecetedUser.username} ({SelecetedUser.first_name} {SelecetedUser.last_name} as{' '}
              {SelecetedUser.role === 'mentee' ? 'mentee' : 'mentor'})
            </h4>
            <h5 style={{ color: '#7f8000', marginBottom: '10px' }}>
              Email: {SelecetedUser.email}
            </h5>
          </div>
          <div
            style={{
              marginBottom: '15px',
              paddingBottom: '10px',
              borderBottom: '1px solid #ddd',
            }}
          >
            <h6 style={{ color: 'green', fontWeight: 'bold' }}>Bio:</h6>
            <p style={{ color: '#7f8000' }}>{bio}</p>
          </div>
          <div style={{ marginBottom: '10px' }}>
            <strong style={{ color: '#7f8000' }}>• Programming languages:</strong>
            <span style={{ color: skills.isPython ? 'green' : '#777' }}> Python</span>,
            <span style={{ color: skills.isJava ? 'green' : '#777' }}> Java</span>,
            <span style={{ color: skills.isC ? 'green' : '#777' }}> C</span>,
            <span style={{ color: skills.isCPlusPlus ? 'green' : '#777' }}> C++</span>,
            <span style={{ color: skills.isJavaScript ? 'green' : '#777' }}> JavaScript</span>,
            <span style={{ color: skills.isSQL ? 'green' : '#777' }}> SQL</span>
          </div>
          <div style={{ marginBottom: '10px' }}>
            <strong style={{ color: '#7f8000' }}>• Web development:</strong>
            <span style={{ color: skills.isHtml ? 'green' : '#777' }}> HTML</span>,
            <span style={{ color: skills.isCss ? 'green' : '#777' }}> CSS</span>,
            <span style={{ color: skills.isReactJs ? 'green' : '#777' }}> React.js</span>,
            <span style={{ color: skills.isNodeJs ? 'green' : '#777' }}> Node.js</span>,
            <span style={{ color: skills.isDjango ? 'green' : '#777' }}> Django</span>,
            <span style={{ color: skills.isFlask ? 'green' : '#777' }}> Flask</span>
          </div>
          <div style={{ marginBottom: '10px' }}>
            <strong style={{ color: '#7f8000' }}>• Mobile development:</strong>
            <span style={{ color: skills.isAndroid ? 'green' : '#777' }}> Android</span>,
            <span style={{ color: skills.isIOS ? 'green' : '#777' }}> iOS</span>,
            <span style={{ color: skills.isFlutter ? 'green' : '#777' }}> Flutter</span>
          </div>
          <div style={{ marginBottom: '10px' }}>
            <strong style={{ color: '#7f8000' }}>• Data science:</strong>
            <span style={{ color: skills.isMachineLearning ? 'green' : '#777' }}> Machine Learning</span>,
            <span style={{ color: skills.isDataAnalytics ? 'green' : '#777' }}> Data Analytics</span>,
            <span style={{ color: skills.isDeepLearning ? 'green' : '#777' }}> Deep Learning</span>
          </div>
          <div style={{ marginBottom: '10px' }}>
            <strong style={{ color: '#7f8000' }}>• DevOps:</strong>
            <span style={{ color: skills.isDocker ? 'green' : '#777' }}> Docker</span>,
            <span style={{ color: skills.isKubernetes ? 'green' : '#777' }}> Kubernetes</span>,
            <span style={{ color: skills.isAws ? 'green' : '#777' }}> Aws</span>,
            <span style={{ color: skills.isAzure ? 'green' : '#777' }}> Azure</span>
          </div>
          <div style={{ marginBottom: '10px' }}>
            <strong style={{ color: '#7f8000' }}>• Version Control:</strong>
            <span style={{ color: skills.isGit ? 'green' : '#777' }}> Git</span>,
            <span style={{ color: skills.isGitHub ? 'green' : '#777' }}> GitHub</span>
          </div>
            </section>
        )
        }
      </div>
    </div>
  );
}

export default ViewProfile;
