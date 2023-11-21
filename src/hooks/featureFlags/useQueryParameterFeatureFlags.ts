import { useSearchParams } from "react-router-dom";

export function useQueryParameterFeatureFlags() {
  const [searchParams] = useSearchParams();

  const groups = searchParams.get("tests")?.split(",");

  const groupResults: { [group: string]: boolean } = JSON.parse(
    localStorage.getItem("forcedGroups") ?? "{}"
  );

  groups?.forEach((group) => {
    if (group.length > 1) {
      const groupName = group.slice(0, group.length - 1);
      const trueFalseFlag = group.slice(group.length - 1);
      if (trueFalseFlag === "r") {
        delete groupResults[groupName];
      } else if (trueFalseFlag === "n") {
        groupResults[groupName] = false;
      } else if (trueFalseFlag === "y") {
        groupResults[groupName] = true;
      }
    }
  });

  localStorage.setItem("forcedGroups", JSON.stringify(groupResults));
}
