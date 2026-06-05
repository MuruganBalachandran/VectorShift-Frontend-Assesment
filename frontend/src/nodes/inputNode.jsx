// src/nodes/inputNode.jsx
/**
 * Input Node
 * Defines inputs for the pipeline
 * Theme: Input (Blue)
 */

import { createNode, HANDLE_PRESETS } from '../components/node/baseNode';
import { TextInput, SelectControl } from '../components/node/controlComponents';
import { NODE_THEMES, applyTheme } from '../utils/nodeThemes';

const config = {
  title: 'Input',
  description: 'Pipeline input',
  width: 200,
  height: 140,
  handles: HANDLE_PRESETS.SINGLE_OUTPUT,
  styles: applyTheme(NODE_THEMES.INPUT),
  icon: NODE_THEMES.INPUT.icon,
};

const renderContent = ({ id, data, onDataChange }) => {
  const name = data.inputName || id.replace('customInput-', 'input_');
  const inputType = data.inputType || 'Text';

  return (
    <>
      <TextInput
        label="Name"
        value={name}
        onChange={(val) => onDataChange('inputName', val)}
        placeholder="input_1"
      />
      <SelectControl
        label="Type"
        value={inputType}
        onChange={(val) => onDataChange('inputType', val)}
        options={[
          { value: 'Text', label: 'Text' },
          { value: 'File', label: 'File' },
        ]}
      />
    </>
  );
};

export const InputNode = createNode(config, renderContent);
