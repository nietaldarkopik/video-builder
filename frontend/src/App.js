import { BrowserRouter, Route, Routes, Link, Outlet} from 'react-router-dom';
import React from 'react';
import logo from './logo.svg';
import './App.css';
import HomePage from './pages/HomePage';
import Layout from './components/Layout';
import AboutPage from './pages/AboutPage';
import NoPage from './pages/NoPage';
import VideoManager from './pages/VideoManager';
import VideoBuilder from './pages/VideoBuilder';
import FindVideo from './pages/FindVideo';
import VideoDownloader from './pages/VideoDownloader';
import ContentBuilder from './pages/ContentBuilder';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="contact" element={<AboutPage />} />
          <Route path="video-manager" element={<VideoManager/>} />
          <Route path="video-downloader" element={<VideoDownloader/>} />
          <Route path="video-builder" element={<VideoBuilder/>} />
          <Route path="find-video" element={<FindVideo/>} />
          <Route path="content-builder" element={<ContentBuilder/>} />
          <Route path="*" element={<NoPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
