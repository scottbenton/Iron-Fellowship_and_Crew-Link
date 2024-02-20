export interface StoredStat {
  dataswornId: string;
  collectionId: string;
  label: string;
  description?: string;
}

export interface StoredConditionMeter {
  dataswornId: string;
  collectionId: string;
  description?: string;
  shared: boolean;
  label: string;
  value: number;
  min: number;
  max: number;
  rollable: boolean;
}

export interface StoredImpact {
  label: string;
  dataswornId: string;
  description?: string;
  shared: boolean;
  // ex: health, spirit
  preventsRecovery: string[];
  permanent: boolean;
}

export interface StoredImpactCategory {
  collectionId: string;
  label: string;
  description?: string;
  contents: {
    [impactKey: string]: StoredImpact;
  };
}
export interface StoredLegacyTrack {
  dataswornId: string;
  collectionId: string;
  label: string;
  description?: string;
  shared: boolean;
  optional: boolean;
}
