import { useEffect, useRef } from "react";
import JSConfetti from "js-confetti";

const CONFETTI_THEMES = [
  {
    emojis: ["🧪"],
    colors: ["#6cd4ff", "#d4f1f9", "#8cdcf4"],
  },
  {
    emojis: ["🧬"],
    colors: ["#9f79ee", "#f5a3d1", "#b1d2ff"],
  },
  {
    emojis: ["🪟"],
    colors: ["#cbd5e1", "#f1f5f9", "#94a3b8"],
  },
  {
    emojis: ["✨", "💫", "⭐️", "🌟"],
    colors: ["#facc15", "#fde68a", "#fcd34d"],
  },
  {
    emojis: ["🤠"],
    colors: ["#a16207", "#92400e", "#78350f"],
  },
  {
    emojis: ["🧠", "🤓"],
    colors: ["#fca5a5", "#fcd34d", "#e879f9"],
  },
  {
    emojis: ["🧯", "🔥"],
    colors: ["#ef4444", "#f97316", "#facc15"],
  },
  {
    emojis: ["🥽", "🥼", "🧤", "🧑‍🔬"],
    colors: ["#e2e8f0", "#94a3b8", "#cbd5e1"],
  },
  {
    emojis: ["💧", "🔥", "🌬️", "🪨"],
  },
  {
    emojis: ["🚀", "🪐", "🌎", "🛰️", "🌟", "🌙"],
  },
  {
    emojis: ["🐈", "🐾", "🐱", "🍣"],
    colors: ["#facc15", "#f87171", "#d1d5db"],
  },
  { emojis: ["🦄", "🌈", "✨", "💖", "🧚"] },
];

export function useConfetti() {
  const jsConfetti = useRef<JSConfetti | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = document.createElement("canvas");
    canvas.style.position = "fixed";
    canvas.style.top = "0";
    canvas.style.left = "0";
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.pointerEvents = "none";
    canvas.style.zIndex = "999999";
    document.body.appendChild(canvas);
    canvasRef.current = canvas;

    jsConfetti.current = new JSConfetti({ canvas });

    return () => {
      if (canvasRef.current) {
        document.body.removeChild(canvasRef.current);
      }
    };
  }, []);

  const addConfetti = () => {
    const randomArray = new Uint32Array(1);
    crypto.getRandomValues(randomArray);
    const randomIndex = randomArray[0] % CONFETTI_THEMES.length;
    const theme = CONFETTI_THEMES[randomIndex];

    jsConfetti.current?.addConfetti({
      emojis: theme.emojis,
      confettiColors: theme.colors,
      confettiNumber: 30,
      emojiSize: 100,
    });
  };

  return { addConfetti };
}
