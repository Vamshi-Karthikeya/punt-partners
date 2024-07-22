import React from "react";

interface ItalicToggleProps {
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
}

const ItalicToggle: React.FC<ItalicToggleProps> = ({ enabled, onToggle }) => {
  return (
    <label>
      Italic
      <input
        type="checkbox"
        checked={enabled}
        onChange={(e) => onToggle(e.target.checked)}
        style={{ marginLeft: "10px" }}
      />
    </label>
  );
};

export default ItalicToggle;
