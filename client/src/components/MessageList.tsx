import { useEffect, useRef } from "react";
import { format } from "date-fns";
import { ScrollArea } from "./ui/scroll-area";
import { Hash } from "lucide-react";
import type { Channel, Message } from "@/lib/types";

interface MessageListProps {
  messages: Message[];
  selectedChannel: Channel | null;
}

export function MessageList({ messages, selectedChannel }: MessageListProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      const shouldScroll =
        scrollRef.current.scrollHeight -
          scrollRef.current.scrollTop -
          scrollRef.current.clientHeight <
        100;
      if (shouldScroll) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }
    }
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
      <div className="border-b p-4 shadow-sm">
        <div className="flex items-center">
          <Hash className="mr-2 h-5 w-5" />
          <h2 className="text-lg font-semibold">{selectedChannel.name}</h2>
        </div>
      </div>
      <ScrollArea ref={scrollRef} className="flex-1">
        <div className="space-y-4 p-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className="group flex items-start space-x-3 rounded-md p-2 transition-colors hover:bg-slate-50"
            >
              <div
                className="h-8 w-8 shrink-0 rounded-full flex items-center justify-center text-white"
                style={{
                  background: `linear-gradient(135deg, #${Math.floor(
                    Math.random() * 16777215
                  ).toString(16)}, #${Math.floor(Math.random() * 16777215).toString(
                    16
                  )})`,
                }}
              >
                {message.userName[0].toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline space-x-2">
                  <span className="font-medium">{message.userName}</span>
                  <span className="text-xs text-muted-foreground">
                    {format(new Date(message.createdAt), "p")}
                  </span>
                </div>
                <p className="mt-1 break-words">{message.content}</p>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
