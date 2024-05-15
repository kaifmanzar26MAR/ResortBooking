import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import toast from 'react-hot-toast'

const Login = () => {
  const navigate= useNavigate();
  const [loginData, setloginData]= useState({email:"", password:""})

  const [registerData, setRegisterData]= useState({email:"", username:"", fullname:"", password:""})

  const handleLogin= async(e)=>{
    e.preventDefault();
    console.log(loginData)
    try {
      const res= await axios.post("http://localhost:5000/api/v1/users/loginuser",
        loginData
      , {
        withCredentials:true,
      });

      if(!res) throw new Error("error in login!!")
        console.log(res.data.data)
      toast.success("user login")
      navigate('/');
    } catch (error) {
      console.log(error);
    }
  }

  const handleRegister= async(e)=>{
    e.preventDefault();
    console.log(registerData)
    try {
      const res= await axios.post("http://localhost:5000/api/v1/users/registeruser",
        registerData
      , {
        withCredentials:true,
      });

      if(!res) throw new Error("error in register!!")
        console.log(res.data.data)
      toast.success("user register! please login")
    } catch (error) {
      toast.error("Somethis went worng!")
      console.log(error);
    }
  }

  const getCurrentUser= async()=>{
    try {
      const res= await axios.get("http://localhost:5000/api/v1/users/current-user", {
        withCredentials:true,
      });

      if(!res) throw new Error("error in getting curret user!!")
      navigate("/");        
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(()=>{
    getCurrentUser();
  },[])
  return (
    <>
    
    <div id='login_cont'>
    <div id='back'><Link to='/'>Home</Link></div>
      <form  id="login_box" onSubmit={handleLogin}>
        <h1>Login</h1>
        <input type="text" placeholder='email' onChange={(e)=>{setloginData({...loginData, email:e.target.value})}}/>
        <input type="password"  placeholder='password' onChange={(e)=>{setloginData({...loginData, password:e.target.value})}}/>
        <input type="submit" value="Login" id='submin_btn'/>
      </form>
      <form  id="login_box" onSubmit={handleRegister}>
        <h1>Register</h1>
        <input type="text" placeholder='email' onChange={(e)=>{setRegisterData({...registerData, email:e.target.value})}}/> 
        <input type="text" placeholder='username' onChange={(e)=>{setRegisterData({...registerData, username:e.target.value})}}/> 
        <input type="text" placeholder='fullname' onChange={(e)=>{setRegisterData({...registerData, fullname:e.target.value})}}/> 
        <input type="password"  placeholder='password' onChange={(e)=>{setRegisterData({...registerData, password:e.target.value})}}/>
        <input type="submit" value="Register" id='submin_btn'/>
      </form>
    </div></>
  )
}

export default Login
