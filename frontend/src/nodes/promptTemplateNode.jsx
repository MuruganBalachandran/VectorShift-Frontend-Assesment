// src/nodes/promptTemplateNode.js
/**
 * Prompt Template Node
 * Manages reusable AI prompts with variable substitution
 * Theme: AI/Utility
 */

import { createNode, HANDLE_PRESETS } from '../components/node/baseNode';
import {
  TextareaControl,
  TagInputControl,
} from '../components/node/controlComponents';
import { NODE_THEMES, applyTheme } from '../utils/nodeThemes';

const config = {
  title: 'Prompt Template',
  description: 'AI prompt with variables',
  width: 220,
  height: 160,
  handles: [
    ...HANDLE_PRESETS.INPUT_OUTPUT,
  ],
  styles: applyTheme(NODE_THEMES.AI),
  icon: NODE_THEMES.AI.icon,
};

const renderContent = ({ id, data, onDataChange }) => {
  const template = data.template || 'Please respond to: {{query}}';
  const variables = data.variables || ['query'];

  return (
    <>
      <TextareaControl
        label="Template (use {{variable}})"
        value={template}
        onChange={(val) => onDataChange('template', val)}
        rows={2}
        placeholder="Enter your prompt template..."
      />
      <TagInputControl
        label="Variables"
        value={variables}
        onChange={(val) => onDataChange('variables', val)}
        placeholder="Add variable name..."
      />
    </>
  );
};

export const PromptTemplateNode = createNode(config, renderContent);
