// controlComponents.jsx
/**
 * Reusable control components for node content
 * Provides consistent UI patterns across all node types
 */

// region imports
// hooks
import { useState } from 'react';
// styles
import '../../styles/controlComponents.css';
// endregion

// region Text Input Control
export const TextInput = ({
  label,
  value,
  onChange,
  placeholder = '',
  type = 'text',
}) => (
  <div className="control-wrapper">
    <label className="control-label">{label}</label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="control-input"
    />
  </div>
);
// endregion

// region Select/Dropdown Control
export const SelectControl = ({
  label,
  value,
  onChange,
  options = [],
}) => (
  <div className="control-wrapper">
    <label className="control-label">{label}</label>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="control-select"
    >
      {options.map(opt => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  </div>
);
// endregion

// region Textarea Control
export const TextareaControl = ({
  label,
  value,
  onChange,
  placeholder = '',
  rows = 3,
}) => (
  <div className="control-wrapper">
    <label className="control-label">{label}</label>
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      className="control-textarea"
    />
  </div>
);
// endregion

// region Checkbox Control
export const CheckboxControl = ({
  label,
  value,
  onChange,
}) => (
  <div className="control-checkbox-wrapper">
    <label className="control-checkbox-label">
      <input
        type="checkbox"
        checked={value}
        onChange={(e) => onChange(e.target.checked)}
      />
      {label}
    </label>
  </div>
);

// region Toggle Control
export const ToggleControl = ({
  label,
  value,
  onChange,
}) => (
  <div className="control-toggle-wrapper">
    <label className="control-toggle-label">{label}</label>
    <button
      onClick={() => onChange(!value)}
      className={`control-toggle-button ${value ? 'on' : 'off'}`}
    >
      {value ? 'ON' : 'OFF'}
    </button>
  </div>
);
// endregion

// region Multi-Select Control
export const MultiSelectControl = ({
  label,
  value = [],
  onChange,
  options = [],
}) => (
  <div className="control-multiselect-wrapper">
    <label className="control-label">{label}</label>
    <div className="control-multiselect-options">
      {options.map(opt => (
        <label key={opt.value} className="control-multiselect-option">
          <input
            type="checkbox"
            checked={value.includes(opt.value)}
            onChange={(e) => {
              if (e.target.checked) {
                onChange([...value, opt.value]);
              } else {
                onChange(value.filter(v => v !== opt.value));
              }
            }}
          />
          {opt.label}
        </label>
      ))}
    </div>
  </div>
);

/**
 * Color Picker Control
 */
export const ColorPickerControl = ({
  label,
  value,
  onChange,
}) => (
  <div className="control-wrapper">
    <label className="control-label">{label}</label>
    <input
      type="color"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="control-color"
    />
  </div>
);

// region Slider Control
export const SliderControl = ({
  label,
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
}) => (
  <div className="control-slider-wrapper">
    <label className="control-slider-label">
      <span>{label}</span>
      <span className="control-slider-value">{value}</span>
    </label>
    <input
      type="range"
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      min={min}
      max={max}
      step={step}
      className="control-slider"
    />
  </div>
);
// endregion

// region Tag Input Control
export const TagInputControl = ({
  label,
  value = [],
  onChange,
  placeholder = 'Add tag and press Enter',
}) => {
  const [input, setInput] = useState('');

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && input.trim()) {
      onChange([...value, input.trim()]);
      setInput('');
    }
  };

  const removeTag = (index) => {
    onChange(value.filter((_, i) => i !== index));
  };

  return (
    <div className="control-tags-wrapper">
      <label className="control-label">{label}</label>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="control-tags-input"
      />
      <div className="control-tags-list">
        {value.map((tag, idx) => (
          <span key={idx} className="control-tag">
            {tag}
            <button
              onClick={() => removeTag(idx)}
              className="control-tag-remove"
            >
              ✕
            </button>
          </span>
        ))}
      </div>
    </div>
  );
};
// endregion
