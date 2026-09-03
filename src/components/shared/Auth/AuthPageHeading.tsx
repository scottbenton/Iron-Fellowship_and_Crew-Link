import { Box, Typography } from "@mui/material";
import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { BASE_ROUTES, basePaths } from "routes";

export interface AuthPageHeadingProps {
  isLoginPage: boolean;
  icon: ReactNode;
}

export function AuthPageHeading(props: AuthPageHeadingProps) {
  const { isLoginPage, icon } = props;

  return (
    <Box>
      <Box pt={2} display={"flex"} alignItems={"center"}>
        <Box
          sx={(theme) => ({
            display: "inline-flex",
            borderRadius: 999,
            alignItems: "center",
            justifyContent: "center",
            p: 0.5,
            bgcolor: theme.palette.primary.main,
            color: theme.palette.common.white,
          })}
        >
          {icon}
        </Box>
        <Typography
          ml={1}
          variant={"h4"}
          fontFamily={(theme) => theme.fontFamilyTitle}
          color={"textSecondary"}
        >
          {isLoginPage ? "Log in" : "Create an Account"}
        </Typography>
      </Box>
      {isLoginPage ? (
        <Typography>
          Need an account?{" "}
          <Typography
            component={Link}
            color={"primary"}
            to={basePaths[BASE_ROUTES.SIGNUP]}
          >
            Create an Account
          </Typography>
        </Typography>
      ) : (
        <Typography>
          Already have an account?{" "}
          <Typography
            component={Link}
            color={"primary"}
            to={basePaths[BASE_ROUTES.LOGIN]}
          >
            Login
          </Typography>
        </Typography>
      )}
    </Box>
  );
}
