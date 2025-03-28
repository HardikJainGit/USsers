import React, { useState } from 'react';
import './CSS/Loginsign.css';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();

        axios.post('https://reqres.in/api/login', { email, password })
            .then(result => {
                console.log(result);
                if (result.data.token) {  // ReqRes returns a token if login is successful
                    localStorage.setItem('jwt', result.data.token); // Store token
                    navigate('/home'); // Redirect to home page
                }
            })
            .catch(err => {
                alert(err.response?.data?.error || "Login failed!"); // Show error message
                console.log(err);
            });
    };

    return (
        <div className='loginsignup'>
            <div className="loginsignup-container">
                <h1>LogIn</h1>
                <form onSubmit={handleSubmit}>
                    <div className="loginsignup-fields">
                        <input
                            type="email"
                            name="email"
                            placeholder="Email Address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <button type="submit" className="submit-btn">Continue</button>
                </form>
                <p>Test with: <br /><b>Email:</b> eve.holt@reqres.in <br /><b>Password:</b> cityslicka</p>
            </div>
        </div>
    );
};

export default Login;
