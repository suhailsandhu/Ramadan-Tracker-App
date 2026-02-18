import React from 'react';
import './App.css'; // Ensure to style with calligraphy and gradient background

themedApp = () => {
    return (
        <div className="app-container">
            <header className="app-header">
                <h1 className="app-title">Ramadan Tracker</h1>
                <div className="lantern" />
            </header>
            <main>
                <div className="progress-bar">
                    <div className="progress-fill" style={{ width: '70%' }} />
                </div>
                <p className="app-description">Track your Ramadan progress with elegance and style!</p>
                <div className="interactive-elements">
                    <button className="glowing-button">Celebrate</button>
                    <button className="glowing-button">Share Your Progress</button>
                </div>
            </main>
        </div>
    );
};

export default themedApp;
