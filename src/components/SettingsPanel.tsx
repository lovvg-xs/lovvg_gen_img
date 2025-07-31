import React, { useState } from 'react';
import Button from './Button';

interface SettingsPanelProps {
  onSave: (apiKeys: string[]) => void;
  initialApiKeys: string[];
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({ onSave, initialApiKeys }) => {
  const [keys, setKeys] = useState(initialApiKeys.join('\n'));

  const handleSave = () => {
    const apiKeys = keys
      .split(/[\n, ]+/) // Split by newlines, commas, or spaces
      .map(key => key.trim())
      .filter(key => key.length > 0);
    onSave(apiKeys);
  };

  return (
    <div>
      <label htmlFor="api-keys" className="block mb-2 text-sm text-gray-400">
        API Keys (one per line, or separated by comma/space)
      </label>
      <textarea
        id="api-keys"
        value={keys}
        onChange={(e) => setKeys(e.target.value)}
        className="w-full h-40 p-3 bg-gray-900 border-2 border-gray-600 focus:border-cyan-400 focus:outline-none resize-y selection:bg-cyan-400 selection:text-black"
        placeholder="Enter your Gemini API keys here..."
      />
      <p className="mt-2 text-xs text-gray-500">
        Your keys are saved in your browser's local storage and are not sent anywhere else.
      </p>
      <Button onClick={handleSave} className="w-full mt-4">
        Save Settings
      </Button>
    </div>
  );
};

export default SettingsPanel;