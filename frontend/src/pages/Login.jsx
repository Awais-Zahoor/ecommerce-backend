import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import axios from 'axios';
import { toast } from 'react-toastify';

const Login = () => {

  const [currentState, setCurrentState] = useState('Login')
  const { token, setToken, navigate, backendUrl } = useContext(ShopContext)

  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [email, setEmail] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      if (currentState === 'Sign Up') {

        const response = await axios.post(backendUrl + '/api/user/register', { name, email, password })
        if (response.data.success) {
          setToken(response.data.token)
          localStorage.setItem('token', response.data.token)
          toast.success("Account created successfully");
        } else {
          toast.error(response.data.message)
        }
      } else {

        const response = await axios.post(backendUrl + '/api/user/login', { email, password })
        if (response.data.success) {
          setToken(response.data.token)
          localStorage.setItem('token', response.data.token)
          toast.success("Login successful");
        } else {
          // If the backend returns a generic "Invalid credentials" message, keep it, 
          // otherwise enforce the requirement.
          if (response.data.message.toLowerCase().includes('password') || response.data.message.toLowerCase().includes('email')) {
             toast.error("Invalid email or password");
          } else {
             toast.error(response.data.message);
          }
        }

      }

    } catch (error) {
      console.log(error)
      toast.error("Invalid email or password")
    }
  }

  useEffect(()=>{
    if (token) {
      navigate('/')
      
    }
  },[token])



  return (
    <form onSubmit={onSubmitHandler} className='flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-800 dark:text-gray-200 transition-colors'>
      <div className='inline-flex items-center gap-2 mb-2 mt-10'>
        <p className='prata-regular text-3xl dark:text-white'>{currentState}</p>
        <hr className='border-none h-[1.5px] w-8 bg-gray-800 dark:bg-gray-200' />
      </div>
      {currentState === 'Login' ? '' : <input onChange={(e) => setName(e.target.value)} value={name} type="text" className='w-full px-3 py-2 border border-gray-800 dark:border-gray-700 bg-white dark:bg-gray-900 dark:text-white outline-none focus:ring-1 focus:ring-black dark:focus:ring-white transition-all' placeholder='Name' required />}
      <input onChange={(e) => setEmail(e.target.value)} value={email} type="email" className='w-full px-3 py-2 border border-gray-800 dark:border-gray-700 bg-white dark:bg-gray-900 dark:text-white outline-none focus:ring-1 focus:ring-black dark:focus:ring-white transition-all' placeholder='Email' required />
      <div className='relative w-full'>
        <input 
          onChange={(e) => setPassword(e.target.value)} 
          value={password} 
          type={showPassword ? "text" : "password"} 
          className='w-full px-3 py-2 border border-gray-800 dark:border-gray-700 bg-white dark:bg-gray-900 dark:text-white outline-none focus:ring-1 focus:ring-black dark:focus:ring-white transition-all pr-10' 
          placeholder='Password' 
          required 
        />
        <div 
          onClick={() => setShowPassword(!showPassword)}
          className='absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500 hover:text-black dark:hover:text-white transition-colors'
        >
          {showPassword ? (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
            </svg>
          )}
        </div>
      </div>
      <div className='w-full flex justify-between text-sm mt-[-8px] text-gray-600 dark:text-gray-400'>
        <p className='cursor-pointer hover:text-black dark:hover:text-white transition-colors'>Forget your password</p>
        {
          currentState === 'Login'
            ? <p onClick={() => setCurrentState('Sign Up')} className='cursor-pointer hover:text-black dark:hover:text-white transition-colors'>Create account</p>
            : <p onClick={() => setCurrentState('Login')} className='cursor-pointer hover:text-black dark:hover:text-white transition-colors'>Login Here</p>
        }
      </div>
      <button className='bg-black dark:bg-white text-white dark:text-black font-light px-8 py-2 mt-4 active:bg-gray-700 dark:active:bg-gray-200 transition-all rounded-sm uppercase tracking-widest'>{currentState === 'Login' ? 'Sign In' : 'Sign Up'}</button>
    </form>
  )
}

export default Login