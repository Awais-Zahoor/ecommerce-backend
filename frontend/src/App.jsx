import React, { useContext } from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Collection from './pages/Collection'
import About from './pages/About'
import Product from './pages/Product'
import Cart from './pages/Cart'
import PlaceOrder from './pages/PlaceOrder'
import Orders from './pages/Orders'
import Contact from './pages/Contact'
import Login from './pages/Login'
import Wishlist from './pages/Wishlist'

import Navbar from './components/Navbar'
import Footer from './components/Footer'
import SearchBar from './components/SearchBar'
import ScrollToTop from './components/ScrollToTop'
import FlashSaleBar from './components/FlashSaleBar'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Verify from './pages/Verify'
import OutfitBuilder from './pages/OutfitBuilder'
import { ShopContext } from './context/ShopContext'
import WhatsAppButton from './components/WhatsAppButton'


const App = () => {
  const { isDarkMode } = useContext(ShopContext);


  return (
    <div className='bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-500 min-h-screen'>
      <div className='px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw] pt-24 sm:pt-28 md:pt-32'>

        <ToastContainer theme={isDarkMode ? 'dark' : 'light'} />
        <ScrollToTop />
        <Navbar />
        <FlashSaleBar />
        <SearchBar />
        <WhatsAppButton />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/collection' element={<Collection />} />
          <Route path='/about' element={<About />} />
          <Route path='/contact' element={<Contact />} />
          <Route path='/product/:productId' element={<Product />} />

          <Route path='/cart' element={<Cart />} />
          <Route path='/wishlist' element={<Wishlist />} />
          <Route path='/login' element={<Login />} />
          <Route path='/place-order' element={<PlaceOrder />} />
          <Route path='/orders' element={<Orders />} />
          <Route path='/outfit-builder' element={<OutfitBuilder />} />

          <Route path='/about' element={<About />} />
          <Route path='/verify' element={<Verify />} />

        </Routes>
        <Footer />
      </div>
    </div>
  )
}

export default App