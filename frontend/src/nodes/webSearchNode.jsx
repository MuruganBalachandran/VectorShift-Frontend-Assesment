// src/nodes/webSearchNode.js
/**
 * Web Search Node
 * Performs web searches and returns ranked results
 * Supports multiple search engines and filtering
 * Theme: AI/Process
 */

import { createNode, HANDLE_PRESETS } from '../components/node/baseNode';
import {
  SelectControl,
  CheckboxControl,
  SliderControl,
} from '../components/node/controlComponents';
import { NODE_THEMES, applyTheme } from '../utils/nodeThemes';

const config = {
  title: 'Web Search',
  description: 'Search the web for information',
  width: 220,
  height: 180,
  handles: [
    ...HANDLE_PRESETS.INPUT_OUTPUT,
  ],
  styles: applyTheme(NODE_THEMES.AI),
  icon: NODE_THEMES.AI.icon,
};

const renderContent = ({ id, data, onDataChange }) => {
  const engine = data.engine || 'google';
  const resultCount = data.resultCount ?? 10;
  const includeSnippets = data.includeSnippets ?? true;
  const safeSearch = data.safeSearch ?? true;

  return (
    <>
      <SelectControl
        label="Search Engine"
        value={engine}
        onChange={(val) => onDataChange('engine', val)}
        options={[
          { value: 'google', label: 'Google' },
          { value: 'bing', label: 'Bing' },
          { value: 'duckduckgo', label: 'DuckDuckGo' },
          { value: 'scholar', label: 'Google Scholar' },
        ]}
      />
      <SliderControl
        label="Results to Return"
        value={resultCount}
        onChange={(val) => onDataChange('resultCount', val)}
        min={1}
        max={50}
        step={1}
      />
      <CheckboxControl
        label="Include Snippets"
        value={includeSnippets}
        onChange={(val) => onDataChange('includeSnippets', val)}
      />
      <CheckboxControl
        label="Safe Search"
        value={safeSearch}
        onChange={(val) => onDataChange('safeSearch', val)}
      />
    </>
  );
};

export const WebSearchNode = createNode(config, renderContent);
