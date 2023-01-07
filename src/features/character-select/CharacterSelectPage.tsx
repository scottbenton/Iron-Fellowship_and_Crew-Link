import { Button } from "@mui/material";
import { Link } from "react-router-dom";
import { EmptyState } from "../../components/EmptyState/EmptyState";
import { paths, ROUTES } from "../../routes";

export function CharacterSelectPage() {
  const characters: string[] = [];

  return (
    <>
      {!characters || characters.length === 0 ? (
        <EmptyState
          imageSrc="/assets/nature.svg"
          title={"No Characters"}
          message={"Create your first character to get started"}
          callToAction={
            <Button
              component={Link}
              to={paths[ROUTES.CHARACTER_CREATE]}
              variant={"contained"}
            >
              Create a Character
            </Button>
          }
        />
      ) : (
        <>Character Select Page </>
      )}
    </>
  );
}
