import React, {fragment} from 'react';
import Landing from "./components/layout/Landing";
import Navbar from "./components/layout/Navbar";
import Login from "./components/auth/Login";
// import Register from "./components/auth/Register";
import Register from "./components/auth/Register";
import {BrowserRouter as Router,Route, Routes } from "react-router-dom";
function App() {
  return (

  <>
  <Router>
  <div className="container">
        <Navbar />
</div>  
   <Routes>
    <Route exact path="/" element={<Landing /> }  />
  <Route  path="/login" element={<Login />}  />
{/* <section className="container"> */}
  <Route path="/register" element={<Register />} />
   
  {/* </section> */}
  </Routes>


   
   
   </Router>
   </>
  
  );
}

export default App;
