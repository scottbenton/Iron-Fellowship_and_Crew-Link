import { useEffect, useState } from "react";

export function useScrolledToBottom() {
  const [isBottom, setIsBottom] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0]) {
        setIsBottom(entries[0].isIntersecting);
      }
    });
    const footerIntersectionObserver = document.getElementById(
      "footer-intersection-observer"
    );
    if (footerIntersectionObserver) {
      observer.observe(footerIntersectionObserver);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  return isBottom;
}
