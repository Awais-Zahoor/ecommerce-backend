import React, { useEffect, useState } from 'react'
import axios from 'axios';
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import { Routes, Route } from 'react-router-dom'
export const backendUrl = import.meta.env.VITE_BACKEND_URL
export const currency = 'Rs.'

import Add from './pages/Add';
import List from './pages/List';
import Orders from './pages/Orders';
import Branding from './pages/Branding';
import Dashboard from './pages/Dashboard';
import Edit from './pages/Edit';
import Discounts from './pages/Discounts';
import Subscribers from './pages/Subscribers';
import Inquiries from './pages/Inquiries';
import AddSunglasses from './pages/AddSunglasses';
import ListSunglasses from './pages/ListSunglasses';
import EditSunglasses from './pages/EditSunglasses';
import Login from './components/Login';
import { ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {

  const [token, setToken] = useState(() => {
    return localStorage.getItem('token') || sessionStorage.getItem('token') || '';
  });

  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('adminDarkMode') === 'true';
    if (saved) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    return saved;
  });

  useEffect(() => {
    localStorage.setItem('adminDarkMode', isDarkMode);
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const [branding, setBranding] = useState(() => {
    const saved = localStorage.getItem('adminBranding') || sessionStorage.getItem('adminBranding');
    return saved ? JSON.parse(saved) : { logo: '' };
  });

  useEffect(() => {
    const fetchBranding = async () => {
      try {
        const res = await axios.get(backendUrl + '/api/branding/get');
        if (res.data.success && res.data.branding) {
          setBranding(res.data.branding);
          const stayAuth = localStorage.getItem('adminStayAuthenticated') === 'true';
          if (stayAuth) {
            localStorage.setItem('adminBranding', JSON.stringify(res.data.branding));
          } else {
            sessionStorage.setItem('adminBranding', JSON.stringify(res.data.branding));
          }
        }
      } catch (e) {
        // silently fail, use cached logo
      }
    };
    fetchBranding();
  }, [token]);

  useEffect(() => {
    if (token) {
      const stayAuth = localStorage.getItem('adminStayAuthenticated') === 'true';
      if (stayAuth) {
        localStorage.setItem('token', token);
      } else {
        sessionStorage.setItem('token', token);
        localStorage.removeItem('token'); // Ensure it's not in both
      }
    } else {
      localStorage.removeItem('token');
      sessionStorage.removeItem('token');
      localStorage.removeItem('adminStayAuthenticated');
    }
  }, [token]);

  return (
    <div className='bg-gray-50 dark:bg-gray-950 min-h-screen text-gray-800 dark:text-gray-200 transition-colors flex flex-col'>
      <ToastContainer theme={isDarkMode ? 'dark' : 'light'} />
      {token === ""
        ? <Login setToken={setToken} />
        : <div className='flex flex-col h-screen overflow-hidden'>
            <Navbar setToken={setToken} isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} logo={branding.logo} />
            
            <div className='flex flex-1 overflow-hidden'>
              <Sidebar />
              <div className='flex-1 overflow-y-auto px-4 sm:px-10 py-8 scroll-smooth no-scrollbar lg:px-16 pb-24'>
                <div className='max-w-[1600px] mx-auto'>
                  <Routes>
                    <Route path='/' element={<Dashboard token={token} />} />
                    <Route path='/add' element={<Add token={token} />} />
                    <Route path='/list' element={<List token={token} />} />
                    <Route path='/edit/:id' element={<Edit token={token} />} />
                    <Route path='/orders' element={<Orders token={token} />} />
                    <Route path='/branding' element={<Branding token={token} />} />
                    <Route path='/discounts' element={<Discounts token={token} />} />
                    <Route path='/promotions' element={<Discounts token={token} />} />
                    <Route path='/subscribers' element={<Subscribers token={token} />} />
                    <Route path='/inquiries' element={<Inquiries token={token} />} />
                    <Route path='/add-sunglasses' element={<AddSunglasses token={token} />} />
                    <Route path='/list-sunglasses' element={<ListSunglasses token={token} />} />
                    <Route path='/edit-sunglasses/:id' element={<EditSunglasses token={token} />} />
                  </Routes>
                </div>
              </div>
            </div>
          </div>
      }
    </div>
  )
}

export default App
