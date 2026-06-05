// Toolbar.jsx
import { useState } from 'react';
import { DraggableNode } from './DraggableNode';
import { useStore } from '../store/store';
import { useTheme } from '../context/ThemeContext';
import { PipelineResultsModal } from './PipelineResultsModal';
import { MdInput, MdOutput } from 'react-icons/md';
import { BiBot } from 'react-icons/bi';
import { AiOutlineFileText } from 'react-icons/ai';
import { MdPictureAsPdf, MdStorage, MdSearch, MdEditNote, MdEmail } from 'react-icons/md';
import { MdLightMode, MdDarkMode } from 'react-icons/md';
import '../styles/Toolbar.css';

export const PipelineToolbar = () => {
  const nodes = useStore((state) => state.nodes);
  const edges = useStore((state) => state.edges);
  const history = useStore((state) => state.history);
  const historyStep = useStore((state) => state.historyStep);
  const undo = useStore((state) => state.undo);
  const redo = useStore((state) => state.redo);
  const clearAll = useStore((state) => state.clearAll);
  const deleteNode = useStore((state) => state.deleteNode);
  const deleteEdge = useStore((state) => state.deleteEdge);

  const { theme, toggleTheme } = useTheme();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState(null);
  const [modalError, setModalError] = useState(null);

  const handleDeleteSelected = () => {
    const selectedNodes = nodes.filter(node => node.selected);
    const selectedEdges = edges.filter(edge => edge.selected);
    
    selectedNodes.forEach(node => deleteNode(node.id));
    selectedEdges.forEach(edge => deleteEdge(edge.id));
  };

  const handleUndo = () => {
    undo();
  };

  const handleRedo = () => {
    redo();
  };

  const handleDeleteAllNodes = () => {
    clearAll();
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        nodes: nodes,
        edges: edges,
      };

      const response = await fetch('http://localhost:8000/pipelines/parse', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setModalData(data);
      setModalError(null);
      setIsModalOpen(true);

    } catch (error) {
      console.error('Error submitting pipeline:', error);
      setModalError(`Error: ${error.message}\n\nMake sure the backend is running at http://localhost:8000`);
      setIsModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setModalData(null);
    setModalError(null);
  };

  const canUndo = historyStep > 0;
  const canRedo = historyStep < history.length - 1;
  const hasSelected = nodes.some(n => n.selected) || edges.some(e => e.selected);

  return (
    <>
      <div className="toolbar-container">
        {/* VectorShift Logo */}
        <div className="toolbar-logo">
          <div className="toolbar-logo-title">VectorShift</div>
          <div className="toolbar-logo-subtitle">Pipeline Builder</div>
        </div>

        {/* Vertical Separator */}
        <div className="toolbar-separator" />

        {/* Node Buttons - ALL 9 NODES */}
        <div className="toolbar-nodes">
          <DraggableNode type='customInput' label='Input' icon={<MdInput size={20} />} />
          <DraggableNode type='llm' label='LLM' icon={<BiBot size={20} />} />
          <DraggableNode type='customOutput' label='Output' icon={<MdOutput size={20} />} />
          <DraggableNode type='text' label='Text' icon={<AiOutlineFileText size={20} />} />
          <DraggableNode type='pdfExtractor' label='PDF' icon={<MdPictureAsPdf size={20} />} />
          <DraggableNode type='knowledgeBase' label='Knowledge' icon={<MdStorage size={20} />} />
          <DraggableNode type='webSearch' label='Search' icon={<MdSearch size={20} />} />
          <DraggableNode type='promptTemplate' label='Prompt' icon={<MdEditNote size={20} />} />
          <DraggableNode type='emailGenerator' label='Email' icon={<MdEmail size={20} />} />
        </div>

        {/* Vertical Separator */}
        <div className="toolbar-separator" />

        {/* Spacer */}
        <div className="toolbar-spacer" />

        {/* Controls Section */}
        <div className="toolbar-controls">
          
          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            title={theme === 'light' ? 'Switch to dark theme' : 'Switch to light theme'}
            className="toolbar-button toolbar-button-icon"
          >
            {theme === 'light' ? <MdDarkMode size={20} /> : <MdLightMode size={20} />}
          </button>

          {/* Delete Selected Button */}
          <button
            onClick={handleDeleteSelected}
            disabled={!hasSelected}
            title="Delete selected node or edge"
            className={`toolbar-button-delete ${!hasSelected ? 'disabled' : ''}`}
          >
            ✕
          </button>

          {/* Undo Button */}
          <button
            onClick={handleUndo}
            disabled={!canUndo}
            title="Undo"
            className="toolbar-button toolbar-button-icon"
          >
            ↶
          </button>

          {/* Redo Button */}
          <button
            onClick={handleRedo}
            disabled={!canRedo}
            title="Redo"
            className="toolbar-button toolbar-button-icon"
          >
            ↷
          </button>

          {/* Delete All Button */}
          <button
            onClick={handleDeleteAllNodes}
            title="Delete all nodes and edges (Clear Canvas)"
            className="toolbar-button toolbar-button-icon"
          >
            🗑️
          </button>

          {/* Submit Pipeline Button */}
          <button
            onClick={handleSubmit}
            title="Submit Pipeline"
            className="toolbar-button-submit"
          >
            Submit
          </button>
        </div>
      </div>

      {/* Pipeline Results Modal */}
      <PipelineResultsModal 
        isOpen={isModalOpen}
        data={modalData}
        error={modalError}
        onClose={handleCloseModal}
      />
    </>
  );
};
