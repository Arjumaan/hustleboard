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
                id: 'wiki_block_systems',
                workspaceId: 'ws_personal',
                title: 'Block-Based Knowledge Systems',
                content: '# Block-Based Knowledge Systems — Deep Breakdown\n\n## 1.1 Fundamental Concept\nThis system is not a notes app or a task app. It is a block-based content engine with a relational database layer on top.\n\n## 1.2 Core Architecture\n### A. Block-Based Foundation\nEvery unit of content is a block: Paragraph, Heading, Image, Toggle, Table row, Task. Blocks can exist independently, be nested, and be rearranged freely.\n\n### B. Container Pages\nA page is simply a block that can contain other blocks. This creates wiki-style navigation with no rigid folder hierarchy.\n\n### C. Relational Databases\nDatabases are typed collections of blocks. Each database is a table where each row is a page with its own properties and content area.\n\n## 1.3 Data Storage\nAt a conceptual level, blocks have unique IDs, types, content, and parent references. Data exists once; views (Table, Board, Calendar) are projections.',
                tags: ['research', 'architecture', 'systems'],
                linkedPages: [],
                backlinks: [],
                template: false,
                isPublished: true,
                publicId: 'block_systems_breakdown',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            },
            {
                id: 'wiki_workflow_state',
                workspaceId: 'ws_personal',
                title: 'State-Management Workflows',
                content: '# State-Management Workflows — Deep Breakdown\n\n## 2.1 Fundamental Concept\nThis is a visual state-management system based on Kanban principles. It focuses on flow, not structure.\n\n## 2.2 Core Architecture\n### A. Board → List → Card Model\nBoard = Project, List = State (To Do, Doing, Done), Card = Work item. This is a finite-state workflow.\n\n### B. Lightweight Objects\nEach card contains title, description, checklists, and labels. There is no deep hierarchy, giving the system speed and predictability.\n\n## 2.3 Data Consistency\nCard metadata is stored flat. Movement = updating list ID + order index. No relational databases or nested pages.\n\n## 2.4 User Interface Design\n- **Visual-First**: Columns represent status, cards represent tasks.\n- **Immediate Feedback**: Move a card -> instant visual progress.\n- **Low Cognitive Load**: No complex menus or nested navigation.',
                tags: ['research', 'kanban', 'productivity'],
                linkedPages: [],
                backlinks: [],
                template: false,
                isPublished: true,
                publicId: 'workflow_state_breakdown',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            },
            {
                id: 'wiki_1',
                workspaceId: 'ws_personal',
                title: 'Getting Started Guide',
                content: '# Getting Started\n\nWelcome to your workspace!\n\n## Insights\n- [[Block-Based Knowledge Systems]]\n- [[State-Management Workflows]]\n\n## Internal Docs\n- [[Product Roadmap]]',
                tags: ['guide', 'onboarding'],
                linkedPages: ['wiki_block_systems', 'wiki_workflow_state', 'wiki_2'],
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
