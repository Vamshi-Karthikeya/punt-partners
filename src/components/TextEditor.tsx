import React, { useState, useEffect, useRef } from "react";
import FontSelector from "./FontSelector";
import fontsData from "../fonts.json"; // Ensure this path is correct
import "./TextEditor.css";

interface FontData {
  [fontFamily: string]: {
    [weight: string]: string;
  };
}

const TextEditor: React.FC = () => {
  const [font, setFont] = useState<string>("");
  const [weight, setWeight] = useState<string>("");
  const [italic, setItalic] = useState<boolean>(false);
  const [text, setText] = useState<string>("");
  const [availableWeights, setAvailableWeights] = useState<string[]>([]);
  const [isDirty, setIsDirty] = useState<boolean>(false); // Track if changes are made
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Load saved settings from localStorage
  useEffect(() => {
    const savedFont = localStorage.getItem("font");
    const savedWeight = localStorage.getItem("weight");
    const savedItalic = localStorage.getItem("italic") === "true";
    const savedText = localStorage.getItem("text") || "";

    if (savedFont && savedWeight) {
      setFont(savedFont);
      setWeight(savedWeight);
      setItalic(savedItalic);
      setText(savedText);
    }
  }, []);

  // Update available weights when font changes
  useEffect(() => {
    if (font) {
      const fontData = fontsData as FontData;
      const weights = Object.keys(fontData[font] || {});
      setAvailableWeights(weights);

      // Reset weight if not available
      if (!weights.includes(weight)) {
        setWeight("");
      }
    }
  }, [font]);

  // Update isDirty state whenever any settings change
  useEffect(() => {
    const savedFont = localStorage.getItem("font");
    const savedWeight = localStorage.getItem("weight");
    const savedItalic = localStorage.getItem("italic") === "true";
    const savedText = localStorage.getItem("text") || "";

    setIsDirty(
      font !== savedFont ||
        weight !== savedWeight ||
        italic !== savedItalic ||
        text !== savedText
    );
  }, [font, weight, italic, text]);

  useEffect(() => {
    if (font && weight) {
      const fontData = fontsData as FontData;
      const fontUrl = fontData[font]?.[weight];
      if (fontUrl) {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = fontUrl;
        document.head.appendChild(link);

        // Cleanup on component unmount
        return () => {
          document.head.removeChild(link);
        };
      }
    }
  }, [font, weight]);

  // Save settings to localStorage
  const saveSettings = () => {
    localStorage.setItem("font", font);
    localStorage.setItem("weight", weight);
    localStorage.setItem("italic", String(italic));
    localStorage.setItem("text", text);
    setIsDirty(false); // Reset dirty state after saving
  };

  // Reset settings to default and clear text area
  const resetSettings = () => {
    setFont("");
    setWeight("");
    setItalic(false);
    setText("");

    if (textareaRef.current) {
      textareaRef.current.value = ""; // Clear the textarea
    }

    // Remove saved settings from localStorage
    localStorage.removeItem("font");
    localStorage.removeItem("weight");
    localStorage.removeItem("italic");
    localStorage.removeItem("text");
    setIsDirty(true); // Mark as dirty to enable save button
  };

  return (
    <div className="text-editor-container">
      <div className="controls-container">
        <FontSelector onFontChange={setFont} onWeightChange={setWeight} />
        <div className="font-weight-container">
          Variant:
          <select
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            className="font-weight-selector"
          >
            <option value="">Select weight</option>
            {availableWeights.map((weightOption) => (
              <option key={weightOption} value={weightOption}>
                {weightOption}
              </option>
            ))}
          </select>
          <div className="italic-toggle-container">
            <label className="switch">
              <input
                type="checkbox"
                checked={italic}
                onChange={() => setItalic(!italic)}
              />
              <span className="slider round"></span>
            </label>
            <span className="italic-label">
              {italic ? "Italic On" : "Italic Off"}
            </span>
          </div>
        </div>
      </div>
      <textarea
        ref={textareaRef}
        placeholder="Hello World"
        value={text}
        onChange={(e) => setText(e.target.value)}
        style={{
          fontFamily: font,
          fontWeight: weight || "normal",
          fontStyle: italic ? "italic" : "normal",
        }}
      />
      <div className="buttons-container">
        <button
          onClick={saveSettings}
          className="save-button"
          disabled={!isDirty} // Disable button if no changes
        >
          Save
        </button>
        <button onClick={resetSettings} className="reset-button">
          Reset
        </button>
      </div>
    </div>
  );
};

export default TextEditor;
