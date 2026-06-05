// region imports
// components
import { createNode, HANDLE_PRESETS } from '../components/node/baseNode';
import { TextInput, SelectControl } from '../components/node/controlComponents';
// utils
import { NODE_THEMES, applyTheme } from '../utils/nodeThemes';
// endregion

// config
const config = {
  title: 'Output',
  description: 'Pipeline output',
  width: 200,
  height: 140,
  handles: HANDLE_PRESETS.SINGLE_INPUT,
  styles: applyTheme(NODE_THEMES.OUTPUT),
  icon: NODE_THEMES.OUTPUT.icon,
};

// region render content
const renderContent = ({ id, data, onDataChange }) => {
  const name = data.outputName || id.replace('customOutput-', 'output_');
  const outputType = data.outputType || 'Text';

  // region UI
  return (
    <>
      <TextInput
        label="Name"
        value={name}
        onChange={(val) => onDataChange('outputName', val)}
        placeholder="output_1"
      />
      <SelectControl
        label="Type"
        value={outputType}
        onChange={(val) => onDataChange('outputType', val)}
        options={[
          { value: 'Text', label: 'Text' },
          { value: 'Image', label: 'Image' },
        ]}
      />
    </>
  );
  // endregion
};
// endregion

// region exports
export const OutputNode = createNode(config, renderContent);
// endregion
