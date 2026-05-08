import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { backendUrl } from '../App';

const Subscribers = ({ token }) => {
    const [subscribers, setSubscribers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({ total: 0, active: 0, inactive: 0, thisMonth: 0 });
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('all');
    
    // Campaign State
    const [showCampaignModal, setShowCampaignModal] = useState(false);
    const [campaign, setCampaign] = useState({ subject: '', message: '', testEmail: '' });
    const [sending, setSending] = useState(false);

    const fetchSubscribers = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${backendUrl}/api/elite/admin/list`, {
                params: { page, search, filter },
                headers: { token }
            });
            if (res.data.success) {
                setSubscribers(res.data.subscribers);
                setTotalPages(res.data.pagination.totalPages);
            }
        } catch (e) {
            toast.error('Failed to load subscribers');
        }
        setLoading(false);
    };

    const fetchStats = async () => {
        try {
            const res = await axios.get(`${backendUrl}/api/elite/admin/stats`, { headers: { token } });
            if (res.data.success) setStats(res.data.stats);
        } catch (e) {}
    };

    useEffect(() => {
        fetchSubscribers();
    }, [page, filter]);

    useEffect(() => {
        fetchStats();
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        setPage(1);
        fetchSubscribers();
    };

    const toggleStatus = async (id, currentStatus) => {
        try {
            const endpoint = currentStatus ? 'delete' : 'restore';
            const res = await axios.post(`${backendUrl}/api/elite/admin/${endpoint}/${id}`, {}, { headers: { token } });
            if (res.data.success) {
                toast.success(res.data.message);
                fetchSubscribers();
                fetchStats();
            }
        } catch (e) {
            toast.error('Operation failed');
        }
    };

    const handleSendCampaign = async (e) => {
        e.preventDefault();
        setSending(true);
        try {
            const res = await axios.post(`${backendUrl}/api/elite/admin/send-campaign`, {
                subject: campaign.subject,
                htmlContent: campaign.message, // Map 'message' back to 'htmlContent' for backend compatibility
                testEmail: campaign.testEmail
            }, { headers: { token } });
            if (res.data.success) {
                toast.success(res.data.message);
                if (!campaign.testEmail) setShowCampaignModal(false);
            } else {
                toast.error(res.data.message);
            }
        } catch (e) {
            toast.error('Failed to send campaign');
        }
        setSending(false);
    };

    const inputCls = 'w-full border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 bg-white dark:bg-gray-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all';
    const labelCls = 'block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-1.5';

    return (
        <div className="max-w-7xl animate-reveal pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight uppercase">Elite Club</h1>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em] mt-1.5">Subscribers & Email Campaigns</p>
                </div>
                <button 
                    onClick={() => setShowCampaignModal(true)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3.5 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-xl shadow-indigo-500/20 active:scale-95 flex items-center gap-3"
                >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                    Send Email
                </button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-10">

                {/* Total Members */}
                <div className="admin-card p-6 border-none">
                    <div className="w-10 h-10 rounded-xl bg-indigo-50/50 dark:bg-indigo-900/10 flex items-center justify-center mb-4">
                        <svg className="w-5 h-5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                    </div>
                    <h4 className="text-2xl font-black text-indigo-600">{stats.total}</h4>
                    <p className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 mt-1">Total Members</p>
                </div>

                {/* Active */}
                <div className="admin-card p-6 border-none">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50/50 dark:bg-emerald-900/10 flex items-center justify-center mb-4">
                        <svg className="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h4 className="text-2xl font-black text-emerald-600">{stats.active}</h4>
                    <p className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 mt-1">Active</p>
                </div>

                {/* Inactive */}
                <div className="admin-card p-6 border-none">
                    <div className="w-10 h-10 rounded-xl bg-rose-50/50 dark:bg-rose-900/10 flex items-center justify-center mb-4">
                        <svg className="w-5 h-5 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                        </svg>
                    </div>
                    <h4 className="text-2xl font-black text-rose-600">{stats.inactive}</h4>
                    <p className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 mt-1">Inactive</p>
                </div>

                {/* This Month */}
                <div className="admin-card p-6 border-none">
                    <div className="w-10 h-10 rounded-xl bg-amber-50/50 dark:bg-amber-900/10 flex items-center justify-center mb-4">
                        <svg className="w-5 h-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                        </svg>
                    </div>
                    <h4 className="text-2xl font-black text-amber-600">{stats.thisMonth}</h4>
                    <p className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 mt-1">This Month</p>
                </div>

            </div>

            {/* Filters & Search */}
            <div className="admin-card p-5 border-none mb-6 flex flex-wrap items-center gap-6">
                <form onSubmit={handleSearch} className="flex-1 min-w-[250px]">
                    <div className="relative">
                        <input 
                            type="text" 
                            placeholder="Identify subscriber by email..." 
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full bg-gray-50/50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800 rounded-2xl px-5 py-3 pl-12 text-xs font-bold focus:ring-4 focus:ring-indigo-500/10 transition-all dark:text-white outline-none"
                        />
                        <svg className="w-5 h-5 absolute left-4 top-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                    </div>
                </form>
                <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-800/50 p-1.5 rounded-[1.25rem]">
                    {['all', 'active', 'inactive'].map(f => (
                        <button 
                            key={f}
                            onClick={() => { setFilter(f); setPage(1); }}
                            className={`px-5 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${filter === f ? 'bg-white dark:bg-gray-700 text-indigo-600 dark:text-white shadow-sm' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200'}`}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            {/* List */}
            <div className="admin-card overflow-hidden border-none shadow-xl shadow-gray-200/50 dark:shadow-none">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="admin-table-header">
                                <th className="px-8 py-5">Email</th>
                                <th className="px-8 py-5">Status</th>
                                <th className="px-8 py-5">Coupon Code</th>
                                <th className="px-8 py-5">Joined</th>
                                <th className="px-8 py-5 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 dark:divide-gray-800/50">
                            {loading ? (
                                <tr><td colSpan="5" className="px-8 py-24 text-center text-gray-400 animate-pulse font-black uppercase tracking-widest text-[10px]">Loading subscribers...</td></tr>
                            ) : subscribers.length === 0 ? (
                                <tr><td colSpan="5" className="px-8 py-24 text-center text-gray-400 font-black uppercase tracking-widest text-[10px]">No results found</td></tr>
                            ) : (
                                subscribers.map((s) => (
                                    <tr key={s._id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/20 transition-colors group">
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 font-black text-xs border border-indigo-100/50 dark:border-indigo-800/50">
                                                    {s.email[0].toUpperCase()}
                                                </div>
                                                <span className="text-sm font-bold text-gray-900 dark:text-white truncate max-w-[250px]">{s.email}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5">
                                            <span className={`px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${s.isActive ? 'bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-900/20 dark:border-emerald-800' : 'bg-rose-50 text-rose-600 border-rose-100 dark:bg-rose-900/20 dark:border-rose-800'}`}>
                                                {s.isActive ? 'Active' : 'Dormant'}
                                            </span>
                                        </td>
                                        <td className="px-8 py-5">
                                            <span className="font-mono text-xs text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-800 px-3 py-1.5 rounded-lg border border-gray-100 dark:border-gray-700">
                                                {s.couponCode || 'SECURED'}
                                            </span>
                                        </td>
                                        <td className="px-8 py-5">
                                            <p className="text-xs font-bold text-gray-500 dark:text-gray-400">
                                                {new Date(s.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                            </p>
                                        </td>
                                        <td className="px-8 py-5 text-right">
                                            <button 
                                                onClick={() => toggleStatus(s._id, s.isActive)}
                                                className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all ${s.isActive ? 'text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/30' : 'text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/30'}`}
                                                title={s.isActive ? 'Deactivate' : 'Restore'}
                                            >
                                                {s.isActive ? (
                                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                                ) : (
                                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                                                )}
                                            </button>
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
                <div className="flex justify-center mt-12 gap-3 transition-all">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                        <button 
                            key={p}
                            onClick={() => setPage(p)}
                            className={`w-12 h-12 rounded-2xl font-black text-[10px] transition-all duration-300 ${page === p ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-500/20 scale-110' : 'bg-white dark:bg-gray-900 text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 border border-gray-100 dark:border-gray-800'}`}
                        >
                            {p}
                        </button>
                    ))}
                </div>
            )}

            {/* Campaign Modal */}
            {showCampaignModal && (
                <div className="fixed inset-0 bg-gray-950/60 backdrop-blur-md z-[100] flex items-center justify-center p-4 animate-reveal" onClick={(e) => e.target === e.currentTarget && setShowCampaignModal(false)}>
                    <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden border border-white/20">
                        <div className="p-8 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm sticky top-0 z-10">
                            <div>
                                <h2 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tight">Send Campaign</h2>
                                <p className="text-[10px] text-indigo-600 font-bold uppercase tracking-[0.25em] mt-1.5 italic">Sending to {stats.active} active subscribers</p>
                            </div>
                            <button onClick={() => setShowCampaignModal(false)} className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all">
                                <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>

                        <form onSubmit={handleSendCampaign} className="p-8 space-y-6 overflow-y-auto max-h-[calc(90vh-100px)]">
                            <div>
                                <label className={labelCls}>Email Subject *</label>
                                <input 
                                    type="text" 
                                    required 
                                    className={`${inputCls} !text-sm !font-black !py-4`} 
                                    placeholder="Enter premium headline..."
                                    value={campaign.subject}
                                    onChange={(e) => setCampaign({...campaign, subject: e.target.value})}
                                />
                            </div>
                            <div>
                                <label className={labelCls}>Message *</label>
                                <textarea 
                                    required 
                                    className={`${inputCls} min-h-[300px] !text-sm !py-4 leading-relaxed`} 
                                    placeholder="Type your strategic message here..."
                                    value={campaign.message}
                                    onChange={(e) => setCampaign({...campaign, message: e.target.value})}
                                />
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-3 flex items-center gap-2 italic">
                                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                                    Identity branding will be applied automatically
                                </p>
                            </div>

                            <div className="bg-indigo-50/50 dark:bg-indigo-900/10 p-6 rounded-[2rem] border border-indigo-100/50 dark:border-indigo-800/50">
                                <label className={labelCls}>Test Email (Optional)</label>
                                <div className="flex gap-3">
                                    <input 
                                        type="email" 
                                        className={`${inputCls} !text-xs !py-3`} 
                                        placeholder="test@terminal.com"
                                        value={campaign.testEmail}
                                        onChange={(e) => setCampaign({...campaign, testEmail: e.target.value})}
                                    />
                                    <button 
                                        type="button" 
                                        disabled={sending || !campaign.testEmail}
                                        onClick={handleSendCampaign}
                                        className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-6 py-2 rounded-2xl text-[9px] font-black uppercase tracking-widest text-indigo-600 hover:bg-indigo-600 hover:text-white transition-all disabled:opacity-50 active:scale-95 whitespace-nowrap"
                                    >
                                        Send Test
                                    </button>
                                </div>
                            </div>

                            <button 
                                type="submit" 
                                disabled={sending}
                                className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white py-5 rounded-[1.5rem] font-black text-xs uppercase tracking-[0.3em] transition-all shadow-2xl shadow-indigo-500/40 active:scale-[0.98] mt-4"
                            >
                                {sending ? 'Sending...' : 'Send to All Subscribers →'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Subscribers;
