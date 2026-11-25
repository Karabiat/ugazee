"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  brandApps,
  config,
  dockApps,
  type IosApp,
} from "@/lib/config";
import { useAudio } from "@/components/AudioProvider";
import { useMediaQuery } from "@/hooks/useClock";
import { Wallpaper } from "@/components/Wallpaper";
import { LockScreen } from "@/components/LockScreen";
import { HomeScreen } from "@/components/HomeScreen";
import { DynamicIsland } from "@/components/DynamicIsland";
import { Notification } from "@/components/Notification";
import { StatusBar } from "@/components/StatusBar";
import { Messages } from "@/components/Messages";
import { UtilityApp } from "@/components/UtilityApp";
import { Spotify } from "@/components/apps/Spotify";
import { AppleMusic } from "@/components/apps/AppleMusic";
import { SoundCloud } from "@/components/apps/SoundCloud";
import type { OpenApp, OpenOrigin } from "@/components/AppIcon";

const MESSAGES_APP = dockApps.find((app) => app.id === "messages")!;
const MUSIC_APP =
  brandApps.find((app) => app.id === "appleMusic") ?? dockApps[3];

type AppSurfaceProps = {
  app: IosApp;
  onClose: () => void;
};

function AppSurface({ app, onClose }: AppSurfaceProps) {
  switch (app.id) {
    case "spotify":
      return <Spotify onClose={onClose} />;
    case "appleMusic":
    case "music":
      return <AppleMusic onClose={onClose} />;
    case "soundcloud":
      return <SoundCloud onClose={onClose} />;
    case "messages":
      return <Messages onClose={onClose} />;
    default:
      return <UtilityApp app={app} onClose={onClose} />;
  }
}

export function Phone() {
  const { play, playChime, duck } = useAudio();
  const reduceMotion = useReducedMotion();
  const isDesktop = useMediaQuery("(min-width: 820px)");

  const [unlocked, setUnlocked] = useState(false);
  const [activeApp, setActiveApp] = useState<IosApp | null>(null);
  const [origin, setOrigin] = useState<OpenOrigin | undefined>(undefined);
  const [split, setSplit] = useState(false);
  const [unread, setUnread] = useState(0);
  const [notificationVisible, setNotificationVisible] = useState(false);

  const shellRef = useRef<HTMLDivElement | null>(null);
  const notifyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const scheduledRef = useRef(false);

  const vibrate = useCallback((pattern: number | number[]) => {
    if (typeof navigator !== "undefined" && "vibrate" in navigator) {
      try {
        navigator.vibrate(pattern);
      } catch {
        /* noop */
      }
    }
  }, []);

  const showNotification = useCallback(() => {
    setNotificationVisible(true);
    setSplit(true);
    setUnread(1);
    playChime();
    duck(0.22, 1900);
    vibrate([14, 52, 14]);
  }, [duck, playChime, vibrate]);

  const dismissNotification = useCallback(() => {
    setNotificationVisible(false);
    setSplit(false);
  }, []);

  useEffect(() => {
    if (!notificationVisible) return;
    const timer = setTimeout(
      dismissNotification,
      config.notification.autoDismissMs,
    );
    return () => clearTimeout(timer);
  }, [dismissNotification, notificationVisible]);

  const handleUnlock = useCallback(() => {
    setUnlocked(true);
    void play();
    if (scheduledRef.current) return;
    scheduledRef.current = true;
    const { minDelayMs, maxDelayMs } = config.notification;
    const delay =
      minDelayMs + Math.random() * Math.max(1000, maxDelayMs - minDelayMs);
    notifyTimer.current = setTimeout(showNotification, delay);
  }, [play, showNotification]);

  const testNotification = useCallback(() => {
    if (notifyTimer.current) clearTimeout(notifyTimer.current);
    setNotificationVisible(false);
    // A double-click on the lock-screen clock unlocks the phone and drops the
    // banner in one gesture — the label promises exactly that.
    if (!unlocked) {
      setUnlocked(true);
      scheduledRef.current = true;
      void play();
    }
    // Re-trigger the banner even when it is already on screen.
    setTimeout(showNotification, notificationVisible ? 260 : 60);
  }, [notificationVisible, play, showNotification, unlocked]);

  const openMessages = useCallback(() => {
    if (notifyTimer.current) clearTimeout(notifyTimer.current);
    setNotificationVisible(false);
    setSplit(false);
    setUnread(0);
    setOrigin(undefined);
    setActiveApp(MESSAGES_APP);
    vibrate(6);
  }, [vibrate]);

  const openApp = useCallback<OpenApp>(
    (app, appOrigin) => {
      if (!unlocked) return;
      if (app.id === "messages") {
        openMessages();
        return;
      }
      if (app.id === "music") {
        setOrigin(appOrigin);
        setActiveApp(MUSIC_APP);
        return;
      }
      setOrigin(appOrigin);
      setActiveApp(app);
      vibrate(6);
    },
    [openMessages, unlocked, vibrate],
  );

  const closeApp = useCallback(() => {
    setActiveApp(null);
  }, []);

  useEffect(() => {
    return () => {
      if (notifyTimer.current) clearTimeout(notifyTimer.current);
    };
  }, []);

  // Gentle device tilt on pointer devices. Kept on .phone-shell so the scroll
  // story can drive .phone-tilt without fighting this transform.
  useEffect(() => {
    if (reduceMotion || !isDesktop) return;
    const shell = shellRef.current;
    if (!shell) return;
    let raf = 0;
    const target = { x: 0, y: 0 };
    const current = { x: 0, y: 0 };

    const onMove = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      target.x = (event.clientX / window.innerWidth - 0.5) * 2;
      target.y = (event.clientY / window.innerHeight - 0.5) * 2;
    };

    const loop = () => {
      current.x += (target.x - current.x) * 0.055;
      current.y += (target.y - current.y) * 0.055;
      shell.style.transform = `perspective(1600px) rotateY(${
        current.x * 4.2
      }deg) rotateX(${-current.y * 3.4}deg)`;
      raf = requestAnimationFrame(loop);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    raf = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
      shell.style.transform = "";
    };
  }, [isDesktop, reduceMotion]);

  const entering = !activeApp;

  return (
    <div className="phone-stage">
      <div className="phone-tilt">
        <div className="phone-shell" ref={shellRef}>
          <div className="phone-frame">
            <span className="phone-side side-mute" aria-hidden="true" />
            <span className="phone-side side-vol-up" aria-hidden="true" />
            <span className="phone-side side-vol-down" aria-hidden="true" />
            <span className="phone-side side-power" aria-hidden="true" />

            <div className="phone-screen">
              <div className="phone-screen-inner">
                <Wallpaper variant={unlocked ? "home" : "lock"} />

                <HomeScreen
                  onOpen={openApp}
                  unread={unread}
                  locked={!unlocked}
                />

                <AnimatePresence>
                  {!unlocked && (
                    <LockScreen
                      key="lock"
                      onUnlock={handleUnlock}
                      onTestNotification={testNotification}
                    />
                  )}
                </AnimatePresence>

                <AnimatePresence>
                  {activeApp && (
                    <motion.div
                      key={activeApp.id}
                      className="absolute inset-0 z-50 overflow-hidden bg-black"
                      initial={
                        reduceMotion || !origin
                          ? { opacity: 0 }
                          : {
                              opacity: 0.4,
                              scale: Math.max(0.16, origin.scale),
                              x: origin.x,
                              y: origin.y,
                              borderRadius: 28,
                            }
                      }
                      animate={{
                        opacity: 1,
                        scale: 1,
                        x: 0,
                        y: 0,
                        borderRadius: 0,
                      }}
                      exit={
                        reduceMotion || !origin
                          ? { opacity: 0 }
                          : {
                              opacity: 0.2,
                              scale: Math.max(0.16, origin.scale),
                              x: origin.x,
                              y: origin.y,
                              borderRadius: 28,
                            }
                      }
                      transition={{
                        type: "spring",
                        stiffness: 330,
                        damping: 32,
                        mass: 0.9,
                      }}
                    >
                      <AppSurface app={activeApp} onClose={closeApp} />
                    </motion.div>
                  )}
                </AnimatePresence>

                {unlocked && activeApp && (
                  <motion.button
                    type="button"
                    className="phone-home-indicator pointer-events-auto"
                    aria-label="Close app and return to the Home Screen"
                    drag="y"
                    dragConstraints={{ top: -70, bottom: 0 }}
                    dragElastic={{ top: 0.35, bottom: 0 }}
                    dragMomentum={false}
                    onDragEnd={(_, info) => {
                      if (info.offset.y < -26 || info.velocity.y < -320) closeApp();
                    }}
                    onClick={closeApp}
                    whileTap={{ scaleX: 0.92, opacity: 0.75 }}
                    style={{ zIndex: 57 }}
                  />
                )}
              </div>

              <StatusBar
                tone="light"
                onTestNotification={testNotification}
              />

              <Notification
                visible={notificationVisible && unlocked}
                onOpen={openMessages}
                onDismiss={dismissNotification}
              />

              <DynamicIsland
                split={split}
                onOpenMessages={openMessages}
                onIdleActivate={handleUnlock}
              />

              <span className="sr-only" aria-live="polite">
                {entering
                  ? unlocked
                    ? "Home Screen"
                    : "Lock screen"
                  : `${activeApp?.label ?? "App"} open. Swipe up on the home indicator to close.`}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
