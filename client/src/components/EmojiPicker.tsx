import { useEffect, useRef } from "react";
import { useFloating, offset, flip, shift, autoUpdate } from "@floating-ui/react";
import data from "@emoji-mart/data/sets/14/native.json";
import Picker from "@emoji-mart/react";

interface EmojiPickerProps {
  onEmojiSelect: (emoji: string) => void;
  onClose: () => void;
  triggerRef: React.RefObject<HTMLElement>;
}

export function EmojiPicker({ onEmojiSelect, onClose, triggerRef }: EmojiPickerProps) {
  const ref = useRef<HTMLDivElement>(null);
  
  const { x, y, strategy, refs } = useFloating({
    elements: {
      reference: triggerRef.current,
    },
    middleware: [
      offset(8),
      flip({
        fallbackAxisSideDirection: "start",
      }),
      shift(),
    ],
    whileElementsMounted: autoUpdate,
  });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        ref.current &&
        !ref.current.contains(event.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
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
  }, [onClose, triggerRef]);

  return (
    <div
      ref={ref}
      className="fixed z-50 animate-in zoom-in-95 fade-in duration-200"
      style={{
        position: strategy,
        top: y ?? 0,
        left: x ?? 0,
        width: "352px",
      }}
    >
      <div className="rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
        <Picker
          ref={refs.setFloating}
          data={data}
          onEmojiSelect={(emoji: any) => onEmojiSelect(emoji.native)}
          locale="ja"
          theme="light"
          skinTonePosition="none"
          previewPosition="none"
          categories={[
            "frequent",
            "people",
            "nature",
            "foods",
            "activity",
            "places",
            "objects",
            "symbols",
          ]}
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
    </div>
  );
}
