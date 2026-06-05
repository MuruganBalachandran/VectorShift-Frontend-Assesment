// region imports
// components
import { createNode, HANDLE_PRESETS } from '../components/node/baseNode';
import { TextInput, SelectControl } from '../components/node/controlComponents';
// utils
import { NODE_THEMES, applyTheme } from '../utils/nodeThemes';
// endregion

// config
const config = {
  title: 'Input',
  description: 'Pipeline input',
  width: 200,
  height: 140,
  handles: HANDLE_PRESETS.SINGLE_OUTPUT,
  styles: applyTheme(NODE_THEMES.INPUT),
  icon: NODE_THEMES.INPUT.icon,
};

// region render content
const renderContent = ({ id, data, onDataChange }) => {
  const name = data.inputName || id.replace('customInput-', 'input_');
  const inputType = data.inputType || 'Text';

  // region UI
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
  // endregion
};
// endregion

// region exports
export const InputNode = createNode(config, renderContent);
// endregion
