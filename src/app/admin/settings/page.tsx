"use client";

import { motion } from "framer-motion";
import { Sliders, Paintbrush, ShieldCheck, Mail, Save } from "lucide-react";

import { useState } from "react";

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState('branding');
    const [isSaving, setIsSaving] = useState(false);
    const [settings, setSettings] = useState({
        logoUrl: '/logo.png',
        primaryAccent: '#059669',
        strictVideo: true,
        autoIssueCerts: true
    });

    const handleSave = () => {
        setIsSaving(true);
        setTimeout(() => setIsSaving(false), 1500);
    };
    return (
        <div className="max-w-5xl mx-auto space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                <div>
                    <h2 className="text-3xl font-black text-emerald-950 mb-2">Platform Settings</h2>
                    <p className="text-slate-500 font-medium">Configure corporate branding, email templates, and playback rules.</p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-3 rounded-xl transition flex gap-2 items-center mt-4 md:mt-0 shadow-lg shadow-emerald-500/20 active:scale-95 disabled:opacity-75 disabled:cursor-wait"
                >
                    {isSaving ? (
                        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
                            <Save className="w-5 h-5 text-emerald-200" />
                        </motion.div>
                    ) : (
                        <Save className="w-5 h-5" />
                    )}
                    {isSaving ? "Applying..." : "Save All Settings"}
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                {/* Navigation */}
                <div className="col-span-1 border-r border-slate-200 pr-4 space-y-2 hidden md:block">
                    <button
                        onClick={() => setActiveTab('branding')}
                        className={`w-full flex items-center gap-3 p-3 rounded-xl font-bold transition ${activeTab === 'branding' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'}`}
                    >
                        <Paintbrush className="w-5 h-5" /> Theme & Branding
                    </button>
                    <button
                        onClick={() => setActiveTab('video')}
                        className={`w-full flex items-center gap-3 p-3 rounded-xl font-bold transition ${activeTab === 'video' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'}`}
                    >
                        <Sliders className="w-5 h-5" /> Video Defaults
                    </button>
                    <button
                        onClick={() => setActiveTab('roles')}
                        className={`w-full flex items-center gap-3 p-3 rounded-xl font-bold transition ${activeTab === 'roles' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'}`}
                    >
                        <ShieldCheck className="w-5 h-5" /> Role Permissions
                    </button>
                    <button
                        onClick={() => setActiveTab('email')}
                        className={`w-full flex items-center gap-3 p-3 rounded-xl font-bold transition ${activeTab === 'email' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'}`}
                    >
                        <Mail className="w-5 h-5" /> Email Editor
                    </button>
                </div>

                {/* Settings Panels */}
                <div className="col-span-1 md:col-span-3 space-y-8">
                    {activeTab === 'branding' && (
                        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-white p-8 rounded-[1.5rem] shadow-sm border border-slate-100 group hover:border-emerald-200 transition duration-500">
                            <h3 className="text-xl font-bold mb-6 text-slate-800 pb-4 border-b border-slate-100">Branding Interface</h3>
                            <div className="space-y-6">
                                <div className="group/input">
                                    <label className="block text-sm font-semibold text-slate-700 mb-2 group-focus-within/input:text-emerald-600 transition">Corporate Logo URL</label>
                                    <input placeholder="https://..." value={settings.logoUrl} onChange={e => setSettings({ ...settings, logoUrl: e.target.value })} className="w-full bg-slate-50 border border-slate-200 outline-none p-4 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition text-sm" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="group/input">
                                        <label className="block text-sm font-semibold text-slate-700 mb-2 group-focus-within/input:text-emerald-600 transition">Primary Accent Hex</label>
                                        <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 p-2 rounded-xl focus-within:border-emerald-500 focus-within:ring-4 focus-within:ring-emerald-500/10 transition">
                                            <div className="w-8 h-8 rounded-lg shadow-sm" style={{ backgroundColor: settings.primaryAccent }} />
                                            <input value={settings.primaryAccent} onChange={e => setSettings({ ...settings, primaryAccent: e.target.value })} className="bg-transparent outline-none flex-1 text-sm font-medium uppercase" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'video' && (
                        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-white p-8 rounded-[1.5rem] shadow-sm border border-slate-100 hover:border-emerald-200 transition duration-500">
                            <h3 className="text-xl font-bold mb-6 text-slate-800 pb-4 border-b border-slate-100">App Features & Playback</h3>
                            <div className="space-y-4">
                                <label className="flex items-center justify-between cursor-pointer p-4 border border-slate-100 rounded-xl hover:bg-emerald-50 hover:border-emerald-200 transition group">
                                    <div>
                                        <span className="font-bold text-slate-800 group-hover:text-emerald-900 transition">Strict Video Sequential Unlocking</span>
                                        <p className="text-xs text-slate-500 mt-1">Prevent skipping ahead in course modules.</p>
                                    </div>
                                    <div className={`w-12 h-6 rounded-full relative transition ${settings.strictVideo ? 'bg-emerald-500' : 'bg-slate-300'}`} onClick={() => setSettings({ ...settings, strictVideo: !settings.strictVideo })}>
                                        <motion.div animate={{ x: settings.strictVideo ? 24 : 0 }} className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm" />
                                    </div>
                                </label>

                                <label className="flex items-center justify-between cursor-pointer p-4 border border-slate-100 rounded-xl hover:bg-emerald-50 hover:border-emerald-200 transition group">
                                    <div>
                                        <span className="font-bold text-slate-800 group-hover:text-emerald-900 transition">Auto-Issue Certificates</span>
                                        <p className="text-xs text-slate-500 mt-1">Generate PDF immediately after trainer marks "Pass".</p>
                                    </div>
                                    <div className={`w-12 h-6 rounded-full relative transition ${settings.autoIssueCerts ? 'bg-emerald-500' : 'bg-slate-300'}`} onClick={() => setSettings({ ...settings, autoIssueCerts: !settings.autoIssueCerts })}>
                                        <motion.div animate={{ x: settings.autoIssueCerts ? 24 : 0 }} className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm" />
                                    </div>
                                </label>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'roles' && (
                        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-white p-8 rounded-[1.5rem] shadow-sm border border-slate-100 flex items-center justify-center p-12">
                            <div className="text-center">
                                <ShieldCheck className="w-16 h-16 text-emerald-200 mx-auto mb-4" />
                                <h3 className="text-xl font-bold text-slate-800 mb-2">Role Management</h3>
                                <p className="text-slate-500 text-sm max-w-sm mx-auto">Role management has been moved to the primary Manage Users tab for tighter security integration.</p>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'email' && (
                        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-white p-8 rounded-[1.5rem] shadow-sm border border-slate-100 flex items-center justify-center p-12">
                            <div className="text-center">
                                <Mail className="w-16 h-16 text-emerald-200 mx-auto mb-4" />
                                <h3 className="text-xl font-bold text-slate-800 mb-2">Email Templates</h3>
                                <p className="text-slate-500 text-sm max-w-sm mx-auto">Transactional email templates are currently managed via the SendGrid dashboard.</p>
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    );
}
