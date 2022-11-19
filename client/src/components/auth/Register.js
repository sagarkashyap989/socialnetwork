import React, {useState} from 'react'
import axios from 'axios';

const Register = () => {


    const [formData, setFromData] = useState({
        name:"",
        email:"",
        password:"",
        password2:""
          })
      
    const {name, email, password, password2} = formData;

          const onChange = (e) =>{
              setFromData({...formData, [e.target.name]: e.target.value})
          }
      


          const handleSubmit = async (e) =>{
            e.preventDefault();
            if(password !== password2){
                alert("wrong password");
            }else{
              
              const newUser = {
                name,
                email,
                password
              }

              try {
                const config = {
                  header: {
                      'Content-Type' : 'Application/json'
                  }
                }

                const body = JSON.stringify(newUser);


                const res = await axios.post('/api/users', body, config);

                console.log(res.data);
              } catch (error) {
                console.log(error.response.data);
              }



            }
          }




  return (
    <div>
         <section className="container">
      <h1 className="large text-primary">Sign Up</h1>
      <p className="lead"><i className="fas fa-user"></i> Create Your Account</p>
      <form onSubmit={handleSubmit} className="form" >
        <div className="form-group">
          <input onChange={ (e) => onChange(e)} type="text" placeholder="Name" name="name" required />
        </div>
        <div className="form-group">
          <input onChange={ (e) => onChange(e)}  type="email" placeholder="Email Address" name="email" />
          <small className="form-text"
            >This site uses Gravatar so if you want a profile image, use a
            Gravatar email</small
          >
        </div>
        <div className="form-group">
          <input
           onChange={ (e) => onChange(e)} 
            type="password"
            placeholder="Password"
            name="password"
            minLength="6"
          />
        </div>
        <div className="form-group">
          <input
           onChange={ (e) => onChange(e)} 
            type="password"
            placeholder="Confirm Password"
            name="password2"
            minLength="6"
          />
        </div>
        <input type="submit" className="btn btn-primary" value="Register" />
      </form>
      <p className="my-1">
        Already have an account? <a href="login.html">Sign In</a>
      </p>
    </section>
    </div>
  );
}

export default Register;