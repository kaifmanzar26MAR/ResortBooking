import axios from "axios";
import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";

const UserAbout = () => {
  const [user, setUser] = useState({});
  const navigate=useNavigate();
  const getCurrentUser = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/v1/users/current-user",
        {
          withCredentials: true,
        }
      );

      if (!res) throw new Error("error in getting curret user!!");
      setUser(res.data.data);
      console.log(res.data.data);
    } catch (error) {
      console.log(error);
      setUser({});
      navigate('/')
    }
  };

  useEffect(() => {
    getCurrentUser();
  }, []);
  return (
    <div className="heroSection" id="heroSection">
      <Navbar />
      <div style={{width:"100%", height:"80vh", display:"flex", flexDirection:"column", justifyContent:"start", alignItems:"center"}}>
        <p>{user.fullname}</p>
        <p>{user.email}</p>
        <p>{user.username}</p>
      </div>
    </div>
  );
};

export default UserAbout;
