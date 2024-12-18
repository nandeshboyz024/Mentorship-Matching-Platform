import React, { useContext, useEffect, useState } from 'react';
import '../styles/Dashboard.css';
import { userContext } from '../context/UserContext';
import { Link, Navigate,useNavigate } from 'react-router-dom';
import axios from 'axios';
import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const API_BASE_URL = process.env.REACT_APP_PROXY_URL;

function Notifications() {
    const { user, isAuthenticated } = useContext(userContext); 
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        if (isAuthenticated) {
            const fetchAndDeleteNotifications = async () => {
                try {
                    const response = await axios.get(`${API_BASE_URL}/get-and-delete-notifications?username=${user.username}`);
                    
                    if (response.data.success) {
                        setNotifications(response.data.deletedNotifications);
                    }
                } catch (err) {
                    toast.error("Something is wrong!");
                } finally {
                    setLoading(false);
                }
            };
            if(isAuthenticated) fetchAndDeleteNotifications();
        }
    }, [isAuthenticated, user]);

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
                navigate('/login'); // Redirect to login page after deletion
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
                
                <section className="content">
                    <ToastContainer/>
                    <h1>Notifications</h1>
                    {loading ? (
                        <p>Loading notifications...</p>
                    ) : (
                        <div>
                            {notifications.length === 0 ? (
                                <p>No notifications to show.</p>
                            ) : (
                                [...notifications].reverse().map((notification) => (
                                    <div key={notification.id} className="notification-item card mb-2">
                                        <p className='card-body card-text'>{notification.message}</p>
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
}

export default Notifications;
