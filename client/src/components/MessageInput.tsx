import { useState, useRef, KeyboardEvent, memo } from "react";
import { Send, Smile } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { EmojiPicker } from "./EmojiPicker";
import { useToast } from "@/hooks/use-toast";

interface MessageInputProps {
  onSendMessage: (content: string) => void;
  disabled?: boolean;
}

export const MessageInput = memo(function MessageInput({ 
  onSendMessage, 
  disabled 
}: MessageInputProps) {
  const [message, setMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const emojiButtonRef = useRef<HTMLButtonElement>(null);
  const { toast } = useToast();

  const handleSend = () => {
    if (message.trim()) {
      onSendMessage(message);
      setMessage("");
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.ctrlKey && e.key === "Enter") {
      e.preventDefault();
      handleSend();
    } else if (e.ctrlKey && e.key === "e") {
      e.preventDefault();
      setShowEmojiPicker((prev) => !prev);
      toast({
        description: showEmojiPicker 
          ? "絵文字パネルを閉じました" 
          : "絵文字パネルを開きました",
        duration: 2000,
      });
    }
  };

  const handleEmojiSelect = (emoji: string) => {
    const input = inputRef.current;
    if (input) {
      const start = input.selectionStart || 0;
      const end = input.selectionEnd || 0;
      const newMessage = message.slice(0, start) + emoji + message.slice(end);
      setMessage(newMessage);
      
      // Set cursor position after the inserted emoji
      requestAnimationFrame(() => {
        input.selectionStart = input.selectionEnd = start + emoji.length;
        input.focus();
      });
    }
    setShowEmojiPicker(false);
  };

  return (
    <div className="border-t p-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-colors">
      <div className="flex items-center space-x-2 max-w-4xl mx-auto">
        <Input
          ref={inputRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="メッセージを入力してください... (Ctrl+Enter で送信)"
          disabled={disabled}
          className="flex-1 focus-visible:ring-2 transition-shadow"
        />
        <div className="relative">
          <Button
            ref={emojiButtonRef}
            variant="ghost"
            size="icon"
            onClick={() => setShowEmojiPicker((prev) => !prev)}
            disabled={disabled}
            className="hover:bg-muted transition-colors"
            title="絵文字を追加 (Ctrl+E)"
          >
            <Smile className="h-5 w-5 transition-transform hover:scale-110" />
          </Button>
          {showEmojiPicker && (
            <EmojiPicker
              onEmojiSelect={handleEmojiSelect}
              onClose={() => setShowEmojiPicker(false)}
              triggerRef={emojiButtonRef}
            />
          )}
        </div>
        <Button 
          onClick={handleSend} 
          disabled={!message.trim() || disabled}
          className="transition-all duration-200 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send className="h-5 w-5 transition-transform hover:scale-110" />
        </Button>
      </div>
    </div>
  );
});
