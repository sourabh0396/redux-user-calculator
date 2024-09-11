import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/authSlice';
import './Header.css'; // Import the external CSS file

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userData } = useSelector((state) => state.profile);

  const handleLogout = () => {
    dispatch(logout()); // Dispatch the logout action to clear token and user data
    document.documentElement.style.removeProperty('--primary-color');
    document.documentElement.style.removeProperty('--secondary-color');
    navigate('/'); // Navigate to the sign-in page after logout
  };

  return (
    <header className='header-header'>
      <div className='header-nav'>
        <div>
          <Link to="/profile" className='header-nav-link'>Profile</Link>
        </div>
        <div>
          <button onClick={handleLogout} className='header-nav-link'>Logout</button>
        </div>

        {userData && userData.logo && (
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center' }}>
            <h2 style={{ marginRight: '10px' }}>{userData.firstName}</h2>
            <h2 style={{ marginRight: '10px' }}>{userData.lastName}</h2>
            <Link to="/profile" className='header-nav-link'>
              <img src={userData.logo} alt="Profile" />
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
// import React from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { useDispatch, useSelector } from 'react-redux';
// import { logout } from '../store/authSlice';
// import './Header.css'; // Import the external CSS file

// const Header = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const { userData } = useSelector((state) => state.profile);

//   const handleLogout = () => {
//     // Dispatch the logout action to clear token and user data
//     dispatch(logout());

//     // Reset primary and secondary colors after logout
//     document.documentElement.style.removeProperty('--primary-color');
//     document.documentElement.style.removeProperty('--secondary-color');

//     // Navigate to the sign-in page after logout
//     navigate('/');
//   };

//   return (
//     <header className='header-header'>
//       <div className='header-nav'>
//         <div><Link to="/profile" className='header-nav-link'>Profile</Link></div>
//         <div>
//           <button onClick={handleLogout} className='header-nav-link'>Logout</button>
//         </div>

//         {userData && userData.logo && (
//           <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center' }}>
//             <h2 style={{ marginRight: '10px' }}>{userData.firstName}</h2>
//             <h2 style={{ marginRight: '10px' }}>{userData.lastName}</h2>
//             <Link to="/profile" className='header-nav-link'>
//               <img src={userData.logo} alt="Profile" />
//             </Link>
//           </div>
//         )}
//       </div>
//     </header>
//   );
// };

// export default Header;
// // import React from 'react';

// // import { Link, useNavigate } from 'react-router-dom';
// // import { useDispatch, useSelector } from 'react-redux';
// // import { logout } from '../store/authSlice';

// // const Header = () => {
// //   const dispatch = useDispatch();
// //   const navigate = useNavigate();
// //   const { userData } = useSelector((state) => state.profile);

// //   const handleLogout = () => {
// //     // Dispatch the logout action to clear token and user data
// //     dispatch(logout());

// //     // Reset primary and secondary colors after logout
// //     document.documentElement.style.removeProperty('--primary-color');
// //     document.documentElement.style.removeProperty('--secondary-color');

// //     // Navigate to the sign-in page after logout
// //     navigate('/');
// //   };

// //   return (
// //     <header className='header-header'>
// //       <div style={{ display: 'flex', alignItems: 'center' }} className='header-nav'>
// //         <div><Link to="/profile" className='header-nav-link'>Profile</Link></div>
// //         <div>
// //           <button onClick={handleLogout} className='header-nav-link'>Logout</button>
// //         </div>

// //         {userData && userData.logo && (
// //           <div style={{ marginLeft: 'auto', marginRight: '10px', display: 'flex', justifyContent: 'space-between' }}>
// //             <h2 style={{ marginRight: '10px' }}>{userData.firstName}</h2>
// //             <h2 style={{ marginRight: '10px' }}>{userData.lastName}</h2>
// //             <Link to="/profile" className='header-nav-link'>
// //               <img src={userData.logo} alt="Profile" style={{ width: '50px', height: '50px', borderRadius: '50%', marginLeft: '20px' }} />
// //             </Link>
// //           </div>
// //         )}
// //       </div>
// //     </header>
// //   );
// // };

// // export default Header;

// // // import React from 'react';
// // // import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate for redirection
// // // import { useDispatch, useSelector } from 'react-redux';
// // // import { logout } from '../store/authSlice';
// // // import './Header.css'; // Import the external CSS file

// // // const Header = () => {
// // //   const dispatch = useDispatch();
// // //   const navigate = useNavigate(); // Initialize the navigate function
// // //   const { userData } = useSelector((state) => state.profile);

// // //   const handleLogout = () => {
// // //     dispatch(logout()); // Dispatch the logout action to clear token and user data
// // //     navigate('/'); // Navigate to the sign-in page after logout
// // //   };

// // //   return (
// // //     <header className='header-header'>
// // //       <div className='header-nav'>
// // //         <div ><Link to="/profile" className='header-nav-link'>Profile</Link></div>
// // //         <div>
// // //           <button onClick={handleLogout} className='header-nav-link'>Logout</button>
// // //         </div>
// // //         {userData && userData.logo && (
// // //           <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center' }}>
// // //             <h2>{userData.firstName}</h2>
// // //             <h2>{userData.lastName}</h2>
// // //             <Link to="/profile" className='header-nav-link'>
// // //               <img src={userData.logo} alt="Profile" />
// // //             </Link>
// // //           </div>
// // //         )}
// // //       </div>
// // //     </header>
// // //   );
// // // };

// // // export default Header;