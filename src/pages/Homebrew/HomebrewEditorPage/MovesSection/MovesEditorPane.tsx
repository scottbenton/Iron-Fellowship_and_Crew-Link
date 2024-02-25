export interface MovesEditorPaneProps {
  homebrewId: string;
}

export function MovesEditorPane(props: MovesEditorPaneProps) {
  const { homebrewId } = props;

  console.debug(homebrewId);
  return <>Editor</>;
}
