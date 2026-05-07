export interface Settings {
  id:            number;
  codEnabled:    boolean;
  flatFee:       number;
  freeThreshold: number;
  deliveryLabel: string;
  minOrder:      number;
  guestCheckout: boolean;
  updatedAt:     string;
}

export interface UpdateSettingsPayload {
  codEnabled?:    boolean;
  flatFee?:       number;
  freeThreshold?: number;
  deliveryLabel?: string;
  minOrder?:      number;
  guestCheckout?: boolean;
}