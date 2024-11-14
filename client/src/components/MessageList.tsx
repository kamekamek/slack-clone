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
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  if (!selectedChannel) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <p className="text-muted-foreground">Select a channel to start chatting</p>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col">
      <div className="border-b p-4">
        <div className="flex items-center">
          <Hash className="mr-2 h-5 w-5" />
          <h2 className="text-lg font-semibold">{selectedChannel.name}</h2>
        </div>
      </div>
      <ScrollArea ref={scrollRef} className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className="group flex items-start space-x-3 hover:bg-slate-50 p-2 rounded-md"
            >
              <div
                className="h-8 w-8 rounded-full flex items-center justify-center text-white"
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
              <div>
                <div className="flex items-baseline space-x-2">
                  <span className="font-medium">{message.userName}</span>
                  <span className="text-xs text-muted-foreground">
                    {format(new Date(message.createdAt), "p")}
                  </span>
                </div>
                <p className="mt-1">{message.content}</p>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
