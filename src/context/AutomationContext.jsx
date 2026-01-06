import React, { createContext, useContext, useState, useEffect } from 'react';
import { useWorkspace } from './WorkspaceContext';

const AutomationContext = createContext();

export const useAutomation = () => {
    const context = useContext(AutomationContext);
    if (!context) throw new Error('useAutomation must be used within an AutomationProvider');
    return context;
};

export const AutomationProvider = ({ children }) => {
    const { activeWorkspaceId } = useWorkspace();
    const [rules, setRules] = useState(() => {
        const saved = localStorage.getItem('hustleboard_automations');
        return saved ? JSON.parse(saved) : [
            {
                id: 'rule_1',
                workspaceId: 'ws_personal',
                name: 'Auto-Complete Subtasks',
                trigger: 'TASK_STATUS_CHANGED',
                condition: { status: 'Done' },
                action: 'COMPLETE_ALL_SUBTASKS',
                enabled: true
            },
            {
                id: 'rule_2',
                workspaceId: 'ws_personal',
                name: 'Set High Priority on Overdue',
                trigger: 'TASK_OVERDUE',
                condition: {},
                action: 'SET_PRIORITY_HIGH',
                enabled: false
            }
        ];
    });

    useEffect(() => {
        localStorage.setItem('hustleboard_automations', JSON.stringify(rules));
    }, [rules]);

    const addRule = (rule) => {
        const newRule = {
            ...rule,
            id: `rule_${Date.now()}`,
            workspaceId: activeWorkspaceId,
            enabled: true
        };
        setRules(prev => [...prev, newRule]);
    };

    const toggleRule = (ruleId) => {
        setRules(prev => prev.map(r => r.id === ruleId ? { ...r, enabled: !r.enabled } : r));
    };

    const deleteRule = (ruleId) => {
        setRules(prev => prev.filter(r => r.id !== ruleId));
    };

    const workspaceRules = rules.filter(r => r.workspaceId === activeWorkspaceId);

    // Automation Engine - checks if any rules trigger
    const processAutomation = (triggerType, data, taskActions) => {
        const activeRules = workspaceRules.filter(r => r.enabled && r.trigger === triggerType);

        activeRules.forEach(rule => {
            // Simple condition check
            let conditionMet = true;
            if (rule.condition && Object.keys(rule.condition).length > 0) {
                conditionMet = Object.keys(rule.condition).every(key => data[key] === rule.condition[key]);
            }

            if (conditionMet) {
                executeAction(rule.action, data.id, taskActions);
            }
        });
    };

    const executeAction = (actionType, taskId, taskActions) => {
        const { updateTask } = taskActions;

        switch (actionType) {
            case 'COMPLETE_ALL_SUBTASKS':
                updateTask(taskId, { action: 'COMPLETE_ALL_SUBTASKS' });
                break;
            case 'SET_PRIORITY_HIGH':
                updateTask(taskId, { priority: 'High' });
                break;
            case 'ARCHIVE_TASK':
                updateTask(taskId, { status: 'Archived' });
                break;
            default:
                break;
        }
    };

    return (
        <AutomationContext.Provider value={{
            rules: workspaceRules,
            addRule,
            toggleRule,
            deleteRule,
            processAutomation
        }}>
            {children}
        </AutomationContext.Provider>
    );
};
