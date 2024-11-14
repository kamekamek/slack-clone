import { useSlackClone } from "@/hooks/useSlackClone";
import { Sidebar } from "@/components/Sidebar";
import { MessageList } from "@/components/MessageList";
import { MessageInput } from "@/components/MessageInput";

export default function App() {
  const {
    channels,
    messages,
    selectedChannel,
    createChannel,
    selectChannel,
    sendMessage,
    isChannelValid,
  } = useSlackClone();

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      <Sidebar
        channels={channels}
        selectedChannel={selectedChannel}
        onCreateChannel={createChannel}
        onSelectChannel={selectChannel}
        isChannelValid={isChannelValid}
      />
      <div className="flex flex-1 flex-col">
        <MessageList
          messages={messages}
          selectedChannel={selectedChannel}
        />
        <MessageInput
          onSendMessage={sendMessage}
          disabled={!selectedChannel}
        />
      </div>
    </div>
  );
}
