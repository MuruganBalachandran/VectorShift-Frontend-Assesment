# VectorShift Pipeline Builder - Frontend

A modern, feature-rich visual pipeline builder for creating and managing node-based workflows with real-time validation and a beautiful light/dark theme system.

## Description

The VectorShift Pipeline Builder is a React-based application that allows users to create complex data processing pipelines through an intuitive drag-and-drop interface. Built with ReactFlow, it provides a canvas where users can add various types of nodes (Input, Output, LLM, Text, PDF Extractor, Knowledge Base, Web Search, Prompt Template, and Email Generator), connect them together, and validate the resulting pipeline structure.

### Key Features

- **9 Node Types**: Input, Output, LLM, Text, PDF Extractor, Knowledge Base, Web Search, Prompt Template, and Email Generator
- **Visual Pipeline Editor**: Drag-and-drop interface with smooth connections
- **Dynamic Text Node**: Auto-resizing text node with variable extraction from `{{variableName}}` syntax
- **Light/Dark Theme**: Fully implemented theme system with smooth transitions
- **Undo/Redo**: Complete history management for all pipeline changes
- **Real-time Validation**: DAG (Directed Acyclic Graph) detection and pipeline statistics
- **Minimap**: Color-coded miniature overview of the entire pipeline
- **Professional UI**: Polished design with consistent styling across all components

## Architecture

### Component Structure

```
src/
├── components/
│   ├── node/
│   │   ├── baseNode.jsx           # Node abstraction with createNode factory
│   │   └── controlComponents.jsx  # Reusable form controls (inputs, selects, sliders, etc.)
│   ├── DraggableNode.jsx          # Draggable node buttons for toolbar
│   ├── PipelineResultsModal.jsx   # Modal for displaying pipeline validation results
│   ├── PipelineUI.jsx             # Main ReactFlow canvas with minimap and controls
│   └── Toolbar.jsx                # Top toolbar with node palette and actions
├── nodes/
│   ├── inputNode.jsx              # Input node for pipeline entry points
│   ├── outputNode.jsx             # Output node for pipeline results
│   ├── llmNode.jsx                # LLM configuration node
│   ├── textNode.jsx               # Dynamic text node with variable extraction
│   ├── pdfExtractorNode.jsx       # PDF processing node
│   ├── knowledgeBaseNode.jsx      # Knowledge storage and retrieval node
│   ├── webSearchNode.jsx          # Web search integration node
│   ├── promptTemplateNode.jsx     # AI prompt templating node
│   └── emailGeneratorNode.jsx     # Email generation node
├── context/
│   └── ThemeContext.jsx           # Theme provider for light/dark mode
├── store/
│   └── store.js                   # Zustand store for state management
├── styles/
│   ├── theme.css                  # CSS variables for light/dark themes
│   ├── baseNode.css               # Base node styling
│   ├── controlComponents.css      # Form control styles
│   ├── PipelineUI.css             # Canvas and ReactFlow styles
│   ├── Toolbar.css                # Toolbar styling
│   ├── DraggableNode.css          # Draggable node button styles
│   ├── PipelineResultsModal.css   # Modal dialog styles
│   ├── index.css                  # Global styles
│   └── App.css                    # Main app layout
├── utils/
│   └── nodeThemes.js              # Node theme definitions with icons and colors
├── App.jsx                        # Root application component
└── index.js                       # Application entry point
```

### Design Patterns

#### 1. Node Abstraction
All nodes are created using the `createNode()` factory function from `baseNode.jsx`. This abstraction provides:
- Consistent structure across all node types
- Reusable handle presets (SINGLE_INPUT, SINGLE_OUTPUT, INPUT_OUTPUT, DUAL_INPUT)
- Theme-based styling
- Centralized node configuration

**Example:**
```javascript
const config = {
  title: 'Node Title',
  description: 'Node description',
  width: 200,
  height: 140,
  handles: HANDLE_PRESETS.INPUT_OUTPUT,
  styles: applyTheme(NODE_THEMES.AI),
  icon: NODE_THEMES.AI.icon,
};

const renderContent = ({ id, data, onDataChange }) => {
  return (/* JSX content */);
};

export const MyNode = createNode(config, renderContent);
```

#### 2. Control Components
Reusable form controls in `controlComponents.jsx`:
- TextInput
- SelectControl
- CheckboxControl
- ToggleControl
- MultiSelectControl
- ColorPickerControl
- SliderControl
- TextareaControl
- TagInputControl

#### 3. State Management
Uses Zustand for centralized state management with:
- Node and edge management
- History tracking (undo/redo)
- Automatic state persistence
- Action creators for all operations

#### 4. Theme System
CSS variable-based theming with:
- Light and dark mode support
- Smooth transitions between themes
- Theme-aware components
- Context API for theme state

### Key Technologies

- **React 18**: Modern React with hooks
- **ReactFlow**: Visual node-based editor
- **Zustand**: Lightweight state management
- **React Icons**: Icon library
- **CSS Variables**: Dynamic theming

## File Structure

### Core Files

- **`App.jsx`**: Main application container
- **`index.js`**: Application entry point with theme provider
- **`store/store.js`**: Zustand store with history management

### Node System

- **`components/node/baseNode.jsx`**: Node factory function and handle presets
- **`components/node/controlComponents.jsx`**: All reusable form controls
- **`nodes/*.jsx`**: Individual node implementations (9 types)
- **`utils/nodeThemes.js`**: Theme definitions for all node types

### UI Components

- **`Toolbar.jsx`**: 
  - Node palette with drag-and-drop
  - Theme toggle
  - Undo/Redo buttons
  - Delete selected/clear all
  - Submit button

- **`PipelineUI.jsx`**:
  - ReactFlow canvas
  - Background grid
  - Zoom controls
  - Minimap with color-coded nodes

- **`PipelineResultsModal.jsx`**:
  - Pipeline statistics (node count, edge count)
  - DAG validation results
  - Error handling
  - User-friendly messages

### Styling

All CSS files use:
- CSS variables for theming
- BEM-style naming conventions
- Comprehensive comments explaining each style
- Responsive design principles

### Special Features

#### Text Node with Variable Extraction
The text node (`textNode.jsx`) includes:
- Auto-resizing based on content
- Variable extraction from `{{variableName}}` syntax
- Dynamic handle generation for each variable
- Real-time variable detection

#### Minimap Customization
The minimap displays nodes as:
- Colored rectangles (based on node type)
- White text abbreviations (e.g., "IN", "OUT", "LLM")
- Better visual distinction than emojis

#### History Management
Complete undo/redo system with:
- State snapshots after each change
- History step tracking
- UI buttons with disabled states

## Installation & Setup

```bash
# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build
```

## Usage

1. **Add Nodes**: Drag node types from the toolbar to the canvas
2. **Connect Nodes**: Drag from output handles to input handles
3. **Configure Nodes**: Click nodes to edit their properties
4. **Text Variables**: Use `{{variableName}}` in text nodes to create dynamic inputs
5. **Theme Toggle**: Click the sun/moon icon to switch themes
6. **Undo/Redo**: Use the arrow buttons to navigate history
7. **Submit**: Click "Submit" to validate the pipeline and see statistics

## API Integration

The frontend connects to the backend API at `http://localhost:8000`:

- **POST /pipelines/parse**: Submit pipeline for validation
  - Sends: `{ nodes: [], edges: [] }`
  - Receives: `{ num_nodes, num_edges, is_dag, status }`

## Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge

Modern browsers with ES6+ support required.
