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
import Channels from "../pages/user/Channels";
import WatchLater from "../pages/user/WatchLater";
import Liked from "../pages/user/Liked";
import Playlist from "../pages/user/Playlist";
import MyPlaylists from "../pages/user/MyPlaylists";
import Short from "../pages/Short";

export default function Main() {
    const [sidebarOpen, setSidebarOpen] = useState(false)

    return (
        <>
            <Header onSideBarClick={() => setSidebarOpen(true)} />

            <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            <main className="flex justify-center bg-gray-50 min-h-[calc(100vh-65px)]">
                <div className="w-full max-w-6xl px-2 py-8">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/settings" element={<Settings />} />
                        <Route path="/video/:id" element={<Video />} />
                        <Route path="/shorts/:id" element={<Short />} />
                        <Route path="/search" element={<SearchResultList />} />
                        <Route path="/channel/:id" element={<Channel />} />
                        <Route path="*" element={<NotFound />} />
                        
                        <Route element={<Protected />}>
                            <Route path="/channel/settings" element={<ChannelSettings />} />
                            <Route path="/upload" element={<Upload />} />
                            <Route path="/edit/:id" element={<VideoEdit />} />
                            <Route path="/my-videos" element={<MyVideos />} />
                            <Route path="/history" element={<History />} />
                            <Route path="/channels" element={<Channels />}/>
                            <Route path="/watch-later" element={<WatchLater />}/>
                            <Route path="/liked" element={<Liked />}/>
                            <Route path="/playlist" element={<Playlist />}/>
                            <Route path="/playlist/:playlistId" element={<Playlist />}/>
                            <Route path="/my-playlists" element={<MyPlaylists />}/>
                        </Route>
                    </Routes>
                </div>
            </main>
        </>
    )    
}