
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignIn from './SignIn';
import Register from './Register';
import Profile from './Profile';
import CalculatorFour from './component/calculator/CalculatorFour';
import PrivateRoute from './PrivateRoute';
import Home from './Home/Home';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SignIn />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/home" element={<Home/>} />
        {/* <Route path="/home" element={<PrivateRoute><Home /></PrivateRoute>} /> */}
        <Route path="/calculator" element={<CalculatorFour />} />
      </Routes>
    </Router>
  );
};

export default App;

// import React from 'react';
// import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// import SignInPage from './Auth/SignIn';
// import RegisterPage from './Auth/Register';
// import HomePage from './Home/Home';
// import ProfilePage from './Home/ProfilePage';

// const App = () => {
//     return (
//         <Router>
//             <Routes>
//                 <Route path="/" exact component={SignInPage} />
//                 <Route path="/register" component={RegisterPage} />
//                 <Route path="/home" component={HomePage} />
//                 <Route path="/profile" component={ProfilePage} />
//             </Routes>
//         </Router>
//     );
// };

// export default App;

// // import React from 'react';
// // import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
// // import SignIn from './SignIn';
// // import Register from './Register';
// // // import Profile from './Profile/Profile';
// // import Home from './Home/Home';
// // // import TopBar from './components/TopBar';

// // const App = () => {
// //   return (
// //     <Router>
// //       <TopBar />
// //       <Switch>
// //         <Route path="/" exact component={SignIn} />
// //         <Route path="/register" component={Register} />
// //         {/* <Route path="/profile" component={Profile} /> */}
// //         <Route path="/home" component={Home} />
// //       </Switch>
// //     </Router>
// //   );
// // };

// // export default App;

// // import { useState } from 'react'
// // import reactLogo from './assets/react.svg'
// // import viteLogo from '/vite.svg'
// // import './App.css'
// // import CalculatorFour from './component/calculator/CalculatorFour'
// // import Login from './Auth/SignIn'
// // // import CalculatorFour from './component/CalculatorFour'

// // function App() {
// //   // const [count, setCount] = useState(0)

// //   return (
// //     <>
// //     {/* <Login/>  */}
// //     <CalculatorFour/>
// //     </>
// //   )
// // }

// // export default App
