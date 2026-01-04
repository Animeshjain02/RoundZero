"use client";

import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import {
  Camera,
  CameraOff,
  Hand,
  MessageSquare,
  Mic,
  MicOff,
  Pause,
  Play,
  Settings,
  SkipForward,
  Volume2,
} from "lucide-react";
import { useState } from "react";

interface ControlBarProps {
  onToggleChat?: () => void;
  isChatOpen?: boolean;
}

export function ControlBar({ onToggleChat, isChatOpen }: ControlBarProps) {
  const [isPaused, setIsPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isHandRaised, setIsHandRaised] = useState(false);
  const [volume, setVolume] = useState([80]);

  return (
    <div className="flex items-center justify-center gap-2 p-4 bg-background/80 backdrop-blur-md border-t">
      <TooltipProvider delayDuration={0}>
        <div className="flex items-center gap-2 bg-muted/50 rounded-full p-1.5">
          {/* Raise Hand */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "h-10 w-10 rounded-full",
                  isHandRaised && "bg-yellow-500/20 text-yellow-600 hover:bg-yellow-500/30"
                )}
                onClick={() => setIsHandRaised(!isHandRaised)}
              >
                <Hand className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>{isHandRaised ? "Lower hand" : "Raise hand"}</TooltipContent>
          </Tooltip>

          {/* Mic */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "h-10 w-10 rounded-full",
                  !isMuted && "bg-primary/10 text-primary hover:bg-primary/20"
                )}
                onClick={() => setIsMuted(!isMuted)}
              >
                {isMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
              </Button>
            </TooltipTrigger>
            <TooltipContent>{isMuted ? "Unmute" : "Mute"}</TooltipContent>
          </Tooltip>

          {/* Main Play/Pause */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                className="h-12 w-12 rounded-full bg-primary hover:bg-primary/90"
                onClick={() => setIsPaused(!isPaused)}
              >
                {isPaused ? <Play className="h-5 w-5" /> : <Pause className="h-5 w-5" />}
              </Button>
            </TooltipTrigger>
            <TooltipContent>{isPaused ? "Resume" : "Pause"}</TooltipContent>
          </Tooltip>

          {/* Camera */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "h-10 w-10 rounded-full",
                  isVideoOn && "bg-primary/10 text-primary hover:bg-primary/20"
                )}
                onClick={() => setIsVideoOn(!isVideoOn)}
              >
                {isVideoOn ? <Camera className="h-5 w-5" /> : <CameraOff className="h-5 w-5" />}
              </Button>
            </TooltipTrigger>
            <TooltipContent>{isVideoOn ? "Turn off camera" : "Turn on camera"}</TooltipContent>
          </Tooltip>

          {/* Skip */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full">
                <SkipForward className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Skip question</TooltipContent>
          </Tooltip>
        </div>

        {/* Volume */}
        <div className="flex items-center gap-2 bg-muted/50 rounded-full px-3 py-2 ml-2">
          <Volume2 className="h-4 w-4 text-muted-foreground" />
          <Slider
            value={volume}
            onValueChange={setVolume}
            max={100}
            step={1}
            className="w-20"
          />
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-1 ml-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "h-10 w-10 rounded-full",
                  isChatOpen && "bg-primary/10 text-primary"
                )}
                onClick={onToggleChat}
              >
                <MessageSquare className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Toggle chat</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full">
                <Settings className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Settings</TooltipContent>
          </Tooltip>
        </div>
      </TooltipProvider>
    </div>
  );
}
