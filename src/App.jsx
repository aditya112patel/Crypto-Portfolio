import React, { useState } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import './App.css';
import Navbar from './components/navbar';
import Coinlist from './components/coinlist';

const App = () => {
  
  return (
    <>
      <Navbar/>
      <div className='container'>
              <Coinlist/>
      </div>
      

    </>
  );
};

export default App;
