import React, { useState, useEffect } from "react";
import Select from "react-select";
import axios from "axios";

interface FontVariantOption {
  label: string;
  value: string;
}

const FontVariantSelector: React.FC<{
  font: string;
  onVariantChange: (variant: string) => void;
}> = ({ font, onVariantChange }) => {
  const [variants, setVariants] = useState<FontVariantOption[]>([]);
  const [weights, setWeights] = useState<FontVariantOption[]>([]);
  const [italicEnabled, setItalicEnabled] = useState<boolean>(false);

  useEffect(() => {
    if (!font) return;

    axios.get("/fonts.json").then((response) => {
      const fontData = response.data[font];
      if (fontData) {
        const allVariants = Object.keys(fontData);
        const weightOptions = allVariants
          .filter((key) => !key.includes("italic"))
          .map((weight) => ({
            label: weight,
            value: weight,
          }));
        const italicOptions = allVariants
          .filter((key) => key.includes("italic"))
          .map((italic) => ({
            label: italic,
            value: italic,
          }));

        setWeights(weightOptions);
        setVariants(weightOptions.concat(italicOptions));
        setItalicEnabled(italicOptions.length > 0);
      }
    });
  }, [font]);

  return (
    <Select
      options={variants}
      onChange={(option) => onVariantChange(option?.value || "")}
      placeholder="Select variant"
    />
  );
};

export default FontVariantSelector;
