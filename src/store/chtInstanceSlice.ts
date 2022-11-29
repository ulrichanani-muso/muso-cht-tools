import { createSlice, PayloadAction } from '@reduxjs/toolkit'
// import { RootState } from '@store';

interface ChtInstance {
  id: number;
  name: string;
  url: string;
  username: string;
  password: string;
}

// Define a type for the slice state
interface ChtInstanceState {
  current: ChtInstance | null;
  instances: ChtInstance[];
}

const initialState : ChtInstanceState = {
  current: null,
  instances: [],
}

export const chtInstanceSlice = createSlice({
  name: 'chtInstance',
  initialState,
  reducers: {
    setCurrentInstance: (state, action: PayloadAction<number>) => {
      state.current = state.instances.find((i) => i.id === action.payload) || null
    },
    setInstances: (state, action: PayloadAction<ChtInstance[]>) => {
      state.instances = action.payload
    },
    unsetCurrentInstance: (state) => {
      state.current = null
    },
  },
})

// export const currentInstance = (state: RootState) => state.chtInstance.current

export const {
  setCurrentInstance, unsetCurrentInstance, setInstances,
} = chtInstanceSlice.actions

export default chtInstanceSlice.reducer
