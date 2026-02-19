import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

import MainLayout from './layouts/main'
import { AuthProvider } from './contexts/AuthContext'

function App() {
    return (
        <Router>
            <AuthProvider>
                <MainLayout />
            </AuthProvider>
        </Router>
    )
}

const root = createRoot(document.getElementById('root'))
root.render(<App />)