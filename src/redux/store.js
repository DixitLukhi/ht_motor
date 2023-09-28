import { combineReducers, configureStore } from "@reduxjs/toolkit";
import accountSlice from "../pages/account/accountSlice";

const combineReducer = combineReducers({
  account: accountSlice,
});

const store = configureStore({
  reducer: combineReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(),
});

export default store;
