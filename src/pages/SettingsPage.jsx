import React, { useState } from 'react'

export default function SettingsPage({ theme, setTheme }) {
    const [notifications, setNotifications] = useState(true)
    const [autoUpdate, setAutoUpdate] = useState(true)
    const [units, setUnits] = useState('celsius')
    const [soundEffects, setSoundEffects] = useState(true)
    const [isSaving, setIsSaving] = useState(false)
    const [saveStatus, setSaveStatus] = useState(null)

    const handleSave = () => {
        setIsSaving(true)
        // Simulate API call
        setTimeout(() => {
            setIsSaving(false)
            setSaveStatus('success')
            setTimeout(() => setSaveStatus(null), 3000)
        }, 1000)
    }

    return (
        <div className="pointer-events-auto w-full max-w-3xl mx-auto pb-20">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">System Settings</h2>
                {saveStatus === 'success' && (
                    <div className="flex items-center gap-2 text-success animate-in fade-in slide-in-from-right-4">
                        <i className="fa-solid fa-circle-check"></i>
                        <span className="text-sm font-bold">Settings saved successfully!</span>
                    </div>
                )}
            </div>
            
            {/* Appearance Section */}
            <div className="glass-card p-6 rounded-2xl mb-6 border border-white/5 shadow-xl">
                <div className="flex items-center gap-3 mb-4 border-b border-white/5 pb-2">
                    <i className="fa-solid fa-palette text-primary"></i>
                    <h3 className="text-lg font-bold text-white">Appearance</h3>
                </div>
                
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <div className="font-semibold text-slate-200">Theme Mode</div>
                        <div className="text-sm text-slate-400">Choose your preferred visual theme</div>
                    </div>
                    <select 
                        value={theme} 
                        onChange={(e) => setTheme(e.target.value)}
                        className="bg-[#0B0E14] border border-white/10 text-white text-sm rounded-xl p-2.5 outline-none focus:border-primary transition-colors"
                    >
                        <option value="dark">Dark Theme</option>
                        <option value="light">Light Theme</option>
                    </select>
                </div>
            </div>

            {/* Preferences Section */}
            <div className="glass-card p-6 rounded-2xl mb-6 border border-white/5 shadow-xl">
                <div className="flex items-center gap-3 mb-4 border-b border-white/5 pb-2">
                    <i className="fa-solid fa-sliders text-success"></i>
                    <h3 className="text-lg font-bold text-white">Preferences</h3>
                </div>
                
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <div className="font-semibold text-slate-200">Temperature Units</div>
                        <div className="text-sm text-slate-400">Choose between Celsius and Fahrenheit</div>
                    </div>
                    <div className="inline-flex rounded-xl overflow-hidden border border-primary/20 shadow-lg" role="group">
                        <button type="button" onClick={() => setUnits('celsius')}
                            className={`px-4 py-2 text-xs font-bold uppercase transition-all ${units === 'celsius' ? 'bg-primary text-white shadow-glow' : 'text-primary bg-transparent hover:bg-primary/10'}`}>
                            Celsius
                        </button>
                        <button type="button" onClick={() => setUnits('fahrenheit')}
                            className={`px-4 py-2 text-xs font-bold uppercase transition-all ${units === 'fahrenheit' ? 'bg-primary text-white shadow-glow' : 'text-primary bg-transparent hover:bg-primary/10'}`}>
                            Fahrenheit
                        </button>
                    </div>
                </div>

                <div className="space-y-6 pt-4 border-t border-white/5">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="font-semibold text-slate-200">Auto-Update Predictions</div>
                            <div className="text-sm text-slate-400">Refresh weather data every 60 minutes</div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" checked={autoUpdate} onChange={() => setAutoUpdate(!autoUpdate)} />
                            <div className="w-11 h-6 bg-[#0B0E14] border border-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                        </label>
                    </div>

                    <div className="flex items-center justify-between">
                        <div>
                            <div className="font-semibold text-slate-200">Flood Alerts</div>
                            <div className="text-sm text-slate-400">Desktop notifications for risk levels &gt; 70%</div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" checked={notifications} onChange={() => setNotifications(!notifications)} />
                            <div className="w-11 h-6 bg-[#0B0E14] border border-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-danger"></div>
                        </label>
                    </div>

                    <div className="flex items-center justify-between">
                        <div>
                            <div className="font-semibold text-slate-200">Notification Sounds</div>
                            <div className="text-sm text-slate-400">Play audio cues for critical alerts</div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" checked={soundEffects} onChange={() => setSoundEffects(!soundEffects)} />
                            <div className="w-11 h-6 bg-[#0B0E14] border border-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-success"></div>
                        </label>
                    </div>
                </div>
            </div>

            {/* Billing Section */}
            <div className="glass-card p-6 rounded-2xl mb-6 border border-white/5 shadow-xl">
                <div className="flex items-center gap-3 mb-4 border-b border-white/5 pb-2">
                    <i className="fa-solid fa-credit-card text-warning"></i>
                    <h3 className="text-lg font-bold text-white">Subscription & Billing</h3>
                </div>
                
                <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5 mb-4">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-warning/10 flex items-center justify-center text-warning">
                            <i className="fa-solid fa-crown"></i>
                        </div>
                        <div>
                            <div className="font-bold text-white">Enterprise AI Plan</div>
                            <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Active • Next bill: June 01, 2026</div>
                        </div>
                    </div>
                    <button className="text-xs font-bold text-primary hover:underline uppercase tracking-widest">Manage Plan</button>
                </div>

                <div className="space-y-4">
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-400">Monthly Usage (Predictions)</span>
                        <span className="text-white font-bold">12,450 / 50,000</span>
                    </div>
                    <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden">
                        <div className="bg-warning h-full" style={{ width: '25%' }}></div>
                    </div>
                </div>
            </div>

            <button 
                onClick={handleSave}
                disabled={isSaving}
                className={`w-full font-bold py-4 px-4 rounded-2xl shadow-glow transition-all flex items-center justify-center gap-3 ${isSaving ? 'bg-primary/50 cursor-wait' : 'bg-primary hover:bg-blue-600 hover:scale-[1.01] active:scale-[0.99] text-white'}`}
            >
                {isSaving ? (
                    <>
                        <i className="fa-solid fa-circle-notch animate-spin"></i>
                        Processing Changes...
                    </>
                ) : (
                    <>
                        <i className="fa-solid fa-floppy-disk"></i>
                        Save All System Settings
                    </>
                )}
            </button>
        </div>
    )
}
