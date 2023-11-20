import { Box, Breakpoint } from "@mui/material";
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
          maxStickyBreakpoint
            ? {
                [theme.breakpoints.down(maxStickyBreakpoint)]: {
                  position: "sticky",
                  top: 0,
                  zIndex: theme.zIndex.appBar,
                  overflowY: "visible",
                },
              }
            : {}
        }
      >
        <Box
          id={"character-header"}
          sx={[
            (theme) => ({
              top: 0,
              mx: { xs: -2, sm: -3 },
              px: { xs: 2, sm: 3 },
              backgroundColor:
                theme.palette.grey[theme.palette.mode === "light" ? 600 : 800],
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              overflowX: "auto",
              overflowY: "visible",
              flexWrap: "wrap",
              transition: theme.transitions.create(["box-shadow"]),
              pt: 0.5,
              pb: outerChildren ? 5 : 0.5,
            }),
            (theme) =>
              maxStickyBreakpoint
                ? {
                    [theme.breakpoints.down(maxStickyBreakpoint)]: {
                      boxShadow: isStuck ? theme.shadows[8] : undefined,
                    },
                  }
                : {},
          ]}
        >
          {children}
        </Box>
        {outerChildren}
      </Box>
    </>
  );
}
