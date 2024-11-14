import { memo, useEffect, useRef } from "react";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import { Virtuoso } from "react-virtuoso";
import { Hash } from "lucide-react";
import type { Channel, Message } from "@/lib/types";

interface MessageListProps {
  messages: Message[];
  selectedChannel: Channel | null;
}

const MessageItem = memo(({ message, gradient }: { message: Message; gradient: string }) => (
  <div
    className="group flex items-start space-x-3 rounded-md p-2 transition-colors hover:bg-muted/50 animate-in slide-in-from-bottom-2 duration-200"
  >
    <div
      className="h-10 w-10 shrink-0 rounded-full flex items-center justify-center text-white text-sm font-medium shadow-md transition-transform group-hover:scale-105"
      style={{ background: gradient }}
    >
      {message.userName[0].toUpperCase()}
    </div>
    <div className="min-w-0 flex-1">
      <div className="flex items-baseline space-x-2">
        <span className="font-medium">{message.userName}</span>
        <span className="text-xs text-muted-foreground">
          {format(new Date(message.createdAt), "M月d日 HH:mm", { locale: ja })}
        </span>
      </div>
      <p className="mt-1 break-words leading-relaxed text-pretty">{message.content}</p>
    </div>
  </div>
));

MessageItem.displayName = "MessageItem";

const getMessageGradient = (userName: string) => {
  const hash = userName.split("").reduce((acc, char) => {
    return char.charCodeAt(0) + ((acc << 5) - acc);
  }, 0);
  
  const color1 = `hsl(${Math.abs(hash) % 360}, 70%, 50%)`;
  const color2 = `hsl(${(Math.abs(hash) + 40) % 360}, 70%, 50%)`;
  return `linear-gradient(135deg, ${color1}, ${color2})`;
};

export function MessageList({ messages, selectedChannel }: MessageListProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const lastMessageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
          }
        });
      },
      { threshold: 0.5 }
    );

    if (lastMessageRef.current) {
      observer.observe(lastMessageRef.current);
    }

    return () => observer.disconnect();
  }, [messages]);

  if (!selectedChannel) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <p className="text-muted-foreground">チャンネルを選択してください</p>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col">
      <div className="border-b p-4 shadow-sm bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-10">
        <div className="flex items-center">
          <Hash className="mr-2 h-5 w-5" />
          <h2 className="text-lg font-semibold">{selectedChannel.name}</h2>
        </div>
      </div>
      <div className="flex-1">
        <Virtuoso
          data={messages}
          initialTopMostItemIndex={messages.length - 1}
          followOutput="smooth"
          itemContent={(index, message) => (
            <div className="px-4 py-2">
              <MessageItem 
                message={message} 
                gradient={getMessageGradient(message.userName)} 
              />
            </div>
          )}
          style={{ height: "calc(100vh - 160px)" }}
          className="scrollbar-hide"
        />
      </div>
    </div>
  );
}