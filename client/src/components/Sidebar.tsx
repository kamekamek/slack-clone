import { useState } from "react";
import { Hash, Plus } from "lucide-react";
import { Button } from "./ui/button";
import { CreateChannelModal } from "./CreateChannelModal";
import type { Channel } from "@/lib/types";

interface SidebarProps {
  channels: Channel[];
  selectedChannel: Channel | null;
  onCreateChannel: (name: string) => void;
  onSelectChannel: (channel: Channel) => void;
  isChannelValid: (name: string) => boolean;
}

export function Sidebar({
  channels,
  selectedChannel,
  onCreateChannel,
  onSelectChannel,
  isChannelValid,
}: SidebarProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="w-64 bg-slate-900 p-4 text-white">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Channels</h2>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsModalOpen(true)}
          className="text-white hover:bg-slate-800"
        >
          <Plus className="h-5 w-5" />
        </Button>
      </div>
      <div className="mt-4 space-y-1">
        {channels.map((channel) => (
          <button
            key={channel.id}
            onClick={() => onSelectChannel(channel)}
            className={`flex w-full items-center rounded-md px-2 py-1.5 text-sm transition-colors ${
              selectedChannel?.id === channel.id
                ? "bg-blue-600"
                : "hover:bg-slate-800"
            }`}
          >
            <Hash className="mr-2 h-4 w-4" />
            {channel.name}
          </button>
        ))}
      </div>
      <CreateChannelModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreateChannel={onCreateChannel}
        isChannelValid={isChannelValid}
      />
    </div>
  );
}
