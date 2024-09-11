import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from './store/authSlice';
import { useNavigate } from 'react-router-dom';
import './SignIn.css'

const SignIn = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const error = useSelector((state) => state.auth.error);
  const status = useSelector((state) => state.auth.status);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await dispatch(loginUser(formData)).unwrap();
      if (result.token) {
        navigate('/calculator');
      }
    } catch (err) {
      // Error will be caught and handled by the authSlice
    }
  };

  return (
    <div className='siginmain'>
      <h2>Sign In</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          placeholder="Email"
          required
        />
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleInputChange}
          placeholder="Password"
          required
        />
        <button type="submit" disabled={status === 'loading'}>
          {status === 'loading' ? 'Signing in...' : 'Sign In'}
        </button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </form>
      <p>Don't have an account? <a href="/register">Register here</a></p>
    </div>
  );
};

export default SignIn;

// import React, { useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { loginUser } from './store/authSlice';
// import { useNavigate } from 'react-router-dom';
// import './SignIn.css'

// const SignIn = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({
//     email: '',
//     password: ''
//   });

//   const error = useSelector((state) => state.auth.error);
//   const status = useSelector((state) => state.auth.status); // Add this line

//   const handleInputChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const result = await dispatch(loginUser(formData)).unwrap();
//       if (result.token) {
//         navigate('/home');
//       }
//     } catch (err) {
//       console.error('Login failed:', err);
//     }
//   };

//   return (
//     <div className='siginmain'>
//       <h2>Sign In</h2>
//       <form onSubmit={handleSubmit}>
//         <input
//           type="email"
//           name="email"
//           value={formData.email}
//           onChange={handleInputChange}
//           placeholder="Email"
//           required
//         />
//         <input
//           type="password"
//           name="password"
//           value={formData.password}
//           onChange={handleInputChange}
//           placeholder="Password"
//           required
//         />
//         <button type="submit" disabled={status === 'loading'}>
//           {status === 'loading' ? 'Signing in...' : 'Sign In'}
//         </button>
//         {error && <p style={{ color: 'red' }}>{error}</p>}
//       </form>
//       <p>Don't have an account? <a href="/register">Register here</a></p>
//     </div>
//   );
// };

// export default SignIn;