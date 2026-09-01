"use client";

import { useState } from "react";
import Image, { type ImageProps } from "next/image";
import { motion } from "motion/react";
import { DURATION, EASE } from "@/lib/motion";

/**
 * next/image wrapper that fades in once the image has actually loaded,
 * instead of popping in abruptly. Ready for any future photo content
 * (PG listing photos, etc.) — currently applied to the logo.
 */
export function FadeImage({
  alt,
  wrapperClassName,
  onLoad,
  ...props
}: ImageProps & { wrapperClassName?: string }) {
  const [loaded, setLoaded] = useState(false);

  return (
    <motion.span
      initial={{ opacity: 0 }}
      animate={{ opacity: loaded ? 1 : 0 }}
      transition={{ duration: DURATION.base, ease: EASE }}
      className={wrapperClassName}
    >
      <Image
        {...props}
        alt={alt}
        onLoad={(e) => {
          setLoaded(true);
          onLoad?.(e);
        }}
      />
    </motion.span>
  );
}
