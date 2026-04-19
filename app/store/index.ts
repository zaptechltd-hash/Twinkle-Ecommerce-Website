import { configureStore, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { combineReducers } from "redux";

// ── Types ──────────────────────────────────────────────
interface CartItem {
  id: string | number;
  name: string;
  price: number;
  qty: number;
  selectedSize: string;
  images: string[];
}

interface WishlistItem {
  id: string | number;
  name: string;
  price: number;
  images: string[];
  sizes: string[];
}

interface AuthUser {
  name: string;
  email: string;
}

// ── Cart Slice ─────────────────────────────────────────
const cartSlice = createSlice({
  name: "cart",
  initialState: [] as CartItem[],
  reducers: {
    addToCart(state, action: PayloadAction<CartItem>) {
      const existing = state.find(
        (i) => i.id === action.payload.id && i.selectedSize === action.payload.selectedSize
      );
      if (existing) {
        existing.qty += action.payload.qty;
      } else {
        state.push(action.payload);
      }
    },
    removeFromCart(state, action: PayloadAction<number>) {
      state.splice(action.payload, 1);
    },
  },
});

// ── Wishlist Slice ─────────────────────────────────────
const wishlistSlice = createSlice({
  name: "wishlist",
  initialState: [] as WishlistItem[],
  reducers: {
    toggleWishlist(state, action: PayloadAction<WishlistItem>) {
      const index = state.findIndex((i) => i.id === action.payload.id);
      if (index !== -1) {
        state.splice(index, 1);
      } else {
        state.push(action.payload);
      }
    },
    removeFromWishlist(state, action: PayloadAction<number>) {
      state.splice(action.payload, 1);
    },
  },
});

// ── Auth Slice ─────────────────────────────────────────
const authSlice = createSlice({
  name: "auth",
  initialState: null as AuthUser | null,
  reducers: {
    login(_state, action: PayloadAction<AuthUser>) {
      return action.payload;
    },
    logout() {
      return null;
    },
  },
});

// ── Root Reducer + Persist ─────────────────────────────
const rootReducer = combineReducers({
  cart: cartSlice.reducer,
  wishlist: wishlistSlice.reducer,
  auth: authSlice.reducer,
});

const persistConfig = {
  key: "twinkle-root",
  storage,
  whitelist: ["cart", "wishlist"], // auth won't persist (resets on refresh)
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

// ── Store ──────────────────────────────────────────────
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

export const persistor = persistStore(store);

// ── Exports ────────────────────────────────────────────
export const { addToCart, removeFromCart } = cartSlice.actions;
export const { toggleWishlist, removeFromWishlist } = wishlistSlice.actions;
export const { login, logout } = authSlice.actions;

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;