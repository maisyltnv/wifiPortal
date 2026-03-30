"use client";

import { useState } from "react";
import type { CaptivePortalParams } from "@/lib/captive";
import { cn } from "@/lib/utils";

type LoginFormProps = {
  captive: CaptivePortalParams;
  onSaveSuccess: () => void;
};

type FieldErrors = {
  name?: string;
  phone?: string;
};

export function LoginForm({ captive, onSaveSuccess }: LoginFormProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [loading, setLoading] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  function validate(): boolean {
    const next: FieldErrors = {};
    if (!name.trim()) next.name = "Full name is required.";
    if (!phone.trim()) next.phone = "Phone number is required.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaveError(null);
    if (!validate()) return;

    setLoading(true);
    try {
      const res = await fetch("/api/wifi-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mac: captive.mac,
          ip: captive.ip,
          apname: captive.apname,
          name: name.trim(),
          phone: phone.trim(),
          address: address.trim() || undefined,
        }),
      });

      const data = (await res.json()) as {
        success?: boolean;
        message?: string;
      };

      if (!res.ok || !data.success) {
        setSaveError(
          data.message ?? "We could not save your details. Please try again.",
        );
        return;
      }

      onSaveSuccess();
    } catch {
      setSaveError("Network error. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    "mt-1.5 w-full rounded-xl border border-stone-600 bg-stone-900/80 px-4 py-3 text-stone-100 placeholder:text-stone-500 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 disabled:opacity-60";

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5 px-6 pb-6 pt-2"
      noValidate
    >
      {saveError && (
        <div
          role="alert"
          className="rounded-xl border border-red-500/40 bg-red-950/50 px-4 py-3 text-sm text-red-200"
        >
          {saveError}
        </div>
      )}

      <div>
        <label
          htmlFor="fullName"
          className="text-sm font-medium text-stone-300"
        >
          Full Name <span className="text-orange-400">*</span>
        </label>
        <input
          id="fullName"
          name="fullName"
          autoComplete="name"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            if (errors.name) setErrors((s) => ({ ...s, name: undefined }));
          }}
          className={inputClass}
          disabled={loading}
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? "fullName-error" : undefined}
        />
        {errors.name && (
          <p id="fullName-error" className="mt-1.5 text-sm text-red-400">
            {errors.name}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="phone"
          className="text-sm font-medium text-stone-300"
        >
          Phone Number <span className="text-orange-400">*</span>
        </label>
        <input
          id="phone"
          name="phone"
          type="tel"
          autoComplete="tel"
          inputMode="tel"
          value={phone}
          onChange={(e) => {
            setPhone(e.target.value);
            if (errors.phone) setErrors((s) => ({ ...s, phone: undefined }));
          }}
          className={inputClass}
          disabled={loading}
          aria-invalid={!!errors.phone}
          aria-describedby={errors.phone ? "phone-error" : undefined}
        />
        {errors.phone && (
          <p id="phone-error" className="mt-1.5 text-sm text-red-400">
            {errors.phone}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="address" className="text-sm font-medium text-stone-300">
          Destination/Address{" "}
          <span className="font-normal text-stone-500">(Optional)</span>
        </label>
        <input
          id="address"
          name="address"
          autoComplete="street-address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className={inputClass}
          disabled={loading}
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className={cn(
          "w-full rounded-xl bg-gradient-to-r from-orange-600 to-red-600",
          "px-4 py-4 text-sm font-bold uppercase tracking-wide text-white",
          "shadow-lg shadow-orange-900/30 transition hover:brightness-110",
          "focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 focus:ring-offset-stone-950",
          "disabled:cursor-not-allowed disabled:opacity-70",
        )}
      >
        {loading ? "SECURING CONNECTION..." : "CONNECT TO INTERNET"}
      </button>
    </form>
  );
}
