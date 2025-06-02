import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignUp from './pages/SignUp';
import LogIn from './pages/LogIn';
import Dashboard from './pages/Dashboard';
import Admin from './pages/Admin';
import EventPage from "./pages/EventPage";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<SignUp />} />
                <Route path="/login" element={<LogIn />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/adminDashboard" element={<Admin />} />
                <Route path="/events" element={<EventPage />} />
            </Routes>
        </Router>
    );
}

export default App;
