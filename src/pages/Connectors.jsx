import React from 'react';
import { useConnectors } from '../context/ConnectorContext';
import { Share2, RefreshCw, CheckCircle2, AlertCircle, Plus } from 'lucide-react';

const Connectors = () => {
    const { connectors, toggleConnector, getConnectorIcon } = useConnectors();

    return (
        <div className="flex-1 min-h-screen bg-hustle-dark lg:ml-64 p-4 lg:p-8 animate-fade-in">
            <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                        <Share2 className="text-hustle-accent" /> Connectors Hub
                    </h1>
                    <p className="text-slate-400 mt-1">Integrate your external workspaces and sync your data.</p>
                </div>
                <button className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-xl transition-all border border-slate-700">
                    <Plus size={18} />
                    <span>Request Integration</span>
                </button>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {connectors.map((connector) => {
                    const Icon = getConnectorIcon(connector.icon);
                    return (
                        <div key={connector.id} className={`bg-slate-800/40 border ${connector.enabled ? 'border-hustle-accent/30 shadow-lg shadow-hustle-accent/5' : 'border-slate-700/50'} rounded-2xl p-6 transition-all hover:bg-slate-800/60 group`}>
                            <div className="flex justify-between items-start mb-6">
                                <div className={`p-3 rounded-2xl ${connector.enabled ? 'bg-hustle-accent/20 text-hustle-accent' : 'bg-slate-900 border border-slate-700 text-slate-500'}`}>
                                    <Icon size={28} />
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${connector.status === 'Connected' ? 'bg-green-500/10 text-green-400' : 'bg-slate-700/50 text-slate-500'
                                        }`}>
                                        {connector.status}
                                    </span>
                                    <div className={`w-12 h-6 rounded-full p-1 transition-colors cursor-pointer ${connector.enabled ? 'bg-hustle-accent' : 'bg-slate-700'}`} onClick={() => toggleConnector(connector.id)}>
                                        <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${connector.enabled ? 'translate-x-6' : 'translate-x-0'}`}></div>
                                    </div>
                                </div>
                            </div>

                            <div className="mb-6">
                                <h3 className="text-lg font-bold text-white mb-1 group-hover:text-hustle-accent transition-colors">{connector.name}</h3>
                                <p className="text-sm text-slate-400 leading-relaxed">{connector.description}</p>
                            </div>

                            <div className="flex items-center justify-between text-xs pt-6 border-t border-slate-700/50">
                                <div className="flex items-center gap-1 text-slate-500 font-medium">
                                    <RefreshCw size={12} className={connector.enabled ? 'animate-spin-slow' : ''} />
                                    <span>{connector.lastSync ? `Synced ${connector.lastSync}` : 'Never Synced'}</span>
                                </div>
                                <button className={`font-bold transition-colors ${connector.enabled ? 'text-hustle-accent hover:text-white' : 'text-slate-600'}`}>
                                    Configure
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Integration Status Section */}
            <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-gradient-to-br from-hustle-accent/10 to-transparent border border-hustle-accent/20 rounded-3xl p-8">
                    <div className="flex items-center gap-3 mb-4">
                        <CheckCircle2 className="text-hustle-accent" size={24} />
                        <h3 className="text-xl font-bold text-white">System Connectivity</h3>
                    </div>
                    <p className="text-slate-400 leading-relaxed mb-6">
                        All connectors are filtered through our secure tunnel. No direct API tokens are stored on your local device. Workspaces remain isolated and end-to-end encrypted.
                    </p>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-slate-900/50 rounded-xl">
                            <span className="text-slate-300 text-sm">Sync Latency</span>
                            <span className="text-green-400 font-mono text-xs">42ms</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-slate-900/50 rounded-xl">
                            <span className="text-slate-300 text-sm">API Gateway</span>
                            <span className="text-cyan-400 font-mono text-xs">active-01 (Oregon)</span>
                        </div>
                    </div>
                </div>

                <div className="bg-slate-800/30 border border-slate-700/50 rounded-3xl p-8">
                    <div className="flex items-center gap-3 mb-4">
                        <AlertCircle className="text-yellow-400" size={24} />
                        <h3 className="text-xl font-bold text-white">Development Notice</h3>
                    </div>
                    <p className="text-slate-400 leading-relaxed mb-6">
                        Custom webhook support for self-hosted GitLab and Jira Server is currently in beta. Reach out to our engineering team for early access to the Enterprise Connectors suite.
                    </p>
                    <button className="w-full py-3 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-xl transition-all">
                        View Documentation
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Connectors;
