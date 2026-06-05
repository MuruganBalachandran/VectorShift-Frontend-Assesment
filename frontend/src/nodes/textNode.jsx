// region imports
// hooks
import { useState, useMemo, useRef, useEffect } from 'react';
// reactflow
import { Handle, Position } from 'reactflow';
// utils
import { NODE_THEMES } from '../utils/nodeThemes';
// styles
import '../styles/baseNode.css';
// endregion

// region helpers
/**
 * Extract variables from text in format {{varName}}
 * Valid variable names: alphanumeric, underscore, camelCase
 */
const extractVariables = (text) => {
  const regex = /\{\{(\w+)\}\}/g;
  const variables = [];
  let match;
  while ((match = regex.exec(text)) !== null) {
    if (!variables.includes(match[1])) {
      variables.push(match[1]);
    }
  }
  return variables;
};

/**
 * Calculate dynamic height based on text content
 * Min: 100px, grows modestly with content
 */
const calculateHeight = (text, containerWidth) => {
  const baseHeight = 100;
  const charWidth = 8; // approximate char width in pixels
  const availableWidth = containerWidth - 20; // account for padding
  const lines = Math.ceil(text.length / (availableWidth / charWidth));
  // Grow 15px per line instead of 20px
  const contentHeight = Math.max((lines - 1) * 15, 0);
  return Math.max(baseHeight, baseHeight + contentHeight);
};
// endregion

// region component
export const TextNode = ({ id, data = {} }) => {
  const [text, setText] = useState(data.text || '{{input}}');
  const [width, setWidth] = useState(180);
  const containerRef = useRef(null);

  // Extract variables from text
  const variables = useMemo(() => extractVariables(text), [text]);

  // Calculate dynamic height
  const height = useMemo(() => calculateHeight(text, width), [text, width]);

  // Store variables in node data
  useEffect(() => {
    if (data.variables !== JSON.stringify(variables)) {
      // This would normally sync with store, but we're managing it locally for now
    }
  }, [variables, data]);

  const handleTextChange = (e) => {
    const newText = e.target.value;
    setText(newText);
  };

  const theme = NODE_THEMES.TEXT;

  // region UI
  return (
    <div
      ref={containerRef}
      className="base-node"
      style={{
        width,
        height,
        transition: 'height 0.2s ease',
      }}
    >
      {/* Header Section */}
      <div className="base-node-header">
        {theme.icon && <span className="base-node-icon">{theme.icon}</span>}
        <span>Text Node</span>
      </div>

      {/* Content Area - Auto-expanding textarea */}
      <div className="base-node-content" style={{ display: 'flex', flexDirection: 'column', minHeight: '30px' }}>
        <label className="control-label">
          Text
        </label>
        <textarea
          value={text}
          onChange={handleTextChange}
          placeholder="Enter text or use {{variable}}"
          className="control-textarea"
          style={{
            flex: 1,
            minHeight: '25px',
            resize: 'none',
          }}
        />
        {variables.length > 0 && (
          <div style={{ fontSize: '9px', color: 'var(--text-tertiary)', marginTop: '4px' }}>
            Vars: {variables.join(', ')}
          </div>
        )}
      </div>

      {/* Fixed Output Handle */}
      <Handle
        type="source"
        position={Position.Right}
        id={`${id}-output`}
      />

      {/* Dynamic Variable Input Handles */}
      {variables.map((varName, index) => (
        <Handle
          key={`${varName}-${index}`}
          type="target"
          position={Position.Left}
          id={`${id}-${varName}`}
          style={{
            top: `${50 + (index + 1) * (height / (variables.length + 2))}px`,
          }}
          title={`Variable: ${varName}`}
        />
      ))}
    </div>
  );
  // endregion
};
// endregion
