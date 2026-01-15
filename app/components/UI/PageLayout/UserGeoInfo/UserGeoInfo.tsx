"use client";

import { setClientCookie } from "@/utils/cookies/cookies.client";
import { useEffect } from "react";

export default function GeoFallbackFetcher() {
  useEffect(() => {
    fetch("https://ipinfo.io/json")
      .then((res) => res.json())
      .then((geo) => {
        if (geo?.ip) setClientCookie("user_ip", geo.ip);
        let country = "unknown";
        if (typeof geo?.country === "string" && geo.country.length === 2)
          country = geo.country.toUpperCase();

        setClientCookie("user_country", country);
      })
      .catch((err) => {
        console.warn("GeoFallbackFetcher error:", err);
      });
  }, []);

  return null;
}
