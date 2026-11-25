"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronLeft,
  Check,
  Mic,
  Plus,
  SendHorizontal,
  Video,
  Phone,
} from "lucide-react";
import { config } from "@/lib/config";

type Msg = {
  id: string;
  side: "in" | "out";
  text: string;
  delivered?: boolean;
};

type Props = {
  onClose: () => void;
};

let idCounter = 0;
const nextId = () => `msg-${++idCounter}`;

export function Messages({ onClose }: Props) {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [typing, setTyping] = useState(true);
  const [usedReplies, setUsedReplies] = useState<string[]>([]);
  const [draft, setDraft] = useState("");
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMessages([{ id: nextId(), side: "in", text: config.messages.openingMessage }]);
      setTyping(false);
    }, 1350);
    timers.current.push(timer);
    return () => {
      timers.current.forEach(clearTimeout);
    };
  }, []);

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (scroller) {
      scroller.scrollTo({ top: scroller.scrollHeight, behavior: "smooth" });
    }
  }, [messages, typing]);

  const respond = (prompt: string, reply: string) => {
    if (usedReplies.includes(prompt)) return;
    setUsedReplies((prev) => [...prev, prompt]);
    setMessages((prev) => [
      ...prev,
      { id: nextId(), side: "out", text: prompt, delivered: true },
    ]);
    setTyping(true);
    const t1 = setTimeout(() => {
      setMessages((prev) => [...prev, { id: nextId(), side: "in", text: reply }]);
      setTyping(false);
    }, 1650);
    timers.current.push(t1);
  };

  const sendDraft = () => {
    const text = draft.trim();
    if (!text) return;
    setDraft("");
    setMessages((prev) => [...prev, { id: nextId(), side: "out", text, delivered: true }]);
    setTyping(true);
    const t = setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { id: nextId(), side: "in", text: "🤎🤎 see you on the 12th." },
      ]);
      setTyping(false);
    }, 1700);
    timers.current.push(t);
  };

  return (
    <div className="absolute inset-0 z-50 flex h-full flex-col bg-[#050505] pt-[54px]">
      <header className="relative flex h-[54px] shrink-0 items-center border-b border-white/[0.07] px-[12px]">
        <button
          type="button"
          onClick={onClose}
          className="flex h-[32px] w-[32px] items-center justify-center rounded-full text-[#0A84FF] transition-colors hover:bg-white/[0.06] active:scale-90"
          aria-label="Back to Home Screen"
        >
          <ChevronLeft size={24} strokeWidth={2.2} aria-hidden="true" />
        </button>

        <div className="pointer-events-none absolute left-1/2 top-[5px] flex -translate-x-1/2 flex-col items-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={config.artist.poster}
            alt=""
            className="h-[26px] w-[26px] rounded-full object-cover object-top"
            draggable={false}
          />
          <span className="mt-[1px] text-[7.5px] font-medium leading-none text-white/80">
            Ugazee
          </span>
          <span className="mt-[1px] text-[6px] leading-none text-white/35">iMessage</span>
        </div>

        <div className="ml-auto flex items-center gap-[3px]">
          <button
            type="button"
            className="flex h-[30px] w-[30px] items-center justify-center rounded-full text-[#0A84FF] hover:bg-white/[0.06]"
            aria-label="Start video call with Ugazee"
          >
            <Video size={18} strokeWidth={1.9} aria-hidden="true" />
          </button>
          <button
            type="button"
            className="flex h-[30px] w-[30px] items-center justify-center rounded-full text-[#0A84FF] hover:bg-white/[0.06]"
            aria-label="Call Ugazee"
          >
            <Phone size={17} strokeWidth={1.9} aria-hidden="true" />
          </button>
        </div>
      </header>

      <div
        ref={scrollerRef}
        className="no-scrollbar flex-1 overflow-y-auto px-[14px] pb-[8px] pt-[12px]"
      >
        <p className="mb-[13px] text-center text-[9px] font-medium text-white/30">
          Today 9:41
        </p>

        <AnimatePresence initial={false}>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ type: "spring", stiffness: 380, damping: 30 }}
              className={`mb-[6px] flex ${
                message.side === "out" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[76%] rounded-[18px] px-[12px] py-[8px] text-[12.5px] leading-[1.3] ${
                  message.side === "out"
                    ? "rounded-br-[5px] bg-[#0A84FF] text-white"
                    : "rounded-bl-[5px] bg-[#262628] text-white/92"
                }`}
              >
                {message.text}
              </div>
            </motion.div>
          ))}

          {typing && (
            <motion.div
              key="typing"
              initial={{ opacity: 0, y: 8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="mb-[6px] flex justify-start"
            >
              <div className="flex items-center gap-[4px] rounded-[18px] rounded-bl-[5px] bg-[#262628] px-[13px] py-[11px]">
                <span className="typing-dot" style={{ animationDelay: "0ms" }} />
                <span className="typing-dot" style={{ animationDelay: "160ms" }} />
                <span className="typing-dot" style={{ animationDelay: "320ms" }} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {messages.some((m) => m.side === "out") && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-[4px] flex items-center justify-end gap-[3px] text-[8px] font-medium text-white/30"
          >
            Delivered <Check size={8} strokeWidth={2.4} aria-hidden="true" />
          </motion.p>
        )}
      </div>

      <div className="shrink-0 px-[12px] pb-[38px]">
        {messages.length > 0 && usedReplies.length < config.messages.replies.length && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="mb-[8px] flex flex-wrap gap-[6px]"
          >
            {config.messages.replies.map((reply) => {
              const used = usedReplies.includes(reply.prompt);
              return (
                <button
                  key={reply.prompt}
                  type="button"
                  disabled={used}
                  onClick={() => respond(reply.prompt, reply.reply)}
                  className="rounded-full border border-[#0A84FF]/30 bg-[#0A84FF]/10 px-[12px] py-[6px] text-[10.5px] font-medium text-[#5FB2FF] transition-all hover:bg-[#0A84FF]/20 active:scale-95 disabled:cursor-default disabled:opacity-30"
                >
                  {reply.prompt}
                </button>
              );
            })}
          </motion.div>
        )}

        <div className="flex items-center gap-[8px]">
          <button
            type="button"
            className="flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-full bg-[#1C1C1E] text-[#0A84FF]"
            aria-label="Add attachment"
          >
            <Plus size={19} strokeWidth={2} aria-hidden="true" />
          </button>
          <div className="flex h-[34px] flex-1 items-center rounded-full border border-white/10 bg-[#1C1C1E] pl-[13px] pr-[8px]">
            <input
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  sendDraft();
                }
              }}
              placeholder="iMessage"
              className="field-ring h-full flex-1 rounded-full bg-transparent text-[12px] text-white outline-none placeholder:text-white/30"
              aria-label="Message Ugazee"
            />
            {draft ? (
              <button
                type="button"
                onClick={sendDraft}
                className="flex h-[24px] w-[24px] items-center justify-center rounded-full bg-[#0A84FF] text-white"
                aria-label="Send message"
              >
                <SendHorizontal size={13} strokeWidth={2.2} aria-hidden="true" />
              </button>
            ) : (
              <Mic
                size={15}
                strokeWidth={1.9}
                className="mr-[2px] text-white/35"
                aria-hidden="true"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
