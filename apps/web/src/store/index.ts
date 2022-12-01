import { configureStore } from '@reduxjs/toolkit'
import chtInstanceReducer from './chtInstanceSlice'
import flashMessagesReducer from './flashMessagesSlice'

export const store = configureStore({
  reducer: {
    chtInstance: chtInstanceReducer,
    flashMessages: flashMessagesReducer,
  },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
