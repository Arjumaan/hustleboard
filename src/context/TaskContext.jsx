import React, { createContext, useContext, useState, useEffect } from 'react';
import { useWorkspace } from './WorkspaceContext';
import { useAutomation } from './AutomationContext';

const TaskContext = createContext();

export const useTasks = () => {
    const context = useContext(TaskContext);
    if (!context) {
        throw new Error('useTasks must be used within a TaskProvider');
    }
    return context;
};

export const TaskProvider = ({ children }) => {
    const { activeWorkspaceId } = useWorkspace();
    const { processAutomation } = useAutomation();
    const [tasks, setTasks] = useState(() => {
        const saved = localStorage.getItem('hustleboard_tasks');
        return saved ? JSON.parse(saved) : [
            {
                id: 4,
                workspaceId: 'ws_personal',
                title: 'Analyze Knowledge & Workflow Systems',
                category: 'Research',
                status: 'To Do',
                priority: 'Medium',
                dueDate: 'Oct 30',
                assignees: [],
                description: 'Deep dive into block-based models and state-management flows to refine HustleBoard core mechanics.',
                subtasks: [
                    { id: 1, text: 'Analyze [[Block-Based Knowledge Systems]]', completed: false },
                    { id: 2, text: 'Analyze [[State-Management Workflows]]', completed: false }
                ],
                comments: []
            },
            {
                id: 1,
                title: 'Redesign Homepage',
                category: 'Design',
                status: 'To Do',
                priority: 'High',
                dueDate: '2023-10-25',
                description: 'We need a fresh look for the landing page. Focus on conversion and accessibility.\n\n**Key requirements:**\n- Dark mode support\n- Faster load times',
                subtasks: [
                    { id: 1, text: 'Create wireframes', completed: true },
                    { id: 2, text: 'Review with team', completed: false }
                ],
                comments: []
            },
            {
                id: 2,
                workspaceId: 'ws_personal',
                title: 'Integrate Stripe API',
                category: 'Development',
                status: 'In Progress',
                priority: 'High',
                dueDate: '2023-10-24',
                assignees: ['user_2'],
                dependencies: [1],
                blockers: [],
                milestone: 'Q1 Launch',
                tags: ['backend', 'payments'],
                customFields: {
                    complexity: 'High',
                    estimatedHours: 16
                },
                recurring: null,
                description: 'Set up payments for the Pro plan.',
                subtasks: [],
                comments: []
            },
            {
                id: 3,
                workspaceId: 'ws_personal',
                title: 'Update Copywriting',
                category: 'Content',
                status: 'Done',
                priority: 'Low',
                dueDate: '2023-10-20',
                assignees: [],
                dependencies: [],
                blockers: [],
                milestone: '',
                tags: ['content'],
                customFields: {},
                recurring: null,
                description: '',
                subtasks: [],
                comments: []
            },
        ];
    });

    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        localStorage.setItem('hustleboard_tasks', JSON.stringify(tasks));
    }, [tasks]);

    const addTask = (task) => {
        const newTask = {
            ...task,
            id: Date.now(),
            workspaceId: activeWorkspaceId,
            status: 'To Do',
            dueDate: task.dueDate ? new Date(task.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : '',
            assignees: task.assignees || [],
            dependencies: task.dependencies || [],
            blockers: task.blockers || [],
            milestone: task.milestone || '',
            tags: task.tags || [],
            customFields: task.customFields || {},
            recurring: task.recurring || null,
            description: task.description || '',
            subtasks: [],
            comments: []
        };
        setTasks((prev) => [newTask, ...prev]);

        // Automation Trigger
        processAutomation('TASK_CREATED', newTask, { updateTask });
    };

    const updateTask = (id, updates) => {
        setTasks(prev => prev.map(t => {
            if (t.id === id) {
                const updated = { ...t, ...updates };
                return updated;
            }
            return t;
        }));
    };

    const updateTaskStatus = (id, newStatus) => {
        setTasks((prev) => prev.map(t => {
            if (t.id === id) {
                return { ...t, status: newStatus };
            }
            return t;
        }));

        // Better way: trigger after state update to avoid circular mapping issues in this mock setup
        const updatedTask = tasks.find(t => t.id === id);
        if (updatedTask) {
            processAutomation('TASK_STATUS_CHANGED', { ...updatedTask, status: newStatus }, {
                updateTask: (tid, up) => {
                    setTasks(current => current.map(item => {
                        if (item.id === tid) {
                            let next = { ...item, ...up };
                            // Specific logic for 'COMPLETE_ALL_SUBTASKS' if needed
                            if (up.action === 'COMPLETE_ALL_SUBTASKS') {
                                next.subtasks = item.subtasks.map(s => ({ ...s, completed: true }));
                            }
                            return next;
                        }
                        return item;
                    }));
                }
            });
        }
    };

    const deleteTask = (id) => {
        setTasks((prev) => prev.filter(t => t.id !== id));
    };

    const clearTasksByStatus = (status) => {
        setTasks((prev) => prev.filter(t => t.status !== status || t.workspaceId !== activeWorkspaceId));
    };

    const getTaskDependencies = (taskId) => {
        const task = tasks.find(t => t.id === taskId);
        return task ? task.dependencies.map(depId => tasks.find(t => t.id === depId)).filter(Boolean) : [];
    };

    const getMilestones = () => {
        const milestones = new Set();
        workspaceTasks.forEach(task => {
            if (task.milestone) milestones.add(task.milestone);
        });
        return Array.from(milestones);
    };

    const getTasksByMilestone = (milestone) => {
        return workspaceTasks.filter(t => t.milestone === milestone);
    };

    const workspaceTasks = tasks.filter(t => t.workspaceId === activeWorkspaceId || !t.workspaceId);

    const getFilteredTasks = () => {
        if (!searchQuery) return workspaceTasks;
        return workspaceTasks.filter(task =>
            task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            task.category.toLowerCase().includes(searchQuery.toLowerCase())
        );
    };

    const getStats = () => {
        const total = workspaceTasks.length;
        const inProgress = workspaceTasks.filter(t => t.status === 'In Progress').length;
        const completed = workspaceTasks.filter(t => t.status === 'Done').length;

        return {
            total: { value: total, change: '+12%' },
            inProgress: { value: inProgress, change: '-2%' },
            completed: { value: completed, change: '+24%' }
        };
    };

    return (
        <TaskContext.Provider value={{
            tasks: workspaceTasks,
            addTask,
            updateTaskStatus,
            updateTask,
            deleteTask,
            clearTasksByStatus,
            getTaskDependencies,
            getMilestones,
            getTasksByMilestone,
            searchQuery,
            setSearchQuery,
            getFilteredTasks,
            getStats
        }}>
            {children}
        </TaskContext.Provider>
    );
};
