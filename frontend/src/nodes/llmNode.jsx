// src/nodes/llmNode.jsx
/**
 * LLM Node
 * Large Language Model processing with model selection
 * Theme: LLM (Purple)
 */

import { createNode, HANDLE_PRESETS } from '../components/node/baseNode';
import { SelectControl } from '../components/node/controlComponents';
import { NODE_THEMES, applyTheme } from '../utils/nodeThemes';

const config = {
  title: 'LLM',
  description: 'Large Language Model',
  width: 200,
  height: 140,
  handles: [
    ...HANDLE_PRESETS.DUAL_INPUT,
    ...HANDLE_PRESETS.SINGLE_OUTPUT,
  ],
  styles: applyTheme(NODE_THEMES.LLM),
  icon: NODE_THEMES.LLM.icon,
};

const renderContent = ({ id, data, onDataChange }) => {
  const model = data.model || 'GPT-4';

  return (
    <>
      <SelectControl
        label="Model"
        value={model}
        onChange={(val) => onDataChange('model', val)}
        options={[
          { value: 'GPT-4', label: 'GPT-4' },
          { value: 'GPT-3.5', label: 'GPT-3.5 Turbo' },
          { value: 'Gemini-Pro', label: 'Gemini Pro' },
          { value: 'Gemini-Ultra', label: 'Gemini Ultra' },
          { value: 'Claude-3', label: 'Claude 3' },
          { value: 'Claude-2', label: 'Claude 2' },
        ]}
      />
      <div style={{ fontSize: '10px', color: '#999', marginTop: '4px' }}>
        Connect system & prompt inputs
      </div>
    </>
  );
};

export const LLMNode = createNode(config, renderContent);
