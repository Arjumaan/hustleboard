import React, { createContext, useContext, useState, useEffect } from 'react';

const DocsContext = createContext();

export const useDocs = () => {
    const context = useContext(DocsContext);
    if (!context) throw new Error('useDocs must be used within a DocsProvider');
    return context;
};

export const DocsProvider = ({ children }) => {
    const [documents, setDocuments] = useState(() => {
        const saved = localStorage.getItem('hustleboard_docs');
        return saved ? JSON.parse(saved) : [
            { id: 1, title: 'Product Specification', content: '# Product Spec\n\nObjective: Build the ultimate all-in-one workspace.\n\n## Core Features\n- Tasks\n- Docs\n- Team Chat', lastEdited: '2023-10-25' },
            { id: 2, title: 'Meeting Notes: Q4 Planning', content: 'Attendees: Alex, Sarah, Mike\n\nAction items:\n- [ ] Define Q4 goals\n- [ ] Hire 2 engineers', lastEdited: '2023-10-24' },
            { id: 3, title: 'Team Directory', content: 'Engineering:\n- Alex (Lead)\n- Sarah (Frontend)\n\nDesign:\n- Mike (Product)', lastEdited: '2023-10-20' },
        ];
    });

    useEffect(() => {
        localStorage.setItem('hustleboard_docs', JSON.stringify(documents));
    }, [documents]);

    const createDoc = () => {
        const newDoc = {
            id: Date.now(),
            title: 'Untitled Document',
            content: '',
            lastEdited: new Date().toLocaleDateString()
        };
        setDocuments(prev => [newDoc, ...prev]);
        return newDoc.id;
    };

    const updateDoc = (id, updates) => {
        setDocuments(prev => prev.map(doc =>
            doc.id === id ? { ...doc, ...updates, lastEdited: new Date().toLocaleDateString() } : doc
        ));
    };

    const deleteDoc = (id) => {
        setDocuments(prev => prev.filter(doc => doc.id !== id));
    };

    return (
        <DocsContext.Provider value={{ documents, createDoc, updateDoc, deleteDoc }}>
            {children}
        </DocsContext.Provider>
    );
};
