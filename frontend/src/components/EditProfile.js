import React, { useContext, useState } from 'react';
import '../styles/Dashboard.css';
import { userContext } from '../context/UserContext';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SkillsForm from './SkillsForm';

function EditProfile() {
    const { user, isAuthenticated, bio, updateBio } = useContext(userContext); 
    const [bioText, setBioText] = useState(bio || '');
    const [loading1, setLoading1] = useState(false);
    
    
    const navigate = useNavigate();

    if (!isAuthenticated) {
        return <Navigate to="/login" />;
    }
    const handleUpdateBio = async () => {
        setLoading1(true);
        try {
            const response = await fetch('/update-user-bio', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username: user.username, bio: bioText }),
            });
            const data = await response.json();
            if (data.success) {
                updateBio(bioText);
                toast.success('Bio updated successfully');
            } else {
                toast.warning('something is wrong!');
            }
        } catch (error) {
            toast.error('An error occurred. Please try again.');
        } finally{
            setLoading1(false);
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

    const handleBioChange = (e) => {
        setBioText(e.target.value); 
    };

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
                
                <section className="content">
                    <ToastContainer/>
                    <div className="mb-3">
                        <label htmlFor="exampleFormControlTextarea1" className="form-label">Bio</label>
                        <textarea
                            className="form-control"
                            id="exampleFormControlTextarea1"
                            rows="3"
                            value={bioText}
                            onChange={handleBioChange}
                        />
                    </div>
                    <button 
                        onClick={handleUpdateBio}
                        style={{ padding: '10px 20px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer', width:'150px'}}
                        disabled={loading1}
                    >
                        {loading1 ? 'Updating...': 'Update Bio'}
                    </button>
                    <SkillsForm />
                </section>
            </div>
        </div>
    );
}

export default EditProfile;
