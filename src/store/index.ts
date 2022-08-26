import {
  Action,
  combineReducers,
  configureStore,
  getDefaultMiddleware,
  ThunkAction,
} from '@reduxjs/toolkit';
import counterReducer from '@store/counter/counterReducer';
import loginReducer from './counter/loginReducer';
import snackbarReducer from './counter/snackbarReducer';
import storage from 'redux-persist/lib/storage';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import modalReducer from './counter/modalReducer';

const persistConfig = {
  key: 'root',
  storage,
};
const persistedReducer = persistReducer(
  persistConfig,
  combineReducers({
    counter: counterReducer,
    snackbar: snackbarReducer,
    loginUser: loginReducer,
    modal: modalReducer,
  })
);
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
export const persistor = persistStore(store);
