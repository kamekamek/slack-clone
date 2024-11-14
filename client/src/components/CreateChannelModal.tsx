import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

interface CreateChannelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateChannel: (name: string) => void;
  isChannelValid: (name: string) => boolean;
}

export function CreateChannelModal({
  isOpen,
  onClose,
  onCreateChannel,
  isChannelValid,
}: CreateChannelModalProps) {
  const [channelName, setChannelName] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = () => {
    if (!channelName) {
      setError("チャンネル名を入力してください");
      return;
    }

    if (!isChannelValid(channelName)) {
      setError("チャンネル名は2-80文字の日本語で入力してください");
      return;
    }

    onCreateChannel(channelName);
    setChannelName("");
    setError("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>新規チャンネルの作成</DialogTitle>
          <DialogDescription>
            新しいチャンネルの名前を入力してください
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="channel-name">チャンネル名</Label>
            <Input
              id="channel-name"
              value={channelName}
              onChange={(e) => {
                setChannelName(e.target.value);
                setError("");
              }}
              placeholder="例：一般"
              className="focus:ring-2 focus:ring-primary"
            />
            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>
        </div>
        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={onClose}>
            キャンセル
          </Button>
          <Button onClick={handleSubmit}>作成</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
