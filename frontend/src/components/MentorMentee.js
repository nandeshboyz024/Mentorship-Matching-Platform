import React, { useContext, useState, useEffect } from 'react';
import '../styles/Dashboard.css';
import { userContext } from '../context/UserContext';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

function MentorMentee() {
    const { user, isAuthenticated } = useContext(userContext); 
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    useEffect(() => {
        const fetchRequests = async () => {
            try {
                if(user.role==='mentee'){
                    const response = await axios.post('/accepted-request-for-mentee', {
                        mentee_username: user.username
                    });
                    if (response.data.success) {
                        setRequests(response.data.mentors);
                    } else {
                        setError(response.data.message);
                    }
                }
                else{
                    const response = await axios.post('/accepted-request-for-mentor', {
                        mentor_username: user.username
                    });
                    if (response.data.success) {
                        setRequests(response.data.mentees);
                    } else {
                        setError(response.data.message);
                    }
                }
            } catch (err) {
                setError('Failed to fetch requests. Please try again.');
            } finally {
                setLoading(false);
            }
        };
    
        if (isAuthenticated) fetchRequests();
    }, [isAuthenticated,user]);
    

    const deleteRequest = async (Username) => {
        try {
            let params = {};
            if(user.role === 'mentee'){
                params = {
                    mentee_username: user.username,
                    mentor_username: Username,
                    notify_to: Username,
                    message:`request is taken back by ${user.username}`
                };
            }
            else{
                params={
                    mentee_username: Username,
                    mentor_username: user.username,
                    notify_to: Username,
                    message: `your request is rejected by ${user.username}`
                };
            }
            const response = await axios.delete('/delete-request', { params });

            if (response.data.success) {
                if(user.role==='mentee'){
                    setRequests((prevRequests) =>
                        prevRequests.filter((request) => request.mentor_username !== Username)
                    );
                }
                else{
                    setRequests((prevRequests) =>
                        prevRequests.filter((request) => request.mentee_username !== Username)
                    );
                }
                toast.success("Request is dropped successfuly");
            } else {
                toast.warning("Mentorship no longer exists.");
            }
        } catch (err) {
            toast.error('Failed to delete request. Please try again.');
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
                    <li><Link to="/mentor-mentee">  {user.role === 'mentor' ? 'Mentees' : 'Mentors'} </Link></li>
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
                
                <section
                    className="content"
                    style={{
                        padding: '20px',
                        backgroundColor: '#f9f9f9',
                        borderRadius: '8px',
                        maxWidth: '600px',
                        margin: '0 auto',
                        boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
                        fontFamily: 'Arial, sans-serif'
                    }}
                >
                    <ToastContainer/>
                    {loading && <p style={{ color: '#555' }}>Loading...</p>}
                    {error && <p style={{ color: '555' }}>{error}</p>}

                    {!loading && !error && requests.length === 0 && (
                        <p style={{ color: '#555' }}>No result found.</p>
                    )}

                    {!loading && !error && requests.length > 0 && (
                        <div>
                            <h2 style={{textAlign:'center', color:'#555'}}>{user.role==='mentor' ? 'Your mentees': 'Your Mentors'}</h2>
                            <ul style={{ listStyleType: 'none', padding: '0' }}>
                                {requests.map((request, index) => (
                                    <li
                                        key={index}
                                        style={{
                                            marginBottom: '15px',
                                            padding: '10px',
                                            backgroundColor: '#fff',
                                            border: '1px solid #ddd',
                                            borderRadius: '4px',
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                        }}
                                    >
                                        {user.role === 'mentee' ? (
                                            <span>
                                                Mentor Username: <Link to={`/view-profile/${request.mentor_username}`}><strong>@{request.mentor_username} </strong></Link>
                                            </span>
                                        ) : (
                                            <span>
                                                Mentee Username: <Link to={`/view-profile/${request.mentee_username}`}><strong>@{request.mentee_username} </strong></Link>
                                            </span>
                                        )}
                                        {user.role==='mentee' ? (
                                            <button
                                            onClick={() => deleteRequest(request.mentor_username)}
                                            style={{
                                                backgroundColor: '#ff4d4f',
                                                color: '#fff',
                                                border: 'none',
                                                borderRadius: '4px',
                                                padding: '8px 12px',
                                                cursor: 'pointer',
                                                fontWeight: 'bold',
                                            }}
                                        >
                                            Delete
                                        </button>
                                        ):(
                                            <button
                                            onClick={() => deleteRequest(request.mentee_username)}
                                            style={{
                                                backgroundColor: '#ff4d4f',
                                                color: '#fff',
                                                border: 'none',
                                                borderRadius: '4px',
                                                padding: '8px 12px',
                                                cursor: 'pointer',
                                                fontWeight: 'bold',
                                            }}
                                        >
                                            Delete
                                        </button>
                                    )}
                                        
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </section>

            </div>
        </div>
    );
}

export default MentorMentee;
