"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
} from "@/components/ui/drawer";
import { ChatInterface } from "./chat-interface";

interface ChatDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    setMatches(media.matches);

    const listener = (e: MediaQueryListEvent) => setMatches(e.matches);
    media.addEventListener("change", listener);

    return () => media.removeEventListener("change", listener);
  }, [query]);

  return matches;
}

export function ChatDialog({ open, onOpenChange }: ChatDialogProps) {
  const isMobile = useMediaQuery("(max-width: 768px)");

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent className="h-[93vh]">
          <ChatInterface onClose={() => onOpenChange(false)} />
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl h-[600px] p-0 flex flex-col" showCloseButton={false}>
        <DialogTitle className="sr-only">CryptoCoach</DialogTitle>
        <ChatInterface onClose={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  );
}
