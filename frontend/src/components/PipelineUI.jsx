// region imports
// hooks
import { useState, useRef, useCallback, useEffect } from 'react';
import ReactFlow, { Controls, Background, MiniMap } from 'reactflow';
// store
import { useStore } from '../store/store';
import { shallow } from 'zustand/shallow';
// nodes
import { InputNode } from '../nodes/inputNode';
import { LLMNode } from '../nodes/llmNode';
import { OutputNode } from '../nodes/outputNode';
import { TextNode } from '../nodes/textNode';
import { PDFExtractorNode } from '../nodes/pdfExtractorNode';
import { KnowledgeBaseNode } from '../nodes/knowledgeBaseNode';
import { WebSearchNode } from '../nodes/webSearchNode';
import { PromptTemplateNode } from '../nodes/promptTemplateNode';
import { EmailGeneratorNode } from '../nodes/emailGeneratorNode';
// styles
import 'reactflow/dist/style.css';
import '../styles/PipelineUI.css';

// region constants
const gridSize = 20;
const proOptions = { hideAttribution: true };
const nodeTypes = {
  customInput: InputNode,
  llm: LLMNode,
  customOutput: OutputNode,
  text: TextNode,
  pdfExtractor: PDFExtractorNode,
  knowledgeBase: KnowledgeBaseNode,
  webSearch: WebSearchNode,
  promptTemplate: PromptTemplateNode,
  emailGenerator: EmailGeneratorNode,
};


// Icon mapping for each node type
const NODE_ICONS = {
  customInput: '📥',
  customOutput: '📤',
  llm: '💬',
  text: '📝',
  pdfExtractor: '📄',
  knowledgeBase: '💾',
  webSearch: '🔍',
  promptTemplate: '🤖',
  emailGenerator: '✉️',
};

const selector = (state) => ({
  nodes: state.nodes,
  edges: state.edges,
  getNodeID: state.getNodeID,
  addNode: state.addNode,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  onConnect: state.onConnect,
  onNodeDragStop: state.onNodeDragStop,
  deleteNode: state.deleteNode,
  deleteEdge: state.deleteEdge,
});
// endregion


// region Custom MiniMap node component with icons
const MiniMapNodeWithIcon = ({ x, y, width, height, color, shapeRendering, style, onClick }) => {
  // Get node type from the color to determine which icon to show
  const getIconFromColor = (col) => {
    const colorIconMap = {
      '#4CAF50': '📥',
      '#F44336': '📤',
      '#2196F3': '💬',
      '#FF9800': '📝',
      '#9C27B0': '📄',
      '#795548': '💾',
      '#00BCD4': '🔍',
      '#E91E63': '🤖',
      '#607D8B': '✉️',
    };
    return colorIconMap[col] || '';
  };

  const icon = getIconFromColor(color);

  return (
    <g onClick={onClick}>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        fill="transparent"
        stroke={color}
        strokeWidth="2"
        rx="3"
        shapeRendering={shapeRendering}
      />
      {icon && (
        <text
          x={x + width / 2}
          y={y + height / 2 + 1}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize={Math.min(width, height) * 0.8}
          style={{ userSelect: 'none', pointerEvents: 'none' }}
        >
          {icon}
        </text>
      )}
    </g>
  );
};
// endregion

// region pipeline UI
export const PipelineUI = () => {
    const reactFlowWrapper = useRef(null);
    const [reactFlowInstance, setReactFlowInstance] = useState(null);
    const {
      nodes,
      edges,
      getNodeID,
      addNode,
      onNodesChange,
      onEdgesChange,
      onConnect,
      onNodeDragStop,
      deleteNode,
      deleteEdge,
    } = useStore(selector, shallow);

    const getInitNodeData = (nodeID, type) => {
      let nodeData = { id: nodeID, nodeType: `${type}` };
      return nodeData;
    }

    const onDrop = useCallback(
        (event) => {
          event.preventDefault();
    
          const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
          if (event?.dataTransfer?.getData('application/reactflow')) {
            const appData = JSON.parse(event.dataTransfer.getData('application/reactflow'));
            const type = appData?.nodeType;
      
            // check if the dropped element is valid
            if (typeof type === 'undefined' || !type) {
              return;
            }
      
            const position = reactFlowInstance.project({
              x: event.clientX - reactFlowBounds.left,
              y: event.clientY - reactFlowBounds.top,
            });

            const nodeID = getNodeID(type);
            const newNode = {
              id: nodeID,
              type,
              position,
              data: getInitNodeData(nodeID, type),
            };
      
            addNode(newNode);
          }
        },
        [reactFlowInstance]
    );

    const onDragOver = useCallback((event) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    }, []);

    // Handle keyboard delete for selected nodes and edges
    // Note: Only Delete key is handled here, not Backspace
    // Use the Delete button in toolbar instead
    useEffect(() => {
      const handleKeyDown = (event) => {
        if (event.key === 'Delete') {
          if (reactFlowInstance) {
            const selectedNodes = nodes.filter(node => node.selected);
            const selectedEdges = edges.filter(edge => edge.selected);
            
            selectedNodes.forEach(node => deleteNode(node.id));
            selectedEdges.forEach(edge => deleteEdge(edge.id));
          }
        }
      };

      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }, [nodes, edges, reactFlowInstance, deleteNode, deleteEdge]);

    return (
        <div ref={reactFlowWrapper} className="pipeline-wrapper">
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onNodeDragStop={onNodeDragStop}
                onDrop={onDrop}
                onDragOver={onDragOver}
                onInit={setReactFlowInstance}
                nodeTypes={nodeTypes}
                proOptions={proOptions}
                snapGrid={[gridSize, gridSize]}
                connectionLineType='smoothstep'
            >
                <Background color="#aaa" gap={gridSize} />
                <Controls 
                    showZoom={true}
                    showFitView={true}
                    showInteractive={true}
                />
                <MiniMap 
                    nodeColor={(node) => {
                      // Color nodes based on their type for better visual distinction
                      const typeColorMap = {
                        customInput: '#4CAF50',      // Green for inputs
                        customOutput: '#F44336',     // Red for outputs
                        llm: '#2196F3',              // Blue for LLM
                        text: '#FF9800',             // Orange for text
                        pdfExtractor: '#9C27B0',     // Purple for PDF
                        knowledgeBase: '#795548',    // Brown for knowledge base
                        webSearch: '#00BCD4',        // Cyan for web search
                        promptTemplate: '#E91E63',   // Pink for prompt template
                        emailGenerator: '#607D8B',   // Blue grey for email
                      };
                      return typeColorMap[node.type] || '#5e35b1';
                    }}
                    nodeStrokeWidth={3}
                    nodeComponent={MiniMapNodeWithIcon}
                    maskColor="rgba(0, 0, 0, 0.05)"
                />
            </ReactFlow>
        </div>
    )
}
// endregion