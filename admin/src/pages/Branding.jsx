import React, { useState, useEffect } from 'react'
import { assets } from '../assets/assets'
import axios from 'axios'
import { backendUrl } from '../App'
import { toast } from 'react-toastify'

const Branding = ({ token }) => {
    const [logo, setLogo] = useState(false);
    const [banner, setBanner] = useState(false);
    const [flashBanner, setFlashBanner] = useState(false);
    const [categoryMen, setCategoryMen] = useState(false);
    const [categoryWomen, setCategoryWomen] = useState(false);
    const [categoryKids, setCategoryKids] = useState(false);
    const [loadingIdentity, setLoadingIdentity] = useState(false);
    const [loadingMessaging, setLoadingMessaging] = useState(false);
    const [loadingPulse, setLoadingPulse] = useState(false);
    const [loadingNewsletter, setLoadingNewsletter] = useState(false);
    
    // Core Branding
    const [currentBranding, setCurrentBranding] = useState({ logo: "", heroBanner: "" });
    
    // Hero Text
    const [heroTitle, setHeroTitle] = useState("");
    const [heroSubtitle, setHeroSubtitle] = useState("");
    const [heroButtonText, setHeroButtonText] = useState("");
    const [flashSaleEnabled, setFlashSaleEnabled] = useState(false);
    const [flashSaleText, setFlashSaleText] = useState("");
    const [flashSaleEndsAt, setFlashSaleEndsAt] = useState("");

    // Newsletter Text
    const [newsletterTitle, setNewsletterTitle] = useState("");
    const [newsletterDescription, setNewsletterDescription] = useState("");
    const [newsletterButtonText, setNewsletterButtonText] = useState("");


    const fetchBranding = async () => {
        try {
            const response = await axios.get(backendUrl + "/api/branding/get");
            if (response.data.success) {
                const b = response.data.branding;
                setCurrentBranding(b);
                setHeroTitle(b.heroTitle || "Latest Collection");
                setHeroSubtitle(b.heroSubtitle || "Luxury Essentials");
                setHeroButtonText(b.heroButtonText || "EXPLORE COLLECTION");
                setFlashSaleEnabled(Boolean(b.flashSaleEnabled));
                setFlashSaleText(b.flashSaleText || "Flash Sale Live Now!");
                setFlashSaleEndsAt(b.flashSaleEndsAt ? new Date(b.flashSaleEndsAt).toISOString().slice(0, 16) : "");
                setNewsletterTitle(b.newsletterTitle || "Elite Club");
                setNewsletterDescription(b.newsletterDescription || "Be the first to access new arrivals, exclusive drops, and members-only offers — curated for those who define style.");
                setNewsletterButtonText(b.newsletterButtonText || "Subscribe");
            }
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        fetchBranding();
    }, []);


    // --- Modular Update Handlers ---

    const updateIdentityAssets = async () => {
        setLoadingIdentity(true);
        try {
            const formData = new FormData();
            if (logo) formData.append("logo", logo);
            if (banner) formData.append("banner", banner);
            if (categoryMen) formData.append("categoryMen", categoryMen);
            if (categoryWomen) formData.append("categoryWomen", categoryWomen);
            if (categoryKids) formData.append("categoryKids", categoryKids);
            
            const response = await axios.post(backendUrl + "/api/branding/update", formData, { headers: { token } });
            if (response.data.success) {
                toast.success("Identity Assets updated");
                setLogo(false);
                setBanner(false);
                setCategoryMen(false);
                setCategoryWomen(false);
                setCategoryKids(false);
                fetchBranding();
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoadingIdentity(false);
        }
    }

    const updateHeroMessaging = async () => {
        setLoadingMessaging(true);
        try {
            const formData = new FormData();
            formData.append("heroTitle", heroTitle);
            formData.append("heroSubtitle", heroSubtitle);
            formData.append("heroButtonText", heroButtonText);
            
            const response = await axios.post(backendUrl + "/api/branding/update", formData, { headers: { token } });
            if (response.data.success) {
                toast.success("Strategic Messaging updated");
                fetchBranding();
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoadingMessaging(false);
        }
    }

    const updateFlashPulse = async () => {
        setLoadingPulse(true);
        try {
            const formData = new FormData();
            formData.append("flashSaleEnabled", flashSaleEnabled);
            formData.append("flashSaleText", flashSaleText);
            formData.append("flashSaleEndsAt", flashSaleEndsAt);
            if (flashBanner) formData.append("flashBanner", flashBanner);
            
            const response = await axios.post(backendUrl + "/api/branding/update", formData, { headers: { token } });
            if (response.data.success) {
                toast.success("Flash Pulse protocols updated");
                setFlashBanner(false);
                fetchBranding();
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoadingPulse(false);
        }
    }

    const updateNewsletterConfig = async () => {
        setLoadingNewsletter(true);
        try {
            const formData = new FormData();
            formData.append("newsletterTitle", newsletterTitle);
            formData.append("newsletterDescription", newsletterDescription);
            formData.append("newsletterButtonText", newsletterButtonText);
            
            const response = await axios.post(backendUrl + "/api/branding/update", formData, { headers: { token } });
            if (response.data.success) {
                toast.success("Newsletter parameters updated");
                fetchBranding();
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoadingNewsletter(false);
        }
    }



    return (
        <div className="max-w-7xl animate-reveal pb-20">
            <div className="mb-10">
                <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight uppercase">Branding</h1>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em] mt-1.5">Manage Logo, Banner & Site Content</p>
            </div>

            <div className="space-y-12">
                
                {/* 1. Core Identity Assets */}
                <div className="admin-card p-8 md:p-10 border-none shadow-xl shadow-gray-200/50 dark:shadow-none bg-white dark:bg-gray-900">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-10 border-b border-gray-50 dark:border-gray-800 pb-6">
                        <div className="flex items-center gap-3">
                            <span className="w-1.5 h-6 bg-indigo-600 rounded-full"></span>
                            <h2 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight">Logo & Banner</h2>
                        </div>
                        <button 
                            disabled={loadingIdentity}
                            onClick={updateIdentityAssets}
                            className={`px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all shadow-xl ${loadingIdentity ? 'bg-gray-200 text-gray-400' : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-500/20 active:scale-95'}`}
                        >
                            {loadingIdentity ? 'Syncing...' : 'Update Assets'}
                        </button>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                        {/* Logo */}
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Store Logo</label>
                            <label htmlFor="logo" className="block cursor-pointer group">
                                <div className="h-40 w-full rounded-[2.5rem] bg-gray-50/50 dark:bg-gray-800/30 border-2 border-dashed border-gray-100 dark:border-gray-800 flex items-center justify-center overflow-hidden hover:border-indigo-500 hover:bg-indigo-50/10 transition-all duration-500 relative">
                                    {logo ? (
                                        <img className="h-20 object-contain transition-transform duration-700 group-hover:scale-110" src={URL.createObjectURL(logo)} alt="Preview" />
                                    ) : currentBranding.logo ? (
                                        <img className="h-20 object-contain transition-transform duration-700 group-hover:scale-110" src={currentBranding.logo} alt="Current" />
                                    ) : (
                                        <div className="text-center space-y-2">
                                            <svg className="w-8 h-8 text-gray-300 dark:text-gray-600 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                                            </svg>
                                            <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest">Upload Logo</p>
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-indigo-600/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <span className="bg-white dark:bg-gray-900 text-indigo-600 px-6 py-2 rounded-full font-black text-[9px] uppercase tracking-widest shadow-xl">Change Logo</span>
                                    </div>
                                </div>
                            </label>
                            <input onChange={(e) => setLogo(e.target.files[0])} type="file" id="logo" hidden />
                        </div>
                        {/* Banner */}
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Hero Banner</label>
                            <label htmlFor="banner" className="block cursor-pointer group">
                                <div className="h-40 w-full rounded-[2.5rem] bg-gray-50/50 dark:bg-gray-800/30 border-2 border-dashed border-gray-100 dark:border-gray-800 flex items-center justify-center overflow-hidden hover:border-indigo-500 hover:bg-indigo-50/10 transition-all duration-500 relative">
                                    {banner ? (
                                        <img className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" src={URL.createObjectURL(banner)} alt="Preview" />
                                    ) : currentBranding.heroBanner ? (
                                        <img className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" src={currentBranding.heroBanner} alt="Current" />
                                    ) : (
                                        <div className="text-center space-y-2">
                                            <svg className="w-8 h-8 text-gray-300 dark:text-gray-600 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                                            </svg>
                                            <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest">Upload Banner</p>
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-indigo-600/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <span className="bg-white dark:bg-gray-900 text-indigo-600 px-6 py-2 rounded-full font-black text-[9px] uppercase tracking-widest shadow-xl">Change Banner</span>
                                    </div>
                                </div>
                            </label>
                            <input onChange={(e) => setBanner(e.target.files[0])} type="file" id="banner" hidden />
                        </div>
                    </div>
                </div>

                {/* 2. Strategic Messaging */}
                <div className="admin-card p-8 md:p-10 border-none shadow-xl shadow-gray-200/50 dark:shadow-none bg-white dark:bg-gray-900">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-10 border-b border-gray-50 dark:border-gray-800 pb-6">
                        <div className="flex items-center gap-3">
                            <span className="w-1.5 h-6 bg-indigo-600 rounded-full"></span>
                            <h2 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight">Hero Section Text</h2>
                        </div>
                        <button 
                            disabled={loadingMessaging}
                            onClick={updateHeroMessaging}
                            className={`px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all shadow-xl ${loadingMessaging ? 'bg-gray-200 text-gray-400' : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-500/20 active:scale-95'}`}
                        >
                            {loadingMessaging ? 'Syncing...' : 'Update Messaging'}
                        </button>
                    </div>
                    
                    <div className="space-y-10">
                        {/* Hero Text */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Main Title</label>
                                <input type="text" value={heroTitle} onChange={(e)=>setHeroTitle(e.target.value)} className="w-full bg-gray-50/50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800 rounded-2xl px-6 py-4 text-sm font-bold focus:ring-4 focus:ring-indigo-500/10 transition-all dark:text-white outline-none" placeholder="Latest Collection"/>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Subtitle</label>
                                <input type="text" value={heroSubtitle} onChange={(e)=>setHeroSubtitle(e.target.value)} className="w-full bg-gray-50/50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800 rounded-2xl px-6 py-4 text-sm font-bold focus:ring-4 focus:ring-indigo-500/10 transition-all dark:text-white outline-none" placeholder="Luxury Essentials"/>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Button Text</label>
                                <input type="text" value={heroButtonText} onChange={(e)=>setHeroButtonText(e.target.value)} className="w-full bg-gray-50/50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800 rounded-2xl px-6 py-4 text-sm font-black uppercase tracking-widest focus:ring-4 focus:ring-indigo-500/10 transition-all dark:text-white outline-none placeholder:lowercase" placeholder="EXPLORE COLLECTION"/>
                            </div>
                        </div>

                        {/* Flash Sale Banner Configuration */}
                        <div className="bg-gray-50/50 dark:bg-gray-800/20 p-8 rounded-[3rem] border border-gray-100 dark:border-gray-800/50">
                            <div className="flex flex-wrap items-center justify-between gap-6 mb-8">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-2xl bg-amber-500/10 flex items-center justify-center">
                                        <svg className="w-5 h-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-tight">Flash Sale</h3>
                                        <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-1">Show sale banner on the storefront</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-6">
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" checked={flashSaleEnabled} onChange={(e)=>setFlashSaleEnabled(e.target.checked)} className="sr-only peer" />
                                        <div className="w-14 h-8 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600"></div>
                                    </label>
                                    <button 
                                        disabled={loadingPulse}
                                        onClick={updateFlashPulse}
                                        className={`px-5 py-2.5 rounded-xl font-black text-[9px] uppercase tracking-widest transition-all shadow-lg ${loadingPulse ? 'bg-gray-100 text-gray-400' : 'bg-gray-950 dark:bg-white text-white dark:text-gray-950 hover:opacity-90 active:scale-95'}`}
                                    >
                                        {loadingPulse ? 'Saving...' : 'Save Flash Sale'}
                                    </button>
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                                <div className="lg:col-span-7 space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Sale Message</label>
                                        <input type="text" value={flashSaleText} onChange={(e)=>setFlashSaleText(e.target.value)} className="w-full bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl px-6 py-4 text-sm font-bold focus:ring-4 focus:ring-indigo-500/10 transition-all dark:text-white outline-none" placeholder="Ex: Limited Time Offer: 40% OFF"/>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">End Date & Time</label>
                                        <input type="datetime-local" value={flashSaleEndsAt} onChange={(e)=>setFlashSaleEndsAt(e.target.value)} className="w-full bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl px-6 py-4 text-sm font-black focus:ring-4 focus:ring-indigo-500/10 transition-all dark:text-white outline-none" />
                                    </div>
                                </div>
                                <div className="lg:col-span-5">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 block mb-2">Sale Banner Image</label>
                                    <label htmlFor="flashBanner" className="block cursor-pointer group">
                                        <div className="h-44 w-full rounded-[2rem] bg-white dark:bg-gray-900 border-2 border-dashed border-gray-100 dark:border-gray-800 flex items-center justify-center overflow-hidden hover:border-indigo-500 transition-all relative">
                                            {flashBanner ? (
                                                <img className="w-full h-full object-cover" src={URL.createObjectURL(flashBanner)} alt="Preview" />
                                            ) : currentBranding.flashSaleBanner ? (
                                                <img className="w-full h-full object-cover" src={currentBranding.flashSaleBanner} alt="Current" />
                                            ) : (
                                                <div className="text-center space-y-2">
                                                    <svg className="w-7 h-7 text-gray-300 dark:text-gray-600 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                                                    </svg>
                                                    <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">Upload Image</p>
                                                </div>
                                            )}
                                        </div>
                                    </label>
                                    <input onChange={(e) => setFlashBanner(e.target.files[0])} type="file" id="flashBanner" hidden />
                                </div>
                            </div>
                        </div>

                        {/* Category Visuals */}
                        <div className="pt-8 border-t border-gray-50 dark:border-gray-800">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center">
                                    <svg className="w-4 h-4 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16m-7 6h7" />
                                    </svg>
                                </div>
                                <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.25em]">Departmental Visuals</h3>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                                {/* Men */}
                                <div className="space-y-4">
                                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Men Collection</label>
                                    <label htmlFor="catMen" className="block cursor-pointer group">
                                        <div className="aspect-[16/9] bg-gray-50/50 dark:bg-gray-800/30 rounded-[2rem] border-2 border-dashed border-gray-100 dark:border-gray-800 flex items-center justify-center overflow-hidden hover:border-indigo-500 transition-all">
                                            <img className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" src={categoryMen ? URL.createObjectURL(categoryMen) : currentBranding.categoryMen ? currentBranding.categoryMen : assets.upload_area} alt="" />
                                        </div>
                                    </label>
                                    <input onChange={(e) => setCategoryMen(e.target.files[0])} type="file" id="catMen" hidden />
                                </div>

                                {/* Women */}
                                <div className="space-y-4">
                                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Women Collection</label>
                                    <label htmlFor="catWomen" className="block cursor-pointer group">
                                        <div className="aspect-[16/9] bg-gray-50/50 dark:bg-gray-800/30 rounded-[2rem] border-2 border-dashed border-gray-100 dark:border-gray-800 flex items-center justify-center overflow-hidden hover:border-indigo-500 transition-all">
                                            <img className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" src={categoryWomen ? URL.createObjectURL(categoryWomen) : currentBranding.categoryWomen ? currentBranding.categoryWomen : assets.upload_area} alt="" />
                                        </div>
                                    </label>
                                    <input onChange={(e) => setCategoryWomen(e.target.files[0])} type="file" id="catWomen" hidden />
                                </div>

                                {/* Kids */}
                                <div className="space-y-4">
                                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Kids Collection</label>
                                    <label htmlFor="catKids" className="block cursor-pointer group">
                                        <div className="aspect-[16/9] bg-gray-50/50 dark:bg-gray-800/30 rounded-[2rem] border-2 border-dashed border-gray-100 dark:border-gray-800 flex items-center justify-center overflow-hidden hover:border-indigo-500 transition-all">
                                            <img className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" src={categoryKids ? URL.createObjectURL(categoryKids) : currentBranding.categoryKids ? currentBranding.categoryKids : assets.upload_area} alt="" />
                                        </div>
                                    </label>
                                    <input onChange={(e) => setCategoryKids(e.target.files[0])} type="file" id="catKids" hidden />
                                </div>
                            </div>
                        </div>

                        {/* Newsletter Config */}
                        <div className="space-y-8 pt-4">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-2">
                                <div className="flex items-center gap-3">
                                    <span className="w-1.5 h-3 bg-indigo-600 rounded-full"></span>
                                    <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-tight">Elite Club / Newsletter</h3>
                                </div>
                                <button 
                                    disabled={loadingNewsletter}
                                    onClick={updateNewsletterConfig}
                                    className={`px-5 py-2 rounded-xl font-black text-[9px] uppercase tracking-widest transition-all ${loadingNewsletter ? 'bg-gray-200 text-gray-400' : 'bg-gray-100 dark:bg-gray-800 text-indigo-600 dark:text-white hover:bg-indigo-600 hover:text-white shadow-sm'}`}
                                >
                                    {loadingNewsletter ? 'Saving...' : 'Save Newsletter'}
                                </button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Section Title</label>
                                    <input type="text" value={newsletterTitle} onChange={(e)=>setNewsletterTitle(e.target.value)} className="w-full bg-gray-50/50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800 rounded-2xl px-6 py-4 text-sm font-bold focus:ring-4 focus:ring-indigo-500/10 transition-all dark:text-white outline-none" placeholder="Elite Club"/>
                                </div>
                                <div className="md:col-span-2 space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Description</label>
                                    <input type="text" value={newsletterDescription} onChange={(e)=>setNewsletterDescription(e.target.value)} className="w-full bg-gray-50/50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800 rounded-2xl px-6 py-4 text-sm font-bold focus:ring-4 focus:ring-indigo-500/10 transition-all dark:text-white outline-none" placeholder="Be the first to access new arrivals..."/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Branding
