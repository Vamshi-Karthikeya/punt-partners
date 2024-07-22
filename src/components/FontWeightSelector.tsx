import axios from "axios";
import React, { useState, useEffect } from "react";
import Select from "react-select";

interface FontWeightOption {
  label: string;
  value: string;
}

const FontWeightSelector: React.FC<{
  font: string;
  onWeightChange: (weight: string) => void;
}> = ({ font, onWeightChange }) => {
  const [weights, setWeights] = useState<FontWeightOption[]>([]);
  const [isItalicEnabled, setIsItalicEnabled] = useState(false);

  useEffect(() => {
    if (!font) return;

    axios.get("/fonts.json").then((response) => {
      const fontData = response.data[font.split(":")[0]];
      const weightOptions = Object.keys(fontData)
        .filter((key) => !key.includes("italic"))
        .map((weight) => ({ label: weight, value: weight }));

      setWeights(weightOptions);
      setIsItalicEnabled(
        Object.keys(fontData).some((key) => key.includes("italic"))
      );
    });
  }, [font]);

  return (
    <Select
      options={weights}
      onChange={(option) => onWeightChange(option?.value || "")}
    />
  );
};

export default FontWeightSelector;
