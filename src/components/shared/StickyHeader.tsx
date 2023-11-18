import { Box, Breakpoint, useTheme } from "@mui/material";
import {
  PropsWithChildren,
  ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";

interface StickyHeaderProps {
  maxStickyBreakpoint?: Breakpoint;
  outerChildren?: ReactNode;
}

export function StickyHeader(props: PropsWithChildren<StickyHeaderProps>) {
  const { maxStickyBreakpoint, outerChildren, children } = props;

  const observedRef = useRef<HTMLDivElement>(null);
  const [isStuck, setIsStuck] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0]) {
        setIsStuck(!entries[0].isIntersecting);
      }
    });
    if (observedRef.current) {
      observer.observe(observedRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <>
      <div id={"intersection-observer"} ref={observedRef} />
      <Box
        sx={(theme) =>
          maxStickyBreakpoint && theme.breakpoints.down(maxStickyBreakpoint)
            ? {
                position: "sticky",
                top: 0,
                zIndex: theme.zIndex.appBar,
                overflowY: "visible",
              }
            : {}
        }
      >
        <Box
          id={"character-header"}
          sx={[
            (theme) => ({
              top: 0,
              mx: -3,
              px: 3,
              backgroundColor:
                theme.palette.grey[theme.palette.mode === "light" ? 600 : 800],
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              py: 0.5,
              overflowX: "auto",
              overflowY: "visible",
              flexWrap: "wrap",
              transition: theme.transitions.create(["box-shadow"]),
              ...(theme.breakpoints.down("sm")
                ? {
                    pb: 5,
                    pt: 2,
                    boxShadow: isStuck ? theme.shadows[8] : undefined,
                  }
                : {}),
              [theme.breakpoints.down("sm")]: {
                mx: -2,
                px: 2,
              },
            }),
          ]}
        >
          {children}
        </Box>
        {outerChildren}
      </Box>
    </>
  );
}
