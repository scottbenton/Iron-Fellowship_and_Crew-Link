import { useMemo, useState } from "react";

export enum CATEGORY_VISIBILITY {
  HIDDEN,
  SOME,
  ALL,
}

export interface DataswornCollectionFilterItem {
  _id: string;
  name: string;
}

export interface DataswornCollectionFilterCollection<
  TItem extends DataswornCollectionFilterItem,
> {
  _id: string;
  name: string;
  contents?: Record<string, TItem>;
}

export interface DataswornCollectionFilterOptions<
  TCollection extends DataswornCollectionFilterCollection<TItem>,
  TItem extends DataswornCollectionFilterItem,
> {
  collections: Record<string, TCollection>;
  rootCollectionIds: string[];
  search: string;
  getItems?: (collection: TCollection) => TItem[];
  getSubCollections?: (collection: TCollection) => TCollection[];
}

export interface DataswornCollectionFilterResult {
  visibleCollectionIds: Record<string, CATEGORY_VISIBILITY>;
  visibleItemIds: Record<string, boolean>;
  isEmpty: boolean;
}

export function filterDataswornCollections<
  TCollection extends DataswornCollectionFilterCollection<TItem>,
  TItem extends DataswornCollectionFilterItem,
>(
  options: DataswornCollectionFilterOptions<TCollection, TItem>,
): DataswornCollectionFilterResult {
  const { collections, search, getItems, getSubCollections } = options;
  const normalizedSearch = search.toLocaleLowerCase();

  const visibleCollectionIds: Record<string, CATEGORY_VISIBILITY> = {};
  const visibleItemIds: Record<string, boolean> = {};
  let isEmpty = true;

  const filterCollection = (collection: TCollection): boolean => {
    const items = getItems
      ? getItems(collection)
      : Object.values(collection.contents ?? {});
    const subCollections = getSubCollections
      ? getSubCollections(collection)
      : [];
    const hasChildren = items.length > 0 || subCollections.length > 0;
    const collectionMatches =
      !normalizedSearch ||
      collection.name.toLocaleLowerCase().includes(normalizedSearch);

    if (hasChildren && collectionMatches) {
      isEmpty = false;
      visibleCollectionIds[collection._id] = CATEGORY_VISIBILITY.ALL;
      return true;
    }

    let hasMatchingDescendant = false;

    subCollections.forEach((subCollection) => {
      if (filterCollection(subCollection)) {
        hasMatchingDescendant = true;
      }
    });

    items.forEach((item) => {
      if (item.name.toLocaleLowerCase().includes(normalizedSearch)) {
        visibleItemIds[item._id] = true;
        hasMatchingDescendant = true;
      }
    });

    if (hasMatchingDescendant) {
      isEmpty = false;
      visibleCollectionIds[collection._id] = CATEGORY_VISIBILITY.SOME;
    } else {
      visibleCollectionIds[collection._id] = CATEGORY_VISIBILITY.HIDDEN;
    }

    return hasMatchingDescendant;
  };

  Object.values(collections).forEach((collection) => {
    filterCollection(collection);
  });

  return {
    visibleCollectionIds,
    visibleItemIds,
    isEmpty,
  };
}

export function useDataswornCollectionFilter<
  TCollection extends DataswornCollectionFilterCollection<TItem>,
  TItem extends DataswornCollectionFilterItem,
>(
  {
    collections,
    rootCollectionIds,
    getItems,
    getSubCollections,
  }: Omit<
    DataswornCollectionFilterOptions<TCollection, TItem>,
    "search"
  >,
) {
  const [search, setSearch] = useState("");

  const { visibleCollectionIds, visibleItemIds, isEmpty } = useMemo(
    () =>
      filterDataswornCollections({
        collections,
        rootCollectionIds,
        getItems,
        getSubCollections,
        search,
      }),
    [collections, rootCollectionIds, getItems, getSubCollections, search],
  );

  return {
    setSearch,
    visibleCollectionIds,
    visibleItemIds,
    isSearchActive: !!search,
    isEmpty,
    rootCollectionIds,
  };
}
