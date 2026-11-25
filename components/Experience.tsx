"use client";

import { AudioProvider } from "@/components/AudioProvider";
import { Scene3DLazy } from "@/components/Scene3DLazy";
import { Masthead, Hero, SiteFooter } from "@/components/SiteChrome";
import { Phone } from "@/components/Phone";
import { ScrollStory } from "@/components/ScrollStory";

export function Experience() {
  return (
    <AudioProvider>
      <a href="#story" className="skip-link">
        Skip to the roll-out
      </a>

      <Scene3DLazy />
      <div className="grain" aria-hidden="true" />
      <div className="vignette" aria-hidden="true" />

      <Masthead />
      <Phone />

      <main>
        <Hero />
        <ScrollStory />
      </main>

      <SiteFooter />
    </AudioProvider>
  );
}

export default Experience;
