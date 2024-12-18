import React, { useContext, useState, useEffect } from 'react';
import '../styles/SkillsForm.css';
import { userContext } from '../context/UserContext';
import {toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const SkillsForm = () => {
  const { user, skills, updateSkills } = useContext(userContext);
  const [currentSkills, setCurrentSkills] = useState({});

  const [loading2, setLoading2] = useState(false);

  useEffect(() => {
    if (skills) {
      setCurrentSkills(skills);
    }
  }, [skills]);

  const updateCurrentSkills = (skillKey, value) => {
    setCurrentSkills((prevState) => ({
      ...prevState,
      [skillKey]: value,
    }));
  };

  const handleToggle = (skillName) => {
    updateCurrentSkills(skillName, !currentSkills[skillName]);
  };

  const renderSkills1 = () => {
    const skillKeys = Object.keys(currentSkills).slice(0, 12);
    return skillKeys.map((skill) => (
      <div key={skill} className="form-check form-switch mb-3">
        <input
          className="form-check-input"
          type="checkbox"
          role="switch"
          id={`switch-${skill}`}
          checked={currentSkills[skill]}
          onChange={() => handleToggle(skill)}
        />
        <label className="form-check-label" htmlFor={`switch-${skill}`}>
          {skill.replace(/^is/, '')}
        </label>
      </div>
    ));
  };

  const renderSkills2 = () => {
    const skillKeys = Object.keys(currentSkills).slice(12);
    return skillKeys.map((skill) => (
      <div key={skill} className="form-check form-switch mb-3">
        <input
          className="form-check-input"
          type="checkbox"
          role="switch"
          id={`switch-${skill}`}
          checked={currentSkills[skill]}
          onChange={() => handleToggle(skill)}
        />
        <label className="form-check-label" htmlFor={`switch-${skill}`}>
          {skill.replace(/^is/, '')}
        </label>
      </div>
    ));
  };
  const handleUpdate = async() => {
    setLoading2(true);
    try {
        const response = await fetch('/update-user-skills', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username: user.username, skills: currentSkills}),
        });
        const data = await response.json();
        if (data.success) {
            for (const skill in currentSkills) {
                updateSkills(skill, currentSkills[skill]);
            }
            toast.success("Skills updated successfully!");
        } else {
            toast.error('Failed to update bio');
        }
    } catch (error) {
        toast.error('An error occurred. Please try again.');
    } finally{
      setLoading2(false);
    }
  };
  return (
    <div className="skills-form">
      <h2>Select Your Skills</h2>
      <div className='row'>
        <div className='col-5'>
          <div className="skills-list">{renderSkills1()}</div>
        </div>
        <div className='col-7'>
          <div className="skills-list">{renderSkills2()}</div>
        </div>
      </div>
      <div>
        <button 
          style={{ padding: '10px 20px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer', width:'150px'}}
          onClick={handleUpdate}
          disabled={loading2}
        >
          {loading2 ? 'Updaing...' : 'Update Skills'}
        </button>
      </div>
    </div>
  );
};

export default SkillsForm;
