
import { Handle, Position } from 'reactflow';
import { useState, useCallback, useMemo } from 'react';
import '../../styles/baseNode.css';

export const createNode = (config, renderContent) => {
  const {
    title,
    description = '',
    width = 200,
    height = 80,
    handles = [],
    customClass = '',
    styles = {},
    icon = null,
  } = config;

  const defaultStyles = {
    width,
    height,
    ...styles,
  };

  return ({ id, data = {} }) => {
    const [nodeData, setNodeData] = useState(data);

    const handleDataChange = useCallback((key, value) => {
      setNodeData(prev => ({ ...prev, [key]: value }));
    }, []);

    const renderHandles = useMemo(() => {
      return handles.map(handle => (
        <Handle
          key={handle.id}
          id={`${id}-${handle.id}`}
          type={handle.type}
          position={
            handle.position === 'left' ? Position.Left :
            handle.position === 'right' ? Position.Right :
            handle.position === 'top' ? Position.Top :
            Position.Bottom
          }
          style={handle.style || {}}
        />
      ));
    }, [handles, id]);

    return (
      <div style={defaultStyles} className={`base-node ${customClass}`}>
        {/* Header Section */}
        <div className="base-node-header">
          {icon && <span className="base-node-icon">{icon}</span>}
          <span>{title}</span>
        </div>

        {/* Content Area */}
        <div className="base-node-content">
          {renderContent({ id, data: nodeData, onDataChange: handleDataChange })}
        </div>

        {/* Handles */}
        {renderHandles}
      </div>
    );
  };
};

/**
 * Utility: Create handle configuration
 */
export const createHandle = (
  id,
  type = 'source',
  position = 'right',
  label = '',
  style = {}
) => ({
  id,
  type,
  position,
  label,
  style,
});

/**
 * Utility: Common handle configurations
 */
export const HANDLE_PRESETS = {
  SINGLE_INPUT: [createHandle('input', 'target', 'left')],
  SINGLE_OUTPUT: [createHandle('output', 'source', 'right')],
  INPUT_OUTPUT: [
    createHandle('input', 'target', 'left'),
    createHandle('output', 'source', 'right'),
  ],
  DUAL_INPUT: [
    createHandle('input1', 'target', 'left', '', { top: '33%' }),
    createHandle('input2', 'target', 'left', '', { top: '66%' }),
  ],
  TRIPLE_INPUT: [
    createHandle('input1', 'target', 'left', '', { top: '25%' }),
    createHandle('input2', 'target', 'left', '', { top: '50%' }),
    createHandle('input3', 'target', 'left', '', { top: '75%' }),
  ],
};
