"use client";

import { useEffect, useRef } from "react";
import { DotLottie } from "@lottiefiles/dotlottie-web";

export default function LottiePlayer({ src, width = 300, height = 300 }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const animation = new DotLottie({
      autoplay: true,
      loop: true,
      canvas: canvasRef.current,
      src,
    });

    return () => {
      animation.destroy(); // cleanup when unmounting
    };
  }, [src]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      style={{ width, height }}
    />
  );
}
