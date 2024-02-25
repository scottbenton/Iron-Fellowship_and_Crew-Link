export enum PackageTypes {
  Expansion = "expansion",
}

export interface BaseHomebrewCollectionDocument {
  type: PackageTypes;
  id: string;
  title: string;
  editors: string[];
  creator: string;
  rulesetId: string;
}

export interface ExpansionDocument extends BaseHomebrewCollectionDocument {
  type: PackageTypes.Expansion;
}

export type HomebrewCollectionDocument = ExpansionDocument;
