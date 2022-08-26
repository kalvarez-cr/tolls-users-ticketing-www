import {
  combineReducers,
  configureStore,
  getDefaultMiddleware,
} from '@reduxjs/toolkit';
import counterReducer from '@store/counter/counterReducer';
import loginReducer from './counter/loginReducer';
import storage from 'redux-persist/lib/storage';
import snackbarReducer from './counter/snackbarReducer';
import {
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
  key: 'main-root',
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

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
