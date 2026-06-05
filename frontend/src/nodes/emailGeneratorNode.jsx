// region imports
// components
import { createNode, HANDLE_PRESETS } from '../components/node/baseNode';
import {
  TextInput,
  SelectControl,
  CheckboxControl,
  TagInputControl,
} from '../components/node/controlComponents';
// utils
import { NODE_THEMES, applyTheme } from '../utils/nodeThemes';
// endregion

// config
const config = {
  title: 'Email Generator',
  description: 'Generate personalized emails from templates',
  width: 240,
  height: 220,
  handles: [
    ...HANDLE_PRESETS.INPUT_OUTPUT,
  ],
  styles: applyTheme(NODE_THEMES.OUTPUT),
  icon: NODE_THEMES.OUTPUT.icon,
};

// region render content
const renderContent = ({ id, data, onDataChange }) => {
  const emailType = data.emailType || 'marketing';
  const tone = data.tone || 'professional';
  const includeSignature = data.includeSignature ?? true;
  const trackingEnabled = data.trackingEnabled ?? false;
  const recipientFields = data.recipientFields || [];

  // region UI
  return (
    <>
    {/* select email type */}
      <SelectControl
        label="Email Type"
        value={emailType}
        onChange={(val) => onDataChange('emailType', val)}
        options={[
          { value: 'marketing', label: 'Marketing' },
          { value: 'transactional', label: 'Transactional' },
          { value: 'newsletter', label: 'Newsletter' },
          { value: 'followup', label: 'Follow-up' },
          { value: 'notification', label: 'Notification' },
        ]}
      />

      {/* select type */}
      <SelectControl
        label="Tone"
        value={tone}
        onChange={(val) => onDataChange('tone', val)}
        options={[
          { value: 'professional', label: 'Professional' },
          { value: 'casual', label: 'Casual' },
          { value: 'friendly', label: 'Friendly' },
          { value: 'urgent', label: 'Urgent' },
        ]}
      />
      {/* checkboxes */}
      <CheckboxControl
        label="Include Signature"
        value={includeSignature}
        onChange={(val) => onDataChange('includeSignature', val)}
      />
      <CheckboxControl
        label="Enable Tracking"
        value={trackingEnabled}
        onChange={(val) => onDataChange('trackingEnabled', val)}
      />
      <TagInputControl
        label="Recipient Fields to Map"
        value={recipientFields}
        onChange={(val) => onDataChange('recipientFields', val)}
        placeholder="e.g., email, name, company"
      />
    </>
  );
  // endregion
};
// endregion

// region exports
export const EmailGeneratorNode = createNode(config, renderContent);
// endregion
