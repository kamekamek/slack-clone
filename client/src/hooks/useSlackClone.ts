import useSWR, { mutate } from "swr";
import { useState } from "react";
import type { Channel, Message } from "@/lib/types";

export function useSlackClone() {
  const { data: channels = [] } = useSWR<Channel[]>("/api/channels");
  const { data: messages = [] } = useSWR<Message[]>("/api/messages");
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);

  const isChannelValid = (name: string) => {
    const japaneseRegex = /^[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]{2,80}$/;
    return (
      japaneseRegex.test(name) &&
      !channels.some((c) => c.name.toLowerCase() === name.toLowerCase())
    );
  };

  const createChannel = async (name: string) => {
    if (!isChannelValid(name)) return;

    const response = await fetch("/api/channels", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });

    if (response.ok) {
      mutate("/api/channels");
    }
  };

  const sendMessage = async (content: string) => {
    if (!selectedChannel) return;

    const response = await fetch("/api/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        channelId: selectedChannel.id,
        content,
        userName: "User", // In a real app, this would come from auth
      }),
    });

    if (response.ok) {
      mutate("/api/messages");
    }
  };

  const filteredMessages = messages.filter(
    (m) => m.channelId === selectedChannel?.id
  );

  return {
    channels,
    messages: filteredMessages,
    selectedChannel,
    createChannel,
    selectChannel: setSelectedChannel,
    sendMessage,
    isChannelValid,
  };
}
