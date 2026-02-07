import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import QuestBrowser from './pages/QuestBrowser';
import ProfilePage from './pages/ProfilePage';
import SubmitQuestPage from './pages/SubmitQuestPage';
import AdminDashboard from './pages/AdminDashboard';
import { useAccount } from 'wagmi';
import { useProfile } from "@farcaster/auth-kit";

const AppRouter: React.FC = () => {
    const { isConnected } = useAccount();
    const { isAuthenticated, profile } = useProfile();
    const isAdmin = (isConnected || isAuthenticated); // Allow any authenticated user for now, or keep restricted if preferred. 

    return (
        <BrowserRouter>
            <Routes>
                {/* Public Routes */}
                <Route path="/" element={<HomePage />} />
                <Route path="/quests" element={<QuestBrowser />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/submit-quest" element={<SubmitQuestPage />} />

                {/* Admin Route (Protected) */}
                <Route
                    path="/admin"
                    element={isAdmin ? <AdminDashboard /> : <Navigate to="/" replace />}
                />

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    );
};

export default AppRouter;
