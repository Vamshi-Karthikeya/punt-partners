import React, { useState, useEffect } from "react";
import fontsData from "../fonts.json"; // Ensure this path is correct

interface FontData {
  [fontFamily: string]: {
    [weight: string]: string;
  };
}

interface FontSelectorProps {
  onFontChange: (font: string) => void;
  onWeightChange: (weight: string) => void;
}

const FontSelector: React.FC<FontSelectorProps> = ({
  onFontChange,
  onWeightChange,
}) => {
  const [fonts, setFonts] = useState<FontData>(fontsData);
  const [selectedFont, setSelectedFont] = useState<string>("");
  const [selectedWeight, setSelectedWeight] = useState<string>("");
  const [weights, setWeights] = useState<string[]>([]);

  useEffect(() => {
    if (selectedFont) {
      setWeights(Object.keys(fonts[selectedFont] || {}));
      setSelectedWeight(""); // Reset weight selection
      onWeightChange(""); // Notify weight change
    }
  }, [selectedFont]);

  const handleFontChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const font = event.target.value;
    setSelectedFont(font);
    onFontChange(font);
  };

  const handleWeightChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const weight = event.target.value;
    setSelectedWeight(weight);
    onWeightChange(weight);
  };

  return (
    <div className="font-selector">
      <div className="selector-group">
        <label htmlFor="font">Font:</label>
        <select id="font" value={selectedFont} onChange={handleFontChange}>
          <option value="">Select a font</option>
          {Object.keys(fonts).map((font) => (
            <option key={font} value={font}>
              {font}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default FontSelector;
