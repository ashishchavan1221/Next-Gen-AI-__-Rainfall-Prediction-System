import React from 'react'

export default function AdminPage() {
    const systemLogs = [
        { id: 1, event: 'API connection established', status: 'success', time: '10:45:22' },
        { id: 2, event: 'Model re-training initiated', status: 'warning', time: '10:30:15' },
        { id: 3, event: 'Database backup completed', status: 'success', time: '09:15:00' },
        { id: 4, event: 'New user registered: admin_test', status: 'info', time: '08:45:10' },
        { id: 5, event: 'Memory usage threshold exceeded', status: 'danger', time: '07:20:44' },
    ]

    const stats = [
        { label: 'Active Users', value: '1,284', change: '+12%', icon: 'fa-users', color: 'primary' },
        { label: 'Total Predictions', value: '45.2K', change: '+5.4%', icon: 'fa-brain', color: 'accent' },
        { label: 'System Uptime', value: '99.98%', change: 'Stable', icon: 'fa-server', color: 'success' },
        { label: 'Error Rate', value: '0.02%', change: '-0.1%', icon: 'fa-bug', color: 'danger' },
    ]

    return (
        <div className="pointer-events-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-white mb-1">Admin Control Center</h2>
                    <p className="text-slate-400">Monitor system health and manage advanced AI parameters</p>
                </div>
                <div className="flex gap-3">
                    <button className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-xl border border-white/10 transition-colors flex items-center gap-2">
                        <i className="fa-solid fa-download"></i>
                        Export Logs
                    </button>
                    <button className="px-4 py-2 bg-primary text-white rounded-xl shadow-glow hover:bg-blue-600 transition-colors flex items-center gap-2 font-bold">
                        <i className="fa-solid fa-power-off"></i>
                        Restart Core
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {stats.map((stat, idx) => (
                    <div key={idx} className="glass-card p-6 rounded-2xl border border-white/5 shadow-xl hover:translate-y-[-4px] transition-all duration-300">
                        <div className="flex justify-between items-start mb-4">
                            <div className={`w-12 h-12 rounded-2xl bg-${stat.color}/10 flex items-center justify-center text-${stat.color} text-xl shadow-inner`}>
                                <i className={`fa-solid ${stat.icon}`}></i>
                            </div>
                            <span className={`text-xs font-bold px-2 py-1 rounded-lg ${stat.change.startsWith('+') ? 'bg-success/10 text-success' : stat.change === 'Stable' ? 'bg-primary/10 text-primary' : 'bg-danger/10 text-danger'}`}>
                                {stat.change}
                            </span>
                        </div>
                        <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                        <div className="text-sm font-semibold text-slate-500 uppercase tracking-wider">{stat.label}</div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* System Logs */}
                <div className="lg:col-span-2 glass-card p-6 rounded-2xl border border-white/5 shadow-xl">
                    <div className="flex justify-between items-center mb-6 border-b border-white/5 pb-4">
                        <h3 className="font-bold text-white flex items-center gap-2">
                            <i className="fa-solid fa-list-ul text-primary"></i>
                            Real-time Event Logs
                        </h3>
                        <span className="text-[10px] bg-success/10 text-success px-2 py-1 rounded-full font-bold animate-pulse">LIVE MONITORING</span>
                    </div>
                    <div className="space-y-4">
                        {systemLogs.map(log => (
                            <div key={log.id} className="flex items-center gap-4 p-3 rounded-xl bg-white/5 border border-transparent hover:border-white/10 transition-colors group">
                                <div className={`w-2 h-2 rounded-full bg-${log.status}`}></div>
                                <div className="flex-grow">
                                    <div className="text-sm font-semibold text-slate-200">{log.event}</div>
                                    <div className="text-[10px] text-slate-500 font-bold">{log.time}</div>
                                </div>
                                <div className="hidden group-hover:block">
                                    <button className="text-xs text-primary font-bold hover:underline">Details</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* AI Model Health */}
                <div className="glass-card p-6 rounded-2xl border border-white/5 shadow-xl">
                    <h3 className="font-bold text-white mb-6 flex items-center gap-2">
                        <i className="fa-solid fa-microchip text-accent"></i>
                        Model Health
                    </h3>
                    
                    <div className="space-y-6">
                        <div>
                            <div className="flex justify-between mb-2">
                                <span className="text-sm font-semibold text-slate-400">Prediction Accuracy</span>
                                <span className="text-sm font-bold text-white">94.2%</span>
                            </div>
                            <div className="w-full bg-white/5 rounded-full h-2 overflow-hidden border border-white/5">
                                <div className="bg-primary h-full shadow-glow" style={{ width: '94.2%' }}></div>
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-between mb-2">
                                <span className="text-sm font-semibold text-slate-400">Data Processing Load</span>
                                <span className="text-sm font-bold text-white">28%</span>
                            </div>
                            <div className="w-full bg-white/5 rounded-full h-2 overflow-hidden border border-white/5">
                                <div className="bg-success h-full shadow-glow" style={{ width: '28%' }}></div>
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-between mb-2">
                                <span className="text-sm font-semibold text-slate-400">GPU Resource Utilization</span>
                                <span className="text-sm font-bold text-white">65%</span>
                            </div>
                            <div className="w-full bg-white/5 rounded-full h-2 overflow-hidden border border-white/5">
                                <div className="bg-warning h-full shadow-glow" style={{ width: '65%' }}></div>
                            </div>
                        </div>

                        <div className="pt-4 border-t border-white/5">
                            <div className="p-4 rounded-xl bg-accent/10 border border-accent/20">
                                <div className="text-xs font-bold text-accent uppercase tracking-widest mb-1">Pro Tip</div>
                                <p className="text-xs text-slate-300 leading-relaxed">
                                    Model drift detected in Region 4. Consider initiating a re-training cycle with the latest seasonal datasets.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
