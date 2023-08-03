import { Unsubscribe } from "firebase/firestore";
import { useEffect } from "react";
import { useStore } from "stores/store";
import { shallow } from "zustand/shallow";

export function useListenToWorlds() {
  const uid = useStore((store) => store.auth.user?.uid);
  const subscribeToOwnedWorlds = useStore(
    (store) => store.worlds.subscribeToOwnedWorlds
  );
  const ownedWorldsLoading = useStore((store) => store.worlds.loading);
  const ownedWorldIds = useStore((store) => {
    return Object.keys(store.worlds.worldMap);
  }, shallow);
  const subscribeToNonOwnedWorlds = useStore(
    (store) => store.worlds.subscribeToNonOwnedWorlds
  );

  const campaignsLoading = useStore((store) => store.campaigns.loading);
  const campaignWorldIds = useStore((store) => {
    const worldIds = new Set<string>();

    Object.values(store.campaigns.campaignMap).forEach((campaign) => {
      if (campaign.worldId) {
        worldIds.add(campaign.worldId);
      }
    });

    return Array.from(worldIds);
  }, shallow);

  useEffect(() => {
    const unsubscribe = subscribeToOwnedWorlds(uid);

    return () => {
      unsubscribe && unsubscribe();
    };
  }, [uid, subscribeToOwnedWorlds]);

  useEffect(() => {
    let unsubscribe: Unsubscribe | undefined;
    if (!ownedWorldsLoading && !campaignsLoading) {
      unsubscribe = subscribeToNonOwnedWorlds(campaignWorldIds, ownedWorldIds);
    }

    return () => {
      unsubscribe && unsubscribe();
    };
  }, [
    ownedWorldIds,
    ownedWorldsLoading,
    campaignWorldIds,
    campaignsLoading,
    subscribeToNonOwnedWorlds,
  ]);
}
