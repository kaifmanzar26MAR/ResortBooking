import React, { useEffect } from "react";
import { HiOutlineArrowNarrowRight } from "react-icons/hi";
import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Reservation = () => {
  const [number_of_member, setNumber_of_member] = useState(0);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const navigate = useNavigate();



  const handleReservation = async (e) => {
    e.preventDefault();
    // console.log(Date.parse(date), time.toString(), number_of_member)
    console.log(Date.parse(`1970-01-01T${time}`))
    try {
      const res  = await axios.post(
        "http://localhost:5000/api/v1/reservation/createreservation",
        { date_of_event: Date.parse(date),time_of_event: Date.parse(`1970-01-01T${time}`),number_of_member:Number(number_of_member) },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      console.log(res.data)
      toast.success(res.data.message);
      setNumber_of_member(0)
      setTime("");
      setDate("");
    } catch (error) {
      console.log(error)
      toast.error(error.response.data.message+ "!. OR Please Login!!");

    }
  };


  const [user, setUser]= useState({})
  const getCurrentUser = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/v1/users/current-user",
        {
          withCredentials: true,
        }
      );

      if (!res) throw new Error("error in getting curret user!!");
      setUser(res.data.data)
      console.log(res.data.data)
    } catch (error) {
      console.log(error);
      setUser({})
      
    }
  };



  useEffect(() => {
    getCurrentUser();
  }, []);

  return (
    <section className="reservation" id="reservation">
      <div className="container">
        <div className="banner">
          <img src="/reservation.png" alt="res" />
        </div>
        <div className="banner">
          <div className="reservation_form_box">
            <h1>MAKE A RESERVATION</h1>
            <p>For Further Questions, Please Call</p>
            <form>
              <div>
                <input
                  type="text"
                  placeholder="First Name"
                  value={user.fullname}
                />
                <input
                  type="text"
                  placeholder="username"
                  value={user.username}
                  
                />
              </div>
              <div>
                <input
                  type="date"
                  placeholder="Date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
                <input
                  type="time"
                  placeholder="Time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                />
              </div>
              <div>
                <input
                  type="email"
                  placeholder="Email"
                  className="email_tag"
                  value={user.email}
                />
                <input
                  type="number"
                  placeholder="Member"
                  value={number_of_member}
                  onChange={(e) => setNumber_of_member(e.target.value)}
                />
              </div>
              <button type="submit" style={{cursor:"pointer"}} onClick={handleReservation}>
                RESERVE NOW{" "}
                <span>
                  <HiOutlineArrowNarrowRight />
                </span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Reservation;
