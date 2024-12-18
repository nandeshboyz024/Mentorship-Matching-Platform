// userContext.js
import React, { createContext, useState } from 'react';

const userContext = createContext();

const UserProvider = ({ children }) => {

  const initialSkills = {
    isPython:false,
    isJava: false,
    isC:false,
    isCPlusPlus:false,
    isJavaScript:false,
    isSQL:false,
    isHtml:false,
    isCss:false,
    isReactJs:false,
    isNodeJs:false,
    isDjango:false,
    isFlask:false,
    isAndroid:false,
    isIOS:false,
    isFlutter:false,
    isMachineLearning:false,
    isDataAnalytics:false,
    isDeepLearning:false,
    isDocker:false,
    isKubernetes:false,
    isAws:false,
    isAzure:false,
    isGit:false,
    isGitHub:false
  };
  const [user, setUser] = useState(null);
  const [bio,setBio] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [skills,setSkills] = useState(initialSkills);
  const updateUser = (userData) => {
    setUser(userData);
  };
  const updateBio = (text)=>{
    setBio(text);
  };
  const UpdateIsAuthenticated = (isTrue)=>{
    setIsAuthenticated(isTrue);
  };
  const updateSkills = (skillKey,value)=>{
    setSkills((prevState)=>({
      ...prevState,
      [skillKey]:value,
    }))
  };
  return (
    <userContext.Provider 
    value={
      { user, updateUser,
        bio, updateBio,
        isAuthenticated, UpdateIsAuthenticated,
        skills, updateSkills, setSkills
      }
    }>
      {children}
    </userContext.Provider>
  );
};

export { userContext, UserProvider };
