"use client";

import dynamic from "next/dynamic";

export const Map = dynamic(() => import("./Map").then((m) => m.Map), { ssr: false });
