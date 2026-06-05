// region imports
// components
import { createNode, HANDLE_PRESETS } from '../components/node/baseNode';
import {
  TextareaControl,
  TagInputControl,
} from '../components/node/controlComponents';
// utils
import { NODE_THEMES, applyTheme } from '../utils/nodeThemes';
// endregion

// config
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

// region render content
const renderContent = ({ id, data, onDataChange }) => {
  const template = data.template || 'Please respond to: {{query}}';
  const variables = data.variables || ['query'];

  // region UI
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
  // endregion
};
// endregion

// region exports
export const PromptTemplateNode = createNode(config, renderContent);
// endregion
