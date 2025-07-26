import storage from "redux-persist/lib/storage";
import authSlice from "../redux/Feature/auth/authSlice";
import { configureStore } from "@reduxjs/toolkit";
import { baseApi } from "./api/baseApi";
import {
  FLUSH,
  PAUSE,
  PERSIST,
  persistReducer,
  PURGE,
  REGISTER,
  REHYDRATE,
} from "redux-persist";
import persistStore from "redux-persist/es/persistStore";
const persistConfig = {
  key: "root",
  storage,
};

const persistedReducer = persistReducer(persistConfig, authSlice);

export const store = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,
    auth: persistedReducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(baseApi.middleware),
});

export const persistor = persistStore(store);
