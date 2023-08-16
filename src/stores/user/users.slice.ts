import { CreateSliceType } from "stores/store.type";
import { UserSlice } from "./users.slice.type";
import { defaultUserSlice } from "./users.slice.default";
import { getUserDoc } from "api-calls/user/getUserDoc";

export const createUsersSlice: CreateSliceType<UserSlice> = (
  set,
  getState
) => ({
  ...defaultUserSlice,
  loadUserDocument: (userId) => {
    const existingDoc = getState().users.userMap[userId];
    if (!existingDoc) {
      set((store) => {
        store.users.userMap[userId] = { loading: true };
      });
      getUserDoc({ uid: userId })
        .then((doc) => {
          set((store) => {
            store.users.userMap[userId] = { loading: false, doc };
          });
        })
        .catch(() => {});
    }
  },
  loadUserDocuments: (userIds) => {
    userIds.forEach((uid) => {
      const existingDoc = getState().users.userMap[uid];
      if (!existingDoc) {
        {
          set((store) => {
            store.users.userMap[uid] = { loading: true };
          });
          getUserDoc({ uid: uid })
            .then((doc) => {
              set((store) => {
                store.users.userMap[uid] = { loading: false, doc };
              });
            })
            .catch(() => {});
        }
      }
    });
  },
});
