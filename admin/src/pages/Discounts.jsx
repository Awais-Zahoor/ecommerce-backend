import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { backendUrl } from '../App';

const TYPE_LABELS = {
    percentage:    { label: 'Percentage %',     color: 'bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300' },
    fixed:         { label: 'Fixed Amount Rs.', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300' },
    bogo:          { label: 'Buy X Get Y',      color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300' },
    free_shipping: { label: 'Free Shipping',    color: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300' },
    auto_category: { label: 'Auto Category',    color: 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300' },
};

const EMPTY_FORM = {
    code: '', name: '', type: 'percentage', value: '',
    minCartValue: '', maxUses: '', perUserLimit: '', startsAt: '', expiresAt: '', isActive: true,
    categoryTarget: '',
    bogoConfig: { buyQty: 1, getQty: 1, getDiscount: 100 }
};

const toDateTimeLocal = (value) => {
    if (!value) return '';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '';
    const pad = (n) => String(n).padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

const Discounts = ({ token }) => {
    const [discounts, setDiscounts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [form, setForm] = useState(EMPTY_FORM);
    const [submitting, setSubmitting] = useState(false);

    const fetchDiscounts = async () => {
        setLoading(true);
        try {
            const res = await axios.get(backendUrl + '/api/discount/list', { headers: { token } });
            if (res.data.success) setDiscounts(res.data.discounts);
        } catch (e) { toast.error('Failed to load discounts.'); }
        setLoading(false);
    };

    useEffect(() => { fetchDiscounts(); }, []);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await axios.get(backendUrl + '/api/product/list');
                if (res.data.success && Array.isArray(res.data.products)) {
                    const unique = [...new Set(
                        res.data.products
                            .map((p) => (p.category || '').trim())
                            .filter(Boolean)
                    )].sort((a, b) => a.localeCompare(b));
                    setCategories(unique);
                }
            } catch (e) {
                // Non-blocking: keep manual category input available.
            }
        };
        fetchCategories();
    }, []);

    const handleChange = (e) => {
        const { name, value, type: inputType, checked } = e.target;
        if (name === 'type') {
            setForm(f => {
                const next = { ...f, type: value };
                if (value === 'bogo') next.code = '';
                return next;
            });
            return;
        }
        if (name.startsWith('bogo.')) {
            const key = name.split('.')[1];
            setForm(f => ({ ...f, bogoConfig: { ...f.bogoConfig, [key]: value } }));
        } else {
            setForm(f => ({ ...f, [name]: inputType === 'checkbox' ? checked : value }));
        }
    };

    const openCreate = () => { setForm(EMPTY_FORM); setEditingId(null); setShowForm(true); };
    const openEdit = (d) => {
        setForm({
            code: d.type === 'bogo' ? '' : (d.code || ''),
            name: d.name,
            type: d.type,
            value: d.value,
            minCartValue: d.minCartValue,
            maxUses: d.maxUses,
            perUserLimit: d.perUserLimit,
            startsAt: toDateTimeLocal(d.startsAt),
            expiresAt: toDateTimeLocal(d.expiresAt),
            isActive: d.isActive,
            categoryTarget: d.categoryTarget || '',
            bogoConfig: d.bogoConfig || EMPTY_FORM.bogoConfig
        });
        setEditingId(d._id);
        setShowForm(true);
    };
    const closeForm = () => { setShowForm(false); setEditingId(null); };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const payload = { ...form };
            if (payload.type === 'bogo') delete payload.code;
            if (editingId) payload.id = editingId;

            const url = editingId
                ? backendUrl + '/api/discount/update'
                : backendUrl + '/api/discount/create';

            const res = await axios.post(url, payload, { headers: { token } });
            if (res.data.success) {
                toast.success(res.data.message);
                closeForm();
                fetchDiscounts();
            } else {
                toast.error(res.data.message);
            }
        } catch (e) { toast.error(e.message); }
        setSubmitting(false);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this discount?')) return;
        try {
            const res = await axios.post(backendUrl + '/api/discount/delete', { id }, { headers: { token } });
            if (res.data.success) { toast.success(res.data.message); fetchDiscounts(); }
            else toast.error(res.data.message);
        } catch (e) { toast.error(e.message); }
    };

    const handleToggle = async (id) => {
        try {
            const res = await axios.post(backendUrl + '/api/discount/toggle', { id }, { headers: { token } });
            if (res.data.success) { toast.success(res.data.message); fetchDiscounts(); }
        } catch (e) { toast.error(e.message); }
    };

    const stats = {
        total: discounts.length,
        active: discounts.filter(d => d.isActive).length,
        totalUsed: discounts.reduce((s, d) => s + (d.usedCount || 0), 0),
    };

    const inputCls = 'w-full border border-gray-200 dark:border-gray-700 rounded-xl px-3.5 py-2.5 bg-white dark:bg-gray-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all';
    const labelCls = 'block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5';

    return (
        <div className="min-h-screen pb-20">

            {/* ── Header ── */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
                <div>
                    <h1 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">Marketing Promotions</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Marketing / Promotions controls for coupons and automatic offers</p>
                </div>
                <button
                    onClick={openCreate}
                    className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-lg shadow-indigo-500/20 active:scale-95 self-start sm:self-auto"
                >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" /></svg>
                    New Promotion
                </button>
            </div>

            {/* ── Stats Row ── */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                {[
                    {
                        label: 'Total Discounts', value: stats.total,
                        color: 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-100 dark:border-indigo-800/50',
                        iconColor: 'text-indigo-500',
                        icon: (
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a2 2 0 012-2z" />
                            </svg>
                        )
                    },
                    {
                        label: 'Active', value: stats.active,
                        color: 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-100 dark:border-emerald-800/50',
                        iconColor: 'text-emerald-500',
                        icon: (
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        )
                    },
                    {
                        label: 'Total Uses', value: stats.totalUsed,
                        color: 'bg-amber-50 dark:bg-amber-900/20 border-amber-100 dark:border-amber-800/50',
                        iconColor: 'text-amber-500',
                        icon: (
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                        )
                    },
                ].map(s => (
                    <div key={s.label} className={`${s.color} rounded-2xl p-5 border`}>
                        <div className={`${s.iconColor} mb-3 w-9 h-9 rounded-xl bg-white dark:bg-gray-900/50 flex items-center justify-center shadow-sm`}>
                            {s.icon}
                        </div>
                        <div className="text-2xl font-black text-gray-900 dark:text-white">{s.value}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 font-semibold uppercase tracking-wider mt-1">{s.label}</div>
                    </div>
                ))}
            </div>

            {/* ── Discount List ── */}
            {loading ? (
                <div className="flex items-center justify-center py-20 gap-3 text-gray-400">
                    <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                    </svg>
                    Loading discounts…
                </div>
            ) : discounts.length === 0 ? (
                <div className="text-center py-20 bg-gray-50 dark:bg-gray-900/40 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-800">
                    <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-900/30 mx-auto mb-4">
                        <svg className="w-8 h-8 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-bold dark:text-white">No promotions yet</h3>
                    <p className="text-gray-500 text-sm mt-1">Click "New Promotion" to create your first offer</p>
                </div>
            ) : (
                <div className="flex flex-col gap-3">
                    {discounts.map(d => (
                        <div key={d._id} className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:shadow-md transition-shadow">
                            <div className="flex items-center gap-4 flex-1 min-w-0">
                                {/* Type Badge */}
                                <span className={`shrink-0 text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full ${TYPE_LABELS[d.type]?.color}`}>
                                    {TYPE_LABELS[d.type]?.label}
                                </span>
                                {/* Info */}
                                <div className="min-w-0">
                                    <p className="font-black text-gray-900 dark:text-white text-sm truncate">{d.name}</p>
                                    <div className="flex items-center gap-3 mt-0.5 text-xs text-gray-400 flex-wrap">
                                        {d.code && <span className="font-mono bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-md">{d.code}</span>}
                                        {d.type === 'percentage' && <span>{d.value}% off</span>}
                                        {d.type === 'fixed' && <span>Rs. {d.value} off</span>}
                                        {d.type === 'bogo' && <span>BOGO on "{d.categoryTarget || '—'}" — Buy {d.bogoConfig?.buyQty} Get {d.bogoConfig?.getQty} @ {d.bogoConfig?.getDiscount}%</span>}
                                        {d.type === 'free_shipping' && <span>Free shipping {d.minCartValue > 0 ? `on orders ≥ Rs. ${d.minCartValue}` : ''}</span>}
                                        {d.type === 'auto_category' && <span>Auto on "{d.categoryTarget}" — {d.value}% off</span>}
                                        <span>Total Uses: {d.usedCount}/{d.maxUses > 0 ? d.maxUses : '∞'}</span>
                                        <span>Per User: {d.perUserLimit > 0 ? d.perUserLimit : '∞'}</span>
                                        {d.startsAt && <span>Starts: {new Date(d.startsAt).toLocaleString()}</span>}
                                        {d.expiresAt && <span>Ends: {new Date(d.expiresAt).toLocaleString()}</span>}
                                    </div>
                                </div>
                            </div>
                            {/* Actions */}
                            <div className="flex items-center gap-2 shrink-0">
                                {/* Toggle */}
                                <button
                                    onClick={() => handleToggle(d._id)}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${d.isActive ? 'bg-indigo-600' : 'bg-gray-300 dark:bg-gray-700'}`}
                                    title={d.isActive ? 'Active — click to deactivate' : 'Inactive — click to activate'}
                                >
                                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${d.isActive ? 'translate-x-6' : 'translate-x-1'}`} />
                                </button>
                                <button onClick={() => openEdit(d)} className="p-2 rounded-xl hover:bg-indigo-50 dark:hover:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 transition-colors" title="Edit">
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                </button>
                                <button onClick={() => handleDelete(d._id)} className="p-2 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/30 text-red-500 transition-colors" title="Delete">
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* ── Create / Edit Form Modal ── */}
            {showForm && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={(e) => e.target === e.currentTarget && closeForm()}>
                    <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b dark:border-gray-800 flex items-center justify-between sticky top-0 bg-white dark:bg-gray-900 rounded-t-3xl z-10">
                            <h2 className="text-lg font-black text-gray-900 dark:text-white">{editingId ? 'Edit Discount' : 'Create New Discount'}</h2>
                            <button onClick={closeForm} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-5">
                            {/* Type */}
                            <div>
                                <label className={labelCls}>Discount Type *</label>
                                <select name="type" value={form.type} onChange={handleChange} className={inputCls} required>
                                    <option value="percentage">Percentage % (e.g., 20% off)</option>
                                    <option value="fixed">Fixed Amount (e.g., Rs. 500 off)</option>
                                    <option value="bogo">Buy X Get Y (BOGO) — category only, no coupon</option>
                                    <option value="free_shipping">Free Shipping (Automatic)</option>
                                    <option value="auto_category">Auto Category Discount</option>
                                </select>
                            </div>

                            {/* Name */}
                            <div>
                                <label className={labelCls}>Discount Name *</label>
                                <input name="name" value={form.name} onChange={handleChange} className={inputCls} placeholder="e.g., Summer Sale 20%" required />
                            </div>

                            {/* Coupon Code — percentage & fixed only (BOGO uses category, not coupons) */}
                            {['percentage', 'fixed'].includes(form.type) && (
                                <div>
                                    <label className={labelCls}>Coupon Code *</label>
                                    <input name="code" value={form.code} onChange={handleChange} className={`${inputCls} font-mono uppercase`} placeholder="e.g., SAVE20" required={!editingId} />
                                    <p className="text-[11px] text-gray-400 mt-1">Customers will enter this code at checkout</p>
                                </div>
                            )}

                            {/* Value — for percentage, fixed, auto_category */}
                            {['percentage', 'fixed', 'auto_category'].includes(form.type) && (
                                <div>
                                    <label className={labelCls}>
                                        {form.type === 'percentage' ? 'Discount % *' : form.type === 'fixed' ? 'Flat Discount Amount (Rs.) *' : 'Discount % for Category *'}
                                    </label>
                                    <input name="value" value={form.value} onChange={handleChange} type="number" min="0" className={inputCls}
                                        placeholder={form.type === 'percentage' ? '20' : form.type === 'fixed' ? '500' : '15'} required />
                                </div>
                            )}

                            {/* BOGO Config */}
                            {form.type === 'bogo' && (
                                <div className="bg-amber-50 dark:bg-amber-900/10 rounded-2xl p-4 border border-amber-200 dark:border-amber-800">
                                    <p className="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider mb-3">BOGO Configuration</p>
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                        <div>
                                            <label className={labelCls}>Buy Qty</label>
                                            <input name="bogo.buyQty" value={form.bogoConfig.buyQty} onChange={handleChange} type="number" min="1" className={inputCls} />
                                        </div>
                                        <div>
                                            <label className={labelCls}>Get Qty</label>
                                            <input name="bogo.getQty" value={form.bogoConfig.getQty} onChange={handleChange} type="number" min="1" className={inputCls} />
                                        </div>
                                        <div>
                                            <label className={labelCls}>Get Discount %</label>
                                            <input name="bogo.getDiscount" value={form.bogoConfig.getDiscount} onChange={handleChange} type="number" min="1" max="100" className={inputCls} placeholder="100 = free" />
                                        </div>
                                    </div>
                                    <p className="text-[11px] text-amber-600 dark:text-amber-400 mt-2">100% = completely free | 50% = half price on the "get" items</p>
                                </div>
                            )}

                            {/* Category Target — BOGO (no coupon) & auto category % */}
                            {['auto_category', 'bogo'].includes(form.type) && (
                                <div>
                                    <label className={labelCls}>Target Category *</label>
                                    <input
                                        name="categoryTarget"
                                        value={form.categoryTarget}
                                        onChange={handleChange}
                                        className={inputCls}
                                        placeholder="Select or type a category"
                                        list="discount-categories"
                                        required
                                    />
                                    <datalist id="discount-categories">
                                        {categories.map((cat) => (
                                            <option key={cat} value={cat} />
                                        ))}
                                    </datalist>
                                    {categories.length > 0 && (
                                        <div className="mt-2 flex flex-wrap gap-2">
                                            {categories.slice(0, 8).map((cat) => (
                                                <button
                                                    key={cat}
                                                    type="button"
                                                    onClick={() => setForm((f) => ({ ...f, categoryTarget: cat }))}
                                                    className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border transition-colors ${
                                                        form.categoryTarget?.toLowerCase() === cat.toLowerCase()
                                                            ? 'bg-indigo-600 text-white border-indigo-600'
                                                            : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700'
                                                    }`}
                                                >
                                                    {cat}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                    <p className="text-[11px] text-gray-400 mt-2">
                                        {form.type === 'bogo'
                                            ? 'BOGO applies automatically to items in this category — no coupon code.'
                                            : 'Only products in this category will receive the automatic percentage discount.'}
                                    </p>
                                </div>
                            )}

                             {/* Usage limits and minimum requirement */}
                             <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                <div>
                                    <label className={labelCls}>Min Cart Value (Rs.)</label>
                                    <input name="minCartValue" value={form.minCartValue} onChange={handleChange} type="number" min="0" className={inputCls} placeholder="0 = no minimum" />
                                </div>
                                <div>
                                    <label className={labelCls}>Total Max Uses</label>
                                    <input name="maxUses" value={form.maxUses} onChange={handleChange} type="number" min="0" className={inputCls} placeholder="0 = unlimited" />
                                </div>
                                <div>
                                    <label className={labelCls}>Per User Limit</label>
                                    <input name="perUserLimit" value={form.perUserLimit} onChange={handleChange} type="number" min="0" className={inputCls} placeholder="0 = unlimited" />
                                </div>
                            </div>

                             {/* Scheduling */}
                             <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                    <label className={labelCls}>Offer Starts At</label>
                                    <input name="startsAt" value={form.startsAt} onChange={handleChange} type="datetime-local" className={inputCls} />
                                </div>
                                <div>
                                    <label className={labelCls}>Offer Ends At</label>
                                    <input name="expiresAt" value={form.expiresAt} onChange={handleChange} type="datetime-local" className={inputCls} />
                                </div>
                            </div>

                            {/* Active Toggle */}
                            <div className="flex items-center gap-3">
                                <input id="isActiveToggle" name="isActive" type="checkbox" checked={form.isActive} onChange={handleChange} className="w-4 h-4 accent-indigo-600" />
                                <label htmlFor="isActiveToggle" className="text-sm font-semibold text-gray-700 dark:text-gray-300 cursor-pointer">Active (customers can use this discount)</label>
                            </div>

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={submitting}
                                className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white py-3 rounded-xl font-black text-sm uppercase tracking-widest transition-all active:scale-[0.98] shadow-lg shadow-indigo-500/20 mt-2"
                            >
                                {submitting ? 'Saving…' : editingId ? 'Update Discount' : 'Create Discount'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Discounts;
