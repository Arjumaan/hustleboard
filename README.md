# HustleBoard 🚀

HustleBoard is a premium, state-of-the-art productivity platform designed to bridge the gap between deep knowledge management and visual execution.

## 🌟 The Vision
This project aims at making the best productivity app by combining:
1. **Notion's Depth**: A block-based content engine with structured, relational data.
2. **Trello's Flow**: A visual state-management system based on Kanban principles.

## 🛠️ Tech Stack
- **Frontend**: React.js with Tailwind CSS
- **Icons**: Lucide React
- **Drag & Drop**: @dnd-kit
- **Animations**: Framer Motion & Custom CSS
- **Persistence**: LocalStorage with Context API Providers

## 🏗️ Core Architecture Models

### 1. Notion-Inspired Knowledge Layer
- **Block-Based System**: Every unit of content (tasks, docs, wiki) is a structured block.
- **Relational Databases**: Knowledge exists once; views (Board, Timeline, List) are projections.
- **Progressive Disclosure**: Advanced features remain hidden until needed to reduce cognitive load.

### 2. Trello-Inspired Execution Layer
- **Board-First Design**: Visual state-management using Lists and Cards.
- **Dopamine Feedback Loops**: Immediate visual progress through drag-and-drop state changes.
- **Low Cognitive Load**: Focus on movement and flow, not just static documentation.

## 🚀 Getting Started

### Installation
```bash
npm install
```

### Running Locally
```bash
npm start
```

## 📂 Project Structure
- `/src/components`: UI primitives and composite components (Sidebar, Dashboard, Modals).
- `/src/context`: State management for Tasks, Wiki, Docs, Workspaces, and Automations.
- `/src/pages`: Module-specific page layouts (Analytics, Timeline, Wiki, Forms).
- `/src/index.css`: Design system tokens, global animations, and custom scrollbars.

---
Built with ⚡ by the HustleBoard Team.
