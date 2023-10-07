import { NextPage } from "next";
import Login from "../components/auth/Login";
import dotenv from 'dotenv';
dotenv.config();



const Home:NextPage = () => {
  return (
    
      <Login />
 
        
  )
}

export default Home