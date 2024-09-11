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
