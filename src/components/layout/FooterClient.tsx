"use client";

import dynamic from "next/dynamic";

const Footer = dynamic(() => import("./footer").then((mod) => ({ default: mod.Footer })), {
  ssr: false,
});

export function FooterClient() {
  return <Footer />;
}
