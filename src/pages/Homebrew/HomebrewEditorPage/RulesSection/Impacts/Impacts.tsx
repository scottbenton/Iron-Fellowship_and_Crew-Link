import {
  Box,
  Button,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";
import { useState } from "react";
import {
  StoredImpact,
  StoredImpactCategory,
  StoredRules,
} from "types/HomebrewCollection.type";
import { ImpactCategoryDialog } from "./ImpactCategoryDialog";
import { useStore } from "stores/store";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useConfirm } from "material-ui-confirm";
import { deleteField } from "firebase/firestore";
import { ImpactDialog } from "./ImpactDialog";
import { ClampedMarkdownRenderer } from "components/shared/ClampedMarkdownRenderer";

export interface ImpactsProps {
  homebrewId: string;
  impactCategories: StoredRules["impacts"];
  conditionMeters: StoredRules["condition_meters"];
}

export function Impacts(props: ImpactsProps) {
  const { homebrewId, impactCategories, conditionMeters } = props;
  const confirm = useConfirm();

  const [impactCategoryDialogOpen, setImpactCategoryDialogOpen] =
    useState(false);
  const [impactDialogOpen, setImpactDialogOpen] = useState(false);
  const [editingImpactCategoryKey, setEditingImpactCategoryKey] = useState<
    string | undefined
  >(undefined);
  const [editingImpactKey, setEditingImpactKey] = useState<string | undefined>(
    undefined
  );

  const updateRules = useStore((store) => store.homebrew.updateExpansionRules);
  const addImpactCategory = (
    impactCategoryId: string,
    impactCategory: StoredImpactCategory
  ) => {
    return updateRules(homebrewId, {
      impacts: { [impactCategoryId]: impactCategory },
    });
  };
  const deleteImpactCategory = (categoryId: string) => {
    return updateRules(homebrewId, {
      impacts: { [categoryId]: deleteField() },
    });
  };
  const addImpact = (
    impactCategoryId: string,
    impactId: string,
    impact: StoredImpact
  ) => {
    return updateRules(homebrewId, {
      impacts: { [impactCategoryId]: { contents: { [impactId]: impact } } },
    });
  };
  const deleteImpact = (categoryId: string, impactId: string) => {
    return updateRules(homebrewId, {
      impacts: { [categoryId]: { contents: { [impactId]: deleteField() } } },
    });
  };
  const handleCategoryDelete = (categoryId: string) => {
    confirm({
      title: `Delete ${impactCategories[categoryId].label}`,
      description: "Are you sure you want to delete this impact category?",
      confirmationText: "Delete",
      confirmationButtonProps: {
        variant: "contained",
        color: "error",
      },
    })
      .then(() => {
        deleteImpactCategory(categoryId).catch(() => {});
      })
      .catch(() => {});
  };
  const handleImpactDelete = (categoryId: string, impactId: string) => {
    confirm({
      title: `Delete ${impactCategories[categoryId].contents[impactId].label}`,
      description: "Are you sure you want to delete this impact?",
      confirmationText: "Delete",
      confirmationButtonProps: {
        variant: "contained",
        color: "error",
      },
    })
      .then(() => {
        deleteImpact(categoryId, impactId).catch(() => {});
      })
      .catch(() => {});
  };

  return (
    <>
      {Object.keys(impactCategories).length === 0 ? (
        <Typography color={"text.secondary"}>
          No Impact Categories Found
        </Typography>
      ) : (
        <Box
          component={"ul"}
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "repeat(1, 1fr)",
              sm: "repeat(2, 1fr)",
              md: "repeat(3, 1fr)",
            },
            gap: 2,
            pl: 0,
            my: 0,
            listStyle: "none",
          }}
        >
          {Object.keys(impactCategories)
            .sort((c1, c2) =>
              impactCategories[c1].label.localeCompare(
                impactCategories[c2].label
              )
            )
            .map((categoryKey) => (
              <ListItem
                disablePadding
                key={categoryKey}
                sx={{
                  flexDirection: "column",
                  alignItems: "stretch",
                  borderColor: "divider",
                  borderWidth: "1px",
                  borderStyle: "solid",
                  borderRadius: 1,
                }}
              >
                <Box
                  py={1}
                  px={2}
                  width={"100%"}
                  display={"flex"}
                  alignItems={"center"}
                  sx={{
                    borderBottomColor: "divider",
                    borderBottomWidth: "1px",
                    borderBottomStyle: "solid",
                  }}
                >
                  <ListItemText
                    primary={impactCategories[categoryKey].label}
                    secondary={
                      <ClampedMarkdownRenderer
                        markdown={impactCategories[categoryKey].description}
                        inheritColor
                      />
                    }
                  />
                  <Box display={"flex"}>
                    <IconButton
                      onClick={() => {
                        setImpactCategoryDialogOpen(true);
                        setEditingImpactCategoryKey(categoryKey);
                      }}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => handleCategoryDelete(categoryKey)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Box>
                {Object.keys(impactCategories[categoryKey].contents).length >
                0 ? (
                  <List>
                    {Object.keys(impactCategories[categoryKey].contents)
                      .sort((i1, i2) =>
                        impactCategories[categoryKey].contents[
                          i1
                        ].label.localeCompare(
                          impactCategories[categoryKey].contents[i2].label
                        )
                      )
                      .map((categoryContentKey) => (
                        <ListItem key={categoryContentKey}>
                          <ListItemText
                            primary={
                              impactCategories[categoryKey].contents[
                                categoryContentKey
                              ].label
                            }
                            secondary={
                              <ClampedMarkdownRenderer
                                markdown={
                                  impactCategories[categoryKey].contents[
                                    categoryContentKey
                                  ].description
                                }
                                inheritColor
                              />
                            }
                          />
                          <Box display={"flex"}>
                            <IconButton
                              onClick={() => {
                                setImpactDialogOpen(true);
                                setEditingImpactCategoryKey(categoryKey);
                                setEditingImpactKey(categoryContentKey);
                              }}
                            >
                              <EditIcon />
                            </IconButton>
                            <IconButton
                              onClick={() =>
                                handleImpactDelete(
                                  categoryKey,
                                  categoryContentKey
                                )
                              }
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Box>
                        </ListItem>
                      ))}
                  </List>
                ) : (
                  <Typography mt={2} px={2} textAlign={"center"}>
                    No Impacts in this Category
                  </Typography>
                )}
                <Button
                  color={"inherit"}
                  onClick={() => {
                    setImpactDialogOpen(true);
                    setEditingImpactCategoryKey(categoryKey);
                    setEditingImpactKey(undefined);
                  }}
                  sx={{ alignSelf: "center", my: 1 }}
                >
                  Add Impact
                </Button>
              </ListItem>
            ))}
        </Box>
      )}
      <Button
        variant={"outlined"}
        color={"inherit"}
        onClick={() => {
          setImpactCategoryDialogOpen(true);
          setEditingImpactCategoryKey(undefined);
        }}
      >
        Add Impact Category
      </Button>
      <ImpactCategoryDialog
        open={impactCategoryDialogOpen}
        onClose={() => setImpactCategoryDialogOpen(false)}
        impactCategories={impactCategories}
        onSave={addImpactCategory}
        editingCategoryKey={editingImpactCategoryKey}
      />
      {editingImpactCategoryKey && (
        <ImpactDialog
          open={impactDialogOpen}
          onClose={() => setImpactDialogOpen(false)}
          impacts={impactCategories[editingImpactCategoryKey]?.contents}
          onSave={addImpact}
          editingCategoryKey={editingImpactCategoryKey}
          editingImpactKey={editingImpactKey}
          conditionMeters={conditionMeters}
        />
      )}
    </>
  );
}
