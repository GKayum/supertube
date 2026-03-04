import { useState } from "react";
import { Routes, Route } from "react-router-dom";

import Header from "./header";
import Sidebar from "./sidebar";

import Home from "../pages/Home";
import Upload from "../pages/Upload";
import Video from "../pages/Video";
import NotFound from "../pages/404";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import MyVideos from '../pages/user/Videos'
import Settings from "../pages/user/Settings";
import SearchResultList from "../pages/Search";
import Channel from "../pages/user/Channel";
import ChannelSettings from "../pages/user/ChannelSettings";
import Protected from "../components/route/Protected";
import VideoEdit from "../pages/user/VideoEdit";
import History from "../pages/user/History";

export default function Main() {
    const [sidebarOpen, setSidebarOpen] = useState(false)

    return (
        <>
            <Header onSideBarClick={() => setSidebarOpen(true)} />

            <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            <main className="flex justify-center bg-gray-50 min-h-screen py-8">
                <div className="w-full max-w-6xl px-2">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/settings" element={<Settings />} />
                        <Route path="/video/:id" element={<Video />} />
                        <Route path="/search" element={<SearchResultList />} />
                        <Route path="/channel/:id" element={<Channel />} />
                        <Route path="*" element={<NotFound />} />
                        
                        <Route element={<Protected />}>
                            <Route path="/channel/settings" element={<ChannelSettings />} />
                            <Route path="/upload" element={<Upload />} />
                            <Route path="/edit/:id" element={<VideoEdit />} />
                            <Route path="/register" element={<Register />} />
                            <Route path="/my-videos" element={<MyVideos />} />
                            <Route path="/history" element={<History />} />
                        </Route>
                    </Routes>
                </div>
            </main>
        </>
    )    
}