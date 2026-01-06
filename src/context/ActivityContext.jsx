import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { useWorkspace } from './WorkspaceContext';

const ActivityContext = createContext();

export const useActivity = () => {
    const context = useContext(ActivityContext);
    if (!context) throw new Error('useActivity must be used within an ActivityProvider');
    return context;
};

export const ActivityProvider = ({ children }) => {
    const { user } = useAuth();
    const { activeWorkspaceId } = useWorkspace();

    const [activities, setActivities] = useState(() => {
        const saved = localStorage.getItem('hustleboard_activity');
        return saved ? JSON.parse(saved) : [
            {
                id: 'act_1',
                workspaceId: 'ws_personal',
                userId: 'system',
                userName: 'System',
                userAvatar: null,
                type: 'TASK_CREATED',
                targetId: 1,
                targetName: 'Redesign Homepage',
                timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
            },
            {
                id: 'act_2',
                workspaceId: 'ws_personal',
                userId: 'system',
                userName: 'Arjumaan',
                userAvatar: null,
                type: 'DOC_EDITED',
                targetId: 'doc_1',
                targetName: 'Project Requirements',
                timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 mins ago
            }
        ];
    });

    // Simulated online users for presence feature
    const [onlineUsers, setOnlineUsers] = useState([
        { id: 'user_1', name: 'Alex Rivera', avatar: 'https://i.pravatar.cc/150?u=alex', role: 'Designer', status: 'online' },
        { id: 'user_2', name: 'Sarah Chen', avatar: 'https://i.pravatar.cc/150?u=sarah', role: 'Developer', status: 'away' },
        { id: 'user_3', name: 'Michael Scott', avatar: 'https://i.pravatar.cc/150?u=michael', role: 'Manager', status: 'online' }
    ]);

    useEffect(() => {
        localStorage.setItem('hustleboard_activity', JSON.stringify(activities));
    }, [activities]);

    const logActivity = (type, targetId, targetName, metadata = {}) => {
        if (!user) return;

        const newActivity = {
            id: `act_${Date.now()}`,
            workspaceId: activeWorkspaceId,
            userId: user.email,
            userName: user.name || user.email.split('@')[0],
            userAvatar: user.avatar,
            type, // e.g., 'TASK_MOVED', 'COMMENT_ADDED', 'DOC_CREATED'
            targetId,
            targetName,
            metadata,
            timestamp: new Date().toISOString()
        };

        setActivities(prev => [newActivity, ...prev].slice(0, 100)); // Keep last 100
    };

    const getWorkspaceActivity = () => {
        return activities.filter(a => a.workspaceId === activeWorkspaceId);
    };

    const getTargetActivity = (targetId) => {
        return activities.filter(a => a.targetId === targetId);
    };

    return (
        <ActivityContext.Provider value={{
            activities: getWorkspaceActivity(),
            onlineUsers,
            logActivity,
            getTargetActivity
        }}>
            {children}
        </ActivityContext.Provider>
    );
};
