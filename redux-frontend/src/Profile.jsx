import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserProfile, updateUserProfile } from './store/profileSlice';
import { Link } from 'react-router-dom';

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

  const containerStyle = {
    width: '80%',
    maxWidth: '800px',
    margin: '0 auto',
    padding: '20px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
    backgroundColor: '#f9f9f9',
  };

  const formStyle = {
    display: 'flex',
    flexDirection: 'column',
  };

  const inputStyle = {
    width: '100%',
    padding: '8px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    boxSizing: 'border-box',
    marginBottom: '10px',
  };

  const buttonStyle = {
    display: 'block',
    width: '100%',
    padding: '10px',
    border: 'none',
    borderRadius: '4px',
    backgroundColor: 'var(--primary-color, #007bff)',
    color: 'white',
    fontSize: '16px',
    cursor: 'pointer',
    marginTop: '10px',
  };

  const buttonHoverStyle = {
    backgroundColor: 'var(--secondary-color, #0056b3)',
  };

  const infoStyle = {
    marginBottom: '15px',
  };

  const imageStyle = {
    width: '100px',
    borderRadius: '4px',
    display: 'block',
    margin: '0 auto',
  };

  if (!userData) {
    return <div style={containerStyle}>Loading...</div>;
  }

  return (
    <>
      <div style={containerStyle}>
        <div>
          <Link to="/calculator" className='header-nav-link' style={{color: 'black', border: '2px'}}>X</Link>
          <br />
          <Link to="/home" className='header-nav-link' style={{color: 'black', border: '2px'}}>Home</Link>
        </div>
        <h2>Profile</h2>
        {editMode ? (
          <form style={formStyle} onSubmit={handleSubmit}>
            <div>
              <label>First Name:</label>
              <input type="text" name="firstName" value={profileData.firstName} onChange={handleInputChange} style={inputStyle} required
              />
            </div>
            <div>
              <label>Last Name:</label>
              <input type="text" name="lastName" value={profileData.lastName} onChange={handleInputChange} style={inputStyle} required
              />
            </div>
            <div>
              <label>Email </label>
              <input type="email" name="email" value={profileData.email} disabled style={inputStyle}
              />
            </div>
            <div>
              <label>Age:</label>
              <input type="number" name="age" value={profileData.age} onChange={handleInputChange} style={inputStyle} required
              />
            </div>
            <div>
              <label>Home Address:</label>
              <input type="text" name="homeAddress" value={profileData.homeAddress} onChange={handleInputChange} style={inputStyle} required
              />
            </div>
            <div>
              <label>Primary Color:</label>
              <input type="color" name="primaryColor" value={profileData.primaryColor} onChange={handleInputChange} style={inputStyle}
              />
            </div>
            <div>
              <label>Secondary Color:</label>
              <input type="color" name="secondaryColor" value={profileData.secondaryColor} onChange={handleInputChange} style={inputStyle}
              />
            </div>
            <div>
              <label>Logo URL:</label>
              <input type="url" name="logo" value={profileData.logo} onChange={handleInputChange} style={inputStyle} required
              />
            </div>
            <button type="submit" style={buttonStyle}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = buttonHoverStyle.backgroundColor}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = buttonStyle.backgroundColor}
            >
              Save Changes
            </button>
          </form>
        ) : (
          <div>
            <p style={infoStyle}><strong>First Name:</strong> {userData.firstName || 'N/A'}</p>
            <p style={infoStyle}><strong>Last Name:</strong> {userData.lastName || 'N/A'}</p>
            <p style={infoStyle}><strong>Email:</strong> {userData.email || 'N/A'}</p>
            <p style={infoStyle}><strong>Age:</strong> {userData.age || 'N/A'}</p>
            <p style={infoStyle}><strong>Home Address:</strong> {userData.homeAddress || 'N/A'}</p>
            <p style={infoStyle}><strong>Primary Color:</strong> {userData.primaryColor || 'N/A'}</p>
            <p style={infoStyle}><strong>Secondary Color:</strong> {userData.secondaryColor || 'N/A'}</p>
            <p style={infoStyle}><strong>Logo:</strong> 
              {userData.logo ? (
                <img src={userData.logo} alt="Logo" style={imageStyle} />
              ) : (
                <span>No logo available</span>
              )}
            </p>
            <button
              onClick={() => setEditMode(true)}
              style={buttonStyle}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = buttonHoverStyle.backgroundColor}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = buttonStyle.backgroundColor}
            >
              Edit Profile
            </button>
          </div>
        )}
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </div>
    </>
  );
};

export default Profile;
