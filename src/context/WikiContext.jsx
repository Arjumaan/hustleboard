import React, { createContext, useContext, useState, useEffect } from 'react';
import { useWorkspace } from './WorkspaceContext';

const WikiContext = createContext();

export const useWiki = () => {
    const context = useContext(WikiContext);
    if (!context) throw new Error('useWiki must be used within a WikiProvider');
    return context;
};

export const WikiProvider = ({ children }) => {
    const { activeWorkspaceId } = useWorkspace();

    const [pages, setPages] = useState(() => {
        const saved = localStorage.getItem('hustleboard_wiki');
        return saved ? JSON.parse(saved) : [
            {
                id: 'wiki_1',
                workspaceId: 'ws_personal',
                title: 'Getting Started Guide',
                content: '# Getting Started\n\nWelcome to your workspace!\n\n## Quick Links\n- [[Product Roadmap]]\n- [[Team Handbook]]',
                tags: ['guide', 'onboarding'],
                linkedPages: ['wiki_2'],
                backlinks: [],
                template: false,
                isPublished: true,
                publicId: 'guide_101',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            },
            {
                id: 'wiki_2',
                workspaceId: 'ws_personal',
                title: 'Product Roadmap',
                content: '# Product Roadmap\n\nQ1 2024 Features...',
                tags: ['planning', 'product'],
                linkedPages: [],
                backlinks: ['wiki_1'],
                template: false,
                isPublished: false,
                publicId: 'roadmap_202',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            }
        ];
    });

    const [templates, setTemplates] = useState(() => {
        const saved = localStorage.getItem('hustleboard_wiki_templates');
        return saved ? JSON.parse(saved) : [
            {
                id: 'template_sop',
                name: 'Standard Operating Procedure',
                content: '# SOP: [Procedure Name]\n\n## Purpose\n[Why this procedure exists]\n\n## Scope\n[Who this applies to]\n\n## Procedure\n1. Step one\n2. Step two\n\n## References\n- [[Related Document]]'
            },
            {
                id: 'template_meeting',
                name: 'Meeting Notes',
                content: '# Meeting: [Meeting Name]\n\n**Date:** [Date]\n**Attendees:** \n\n## Agenda\n1. \n\n## Notes\n\n## Action Items\n- [ ] Task 1\n- [ ] Task 2'
            }
        ];
    });

    useEffect(() => {
        localStorage.setItem('hustleboard_wiki', JSON.stringify(pages));
    }, [pages]);

    useEffect(() => {
        localStorage.setItem('hustleboard_wiki_templates', JSON.stringify(templates));
    }, [templates]);

    const workspacePages = pages.filter(p => p.workspaceId === activeWorkspaceId || !p.workspaceId);

    const createPage = (fromTemplate = null) => {
        const newPage = {
            id: `wiki_${Date.now()}`,
            workspaceId: activeWorkspaceId,
            title: 'Untitled Page',
            content: fromTemplate ? templates.find(t => t.id === fromTemplate)?.content || '' : '',
            tags: [],
            linkedPages: [],
            backlinks: [],
            template: false,
            isPublished: false,
            publicId: Math.random().toString(36).substring(7),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        setPages(prev => [newPage, ...prev]);
        return newPage.id;
    };

    const updatePage = (id, updates) => {
        setPages(prev => prev.map(page => {
            if (page.id === id) {
                const updated = { ...page, ...updates, updatedAt: new Date().toISOString() };

                // Extract wiki links [[Page Name]]
                const linkMatches = updated.content.match(/\[\[(.*?)\]\]/g) || [];
                const linkedTitles = linkMatches.map(link => link.slice(2, -2));

                // Find linked page IDs
                updated.linkedPages = prev
                    .filter(p => linkedTitles.includes(p.title))
                    .map(p => p.id);

                return updated;
            }
            return page;
        }));

        // Update backlinks
        setTimeout(() => {
            setPages(prev => prev.map(page => {
                const isLinkedToThisPage = prev
                    .filter(p => p.id !== page.id)
                    .filter(p => p.linkedPages.includes(page.id))
                    .map(p => p.id);
                return { ...page, backlinks: isLinkedToThisPage };
            }));
        }, 100);
    };

    const deletePage = (id) => {
        setPages(prev => prev.filter(p => p.id !== id));
    };

    const searchPages = (query) => {
        if (!query) return workspacePages;
        const lowerQuery = query.toLowerCase();
        return workspacePages.filter(page =>
            page.title.toLowerCase().includes(lowerQuery) ||
            page.content.toLowerCase().includes(lowerQuery) ||
            page.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
        );
    };

    const getPagesByTag = (tag) => {
        return workspacePages.filter(page => page.tags.includes(tag));
    };

    const getAllTags = () => {
        const tagSet = new Set();
        workspacePages.forEach(page => {
            page.tags.forEach(tag => tagSet.add(tag));
        });
        return Array.from(tagSet);
    };

    return (
        <WikiContext.Provider value={{
            pages: workspacePages,
            templates,
            createPage,
            updatePage,
            deletePage,
            searchPages,
            getPagesByTag,
            getAllTags
        }}>
            {children}
        </WikiContext.Provider>
    );
};
