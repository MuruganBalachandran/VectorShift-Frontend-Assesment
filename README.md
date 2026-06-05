# VectorShift Pipeline Builder

A full-stack application for building and validating visual data processing pipelines with an intuitive drag-and-drop interface.

![Pipeline Builder](https://img.shields.io/badge/React-18-blue) ![FastAPI](https://img.shields.io/badge/FastAPI-Latest-green) ![License](https://img.shields.io/badge/license-MIT-blue)

## Overview

The VectorShift Pipeline Builder is a modern web application that enables users to create, visualize, and validate complex data processing pipelines through a node-based interface. Users can drag-and-drop various node types onto a canvas, connect them together, and instantly validate whether their pipeline forms a valid Directed Acyclic Graph (DAG).

### Key Highlights

- **9 Node Types**: Input, Output, LLM, Text, PDF Extractor, Knowledge Base, Web Search, Prompt Template, Email Generator
- **Real-time DAG Validation**: Instant feedback on pipeline validity using Kahn's algorithm
- **Dynamic Text Node**: Auto-resizing with variable extraction from `{{variable}}` syntax
- **Light/Dark Theme**: Beautiful, fully-implemented theme system
- **Undo/Redo**: Complete history management for all operations
- **Professional UI**: Polished interface with consistent styling and smooth animations
- **Backend Integration**: FastAPI-powered validation and analysis

## Project Structure

```
frontend_technical_assessment/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/      # React components
│   │   │   ├── node/       # Node system (abstraction & controls)
│   │   │   ├── DraggableNode.jsx
│   │   │   ├── PipelineUI.jsx
│   │   │   ├── PipelineResultsModal.jsx
│   │   │   └── Toolbar.jsx
│   │   ├── nodes/          # 9 node type implementations
│   │   ├── context/        # Theme context
│   │   ├── store/          # Zustand state management
│   │   ├── styles/         # CSS with theme variables
│   │   ├── utils/          # Node themes and utilities
│   │   ├── App.jsx
│   │   └── index.js
│   ├── public/
│   ├── package.json
│   └── README.md           # Frontend documentation
│
├── backend/                 # FastAPI backend
│   ├── main.py             # API endpoints & DAG validation
│   ├── .gitignore
│   └── README.md           # Backend documentation
│
├── .gitignore              # Root gitignore
└── README.md               # This file
```

## Features

### Frontend Features

#### Node System
- **Node Abstraction**: All nodes built using `createNode()` factory for consistency
- **9 Node Types**: Comprehensive set of processing nodes
- **Reusable Controls**: Text inputs, selects, checkboxes, sliders, tags, and more
- **Handle Presets**: Pre-configured input/output handle patterns

#### Visual Editor
- **ReactFlow Canvas**: Professional node-based editor
- **Drag & Drop**: Intuitive node placement from toolbar
- **Connections**: Visual edge creation between nodes
- **Minimap**: Color-coded overview with node type indicators
- **Zoom & Pan**: Full canvas navigation controls

#### Text Node (Special Feature)
- **Auto-resize**: Height adjusts based on content
- **Variable Extraction**: Detects `{{variableName}}` patterns
- **Dynamic Handles**: Automatically creates input handles for variables
- **Real-time Updates**: Variables update as user types

#### UI/UX
- **Light/Dark Theme**: Fully implemented with smooth transitions
- **CSS Variables**: Theme-aware styling throughout
- **Professional Design**: Consistent, polished interface
- **Responsive Layout**: Adapts to different screen sizes

#### User Actions
- **Undo/Redo**: Complete history with 50-step memory
- **Delete Selected**: Remove selected nodes/edges with one click
- **Clear All**: Reset entire canvas
- **Keyboard Shortcuts**: Delete key for quick removal
- **Theme Toggle**: Switch themes instantly

#### Validation Modal
- **Pipeline Statistics**: Visual display of node/edge counts
- **DAG Validation**: Clear indication of validity
- **Color-coded Results**: Green for valid, red for invalid
- **Error Handling**: User-friendly error messages

### Backend Features

#### FastAPI Framework
- **Modern API**: High-performance async web framework
- **Auto Documentation**: Interactive Swagger UI at `/docs`
- **Type Safety**: Full Python type hints
- **Fast Performance**: Built on Starlette and Pydantic

#### CORS Configuration
- **Cross-Origin Support**: Enables frontend-backend communication
- **Configurable**: Easy to restrict for production
- **Credentials Support**: Ready for authentication

#### DAG Detection
- **Kahn's Algorithm**: Efficient topological sort (O(V + E))
- **Cycle Detection**: Identifies circular dependencies
- **Isolated Node Support**: Handles disconnected components
- **Robust Validation**: Handles edge cases gracefully

#### API Endpoints
- **Health Check** (`GET /`): Verify API status
- **Parse Pipeline** (`POST /pipelines/parse`): Validate and analyze pipelines

## Technology Stack

### Frontend
- **React 18**: Modern UI library with hooks
- **ReactFlow**: Visual node editor
- **Zustand**: Lightweight state management
- **React Icons**: Comprehensive icon library
- **CSS Variables**: Dynamic theming

### Backend
- **FastAPI**: Modern Python web framework
- **Uvicorn**: Lightning-fast ASGI server
- **Python 3.7+**: Modern Python features
- **Type Hints**: Static typing for better code quality

## Installation & Setup

### Prerequisites

- **Node.js** (v14 or higher)
- **npm** or **yarn**
- **Python** (3.7 or higher)
- **pip**

### Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server (runs on http://localhost:3000)
npm start
```

The frontend will automatically open in your default browser.

### Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
pip install -r requirements.txt

# Start API server (runs on http://localhost:8000)
uvicorn main:app --reload
```

### Verify Installation

1. **Frontend**: http://localhost:3000
2. **Backend**: http://localhost:8000
3. **API Docs**: http://localhost:8000/docs

## Usage Guide

### Creating a Pipeline

1. **Add Nodes**
   - Drag node types from the toolbar to the canvas
   - Available nodes: Input, Output, LLM, Text, PDF, Knowledge Base, Web Search, Prompt Template, Email

2. **Connect Nodes**
   - Drag from output handles (right side) to input handles (left side)
   - Connections create edges in your pipeline

3. **Configure Nodes**
   - Click on nodes to see their configuration options
   - Each node type has different controls (dropdowns, inputs, checkboxes, etc.)

4. **Use Text Variables**
   - In Text nodes, use `{{variableName}}` syntax
   - Input handles automatically appear for each variable
   - Connect other nodes to these variable inputs

5. **Theme Toggle**
   - Click the sun/moon icon in the toolbar
   - Instantly switch between light and dark themes

6. **Undo/Redo**
   - Use the circular arrow buttons
   - Navigate through your editing history

7. **Delete**
   - Select nodes/edges and click the ✕ button
   - Or press Delete key on your keyboard
   - Use 🗑️ to clear entire canvas

8. **Submit & Validate**
   - Click the "Submit" button
   - View pipeline statistics (node count, edge count)
   - See if your pipeline is a valid DAG

### Understanding DAG Validation

**Valid Pipeline (DAG):**
- No circular dependencies
- Can be executed in order
- Green validation indicator

**Invalid Pipeline (Not a DAG):**
- Contains cycles
- Cannot determine execution order
- Red validation indicator

## API Integration

### Request Format

```javascript
POST http://localhost:8000/pipelines/parse

{
  "nodes": [
    { "id": "node-1", "type": "input", "data": {...} },
    { "id": "node-2", "type": "llm", "data": {...} }
  ],
  "edges": [
    { "source": "node-1", "target": "node-2" }
  ]
}
```

### Response Format

```javascript
{
  "num_nodes": 2,
  "num_edges": 1,
  "is_dag": true,
  "status": "success"
}
```

## Architecture

### Frontend Architecture

- **Component-Based**: Modular React components
- **State Management**: Zustand store with history
- **Factory Pattern**: Node creation abstraction
- **Context API**: Theme management
- **CSS Variables**: Dynamic styling

### Backend Architecture

- **REST API**: FastAPI endpoints
- **Graph Algorithms**: Kahn's algorithm for DAG detection
- **Type Safety**: Python type hints throughout
- **Middleware**: CORS for cross-origin requests

## Code Organization

### Frontend Code Style
- **Region Comments**: All files organized with `// region` markers
- **Consistent Naming**: camelCase for variables, PascalCase for components
- **Comprehensive Comments**: All CSS and complex logic documented
- **Modular Design**: Small, focused components

### Backend Code Style
- **Region Comments**: Python files organized with `# region` markers
- **Type Hints**: All functions fully typed
- **Docstrings**: Comprehensive documentation
- **Error Handling**: Graceful error responses

## Performance

### Frontend
- **React 18**: Concurrent features for smooth UI
- **Optimized Rendering**: Minimal re-renders with Zustand
- **CSS Transitions**: Smooth theme changes
- **Lazy Loading**: Components loaded on demand

### Backend
- **O(V + E) Complexity**: Efficient DAG detection
- **Async Support**: FastAPI async endpoints
- **Fast Response**: Minimal processing time
- **Scalable**: Handles large pipelines

## Browser Support

- ✅ Chrome (Recommended)
- ✅ Firefox
- ✅ Safari
- ✅ Edge

Modern browsers with ES6+ support required.

## Development

### Frontend Development

```bash
cd frontend
npm start          # Start dev server
npm run build      # Build for production
npm test          # Run tests (if available)
```

### Backend Development

```bash
cd backend
uvicorn main:app --reload  # Development with auto-reload
uvicorn main:app          # Production mode
```

### Code Quality

- **Frontend**: ESLint-ready, React best practices
- **Backend**: Type hints, comprehensive docstrings
- **Both**: Region comments, clear structure

## Troubleshooting

### CORS Errors
**Problem**: Browser blocks requests from frontend to backend  
**Solution**: Ensure backend is running before frontend starts

### Port Conflicts
**Problem**: Port 3000 or 8000 already in use  
**Solution**: 
```bash
# Frontend: Edit package.json to use different port
# Backend: uvicorn main:app --port 8001
```

### Theme Not Switching
**Problem**: Theme toggle doesn't work  
**Solution**: Check browser console, ensure ThemeContext is wrapping App

### Pipeline Not Submitting
**Problem**: Submit button shows error  
**Solution**: Verify backend is running at http://localhost:8000

## Documentation

- **Frontend**: See [frontend/README.md](frontend/README.md)
- **Backend**: See [backend/README.md](backend/README.md)
- **API Docs**: http://localhost:8000/docs (when server is running)

## License

MIT License - Feel free to use this project for learning and development.

## Credits

Built with ❤️ using React, FastAPI, and modern web technologies.

---

**Quick Start:** 
```bash
# Terminal 1 - Backend
cd backend && pip install -r requirements.txt && uvicorn main:app --reload

# Terminal 2 - Frontend  
cd frontend && npm install && npm start
```

Then visit http://localhost:3000 and start building pipelines!
