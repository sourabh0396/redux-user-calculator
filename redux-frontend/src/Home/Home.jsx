// Home.js
import React from 'react';
// import Profile from './Profile';
import Profile from '../Profile';
import Header from './Header';
import CalculatorFour from '../component/calculator/CalculatorFour';

const Home = () => {
  return (
    <div>
      {/* <Header /> */}
      <h1>Welcome to your Dashboard</h1>
      {/* <Profile /> */}
      <CalculatorFour />
    </div>
  );
};

export default Home;

// import React, { useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import Header from './Header';
// import CalculatorFour from '../component/calculator/CalculatorFour';
// import { fetchUserLogs } from '../store/calculatorSlice'; // Action to fetch user-specific logs

// const Home = () => {
//   const dispatch = useDispatch();
//   const { history, error } = useSelector((state) => state.calculator);

//   useEffect(() => {
//     dispatch(fetchUserLogs());
//   }, [dispatch]);

//   return (
//     <div>
//       <Header />
//       <h1>Welcome to your Dashboard</h1>
//       {error && <p style={{ color: 'red' }}>{error}</p>}
//       <CalculatorFour />
//       <div>
//         <h2>Your Calculator Logs</h2>
//         <ul>
//           {history && history.length > 0 ? (
//             history.map((log, index) => (
//               <li key={index}>
//                 Result: {log.result} - Calculated at: {new Date(log.date).toLocaleString()}
//               </li>
//             ))
//           ) : (
//             <p>No logs found.</p>
//           )}
//         </ul>
//       </div>
//     </div>
//   );
// };

// export default Home;
