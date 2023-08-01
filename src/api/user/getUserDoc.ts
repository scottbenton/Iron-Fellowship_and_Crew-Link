import { getDoc } from "firebase/firestore";
import { ApiFunction, useApiState } from "hooks/useApiState";
import { getUsersDoc } from "./_getRef";
import { useEffect, useRef, useState } from "react";
import { UserDocument } from "types/User.type";
import { useMiscDataStore } from "stores/miscData.store";

export const getUserDoc: ApiFunction<{ uid?: string }, UserDocument> =
  function (params) {
    const { uid } = params;

    return new Promise((resolve, reject) => {
      if (!uid) {
        throw new Error("User ID not found");
        return;
      }
      getDoc(getUsersDoc(uid))
        .then((snapshot) => {
          const user: UserDocument | undefined = snapshot.data();
          if (user) {
            resolve(user);
          } else {
            reject("User not found.");
          }
        })
        .catch((e) => {
          console.error(e);
          reject("Failed to load user.");
        });
    });
  };

export function useGetUserDoc() {
  const { call, data, loading, error } = useApiState(getUserDoc);

  return {
    getUserDoc: call,
    data,
    loading,
    error,
  };
}

export function useUserDoc(userId?: string) {
  const user = useMiscDataStore((store) => store.userDocs[userId ?? ""]);
  const setStoreUserDoc = useMiscDataStore((store) => store.setUserDoc);
  const { getUserDoc, loading, data } = useGetUserDoc();

  useEffect(() => {
    if (userId) {
      getUserDoc({ uid: userId });
    }
  }, [userId]);

  useEffect(() => {
    if (userId && data) {
      setStoreUserDoc(userId, data);
    }
  }, [userId, data]);

  return {
    user: data ?? user,
    loading,
  };
}

export function useUserDocs(userIds: string[]) {
  const allUsers = useMiscDataStore((store) => store.userDocs);
  const setStoreUserDoc = useMiscDataStore((store) => store.setUserDoc);
  const { getUserDoc } = useGetUserDoc();

  const [userDocs, setUserDocs] = useState<UserDocument[]>([]);
  const loadingUserDocsRef = useRef<{ [key: string]: boolean }>({});

  useEffect(() => {
    console.debug("IN USE USER DOCS USE EFFECT");
    const loadedUsers: UserDocument[] = [];
    userIds.forEach((uid) => {
      if (allUsers[uid]) {
        loadedUsers.push(allUsers[uid]);
      } else if (loadingUserDocsRef.current[uid] !== true) {
        loadingUserDocsRef.current[uid] = true;
        getUserDoc({ uid }).then((userDoc) => {
          setStoreUserDoc(uid, userDoc);
        });
      }
    });
    setUserDocs(loadedUsers);
  }, [userIds, allUsers]);

  return userDocs;
}
