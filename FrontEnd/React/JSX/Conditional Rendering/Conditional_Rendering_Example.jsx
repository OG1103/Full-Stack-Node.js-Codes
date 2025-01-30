
import React, { useState } from 'react';

function AdminPanel() {
    return <p>Admin Access Granted: Welcome to the Admin Panel!</p>;
}

function UserProfile() {
    return <p>User Profile Access: Welcome, User!</p>;
}

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [status, setStatus] = useState("idle");
    
    return (
        <div>
            <h1>Conditional Rendering Examples</h1>
            {/* Ternary Operator Example for Authentication */}
            <h2>{isLoggedIn ? "Welcome back!" : "Please sign in."}</h2>
            <button onClick={() => setIsLoggedIn(!isLoggedIn)}>
                {isLoggedIn ? "Log Out" : "Log In"}
            </button>

            {/* Logical AND (&&) Operator Example for Content Access */}
            <div>
                {isLoggedIn && <p>You have access to exclusive content.</p>}
            </div>

            {/* Ternary with Component Example for Admin Access */}
            <div>
                {isLoggedIn ? (isAdmin ? <AdminPanel /> : <UserProfile />) : <p>Please log in to view your profile.</p>}
                <button onClick={() => setIsAdmin(!isAdmin)}>
                    {isAdmin ? "Switch to User" : "Switch to Admin"}
                </button>
            </div>

            {/* Switch Statement Example for Status Messages */}
            <div>
                <p>Status: {status}</p>
                {status === "loading" && <p>Loading...</p>}
                {status === "success" && <p>Data loaded successfully!</p>}
                {status === "error" && <p>Error loading data.</p>}
                <button onClick={() => setStatus("loading")}>Load</button>
                <button onClick={() => setStatus("success")}>Success</button>
                <button onClick={() => setStatus("error")}>Error</button>
            </div>

            {/* Inline Conditional Rendering Example */}
            <div>
                <h2>Inline Conditional Rendering</h2>
                <p>{isLoggedIn ? "User is logged in" : "User is not logged in"}</p>
                {isLoggedIn && <p>Exclusive feature only for logged-in users.</p>}
            </div>
        </div>
    );
}

export default App;
