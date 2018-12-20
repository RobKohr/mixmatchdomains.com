import React, {useState} from 'react';
import {  sendAction, registerDataUpdateFunction } from "./socket/socket";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";


const Index = () => <h2>Home</h2>;
const About = () => <h2>About</h2>;
const Users = () => <h2>Users</h2>;

const Login = ({ register }) => {
  const initialFormState = { username: '', password: '', retypePassword: '' }
  const [ fields, setFields ] = useState(initialFormState)

  //https://github.com/final-form/react-final-form-hooks#simple-example
  function onSubmit(event){
    event.preventDefault();
    const {username, password, retypePassword} = fields;
    sendAction('register', {username, password, retypePassword});
  }
	const handleInputChange = event => {
    console.log('letter', event.target.value, event.target.name, event.target);
    const { name, value } = event.target
    console.log(name, value);
    setFields({ ...fields, [name]: value })
	}
  return (
    <form id="login" onSubmit={onSubmit}>
      {register && <h2>Register</h2>}
      {!register && <h2>Login</h2>}
      <p>
        <label>Username</label>
        <input type="text" name="username" value={fields.username} onChange={handleInputChange}></input>
      </p>
      <p>
        <label>Password</label>
        <input type="password" name="password" value={fields.password} onChange={handleInputChange}></input>
      </p>
      {register &&
        <p>
          <label>Retype Password</label>
          <input type="password" name="retypePassword" value={fields.retypePassword} onChange={handleInputChange}></input>
        </p>
      }
      <p>
        <label></label>
        <input type="submit"></input>
      </p>
    </form>
  )
}

const Register = () => (
  <Login register="true"></Login>
)


const AppRouter = () => {
  registerDataUpdateFunction(function onUpdate(data){
    console.log('we did it', data)
    
  })
  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/about/">About</Link>
            </li>
            <li>
              <Link to="/users/">Users</Link>
            </li>
            <li>
              <Link to="/login/">Login</Link>
            </li>
            <li>
              <Link to="/register/">Register</Link>
            </li>
          </ul>
        </nav>
        <Route path="/" exact component={Index} />
        <Route path="/about/" component={About} />
        <Route path="/users/" component={Users} />
        <Route path="/login/" component={Login} />
        <Route path="/register/" component={Register} />
      </div>
    </Router>
  );
}

export default AppRouter;