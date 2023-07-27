import { BrowserRouter, Route, Routes, Link, Outlet} from 'react-router-dom';
import React from 'react';
import logo from './logo.svg';
import './App.css';
import HomePage from './pages/HomePage';
import Layout from './components/Layout';
import AboutPage from './pages/AboutPage';
import NoPage from './pages/NoPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="contact" element={<AboutPage />} />
          <Route path="*" element={<NoPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
