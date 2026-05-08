import axios from 'axios'
import React, { useState } from 'react'
import { backendUrl } from '../App'
import { toast } from 'react-toastify'

const Login = ({ setToken }) => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)

    const onSubmitHandler = async (e) => {
        try {
            e.preventDefault();
            setLoading(true);
            const response = await axios.post(backendUrl + '/api/user/admin', { email, password })
            if (response.data.success) {
                setToken(response.data.token)
                toast.success("Login successful");
            } else {
                toast.error(response.data.message)
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message)
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className='min-h-screen w-full flex items-center justify-center bg-gray-50 dark:bg-gray-950 p-6'>
            <div className='w-full max-w-[440px]'>
                <div className='glass-card p-10 rounded-[2.5rem] relative overflow-hidden animate-fade-in-up'>
                    <div className='mb-10 text-center'>
                        <h2 className='text-3xl font-black text-slate-900 dark:text-white mb-2 uppercase tracking-tight'>Login</h2>
                        <p className='text-xs text-slate-500 dark:text-slate-400 font-medium uppercase tracking-widest'>Admin Terminal</p>
                    </div>

                    <form onSubmit={onSubmitHandler} className='space-y-6' autoComplete="off">
                        <div className='space-y-2'>
                            <label className='text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 ml-1'>
                                Email Address
                            </label>
                            <input 
                                onChange={(e) => setEmail(e.target.value)} 
                                value={email} 
                                className='luxury-input !bg-white/50 dark:!bg-slate-900/50 focus:ring-2 focus:ring-cyan-500/20' 
                                type="email" 
                                required 
                                autoComplete="off"
                            />
                        </div>

                        <div className='space-y-2'>
                            <div className='flex justify-between items-end ml-1'>
                                <label className='text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500'>
                                    Password
                                </label>
                                <button 
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className='text-[9px] font-black uppercase tracking-widest text-cyan-600 dark:text-cyan-400 hover:text-slate-900 dark:hover:text-white transition-colors'
                                >
                                    {showPassword ? "Hide" : "Show"}
                                </button>
                            </div>
                            <input 
                                onChange={(e) => setPassword(e.target.value)} 
                                value={password} 
                                className='luxury-input !bg-white/50 dark:!bg-slate-900/50 focus:ring-2 focus:ring-cyan-500/20' 
                                type={showPassword ? "text" : "password"} 
                                required 
                                autoComplete="new-password"
                            />
                        </div>

                        <button 
                            type="submit" 
                            disabled={loading}
                            className={`luxury-button mt-6 flex items-center justify-center gap-3 relative z-10 group overflow-hidden ${loading ? 'opacity-70 cursor-not-allowed' : 'hover:scale-[1.02] active:scale-[0.98]'}`}
                        >
                            <span className='relative z-20 flex items-center gap-3 font-black uppercase tracking-[0.2em]'>
                                {loading ? 'Authorizing...' : 'Login'}
                            </span>
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Login


