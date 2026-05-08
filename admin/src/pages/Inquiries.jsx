import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { backendUrl } from '../App';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';

const Inquiries = ({ token }) => {
    const [list, setList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [statusFilter, setStatusFilter] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedIds, setSelectedIds] = useState([]);
    const [selectedInquiry, setSelectedInquiry] = useState(null); // For modal
    const [replyMessage, setReplyMessage] = useState('');
    const [isResponding, setIsResponding] = useState(false);

    const fetchInquiries = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${backendUrl}/api/contact/list`, {
                headers: { token },
                params: { page, status: statusFilter, search: searchTerm }
            });
            if (response.data.success) {
                setList(response.data.inquiries);
                setTotalPages(response.data.totalPages);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.error(error);
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInquiries();
    }, [page, statusFilter, searchTerm, token]);

    const updateStatus = async (id, status, isRead = true) => {
        try {
            const response = await axios.patch(`${backendUrl}/api/contact/update/${id}`, 
                { status, isRead }, 
                { headers: { token } }
            );
            if (response.data.success) {
                toast.success(response.data.message);
                fetchInquiries();
                if (selectedInquiry?._id === id) setSelectedInquiry(response.data.inquiry);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

const handleResponse = async (id) => {
        if (!replyMessage.trim()) return;
        setIsResponding(true);
        try {
            const response = await axios.post(`${backendUrl}/api/contact/respond/${id}`, 
                { replyMessage }, 
                { headers: { token } }
            );
            if (response.data.success) {
                toast.success(response.data.message);
                setReplyMessage('');
                fetchInquiries();
                // Optionally updated the inquiry in modal if we want to keep it open
                setSelectedInquiry(response.data.inquiry);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error(error.message);
        } finally {
            setIsResponding(false);
        }
    };

    const removeInquiry = async (id) => {
        if (!window.confirm("Delete this inquiry permanently?")) return;
        try {
            const response = await axios.delete(`${backendUrl}/api/contact/delete/${id}`, { headers: { token } });
            if (response.data.success) {
                toast.success(response.data.message);
                fetchInquiries();
                if (selectedInquiry?._id === id) setSelectedInquiry(null);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    const bulkDelete = async () => {
        if (!selectedIds.length) return;
        if (!window.confirm(`Delete ${selectedIds.length} selected inquiries?`)) return;
        try {
            const response = await axios.post(`${backendUrl}/api/contact/bulk-delete`, { ids: selectedIds }, { headers: { token } });
            if (response.data.success) {
                toast.success(response.data.message);
                setSelectedIds([]);
                fetchInquiries();
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    const toggleSelect = (id) => {
        setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    };

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className='max-w-7xl mx-auto pb-20'
        >
            <div className='flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12'>
                <div>
                    <h1 className='text-3xl font-black text-gray-900 dark:text-white uppercase tracking-tight'>Inquiries</h1>
                    <p className='text-sm font-bold text-indigo-500 uppercase tracking-widest mt-1'>Customer Messages & Support</p>
                </div>

                <div className='flex items-center gap-4'>
                    <div className='relative'>
                        <input 
                            type="text" 
                            placeholder="Search by name or email..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className='bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl px-5 py-3 text-sm focus:border-indigo-500 outline-none w-64 shadow-sm font-bold'
                        />
                    </div>
                    <select 
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className='bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl px-4 py-3 text-sm font-black uppercase tracking-wider focus:border-indigo-500 outline-none shadow-sm'
                    >
                        <option value="">All Status</option>
                        <option value="pending">Pending</option>
                        <option value="in-progress">In-Progress</option>
                        <option value="resolved">Resolved</option>
                    </select>
                </div>
            </div>

            {selectedIds.length > 0 && (
                <div className='mb-6 flex items-center gap-4 animate-reveal bg-red-50 dark:bg-red-500/5 p-4 rounded-2xl border border-red-100 dark:border-red-500/10'>
                    <p className='text-xs font-black text-red-600 dark:text-red-400 uppercase tracking-widest'>
                        {selectedIds.length} Messages Selected
                    </p>
                    <button onClick={bulkDelete} className='bg-red-600 text-white text-[10px] font-black px-6 py-2 rounded-lg uppercase tracking-widest hover:bg-red-700 transition-all'>
                        Delete Selected
                    </button>
                    <button onClick={() => setSelectedIds([])} className='text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-gray-600'>
                        Cancel
                    </button>
                </div>
            )}

            <div className='bg-white dark:bg-gray-900 rounded-[2.5rem] shadow-xl shadow-gray-200/50 dark:shadow-none border border-gray-50 dark:border-gray-800 overflow-hidden'>
                <div className='overflow-x-auto'>
                    <table className='w-full text-left border-collapse'>
                        <thead>
                            <tr className='border-b border-gray-50 dark:border-gray-800 bg-gray-50/50 dark:bg-white/[0.02]'>
                                <th className='p-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] w-12'>
                                    <input type="checkbox" checked={selectedIds.length === list.length && list.length > 0} onChange={() => setSelectedIds(selectedIds.length === list.length ? [] : list.map(i => i._id))} />
                                </th>
                                <th className='p-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]'>Customer</th>
                                <th className='p-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]'>Email</th>
                                <th className='p-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]'>Status</th>
                                <th className='p-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right'>Action</th>
                            </tr>
                        </thead>
                        <tbody className='divide-y divide-gray-50 dark:divide-gray-800'>
                            {loading ? (
                                Array(5).fill(0).map((_, i) => (
                                    <tr key={i} className='animate-pulse'>
                                        <td colSpan={5} className='p-8'><div className='h-4 bg-gray-100 dark:bg-gray-800 rounded-full w-full' /></td>
                                    </tr>
                                ))
                            ) : list.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className='p-20 text-center'>
                                        <p className='text-sm font-black text-slate-400 uppercase tracking-widest'>No inquiries found</p>
                                    </td>
                                </tr>
                            ) : (
                                list.map((item) => (
                                    <tr key={item._id} className={`group hover:bg-indigo-50/30 dark:hover:bg-indigo-500/[0.02] transition-colors ${!item.isRead ? 'bg-indigo-50/50 dark:bg-indigo-500/[0.03]' : ''}`}>
                                        <td className='p-6'>
                                            <input type="checkbox" checked={selectedIds.includes(item._id)} onChange={() => toggleSelect(item._id)} />
                                        </td>
                                        <td className='p-6'>
                                            <div className='flex items-center gap-3'>
                                                <div className={`w-2 h-2 rounded-full ${!item.isRead ? 'bg-indigo-500 animate-pulse' : 'bg-transparent'}`} />
                                                <div>
                                                    <p className='text-sm font-black dark:text-white uppercase tracking-tight'>{item.name}</p>
                                                    <p className='text-[10px] font-bold text-slate-400 mt-0.5'>{new Date(item.createdAt).toLocaleDateString()} • {new Date(item.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className='p-6'>
                                            <p className='text-xs font-bold text-slate-500 dark:text-gray-400'>{item.email}</p>
                                        </td>
                                        <td className='p-6'>
                                            <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full border ${
                                                item.status === 'resolved' ? 'bg-green-50 text-green-600 border-green-100 dark:bg-green-500/10 dark:border-green-500/20' :
                                                item.status === 'in-progress' ? 'bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-500/10 dark:border-amber-500/20' :
                                                'bg-indigo-50 text-indigo-600 border-indigo-100 dark:bg-indigo-500/10 dark:border-indigo-500/20'
                                            }`}>
                                                {item.status}
                                            </span>
                                        </td>
                                        <td className='p-6 text-right'>
                                            <div className='flex items-center justify-end gap-2'>
                                                <button onClick={() => setSelectedInquiry(item)} className='p-2 hover:bg-white dark:hover:bg-gray-800 rounded-lg transition-all text-slate-400 hover:text-indigo-500'>
                                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                                </button>
                                                <button onClick={() => removeInquiry(item._id)} className='p-2 hover:bg-white dark:hover:bg-gray-800 rounded-lg transition-all text-slate-400 hover:text-red-500'>
                                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className='mt-8 flex justify-center items-center gap-4'>
                    <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className='p-2 disabled:opacity-30 bg-white dark:bg-gray-900 rounded-xl border dark:border-gray-800 shadow-sm'>
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                    </button>
                    <span className='text-xs font-black uppercase tracking-widest text-slate-400'>Page {page} of {totalPages}</span>
                    <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className='p-2 disabled:opacity-30 bg-white dark:bg-gray-900 rounded-xl border dark:border-gray-800 shadow-sm'>
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                    </button>
                </div>
            )}

            {/* Detail Modal */}
            <AnimatePresence>
                {selectedInquiry && (
                    <div className='fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm'>
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className='bg-white dark:bg-gray-900 w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-y-auto max-h-[90vh] no-scrollbar'
                        >
                            <div className='p-8 sm:p-12'>
                                <div className='flex justify-between items-start mb-10'>
                                    <div>
                                        <p className='text-[10px] font-black text-indigo-500 uppercase tracking-[.3em] mb-3'>Customer Inquiry</p>
                                        <h2 className='text-2xl font-black dark:text-white uppercase tracking-tight'>{selectedInquiry.name}</h2>
                                        <p className='text-xs font-bold text-slate-400 mt-1'>{selectedInquiry.email}</p>
                                    </div>
                                    <button onClick={() => setSelectedInquiry(null)} className='p-3 bg-gray-50 dark:bg-white/5 rounded-full hover:bg-red-50 hover:text-red-500 transition-all'>
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                    </button>
                                </div>

                                <div className='bg-gray-50 dark:bg-white/[0.02] rounded-3xl p-8 mb-10 border border-gray-100 dark:border-gray-800'>
                                    <p className='text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4'>Message</p>
                                    <p className='text-gray-700 dark:text-gray-300 leading-relaxed font-medium'>{selectedInquiry.message}</p>
                                </div>

                                <div className='flex flex-wrap items-center gap-4'>
                                    <div className='flex-1 min-w-[200px]'>
                                        <p className='text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-1'>Update Status</p>
                                        <div className='flex gap-2'>
                                            <button 
                                                onClick={() => updateStatus(selectedInquiry._id, 'pending')}
                                                className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all border ${selectedInquiry.status === 'pending' ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-500/20' : 'bg-white dark:bg-gray-800 text-gray-400 border-gray-100 dark:border-gray-800 hover:border-indigo-400'}`}
                                            >
                                                Pending
                                            </button>
                                            <button 
                                                onClick={() => updateStatus(selectedInquiry._id, 'in-progress')}
                                                className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all border ${selectedInquiry.status === 'in-progress' ? 'bg-amber-600 text-white border-amber-600 shadow-lg shadow-amber-500/20' : 'bg-white dark:bg-gray-800 text-gray-400 border-gray-100 dark:border-gray-800 hover:border-amber-400'}`}
                                            >
                                                Active
                                            </button>
                                            <button 
                                                onClick={() => updateStatus(selectedInquiry._id, 'resolved')}
                                                className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all border ${selectedInquiry.status === 'resolved' ? 'bg-green-600 text-white border-green-600 shadow-lg shadow-green-500/20' : 'bg-white dark:bg-gray-800 text-gray-400 border-gray-100 dark:border-gray-800 hover:border-green-400'}`}
                                            >
                                                Resolved
                                            </button>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={() => removeInquiry(selectedInquiry._id)}
                                        className='px-6 py-3 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 text-[10px] font-black uppercase tracking-widest rounded-xl border border-red-100 dark:border-red-500/20 hover:bg-red-600 hover:text-white transition-all mt-auto'
                                    >
                                        Delete Inquiry
                                    </button>
                                </div>

                                <div className='mt-12 pt-10 border-t border-gray-100 dark:border-gray-800'>
                                    <p className='text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 ml-1'>Reply to Customer</p>
                                    <textarea 
                                        value={replyMessage}
                                        onChange={(e) => setReplyMessage(e.target.value)}
                                        placeholder="Enter your professional response to the customer..."
                                        className='w-full h-32 bg-gray-50 dark:bg-white/[0.02] border border-gray-100 dark:border-gray-800 rounded-3xl p-6 text-sm outline-none focus:border-indigo-500 transition-all font-medium placeholder:text-slate-400'
                                    />
                                    <button 
                                        disabled={isResponding || !replyMessage.trim()}
                                        onClick={() => handleResponse(selectedInquiry._id)}
                                        className='mt-4 w-full bg-indigo-600 text-white py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-indigo-500/20 hover:bg-indigo-700 transition-all disabled:opacity-50 disabled:shadow-none'
                                    >
                                        {isResponding ? 'Sending...' : 'Send Reply'}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default Inquiries;
