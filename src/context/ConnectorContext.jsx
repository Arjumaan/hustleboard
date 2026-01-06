import React, { createContext, useContext, useState, useEffect } from 'react';
import { Github, Globe, MessageSquare, Database, HardDrive, FileCode, Layers, Slack } from 'lucide-react';

const ConnectorContext = createContext();

export const useConnectors = () => {
    const context = useContext(ConnectorContext);
    if (!context) throw new Error('useConnectors must be used within a ConnectorProvider');
    return context;
};

export const ConnectorProvider = ({ children }) => {
    const [connectors, setConnectors] = useState(() => {
        const saved = localStorage.getItem('hustleboard_connectors');
        return saved ? JSON.parse(saved) : [
            { id: 'github', name: 'GitHub', type: 'Code', icon: 'Github', description: 'Link repositories and sync issues.', status: 'Connected', lastSync: '10m ago', enabled: true },
            { id: 'drive', name: 'Google Drive', type: 'Storage', icon: 'HardDrive', description: 'Attach cloud files to tasks and docs.', status: 'Not Connected', lastSync: null, enabled: false },
            { id: 'notion_sync', name: 'Knowledge Hub', type: 'Database', icon: 'Database', description: 'Sync notes and relational databases.', status: 'Connected', lastSync: '1h ago', enabled: true },
            { id: 'trello_sync', name: 'Visual Boards', type: 'Kanban', icon: 'Layers', description: 'Import and sync board cards.', status: 'Not Connected', lastSync: null, enabled: false },
            { id: 'discord', name: 'Chatbot Engine', type: 'Communication', icon: 'MessageSquare', description: 'Automate messages and notifications.', status: 'Not Connected', lastSync: null, enabled: false },
            { id: 'gitlab', name: 'GitLab', type: 'Code', icon: 'FileCode', description: 'Pipeline status and issue tracking.', status: 'Not Connected', lastSync: null, enabled: false },
            { id: 'slack', name: 'Slack', type: 'Communication', icon: 'Slack', description: 'Sync team activity and channels.', status: 'Not Connected', lastSync: null, enabled: false }
        ];
    });

    useEffect(() => {
        localStorage.setItem('hustleboard_connectors', JSON.stringify(connectors));
    }, [connectors]);

    const toggleConnector = (id) => {
        setConnectors(prev => prev.map(c =>
            c.id === id ? { ...c, enabled: !c.enabled, status: !c.enabled ? 'Connected' : 'Not Connected' } : c
        ));
    };

    const getConnectorIcon = (iconName) => {
        switch (iconName) {
            case 'Github': return Github;
            case 'HardDrive': return HardDrive;
            case 'Database': return Database;
            case 'Layers': return Layers;
            case 'MessageSquare': return MessageSquare;
            case 'FileCode': return FileCode;
            case 'Slack': return Slack;
            default: return Globe;
        }
    };

    return (
        <ConnectorContext.Provider value={{
            connectors,
            toggleConnector,
            getConnectorIcon
        }}>
            {children}
        </ConnectorContext.Provider>
    );
};
