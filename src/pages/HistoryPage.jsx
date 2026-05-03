import React, { useState, useEffect } from 'react'

export default function HistoryPage() {
    const [history, setHistory] = useState([])

    useEffect(() => {
        const storedHistory = JSON.parse(localStorage.getItem('weatherSearchHistory') || '[]')
        setHistory(storedHistory)
    }, [])

    const clearHistory = () => {
        localStorage.removeItem('weatherSearchHistory')
        setHistory([])
    }

    return (
        <div className="pointer-events-auto w-full max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">Search History</h2>
                {history.length > 0 && (
                    <button onClick={clearHistory} className="bg-danger/20 text-danger hover:bg-danger hover:text-white px-4 py-2 rounded-lg transition-colors text-sm font-semibold">
                        Clear History
                    </button>
                )}
            </div>
            
            {history.length === 0 ? (
                <div className="glass-card flex items-center justify-center p-12 rounded-2xl text-slate-300">
                    <i className="fa-solid fa-clock-rotate-left mr-3"></i> No search history available.
                </div>
            ) : (
                <div className="grid gap-4">
                    {history.map((item, idx) => (
                        <div key={idx} className="glass-card p-4 rounded-xl flex items-center justify-between hover:border-primary/50 transition-all cursor-pointer">
                            <div>
                                <h3 className="text-lg font-bold text-white mb-1">{item.location}</h3>
                                <p className="text-sm text-slate-400 mb-0">{new Date(item.timestamp).toLocaleString()}</p>
                            </div>
                            <div className="text-right">
                                <div className="text-info font-bold">{item.temp}°C</div>
                                <div className={`text-sm font-semibold ${item.risk !== 'No Flood' ? 'text-danger' : 'text-success'}`}>{item.risk}</div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
