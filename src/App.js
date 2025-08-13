import logo from './logo.svg';
import './App.css';
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './component/common/Navbar';
import FooterComponent from './component/common/Footer';
import HomePage from './component/home/HomePage';
import AllRoomsPage from './component/booking_rooms/AllRoomsPage';
import FindBookingPage from './component/booking_rooms/FindBookingPage';
import RoomDetailsPage from './component/booking_rooms/RoomDetailsPage';

function App() {

  return (
 
    <BrowserRouter>
    <div className="App">
      <Navbar/>

      <div className='content'>
        <Routes>
            <Route exact path='/home' element={<HomePage />} />
            <Route exact path='/rooms' element={<AllRoomsPage />} />
            <Route path='/find-booking' element={<FindBookingPage />} />
            <Route path='/room-details-book/roomId' element={<RoomDetailsPage />} />
        </Routes>
      </div>

      <FooterComponent/>
    </div>
    
    </BrowserRouter>

  );

}

export default App;
