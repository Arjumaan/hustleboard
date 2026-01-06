import React, { createContext, useContext, useState, useEffect } from 'react';
import { useWorkspace } from './WorkspaceContext';

const TeamContext = createContext();

export const useTeam = () => {
    const context = useContext(TeamContext);
    if (!context) throw new Error('useTeam must be used within a TeamProvider');
    return context;
};

export const TeamProvider = ({ children }) => {
    const { activeWorkspaceId } = useWorkspace();
    const [members, setMembers] = useState(() => {
        const saved = localStorage.getItem('hustleboard_team');
        return saved ? JSON.parse(saved) : [
            {
                id: 'user_1',
                workspaceId: 'ws_personal',
                name: 'Alex Johnson',
                role: 'Admin',
                designation: 'Product Manager',
                email: 'alex@hustle.com',
                avatar: 'https://ui-avatars.com/api/?name=Alex+Johnson&background=0D8ABC&color=fff',
                capacity: 40, // hours per week
                tasksAssigned: 5,
                status: 'online'
            },
            {
                id: 'user_2',
                workspaceId: 'ws_personal',
                name: 'Sarah Williams',
                role: 'Member',
                designation: 'Lead Developer',
                email: 'sarah@hustle.com',
                avatar: 'https://ui-avatars.com/api/?name=Sarah+Williams&background=C71585&color=fff',
                capacity: 35,
                tasksAssigned: 8,
                status: 'online'
            },
            {
                id: 'user_3',
                workspaceId: 'ws_personal',
                name: 'Mike Chen',
                role: 'Member',
                designation: 'UI/UX Designer',
                email: 'mike@hustle.com',
                avatar: 'https://ui-avatars.com/api/?name=Mike+Chen&background=228B22&color=fff',
                capacity: 40,
                tasksAssigned: 3,
                status: 'away'
            }
        ];
    });

    useEffect(() => {
        localStorage.setItem('hustleboard_team', JSON.stringify(members));
    }, [members]);

    const addMember = (member) => {
        const newMember = {
            ...member,
            id: `user_${Date.now()}`,
            workspaceId: activeWorkspaceId,
            tasksAssigned: 0,
            status: 'offline'
        };
        setMembers(prev => [...prev, newMember]);
    };

    const updateMember = (id, updates) => {
        setMembers(prev => prev.map(m => m.id === id ? { ...m, ...updates } : m));
    };

    const removeMember = (id) => {
        setMembers(prev => prev.filter(m => m.id !== id));
    };

    const workspaceMembers = members.filter(m => m.workspaceId === activeWorkspaceId);

    return (
        <TeamContext.Provider value={{
            members: workspaceMembers,
            addMember,
            updateMember,
            removeMember
        }}>
            {children}
        </TeamContext.Provider>
    );
};
