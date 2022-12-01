import { createSlice, PayloadAction } from '@reduxjs/toolkit'

type MessageType = 'info' | 'success' | 'warn' | 'error'

interface FlashMessage {
  text: string;
  type?: MessageType;
}

interface FlashMessagesState {
  messages: FlashMessage[];
}

const initialState : FlashMessagesState = {
  messages: [],
}

export const flashMessagesSlice = createSlice({
  name: 'flashMessages',
  initialState,
  reducers: {
    flash: (state, action: PayloadAction<FlashMessage>) => {
      state.messages = [...state.messages, action.payload]
    },
    clearMessages: (state) => {
      state.messages = []
    },
  },
})

// export const currentInstance = (state: RootState) => state.chtInstance.current

export const {
  flash, clearMessages,
} = flashMessagesSlice.actions

export default flashMessagesSlice.reducer
