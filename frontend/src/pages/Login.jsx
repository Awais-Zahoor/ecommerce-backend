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
    <div className='min-h-[80vh] flex items-center justify-center py-10 px-4 transition-colors'>
      
      {/* Background ambient blobs */}
      <div className='fixed inset-0 -z-10 overflow-hidden pointer-events-none'>
        <div className='absolute top-[-10%] right-[-10%] w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-[120px]'></div>
        <div className='absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-[120px]'></div>
      </div>

      <div className='w-full max-w-md'>
        
        {/* Header */}
        <div className='text-center mb-8'>
          <div className='inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-indigo-200 dark:border-indigo-500/30 bg-indigo-50 dark:bg-indigo-500/10 mb-6'>
            <span className='w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse'></span>
            <span className='text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-[0.3em]'>Account Portal</span>
          </div>
          <h1 className='prata-regular text-3xl sm:text-4xl dark:text-white mb-2'>
            {currentState === 'Login' ? 'Welcome Back' : 'Join Us'}
          </h1>
          <p className='text-xs font-bold text-gray-400 uppercase tracking-widest'>
            {currentState === 'Login' ? 'Sign in to your account' : 'Create a new account'}
          </p>
        </div>

        {/* Form Card */}
        <form 
          onSubmit={onSubmitHandler} 
          className='bg-white dark:bg-gray-900/60 backdrop-blur-sm border border-gray-100 dark:border-gray-800 rounded-[2rem] p-7 sm:p-10 shadow-2xl shadow-gray-200/50 dark:shadow-none space-y-4'
        >
          {currentState === 'Sign Up' && (
            <div>
              <label className='block text-[10px] font-black text-gray-400 uppercase tracking-[0.25em] mb-2'>Full Name</label>
              <input 
                onChange={(e) => setName(e.target.value)} 
                value={name} 
                type="text" 
                className='w-full bg-gray-50/80 dark:bg-white/[0.03] border border-gray-100 dark:border-gray-800 rounded-2xl px-5 py-4 text-xs font-bold dark:text-white outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-300 dark:focus:border-indigo-700 transition-all placeholder:text-gray-300 dark:placeholder:text-gray-600' 
                placeholder='Your full name' 
                required 
              />
            </div>
          )}

          <div>
            <label className='block text-[10px] font-black text-gray-400 uppercase tracking-[0.25em] mb-2'>Email Address</label>
            <input 
              onChange={(e) => setEmail(e.target.value)} 
              value={email} 
              type="email" 
              className='w-full bg-gray-50/80 dark:bg-white/[0.03] border border-gray-100 dark:border-gray-800 rounded-2xl px-5 py-4 text-xs font-bold dark:text-white outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-300 dark:focus:border-indigo-700 transition-all placeholder:text-gray-300 dark:placeholder:text-gray-600' 
              placeholder='your@email.com' 
              required 
            />
          </div>

          <div>
            <label className='block text-[10px] font-black text-gray-400 uppercase tracking-[0.25em] mb-2'>Password</label>
            <div className='relative'>
              <input 
                onChange={(e) => setPassword(e.target.value)} 
                value={password} 
                type={showPassword ? "text" : "password"} 
                className='w-full bg-gray-50/80 dark:bg-white/[0.03] border border-gray-100 dark:border-gray-800 rounded-2xl px-5 py-4 pr-12 text-xs font-bold dark:text-white outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-300 dark:focus:border-indigo-700 transition-all placeholder:text-gray-300 dark:placeholder:text-gray-600' 
                placeholder='••••••••' 
                required 
              />
              <button
                type='button'
                onClick={() => setShowPassword(!showPassword)}
                className='absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors'
              >
                {showPassword ? (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Links Row */}
          <div className='flex items-center justify-between pt-1'>
            <p className='text-[10px] font-bold text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer transition-colors uppercase tracking-wider'>
              Forgot password?
            </p>
            {currentState === 'Login'
              ? <p onClick={() => setCurrentState('Sign Up')} className='text-[10px] font-black text-indigo-600 dark:text-indigo-400 cursor-pointer hover:underline uppercase tracking-wider'>Create account</p>
              : <p onClick={() => setCurrentState('Login')} className='text-[10px] font-black text-indigo-600 dark:text-indigo-400 cursor-pointer hover:underline uppercase tracking-wider'>Sign in instead</p>
            }
          </div>

          {/* Submit Button */}
          <button 
            type='submit'
            className='group relative w-full overflow-hidden bg-black dark:bg-white text-white dark:text-black py-5 rounded-2xl font-black uppercase tracking-[0.3em] text-xs transition-all hover:scale-[1.02] active:scale-[0.98] shadow-xl shadow-black/10 dark:shadow-white/10 mt-2'
          >
            <div className='relative z-10 flex items-center justify-center gap-3'>
              <span>{currentState === 'Login' ? 'Sign In' : 'Create Account'}</span>
              <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </div>
            <div className='absolute inset-0 bg-indigo-600 translate-y-full group-hover:translate-y-0 transition-transform duration-500'></div>
          </button>

          {/* Trust Badges */}
          <div className='flex items-center justify-center gap-6 pt-2'>
            <div className='flex items-center gap-1.5 text-gray-300 dark:text-gray-600'>
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
              <span className='text-[9px] font-black uppercase tracking-widest'>Secure</span>
            </div>
            <div className='w-px h-4 bg-gray-200 dark:bg-gray-800'></div>
            <div className='flex items-center gap-1.5 text-gray-300 dark:text-gray-600'>
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
              <span className='text-[9px] font-black uppercase tracking-widest'>Protected</span>
            </div>
          </div>

        </form>
      </div>
    </div>
  )
}

export default Login