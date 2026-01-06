import React, { createContext, useContext, useState, useEffect } from 'react';
import { useWorkspace } from './WorkspaceContext';

const FormContext = createContext();

export const useForms = () => {
    const context = useContext(FormContext);
    if (!context) throw new Error('useForms must be used within a FormProvider');
    return context;
};

export const FormProvider = ({ children }) => {
    const { activeWorkspaceId } = useWorkspace();
    const [forms, setForms] = useState(() => {
        const saved = localStorage.getItem('hustleboard_forms');
        return saved ? JSON.parse(saved) : [
            {
                id: 'form_1',
                workspaceId: 'ws_personal',
                name: 'Client Intake Form',
                description: 'Collect requirements from new clients.',
                fields: [
                    { id: 'f1', label: 'Client Name', type: 'text', required: true },
                    { id: 'f2', label: 'Project Type', type: 'select', options: ['Design', 'Development', 'Content'], required: true },
                    { id: 'f3', label: 'Budget Range', type: 'text', required: false },
                    { id: 'f4', label: 'Description', type: 'textarea', required: true }
                ],
                status: 'published',
                responses: 12,
                publicId: 'share_it_now'
            }
        ];
    });

    useEffect(() => {
        localStorage.setItem('hustleboard_forms', JSON.stringify(forms));
    }, [forms]);

    const addForm = (form) => {
        const newForm = {
            ...form,
            id: `form_${Date.now()}`,
            workspaceId: activeWorkspaceId,
            publicId: Math.random().toString(36).substring(7),
            responses: 0,
            status: 'draft'
        };
        setForms(prev => [...prev, newForm]);
    };

    const updateForm = (id, updates) => {
        setForms(prev => prev.map(f => f.id === id ? { ...f, ...updates } : f));
    };

    const deleteForm = (id) => {
        setForms(prev => prev.filter(f => f.id !== id));
    };

    const workspaceForms = forms.filter(f => f.workspaceId === activeWorkspaceId);

    return (
        <FormContext.Provider value={{
            forms: workspaceForms,
            addForm,
            updateForm,
            deleteForm
        }}>
            {children}
        </FormContext.Provider>
    );
};
