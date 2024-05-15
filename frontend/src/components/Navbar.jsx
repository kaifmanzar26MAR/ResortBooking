import React, { useEffect, useState } from "react";
import { data } from "../restApi.json";
import { Link, useNavigate } from "react-router-dom";
import { GiHamburgerMenu } from "react-icons/gi";
import { FaCircleUser } from "react-icons/fa6";
import axios from "axios";
import toast from "react-hot-toast";
const Navbar = () => {
  const [show, setShow] = useState(false);
  const [islogin,setIsLogin] = useState(false);
const navigate= useNavigate();
  const getCurrentUser = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/v1/users/current-user",
        {
          withCredentials: true,
        }
      );

      if (!res) throw new Error("error in getting curret user!!");
      setIsLogin(true)
    } catch (error) {
      console.log(error);
      setIsLogin(false)
    }
  };

  const handleLogout= async()=>{
    try {
      const res= await axios.post("http://localhost:5000/api/v1/users/logout",{withCredentials:true})

      if(!res) throw new Error("error in logout!!")

      toast.success('user logout')
      navigate('/')
      getCurrentUser();
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getCurrentUser();
  }, []);
  return (
    <>
      <nav>
        <div className="logo"><Link to={'/'} style={{textDecoration:"none", color:"black"}}>ZEESH</Link></div>
        <div className={show ? "navLinks showmenu" : "navLinks"}>
          <div className="links">
            {data[0].navbarLinks.map((element) => (
              <a
                href={element.link}
                spy={true}
                smooth={true}
                duration={500}
                key={element.id}
              >
                {element.title}
              </a>
            ))}
          </div>
          <div
            className=""
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "20px",
            }}
          >
            {islogin ? <button className="menuBtn"><Link to={'/mybookings'} style={{textDecoration:"none", color:"black"}}>My Bookings</Link></button> : ""}
            {!islogin ? "" : <button className="menuBtn" onClick={handleLogout}>Logout</button>}

            {islogin ? (
              <Link to={'/aboutuser'} style={{textDecoration:"none", color:"black"}}><FaCircleUser style={{ cursor: "pointer" }} size={35} /></Link>
            ) : (
              <Link to="/login">
                <button className="menuBtn">Login</button>
              </Link>
            )}
          </div>
        </div>
        <div className="hamburger" onClick={() => setShow(!show)}>
          <GiHamburgerMenu />
        </div>
      </nav>
    </>
  );
};

export default Navbar;
