"use client";

import {
  DirectionProvider as GlobalDirectionProvider,
  useDirection,
} from "@radix-ui/react-direction";
import type * as React from "react";

import { useTranslation } from "@/lib/i18n/useTranslation";

function DirectionProvider(
  props: Omit<React.ComponentProps<typeof GlobalDirectionProvider>, "dir">,
) {
  const { dir } = useTranslation();
  return <GlobalDirectionProvider dir={dir} {...props} />;
}

export {
  DirectionProvider,
  useDirection,
};
