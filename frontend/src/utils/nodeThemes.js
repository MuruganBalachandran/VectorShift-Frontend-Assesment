// region node themes
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
    icon: '📝',
    accentColor: '#5e35b1',
  },
  PROCESS: {
    icon: '⚙️',
    accentColor: '#5e35b1',
  },
  UTILITY: {
    icon: '🔧',
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
  PDF: {
    icon: '📄',
    accentColor: '#5e35b1',
  },
  KNOWLEDGE: {
    icon: '📚',
    accentColor: '#5e35b1',
  },
};
// endregion

// applyTheme now only returns base dimensions, not colors
// All colors are handled by CSS variables in baseNode.css
export const applyTheme = (theme, baseStyles = {}) => ({
  ...baseStyles,
});

// region exports
export const getThemeIcon = (themeName) => NODE_THEMES[themeName]?.icon || '📦';
// endregion
