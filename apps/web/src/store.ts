import { configureStore } from "@reduxjs/toolkit";
import { st6Api } from "./services/st6Api";

export const store = configureStore({
  reducer: {
    [st6Api.reducerPath]: st6Api.reducer
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(st6Api.middleware)
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
