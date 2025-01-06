import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Login from '../Login/Login';
import overview from './overview'; // Import the overview component

const Home = () => {
    return (
        <Router>
            <div className="home-container">
                <nav>
                    <ul>
                        <li><Link to="/login">Login</Link></li>
                        <li><Link to="/overview">Overview</Link></li>
                    </ul>
                </nav>

                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/overview" element={<overview />} />
                </Routes>
            </div>
        </Router>
    );
};

export default Home;
