import { useEffect, useRef } from "react";
import data from "@emoji-mart/data/sets/14/native.json";
import Picker from "@emoji-mart/react";

interface EmojiPickerProps {
  onEmojiSelect: (emoji: string) => void;
  onClose: () => void;
}

export function EmojiPicker({ onEmojiSelect, onClose }: EmojiPickerProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        onClose();
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [onClose]);

  return (
    <div
      ref={ref}
      className="absolute bottom-full right-0 mb-2 z-50 rounded-lg shadow-lg animate-in fade-in slide-in-from-bottom-2"
      style={{ width: "352px" }}
    >
      <Picker
        data={data}
        onEmojiSelect={(emoji: any) => onEmojiSelect(emoji.native)}
        locale="ja"
        theme="light"
        skinTonePosition="none"
        previewPosition="none"
        categories={["frequent", "people", "nature", "foods", "activity", "places", "objects", "symbols"]}
        categoryIcons={{
          frequent: "🕒",
          people: "😊",
          nature: "🌲",
          foods: "🍔",
          activity: "⚽",
          places: "✈️",
          objects: "💡",
          symbols: "💭",
        }}
      />
    </div>
  );
}
