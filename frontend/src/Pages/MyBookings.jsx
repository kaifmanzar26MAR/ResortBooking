import axios from "axios";
import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";

const MyBookings = () => {
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
      navigate('/');
    }
  };

  useEffect(() => {
    getCurrentUser();
  }, []);
  return (
    <div id="about_cont">
      <Navbar />
      <div
        style={{
          display: "flex",
          justifyContent: "start",
          alignItems: "start",
          flexWrap: "wrap",
          gap: "20px",
          padding: "20px",
        }}
      >
        {user?.reservations?.map((e) => {
          const dateObj = new Date(e.time_of_event * 1000);
          const hour = dateObj.getHours();
          const minute = dateObj.getMinutes();
          const second = dateObj.getSeconds();

          const dateObj2=new Date(e.date_of_event);
          const date=dateObj2.getDate();
          const month= dateObj2.getMonth();
          const year= dateObj2.getFullYear();


          const dateObj3=new Date(e.createdAt);
          const date2=dateObj3.getDate();
          const month2= dateObj3.getMonth();
          const year2= dateObj3.getFullYear();
          return (
            <div
              style={{
                border: "2px solid gray",
                padding: "20px",
                borderRadius: "5px",
                width:"250px",
                backgroundColor:"white"
              }}
            >
              <p>Booked on: {date2+"/"+month2+"/"+year2}</p>
              <p>For Date : {date+"/"+month+"/"+year}</p>
              <p>At Time : {hour}: {minute}</p>
              <p>For members : {e.number_of_member}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MyBookings;
