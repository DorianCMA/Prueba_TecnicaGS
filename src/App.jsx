import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import Login from "./auth/Login";
import Register from "./auth/Register";
import Home from "./view/Home";
import Navbar from "./Components/Navbar";
import PrivateRoute from "../src/Components/ProjectContextProvider"; // Importa el componente PrivateRoute

function App() {
  return <AppRoutes />;
}

function AppRoutes() {
    const analysisResults = {};
  const location = useLocation();
  const isAuthPage =
    location.pathname === "/login" || location.pathname === "/register";

  return (
    <>
      {!isAuthPage && <Navbar />}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<PrivateRoute element={<Home />} />} />
        
      </Routes>
    </>
  );
}

export default App;
