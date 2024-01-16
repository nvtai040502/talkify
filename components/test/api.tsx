"use client"
import axios from "axios";
import { useEffect } from "react";

const ApiTest = () => {
  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.post("/api/chat/hf")
      console.log(response)
    }
    fetchData()
  }, [])
  return ( 
    <>
    </>
   );
}
 
export default ApiTest;