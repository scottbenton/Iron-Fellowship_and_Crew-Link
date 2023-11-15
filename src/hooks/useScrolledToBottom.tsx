import { useEffect, useState } from "react";

export function useScrolledToBottom(offset: number = 0) {
  const [isBottom, setIsBottom] = useState(false);

  const handleScroll = () => {
    const scrollTop = document.documentElement.scrollTop;
    const windowHeight = window.innerHeight;
    const height = document.documentElement.scrollHeight - windowHeight;
    const isScrolledToBottom = scrollTop >= height - offset;

    setIsBottom(isScrolledToBottom);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return isBottom;
}
