import React, { createContext, useContext, useState, useEffect } from 'react';

const WorkspaceContext = createContext();

export const useWorkspace = () => {
    const context = useContext(WorkspaceContext);
    if (!context) throw new Error('useWorkspace must be used within a WorkspaceProvider');
    return context;
};

export const WorkspaceProvider = ({ children }) => {
    const [workspaces, setWorkspaces] = useState(() => {
        const saved = localStorage.getItem('hustleboard_workspaces');
        return saved ? JSON.parse(saved) : [
            { id: 'ws_personal', name: 'Personal Workspace', type: 'personal' },
            { id: 'ws_eng', name: 'Engineering Team', type: 'team' },
            { id: 'ws_marketing', name: 'Marketing & Design', type: 'organization' }
        ];
    });

    const [activeWorkspaceId, setActiveWorkspaceId] = useState(() => {
        return localStorage.getItem('hustleboard_active_ws') || 'ws_personal';
    });

    useEffect(() => {
        localStorage.setItem('hustleboard_workspaces', JSON.stringify(workspaces));
    }, [workspaces]);

    useEffect(() => {
        localStorage.setItem('hustleboard_active_ws', activeWorkspaceId);
    }, [activeWorkspaceId]);

    const addWorkspace = (name, type = 'team') => {
        const newWs = { id: `ws_${Date.now()}`, name, type };
        setWorkspaces(prev => [...prev, newWs]);
        setActiveWorkspaceId(newWs.id);
    };

    const deleteWorkspace = (id) => {
        if (workspaces.length <= 1) return; // Prevent deleting last workspace
        const newWorkspaces = workspaces.filter(w => w.id !== id);
        setWorkspaces(newWorkspaces);
        if (activeWorkspaceId === id) {
            setActiveWorkspaceId(newWorkspaces[0].id);
        }
    };

    const activeWorkspace = workspaces.find(w => w.id === activeWorkspaceId) || workspaces[0];

    return (
        <WorkspaceContext.Provider value={{ workspaces, activeWorkspace, activeWorkspaceId, setActiveWorkspaceId, addWorkspace, deleteWorkspace }}>
            {children}
        </WorkspaceContext.Provider>
    );
};
