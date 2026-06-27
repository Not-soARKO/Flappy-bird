import type { ReactNode } from "react";
import { SunAndClouds } from "./SunAndClouds";

type GameFrameProps = {
  children: ReactNode;
  className?: string;
};

export function GameFrame({ children, className }: GameFrameProps) {
  return (
    <div
      className={`relative mx-auto h-[640px] w-full max-w-[420px] overflow-hidden rounded-2xl border-4 border-sky-950 bg-gradient-to-b from-cyan-300 via-sky-300 to-blue-200 shadow-2xl shadow-sky-900/40 ${
        className ?? ""
      }`}
    >
      <SunAndClouds />
      {children}
    </div>
  );
}
