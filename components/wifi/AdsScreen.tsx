"use client";

import { cn } from "@/lib/utils";

type AdsScreenProps = {
  secondsRemaining: number;
  onSkip: () => void;
};

export function AdsScreen({ secondsRemaining, onSkip }: AdsScreenProps) {
  return (
    <div className="mx-auto w-full max-w-md px-4 py-8 sm:py-12">
      <div
        className={cn(
          "overflow-hidden rounded-3xl border border-stone-800/80",
          "bg-gradient-to-b from-stone-900/90 to-stone-950 shadow-portal",
        )}
      >
        <div className="border-b border-stone-800/80 bg-stone-900/50 px-6 py-4">
          <span className="inline-flex items-center rounded-full bg-orange-500/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-orange-400 ring-1 ring-orange-500/30">
            Sponsored Advertisement
          </span>
        </div>

        <div className="space-y-6 px-6 py-8">
          <header className="space-y-2 text-center">
            <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Welcome to Free WiFi
            </h1>
            <p className="text-sm leading-relaxed text-stone-400 sm:text-base">
              Enjoy fast and secure internet access after viewing this short
              promotion.
            </p>
          </header>

          <div
            className={cn(
              "rounded-2xl border border-orange-500/25 bg-gradient-to-br",
              "from-orange-600/20 via-red-600/15 to-stone-900 p-5",
            )}
          >
            <p className="text-center text-lg font-semibold text-orange-100">
              Kolao Group Promotion
            </p>
            <p className="mt-2 text-center text-sm text-stone-300">
              Discover our latest services, offers, and customer benefits.
            </p>
          </div>

          <div className="flex flex-col items-center gap-6">
            <div className="flex flex-col items-center gap-2">
              <p className="text-sm font-medium text-stone-400">Please wait</p>
              <div
                className={cn(
                  "flex h-24 w-24 items-center justify-center rounded-full",
                  "bg-gradient-to-br from-orange-500 to-red-600 text-3xl font-bold text-white",
                  "shadow-lg shadow-orange-900/40 ring-4 ring-orange-500/20",
                )}
                aria-live="polite"
                aria-label={`${secondsRemaining} seconds remaining`}
              >
                {secondsRemaining}
              </div>
            </div>

            <button
              type="button"
              onClick={onSkip}
              className={cn(
                "w-full rounded-xl border border-stone-600 bg-stone-800/80",
                "px-4 py-3.5 text-sm font-semibold text-stone-200",
                "transition hover:border-orange-500/50 hover:bg-stone-800 hover:text-white",
                "focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-stone-950",
              )}
            >
              Skip Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
