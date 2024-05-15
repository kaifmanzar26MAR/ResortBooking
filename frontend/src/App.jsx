import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Home from "./Pages/Home/Home";
import NotFound from "./Pages/NotFound/NotFound";
import Success from "./Pages/Success/Success";
import "./App.css";
import Login from "./Pages/Login";
import UserAbout from "./Pages/UserAbout";
import MyBookings from "./Pages/MyBookings";
const App = () => {
  const [scrollY, setScrollY] = useState(window.scrollY);

  useEffect(() => {
    // Function to handle scroll event
    const handleScroll = () => {
      // Update the scroll value
      setScrollY(window.scrollY);
    };

    // Add event listener for scroll event
    window.addEventListener("scroll", handleScroll);

    // Remove event listener when component unmounts
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []); // Empty dependency array ensures this effect runs only once

  useEffect(() => {
    console.log(scrollY);
    const top=document.getElementById('top');
    if(scrollY>200){
      top.style.display="flex";
      top.style.justifyContent="center"
      top.style.alignItems="center"
      top.style.position="fixed";
      top.style.top="90vh"
      top.style.right="50px"
      top.style.borderRadius="50% 50%"
      top.style.backgroundColor="green"
      top.style.width="50px"
      top.style.height="50px"
      top.style.cursor="pointer"
      top.style.zIndex="20"
    }else{
      top.style.display="none"
    }
  }, [scrollY]);
  return (
    <>
    <div id="top" onClick={()=>{window.scrollTo({top:0})}}>TOP</div>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/success" element={<Success />} />
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<NotFound />} />
          <Route path="/aboutuser" element={<UserAbout />} />
          <Route path="/mybookings" element={<MyBookings />} />
        </Routes>
        <Toaster />
      </Router>
    </>
  );
};

export default App;
