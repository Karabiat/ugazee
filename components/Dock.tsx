"use client";

import { motion } from "framer-motion";
import { dockApps } from "@/lib/config";
import { AppIcon, type OpenApp } from "@/components/AppIcon";

type Props = {
  onOpen: OpenApp;
  unread?: number;
};

export function Dock({ onOpen, unread = 0 }: Props) {
  return (
    <motion.div
      initial={{ y: 18, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.35, type: "spring", stiffness: 260, damping: 26 }}
      className="dock mx-auto flex h-[88px] w-[calc(100%-20px)] items-center justify-around rounded-[30px] px-2"
      role="toolbar"
      aria-label="Dock"
    >
      {dockApps.map((app) => (
        <AppIcon
          key={app.id}
          app={app}
          size="dock"
          onOpen={onOpen}
          showLabel={false}
          badge={app.id === "messages" ? unread : undefined}
        />
      ))}
    </motion.div>
  );
}
