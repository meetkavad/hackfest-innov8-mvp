import React, { useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";



const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const myRequest=(email, roleField = 'recipient')=>{
    return fetch(`http://localhost:5000/myrequest?email=${email}&roleField=${roleField}`,{
      headers:{
        authorization:`Bearer ${user?.accessToken}`
      }
    }).then(res=>res.json())
  }

  const myPostedFoods=(email)=>{
    return fetch(`http://localhost:5000/mypostedfoods?email=${email}`,{
      headers:{
        authorization:`Bearer ${user?.accessToken}`
      }})
    .then(res=>res.json())
  }
 

  

  const handleLoginWithEmailPass = async (email, password) => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Login failed");
      
      localStorage.setItem("token", data.token);
      setUser(data.user);
      setLoading(false);
      return data;
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const createUser = async (email, password, name, photoUrl, role) => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name, photoUrl, role }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Signup failed");
      
      localStorage.setItem("token", data.token);
      setUser(data.user);
      setLoading(false);
      return data;
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const handlesignOut = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  useEffect(() => {
    // Check if token exists in localStorage on mount
    const token = localStorage.getItem("token");
    if (token) {
      try {
        // Decode JWT manually (basic decoding)
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        const decodedUser = JSON.parse(jsonPayload);
        setUser(decodedUser);
      } catch(e) {
        console.error("Invalid token", e);
        localStorage.removeItem("token");
      }
    }
    setLoading(false);
  }, []);

  const userInfo = {
    user,
    loading,
    handlesignOut,
    handleLoginWithEmailPass,
    createUser,
    myRequest,
    myPostedFoods,
  };

  return (
    <AuthContext.Provider value={userInfo}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;
