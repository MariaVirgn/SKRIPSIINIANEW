import { Navigate } from "react-router-dom";
import { apiFetch } from "../utils/api";
import { useEffect, useState } from "react";

export default function ProtectedRoute({ children, allowedRoles }) {
  const token = localStorage.getItem("token");

  const [status, setStatus] = useState("loading");
  const [role, setRole] = useState(null);

  useEffect(() => {
    if (!token) {
      setStatus("unauthorized")
  
    } else {
      apiFetch("/auth/verify-token", {
        method:"GET",
      }).then((result) => {
        setRole(result.user.role);
        setStatus("authorized")
      }).catch((err) => {
        console.log(err);
        setStatus("unauthorized")
      })
    }

  },[token])
  
  if(status === "unauthorized") {
    return <Navigate to={"/login"}/>
  } 
  
  if (status === "loading") {
   return <h1>Loading...</h1>
 }

  if (allowedRoles && !allowedRoles.includes(role)){
    console.log(role);
    if(role === "admin") {
      return <Navigate to={"/admin"} /> 
    }
    if(role === "customer") {
      return <Navigate to={"/"} /> 
    }
  }

  return children;
}