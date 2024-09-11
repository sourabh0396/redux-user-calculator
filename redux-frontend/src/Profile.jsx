import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserProfile, updateUserProfile } from './store/profileSlice';
import { Link } from 'react-router-dom';
import './Profile.css';  // Import the CSS file

const Profile = () => {
  const dispatch = useDispatch();
  const { userData, error } = useSelector((state) => state.profile);
  const [editMode, setEditMode] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    age: '',
    homeAddress: '',
    primaryColor: '',
    secondaryColor: '',
    logo: '',
  });

  useEffect(() => {
    if (!userData) {
      dispatch(fetchUserProfile());
    }
  }, [dispatch, userData]);

  useEffect(() => {
    if (userData) {
      setProfileData({
        firstName: userData.firstName || '',
        lastName: userData.lastName || '',
        email: userData.email || '',
        age: userData.age || '',
        homeAddress: userData.homeAddress || '',
        primaryColor: userData.primaryColor || '',
        secondaryColor: userData.secondaryColor || '',
        logo: userData.logo || '',
      });

      // Apply the primary and secondary colors using CSSOM
      document.documentElement.style.setProperty('--primary-color', userData.primaryColor || '#000000');
      document.documentElement.style.setProperty('--secondary-color', userData.secondaryColor || '#ffffff');
    }
  }, [userData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData({ ...profileData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(updateUserProfile(profileData));
    setEditMode(false);
  };

  if (!userData) {
    return <div className="profile-container">Loading...</div>;
  }

  return (
    <div className="profile-container">
      <div>
        <Link to="/calculator" className='header-nav-link'>X</Link>
        <br />
        <Link to="/home" className='header-nav-link'>Home</Link>
      </div>
      <h2>Profile</h2>
      {editMode ? (
        <form className="profile-form" onSubmit={handleSubmit}>
          <div>
            <label>First Name:</label>
            <input type="text" name="firstName" value={profileData.firstName} onChange={handleInputChange} className="profile-input" required />
          </div>
          <div>
            <label>Last Name:</label>
            <input type="text" name="lastName" value={profileData.lastName} onChange={handleInputChange} className="profile-input" required />
          </div>
          <div>
            <label>Email</label>
            <input type="email" name="email" value={profileData.email} disabled className="profile-input" />
          </div>
          <div>
            <label>Age:</label>
            <input type="number" name="age" value={profileData.age} onChange={handleInputChange} className="profile-input" required />
          </div>
          <div>
            <label>Home Address:</label>
            <input type="text" name="homeAddress" value={profileData.homeAddress} onChange={handleInputChange} className="profile-input" required />
          </div>
          <div>
            <label>Primary Color:</label>
            <input type="color" name="primaryColor" value={profileData.primaryColor} onChange={handleInputChange} className="profile-input" />
          </div>
          <div>
            <label>Secondary Color:</label>
            <input type="color" name="secondaryColor" value={profileData.secondaryColor} onChange={handleInputChange} className="profile-input" />
          </div>
          <div>
            <label>Logo URL:</label>
            <input type="url" name="logo" value={profileData.logo} onChange={handleInputChange} className="profile-input" required />
          </div>
          <button type="submit" className="profile-button">Save Changes</button>
        </form>
      ) : (
        <div>
          <p className="profile-info"><strong>First Name:</strong> {userData.firstName || 'N/A'}</p>
          <p className="profile-info"><strong>Last Name:</strong> {userData.lastName || 'N/A'}</p>
          <p className="profile-info"><strong>Email:</strong> {userData.email || 'N/A'}</p>
          <p className="profile-info"><strong>Age:</strong> {userData.age || 'N/A'}</p>
          <p className="profile-info"><strong>Home Address:</strong> {userData.homeAddress || 'N/A'}</p>
          <p className="profile-info"><strong>Primary Color:</strong> {userData.primaryColor || 'N/A'}</p>
          <p className="profile-info"><strong>Secondary Color:</strong> {userData.secondaryColor || 'N/A'}</p>
          <p className="profile-info"><strong>Logo:</strong> 
            {userData.logo ? (
              <img src={userData.logo} alt="Logo" className="profile-logo" />
            ) : (
              <span>No logo available</span>
            )}
          </p>
          <button onClick={() => setEditMode(true)} className="profile-button">Edit Profile</button>
        </div>
      )}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default Profile;
