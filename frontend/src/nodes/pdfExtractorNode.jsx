// region imports
// components
import { createNode, HANDLE_PRESETS } from '../components/node/baseNode';
import {
  TextInput,
  SelectControl,
  CheckboxControl,
} from '../components/node/controlComponents';
// utils
import { NODE_THEMES, applyTheme } from '../utils/nodeThemes';
// endregion

// config
const config = {
  title: 'PDF Extractor',
  description: 'Extract text, metadata, and images from PDFs',
  width: 240,
  height: 200,
  handles: [
    ...HANDLE_PRESETS.SINGLE_OUTPUT,
  ],
  styles: applyTheme(NODE_THEMES.PDF),
  icon: NODE_THEMES.PDF.icon,
};

// region render content
const renderContent = ({ id, data, onDataChange }) => {
  const mode = data.extractionMode || 'text';
  const pages = data.pages || 'all';
  const includeImages = data.includeImages ?? true;
  const includeMetadata = data.includeMetadata ?? true;

  // region UI
  return (
    <>
      <SelectControl
        label="Extraction Mode"
        value={mode}
        onChange={(val) => onDataChange('extractionMode', val)}
        options={[
          { value: 'text', label: 'Text Only' },
          { value: 'images', label: 'Images Only' },
          { value: 'all', label: 'Text + Images' },
        ]}
      />
      <TextInput
        label="Pages (e.g., 1-5 or all)"
        value={pages}
        onChange={(val) => onDataChange('pages', val)}
        placeholder="all"
      />
      <CheckboxControl
        label="Include Metadata"
        value={includeMetadata}
        onChange={(val) => onDataChange('includeMetadata', val)}
      />
      <CheckboxControl
        label="Include Images"
        value={includeImages}
        onChange={(val) => onDataChange('includeImages', val)}
      />
    </>
  );
  // endregion
};
// endregion

// region exports
export const PDFExtractorNode = createNode(config, renderContent);
// endregion
