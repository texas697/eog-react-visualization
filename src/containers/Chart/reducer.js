import { createSlice } from 'redux-starter-kit';

const initialState = {
  seriesData: [],
  axisData: [],
  trafficSeriesData: [],
  error: '',
  windowHeight: 0
};

const slice = createSlice({
  name: 'measurements',
  initialState,
  reducers: {
    setSeriesData: (state, action) => {
      state.seriesData = action.payload;
    },
    setAxisData: (state, action) => {
      state.axisData = action.payload;
    },
    setTrafficSeriesData: (state, action) => {
      state.trafficSeriesData = action.payload;
    },
    setWindowHeight: (state, action) => {
      state.windowHeight = action.payload;
    },
    measurementsApiErrorReceived: (state, action) => {
      state.error = action.payload;
    }
  },
});

export const reducer = slice.reducer;
export const actions = slice.actions;
