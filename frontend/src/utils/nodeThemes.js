// src/nodes/core/nodeThemes.js
/**
 * Centralized styling system for nodes
 * Icons and metadata only - styling handled by CSS variables in baseNode.css
 */

export const NODE_THEMES = {
  INPUT: {
    icon: '📥',
    accentColor: '#5e35b1',
  },
  OUTPUT: {
    icon: '📤',
    accentColor: '#5e35b1',
  },
  LLM: {
    icon: '💬',
    accentColor: '#5e35b1',
  },
  TEXT: {
    icon: '�',
    accentColor: '#5e35b1',
  },
  PROCESS: {
    icon: '⚙️',
    accentColor: '#5e35b1',
  },
  UTILITY: {
    icon: '�',
    accentColor: '#5e35b1',
  },
  AI: {
    icon: '🤖',
    accentColor: '#5e35b1',
  },
  DATA: {
    icon: '💾',
    accentColor: '#5e35b1',
  },
};

// applyTheme now only returns base dimensions, not colors
// All colors are handled by CSS variables in baseNode.css
export const applyTheme = (theme, baseStyles = {}) => ({
  ...baseStyles,
  // Only include non-color styles here
  // backgroundColor, borderColor, border, borderRadius, boxShadow are all in CSS now
});

export const getThemeIcon = (themeName) => NODE_THEMES[themeName]?.icon || '📦';
