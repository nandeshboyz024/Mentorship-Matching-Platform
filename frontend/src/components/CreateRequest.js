import React, { useContext, useState, useEffect } from 'react';
import '../styles/Dashboard.css';
import { userContext } from '../context/UserContext';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function CreateRequest() {
    const { user, isAuthenticated } = useContext(userContext);
    const [mentors, setMentors] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const SkillMap = { 
        isPython: 'Python', 
        isJava: 'Java', 
        isC: 'C', 
        isCPlusPlus: 'C++',
        isJavaScript: 'JavaScript',
        isSQL: 'SQL',
        isHtml: 'HTML',
        isCss: 'CSS',
        isReactJs: 'React.js',
        isNodeJs: 'Node.js',
        isDjango: 'Django',
        isFlask: 'Flask',
        isAndroid: 'Android Development',
        isIOS: 'iOS Development',
        isFlutter: 'Flutter',
        isMachineLearning: 'Machine Learning',
        isDataAnalytics: 'Data Analytics',
        isDeepLearning: 'Deep Learning',
        isDocker: 'Docker',
        isKubernetes: 'Kubernetes',
        isAws: 'AWS',
        isAzure: 'Azure',
        isGit: 'Git',
        isGitHub: 'GitHub'
    }

    useEffect(() => {
        const fetchMentors = async () => {
            try {
                const response = await fetch('/get_mentor', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        mentee_username: user.username
                    })
                });

                const data = await response.json();
                if (data.success) {
                    setMentors(data.mentors);
                } else {
                    console.error('Failed to fetch mentors:', data.message);
                }
            } catch (error) {
                console.error('Error fetching mentors:', error);
            } finally {
                setLoading(false);
            }
        };

        if (isAuthenticated && user.role === 'mentee') {
            fetchMentors();
        }
    }, [isAuthenticated, user]);

    const handleRequestMentor = async (mentorUsername) => {
        try {
            const response = await fetch('/create_request', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    mentee_username: user.username,
                    mentor_username: mentorUsername
                })
            });
    
            const data = await response.json();
            if (data.success) {
                setMentors((prevMentors) => prevMentors.filter((mentor) => mentor.username !== mentorUsername));
                toast.success("Request sent successfully!");
            } else {
                toast.error("failed to send request!");
            }
        } catch (err) {
            toast.error("failed to send request!");
        }
    };
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


                <section
                    className="content"
                    style={{
                        backgroundColor: '#f9f9f9',
                        borderRadius: '8px', 
                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                        padding: '20px', 
                        marginTop: '20px',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        flexDirection: 'column',
                    }}
                >
                    <ToastContainer/>
                    {loading ? (
                        <p style={{ color: '#555' }}>Loading mentors...</p>
                    ) : mentors.length > 0 ? (
                        <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                            <div>
                                <h2 style={{ color: '#555', marginBottom: '15px', textAlign: 'center' }}>Available Mentors</h2>
                                <ul className="mentor-list" style={{ listStyle: 'none', padding: 0 }}>
                                    {mentors.map((mentor, index) => (
                                        <li
                                            key={index}
                                            className="mentor-item"
                                            style={{
                                                backgroundColor: '#fff',
                                                padding: '15px',
                                                marginBottom: '10px',
                                                borderRadius: '5px',
                                                boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                gap: '10px',
                                                width: '500px',
                                                textAlign: 'center',
                                                margin: '10px auto',
                                            }}
                                        >
                                            <p style={{ fontWeight: 'bold', color: '#333' }}>
                                                Username: {mentor.username}
                                            </p>
                                            <h6 style={{ color: '#777'}}>Skills:</h6>
      
                                            <ul style={{ listStyle: 'none', padding: 0, marginLeft: '100px' }}>
                                                {Object.entries(mentor.skills).filter(([_, hasSkill]) => hasSkill).reduce((result, skill, idx, array) => {
                                                    if (idx % 2 === 0) {
                                                        result.push(array.slice(idx, idx + 2));
                                                    }
                                                    return result;
                                                }, []).map((skillPair, idx) => (
                                                    <li key={idx} style={{ display: 'flex', justifyContent: 'space-between', width: '70%' }}>
                                                        {skillPair.map(([skill], i) => (
                                                            <span key={i} style={{ color: '#555', fontSize: '14px' }}>
                                                                {SkillMap[skill]}
                                                            </span>
                                                        ))}
                                                    </li>
                                                ))}
                                            </ul>
                                            <button
                                                style={{
                                                    backgroundColor: '#4CAF50',
                                                    color: '#fff',
                                                    padding: '10px 15px',
                                                    border: 'none',
                                                    borderRadius: '5px',
                                                    cursor: 'pointer',
                                                    fontSize: '14px',
                                                    transition: 'background-color 0.3s ease',
                                                }}
                                                onClick={() => handleRequestMentor(mentor.username)}
                                                onMouseOver={(e) => (e.target.style.backgroundColor = '#45a049')}
                                                onMouseOut={(e) => (e.target.style.backgroundColor = '#4CAF50')}
                                            >
                                                Request Mentor
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    ) : (
                        <p style={{ color: '#555' }}>No mentors available.</p>
                    )}
                </section>
            </div>
        </div>
    );
}

export default CreateRequest;
