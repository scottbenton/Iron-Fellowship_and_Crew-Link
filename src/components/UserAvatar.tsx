import { useEffect } from "react";
import { useStore } from "stores/store";
import { Avatar, Skeleton } from "@mui/material";

export interface UserAvatarProps {
  uid: string;
}

export function UserAvatar(props: UserAvatarProps) {
  const { uid } = props;
  const user = useStore((store) => store.users.userMap[uid]?.doc);
  const loadUser = useStore((store) => store.users.loadUserDocument);
  useEffect(() => {
    loadUser(uid);
  }, [loadUser, uid]);

  const initials = getInitials(user?.displayName ?? "User");
  if (!user) {
    <Skeleton variant={"circular"}>
      <Avatar />
    </Skeleton>;
  }
  return <Avatar src={user?.photoURL ?? undefined}>{initials}</Avatar>;
}

const getInitials = (name: string) => {
  const names = name.split(" ");
  let initials = names[0].substring(0, 1).toUpperCase();

  if (names.length > 1) {
    initials += names[names.length - 1].substring(0, 1).toUpperCase();
  }
  return initials;
};
