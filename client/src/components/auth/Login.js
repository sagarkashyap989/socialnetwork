import React, {useState} from 'react'
import { Link } from "react-router-dom";


const Login = () => {

    const [formData, setFromData] = useState({
  email:"",
  password:"",
    })

const {email, password} = formData;

    const onChange = (e) =>{
        setFromData({...formData, [e.target.name]: e.target.value})
    }


  return (
    <div>
            <section className="container">
      <div className="alert alert-danger">
        Invalid credentials
      </div>
      <h1 className="large text-primary">Sign In</h1>
      <p className="lead"><i className="fas fa-user"></i> Sign into Your Account</p>
      <form className="form" action="dashboard.html">
        <div className="form-group">
          <input
            type="email"
            placeholder="Email Address"
            name="email"
            onChange={e => onChange(e)}
            required
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            placeholder="Password"
            name="password"
            onChange={e => onChange(e)}
          />
        </div>
        <input type="submit" className="btn btn-primary" value="Login" />
      </form>
      <p className="my-1">
        Don't have an account? <Link to="/register"> sign up! </Link>
      </p>
    </section>
    </div>
  )
}

export default Login;