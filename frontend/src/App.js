import React from 'react';
import {BrowserRouter,Routes,Route} from 'react-router-dom';
import Login from './components/Login';
import Signup from './components/Signup';
import Profile from './components/Profile';
import EditProfile from './components/EditProfile';
import MentorMentee from './components/MentorMentee';
import Notifications from './components/Notifications';
import Requests from './components/Requests';
import CreateRequest from './components/CreateRequest';
import SearchUser from './components/SearchUser';
import ViewProfile from './components/ViewProfile';
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login/>}></Route>
        <Route path="/login" element={<Login/>}></Route>
        <Route path="/signup" element={<Signup/>}></Route>
        <Route path="/profile" element={<Profile/>}></Route>
        <Route path="/edit-profile" element={<EditProfile/>}></Route>
        <Route path="/mentor-mentee" element={<MentorMentee/>}></Route>
        <Route path="/notifications" element={<Notifications/>}></Route>
        <Route path="/requests" element={<Requests/>}></Route>
        <Route path="/create-request" element={<CreateRequest/>}></Route>
        <Route path="/search-user" element={<SearchUser/>}></Route>
        <Route path="/view-profile/:username" element={<ViewProfile />} />
      </Routes>
    </BrowserRouter>
  )
}
export default App;
