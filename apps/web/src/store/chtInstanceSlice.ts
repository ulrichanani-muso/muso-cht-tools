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
  allInstancesLoaded: boolean;
}

const initialState : ChtInstanceState = {
  current: null,
  instances: [],
  allInstancesLoaded: false,
}

export const chtInstanceSlice = createSlice({
  name: 'chtInstance',
  initialState,
  reducers: {
    setCurrentInstance: (state, action: PayloadAction<number>) => {
      const instance = state.instances.find((i) => i.id === action.payload) || null
      localStorage.setItem('cht-utils.current-instance', instance?.id || '')
      state.current = instance
    },
    setInstances: (state, action: PayloadAction<ChtInstance[]>) => {
      state.instances = action.payload
      state.allInstancesLoaded = true
    },
    unsetCurrentInstance: (state) => {
      state.current = null
    },
  },
})

export const currentInstance = (state: RootState) => state.chtInstance.current

export const {
  setCurrentInstance, unsetCurrentInstance, setInstances,
} = chtInstanceSlice.actions

export default chtInstanceSlice.reducer
