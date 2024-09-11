import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from './store/authSlice';
import { useNavigate } from 'react-router-dom';
import './Register.css'; // Import your CSS file here

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    password: '',
    email: '',
    age: '',
    homeAddress: '',
    primaryColor: '#000000',
    secondaryColor: '#ffffff',
    logo: ''
  });

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const error = useSelector((state) => state.auth.error);

  const validateForm = () => {
    let formErrors = {};
    
    if (!formData.firstName || formData.firstName.length < 3 || formData.firstName.length > 15) {
      formErrors.firstName = 'First name must be between 3 and 15 characters.';
    }

    if (formData.lastName && (formData.lastName.length < 3 || formData.lastName.length > 15)) {
      formErrors.lastName = 'Last name must be between 3 and 15 characters.';
    }

    if (!formData.email || formData.email.length < 5 || formData.email.length > 50) {
      formErrors.email = 'Email must be between 5 and 50 characters.';
    }

    if (!formData.age || formData.age < 10 || formData.age > 115) {
      formErrors.age = 'Age must be between 10 and 115.';
    }

    if (!formData.homeAddress || formData.homeAddress.length < 10 || formData.homeAddress.length > 100) {
      formErrors.homeAddress = 'Home Address must be between 10 and 100 characters.';
    }

    if (!formData.primaryColor) {
      formErrors.primaryColor = 'Primary color is required.';
    }

    if (!formData.secondaryColor) {
      formErrors.secondaryColor = 'Secondary color is required.';
    }

    if (!formData.logo || !/^https:\/\/.*$/.test(formData.logo)) {
      formErrors.logo = 'Logo must be a valid https URL.';
    }

    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const response = await dispatch(registerUser(formData)).unwrap();
        if (response && response.message === 'User registered successfully') {
          setSuccessMessage('Registration successful! Redirecting to sign-in page...');
          setTimeout(() => {
            navigate('/'); // Navigate after showing the success message
          }, 2000); // Redirect after 2 seconds
        }
      } catch (err) {
        console.error('Registration failed:', err);
      }
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className='register-container'>
      <div className='register-form'>
        <h2>Register</h2>
        <form onSubmit={handleRegister}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              placeholder="First Name"
              required
            />
            {errors.firstName && <p className='error'>{errors.firstName}</p>}
            
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              placeholder="Last Name"
            />
            {errors.lastName && <p className='error'>{errors.lastName}</p>}
          </div>          
          <div>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Email"
              required
            />
            {errors.email && <p className='error'>{errors.email}</p>}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Password"
              required
            />
            
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleInputChange}
              placeholder="Age"
              required
            />
            {errors.age && <p className='error'>{errors.age}</p>}
          </div>

          <div>
            <input
              type="text"
              name="homeAddress"
              value={formData.homeAddress}
              onChange={handleInputChange}
              placeholder="Home Address"
              required
            />
            {errors.homeAddress && <p className='error'>{errors.homeAddress}</p>}    
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div>
              <label>Primary Color:</label>
              <input
                type="color"
                name="primaryColor"
                value={formData.primaryColor}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <label>Secondary Color:</label>
              <input
                type="color"
                name="secondaryColor"
                value={formData.secondaryColor}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <input
            type="url"
            name="logo"
            value={formData.logo}
            onChange={handleInputChange}
            placeholder="Logo URL (https://)"
            required
          />
          {errors.logo && <p className='error'>{errors.logo}</p>}
          
          <button type="submit">Register</button>
          
          {error && <p className='error'>{error}</p>}
          {successMessage && <p className='success'>{successMessage}</p>}
          
          <p>Already have an account? <a href="/">Sign In here</a></p>
        </form>
      </div>
    </div>
  );
};

export default Register;
