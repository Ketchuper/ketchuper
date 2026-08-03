"use client";

import { useMemo } from "react";
import {
  buildMarineHubBookingUrl,
  buildSnorkelRentalUrl,
  getMarineHubPhoneHref,
  getMarineHubPhoneLabel,
  getMarineHubPrimaryCta,
  marineHub,
} from "@/config/marineHub";

type QrProps = {
  url: string;
  size?: number;
  label?: string;
  className?: string;
};

/** 外部APIでQR生成（印刷プレビュー用）。本番印刷前に読み取り確認すること。 */
export function MarineHubQr({ url, size = 160, label, className }: QrProps) {
  const src = useMemo(() => {
    const q = encodeURIComponent(url);
    return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&margin=8&data=${q}`;
  }, [url, size]);

  return (
    <figure className={className}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        width={size}
        height={size}
        alt={label ?? "申し込みQRコード"}
        className="bg-white p-1"
      />
      {label ? (
        <figcaption className="mt-1 text-center text-[10px] tracking-wide opacity-70">
          {label}
        </figcaption>
      ) : null}
    </figure>
  );
}

export function useMarineHubBookingUrl(hotel?: string) {
  return useMemo(() => {
    if (typeof window === "undefined") {
      return buildMarineHubBookingUrl(undefined, hotel);
    }
    return buildMarineHubBookingUrl(window.location.origin, hotel);
  }, [hotel]);
}

export function useSnorkelRentalUrl(hotel?: string) {
  return useMemo(() => {
    if (typeof window === "undefined") {
      return buildSnorkelRentalUrl(undefined, hotel);
    }
    return buildSnorkelRentalUrl(window.location.origin, hotel);
  }, [hotel]);
}

export function ContactBlock({ compact = false }: { compact?: boolean }) {
  const phoneHref = getMarineHubPhoneHref();
  const phoneLabel = getMarineHubPhoneLabel();
  const cta = getMarineHubPrimaryCta();

  if (compact) {
    return (
      <div className="space-y-1 text-sm">
        <p className="font-semibold tracking-wide">
          TEL{" "}
          {phoneHref ? (
            <a href={phoneHref} className="underline underline-offset-2">
              {phoneLabel}
            </a>
          ) : (
            <span>{phoneLabel}</span>
          )}
        </p>
        <p>
          <a href={cta.href} className="underline underline-offset-2">
            {cta.label}
          </a>
        </p>
        <p className="opacity-80">{marineHub.instagramHandle}</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <a
        href={cta.href}
        className="inline-flex min-h-12 w-full items-center justify-center rounded-md bg-[var(--mh-accent)] px-4 py-3 text-center text-base font-semibold text-[var(--mh-ink)] transition hover:brightness-110"
      >
        {cta.label}
      </a>
      {phoneHref ? (
        <a
          href={phoneHref}
          className="inline-flex min-h-12 w-full items-center justify-center rounded-md border border-white/30 px-4 py-3 text-center text-base font-semibold text-white"
        >
          電話する {phoneLabel}
        </a>
      ) : (
        <p className="rounded-md border border-dashed border-amber-300/60 bg-amber-500/10 px-3 py-2 text-sm text-amber-100">
          印刷前に <code className="text-xs">marineHub.ts</code> の{" "}
          <code className="text-xs">phone</code> を記入してください
        </p>
      )}
      <p className="text-center text-sm text-white/70">
        Instagram {marineHub.instagramHandle} ／ {marineHub.websiteUrl.replace(/^https?:\/\//, "")}
      </p>
    </div>
  );
}
