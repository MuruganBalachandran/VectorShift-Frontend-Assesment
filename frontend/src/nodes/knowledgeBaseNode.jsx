// src/nodes/knowledgeBaseNode.js
/**
 * Knowledge Base Node
 * Stores and retrieves information from a structured knowledge base
 * Supports semantic search and filtering
 * Theme: Data Storage
 */

import { createNode, HANDLE_PRESETS } from '../components/node/baseNode';
import {
  SelectControl,
  SliderControl,
  TagInputControl,
} from '../components/node/controlComponents';
import { NODE_THEMES, applyTheme } from '../utils/nodeThemes';

const config = {
  title: 'Knowledge Base',
  description: 'Query and store structured knowledge',
  width: 240,
  height: 220,
  handles: [
    ...HANDLE_PRESETS.INPUT_OUTPUT,
  ],
  styles: applyTheme(NODE_THEMES.DATA),
  icon: NODE_THEMES.DATA.icon,
};

const renderContent = ({ id, data, onDataChange }) => {
  const operation = data.operation || 'query';
  const searchType = data.searchType || 'semantic';
  const threshold = data.threshold ?? 0.7;
  const tags = data.tags || [];

  return (
    <>
      <SelectControl
        label="Operation"
        value={operation}
        onChange={(val) => onDataChange('operation', val)}
        options={[
          { value: 'query', label: 'Query' },
          { value: 'store', label: 'Store' },
          { value: 'update', label: 'Update' },
        ]}
      />
      {operation === 'query' && (
        <>
          <SelectControl
            label="Search Type"
            value={searchType}
            onChange={(val) => onDataChange('searchType', val)}
            options={[
              { value: 'semantic', label: 'Semantic' },
              { value: 'keyword', label: 'Keyword' },
              { value: 'hybrid', label: 'Hybrid' },
            ]}
          />
          <SliderControl
            label="Relevance Threshold"
            value={Math.round(threshold * 100)}
            onChange={(val) => onDataChange('threshold', val / 100)}
            min={0}
            max={100}
            step={5}
          />
        </>
      )}
      <TagInputControl
        label="Tags/Categories"
        value={tags}
        onChange={(val) => onDataChange('tags', val)}
        placeholder="Add tag..."
      />
    </>
  );
};

export const KnowledgeBaseNode = createNode(config, renderContent);
