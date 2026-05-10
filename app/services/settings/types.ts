export interface PriceFilter {
  label: string;
  min: number;
  max: number | null; // null = Infinity
}

export interface Settings {
  codEnabled: boolean;
  flatFee: number;
  freeThreshold: number;
  deliveryLabel: string;
  minOrder: number;
  guestCheckout: boolean;
  // new
  storeName: string;
  contactNumber: string;
  priceFilters: PriceFilter[] | null;
}

export interface UpdateSettingsPayload extends Partial<Settings> {}
