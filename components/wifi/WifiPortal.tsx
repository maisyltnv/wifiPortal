"use client";

import { useEffect, useRef, useState } from "react";
import { AdsScreen } from "@/components/wifi/AdsScreen";
import { LoginForm } from "@/components/wifi/LoginForm";
import type { CaptivePortalParams } from "@/lib/captive";
import { getMissingCaptiveKeys } from "@/lib/captive";
import { cn } from "@/lib/utils";

const COUNTDOWN_SECONDS = 10;

type WifiPortalProps = {
  captive: CaptivePortalParams;
  arubaAction: string;
  arubaUser: string;
  arubaPassword: string;
};

export function WifiPortal({
  captive,
  arubaAction,
  arubaUser,
  arubaPassword,
}: WifiPortalProps) {
  const [phase, setPhase] = useState<"splash" | "login">("splash");
  const [secondsLeft, setSecondsLeft] = useState(COUNTDOWN_SECONDS);
  const arubaFormRef = useRef<HTMLFormElement>(null);

  const missingKeys = getMissingCaptiveKeys(captive);

  useEffect(() => {
    if (phase !== "splash") return;

    const id = window.setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          setPhase("login");
          return 0;
        }
        return s - 1;
      });
    }, 1000);

    return () => window.clearInterval(id);
  }, [phase]);

  function skipSplash() {
    setPhase("login");
  }

  function submitArubaForm() {
    const form = arubaFormRef.current;
    if (!form) return;
    form.submit();
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-950 via-portal-dark to-black">
      <div className="mx-auto max-w-lg">
        {missingKeys.length > 0 && (
          <div
            role="status"
            className="mx-4 mt-4 rounded-xl border border-amber-500/35 bg-amber-950/40 px-4 py-3 text-sm text-amber-100"
          >
            <p className="font-semibold text-amber-200">
              Some portal parameters are missing
            </p>
            <p className="mt-1 text-amber-100/90">
              The following query parameters were not detected:{" "}
              <span className="font-mono text-amber-300">
                {missingKeys.join(", ")}
              </span>
              . You can still register, but connectivity may fail until the
              captive portal URL includes them.
            </p>
          </div>
        )}

        {phase === "splash" ? (
          <AdsScreen secondsRemaining={secondsLeft} onSkip={skipSplash} />
        ) : (
          <div className="mx-auto w-full max-w-md px-4 py-8 sm:py-12">
            <div
              className={cn(
                "overflow-hidden rounded-3xl border border-stone-800/80 shadow-portal",
                "bg-stone-900/90",
              )}
            >
              <div
                className={cn(
                  "bg-gradient-to-r from-orange-600 via-red-600 to-orange-700",
                  "px-6 py-10 text-center",
                )}
              >
                <h1 className="text-3xl font-bold tracking-tight text-white drop-shadow-sm">
                  Free WiFi
                </h1>
                <p className="mt-2 text-sm font-medium text-orange-50/95 sm:text-base">
                  Fast &amp; Free Internet Connection
                </p>
              </div>
              <LoginForm captive={captive} onSaveSuccess={submitArubaForm} />
              <p className="border-t border-stone-800/80 px-6 py-4 text-center text-xs text-stone-500">
                By connecting, you agree to our Terms of Service.
              </p>
            </div>
          </div>
        )}
      </div>

      <form
        id="arubaForm"
        ref={arubaFormRef}
        method="POST"
        action={arubaAction}
        className="hidden"
        aria-hidden="true"
      >
        <input type="hidden" name="cmd" value="authenticate" />
        <input type="hidden" name="mac" value={captive.mac} />
        <input type="hidden" name="ip" value={captive.ip} />
        <input type="hidden" name="apname" value={captive.apname} />
        <input type="hidden" name="user" value={arubaUser} />
        <input type="hidden" name="password" value={arubaPassword} />
        <input type="hidden" name="url" value={captive.url} />
      </form>
    </div>
  );
}
