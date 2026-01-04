"use client";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import { ChatMessage, type Message } from "./chat-message";

interface ChatSidebarProps {
  messages: Message[];
  isOpen: boolean;
  onClose: () => void;
}

export function ChatSidebar({ messages, isOpen, onClose }: ChatSidebarProps) {
  return (
    <div
      className={cn(
        "fixed right-0 top-0 h-full w-96 bg-background border-l shadow-xl z-50 transition-transform duration-300 ease-out",
        isOpen ? "translate-x-0" : "translate-x-full"
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b">
        <div>
          <h3 className="font-semibold">Conversation</h3>
          <p className="text-xs text-muted-foreground">{messages.length} messages</p>
        </div>
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Messages */}
      <ScrollArea className="h-[calc(100%-60px)] p-4">
        <div className="flex flex-col gap-4">
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
