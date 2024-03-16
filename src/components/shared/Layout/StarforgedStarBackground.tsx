import { Box } from "@mui/material";
import { useEffect, useRef } from "react";

export function StarforgedStarBackground() {
  const densityRatio = 0.25;
  const sizeLimit = 4;
  const defaultAlpha = 0.5;

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const starsRef = useRef<
    | { x: number; y: number; size: number; scale: number; alpha: number }[]
    | null
  >(null);

  useEffect(() => {
    contextRef.current = canvasRef.current?.getContext("2d") ?? null;
    const onResize = () => {
      if (canvasRef.current) {
        const VMIN = Math.min(window.innerHeight, window.innerWidth);
        const STAR_COUNT = Math.floor(VMIN * densityRatio);
        canvasRef.current.width = window.innerWidth;
        canvasRef.current.height = window.innerHeight;
        starsRef.current = new Array(STAR_COUNT).fill(0).map(() => ({
          x: Math.floor(Math.random() * window.innerWidth),
          y: Math.floor(Math.random() * window.innerHeight),
          size: Math.ceil(Math.random() * sizeLimit),
          scale: 1,
          alpha: Math.random() * defaultAlpha,
        }));
      }
      if (contextRef.current && canvasRef.current && starsRef.current) {
        contextRef.current.clearRect(
          0,
          0,
          canvasRef.current.width,
          canvasRef.current.height
        );
        starsRef.current.forEach((star) => {
          if (contextRef.current) {
            contextRef.current.fillStyle = `hsla(0, 100%, 100%, ${star.alpha})`;
            contextRef.current.beginPath();
            contextRef.current.arc(
              star.x,
              star.y,
              star.size / 2,
              0,
              Math.PI * 2
            );
            contextRef.current.fill();
          }
        });
      }
    };
    onResize();
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
    };
  }, []);
  return (
    <Box
      component={"canvas"}
      ref={canvasRef}
      sx={{
        position: "fixed",
        inset: 0,
        bgcolor: "darkGrey.main",

        zIndex: -1,
        height: "100vh",
        width: "100vw",
      }}
    />
  );
}
