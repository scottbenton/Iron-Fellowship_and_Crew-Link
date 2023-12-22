import { Box, Link, Typography, useTheme } from "@mui/material";
import { useCustomMoves } from "components/features/charactersAndCampaigns/MovesSection/useCustomMoves";
import { useCustomOracles } from "components/features/charactersAndCampaigns/OracleSection/useCustomOracles";
import { useOracleMap } from "data/hooks/useRollableOracleMap";
import { moveMap } from "data/moves";
import { oracleMap } from "data/oracles";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useStore } from "stores/store";

export interface MarkdownRendererProps {
  inlineParagraph?: boolean;
  markdown: string;
  inheritColor?: boolean;
  disableLinks?: boolean;
}

export function MarkdownRenderer(props: MarkdownRendererProps) {
  const { inlineParagraph, markdown, inheritColor, disableLinks } = props;

  const openDialog = useStore((store) => store.appState.openDialog);

  const theme = useTheme();

  const { allCustomOracleMap } = useCustomOracles();
  const { customMoveMap } = useCustomMoves();
  const newOracleMap = useOracleMap();

  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        p: ({ children }) => (
          <Typography
            variant={"body2"}
            display={inlineParagraph ? "inline" : "block"}
            color={
              inheritColor
                ? "inherit"
                : (theme) =>
                    inlineParagraph
                      ? theme.palette.text.secondary
                      : theme.palette.text.primary
            }
            py={inlineParagraph ? 0 : 1}
            textAlign={"left"}
          >
            {children}
          </Typography>
        ),
        li: ({ children }) => (
          <Typography
            component={"li"}
            variant={"body2"}
            color={
              inheritColor
                ? "inherit"
                : (theme) =>
                    inlineParagraph
                      ? theme.palette.text.secondary
                      : theme.palette.text.primary
            }
          >
            {children}
          </Typography>
        ),
        ul: ({ children }) => (
          <Box component={"ul"} pl={1.5}>
            {children}
          </Box>
        ),
        table: ({ children }) => (
          <Box
            component={"table"}
            mt={2}
            mb={1}
            border={1}
            borderColor={(theme) => theme.palette.divider}
            borderRadius={(theme) => `${theme.shape.borderRadius}px`}
            sx={{ borderCollapse: "collapse" }}
          >
            {children}
          </Box>
        ),
        thead: ({ children }) => (
          <Box
            component={"thead"}
            bgcolor={(theme) => theme.palette.background.paperInlayDarker}
          >
            {children}
          </Box>
        ),
        th: ({ children }) => (
          <Typography
            component={"th"}
            variant={"body2"}
            textAlign={"left"}
            p={1}
            minWidth={"8ch"}
          >
            <b>{children}</b>
          </Typography>
        ),
        tr: ({ children }) => (
          <Box
            component={"tr"}
            sx={(theme) => ({
              "&:nth-of-type(even)": {
                backgroundColor: theme.palette.background.paperInlay,
              },
            })}
          >
            {children}
          </Box>
        ),
        td: ({ children }) => (
          <Typography
            component={"td"}
            px={1}
            py={0.5}
            variant={"body2"}
            color={(theme) => theme.palette.text.primary}
          >
            {children}
          </Typography>
        ),
        a: (props) => {
          if (disableLinks) {
            return <>{props.children}</>;
          }

          const propertiesHref = props.node.properties?.href;

          const href = typeof propertiesHref === "string" ? propertiesHref : "";
          // V2 versions
          if (href.startsWith("id:")) {
            const strippedHref = href.slice(3);
            if (newOracleMap[strippedHref]) {
              return (
                <Link
                  component={"button"}
                  sx={{
                    cursor: "pointer",
                    verticalAlign: "baseline",
                  }}
                  color={
                    theme.palette.mode === "light" ? "info.dark" : "info.light"
                  }
                  onClick={() => openDialog(strippedHref, true)}
                >
                  {props.children}
                </Link>
              );
            }

            console.error("Link: ", href);

            // TODO - add handlers for this situation;
            return <span>{props.children}</span>;
          }
          // V1 versions
          if (href.startsWith("ironsworn/") || href.startsWith("starforged/")) {
            if (
              (href.startsWith("ironsworn/moves") ||
                href.startsWith("ironsworn/oracles") ||
                href.startsWith("starforged/moves") ||
                href.startsWith("starforged/oracles")) &&
              (!!moveMap[href] ||
                !!oracleMap[href] ||
                !!customMoveMap[href] ||
                !!allCustomOracleMap[href])
            ) {
              return (
                <Link
                  component={"button"}
                  sx={{
                    cursor: "pointer",
                    verticalAlign: "baseline",
                  }}
                  color={
                    theme.palette.mode === "light" ? "info.dark" : "info.light"
                  }
                  onClick={() => openDialog(href)}
                >
                  {props.children}
                </Link>
              );
            }

            // TODO - add handlers for this situation;
            return <span>{props.children}</span>;
          }
          return <a {...props} />;
        },
      }}
    >
      {markdown}
    </ReactMarkdown>
  );
}
