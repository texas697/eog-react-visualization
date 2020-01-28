import { createSlice } from 'redux-starter-kit';

const initialState = {
  measurementsData: [],
  seriesData: [],
  axisData: [],
  trafficSeriesData: [],
  error: ''
};

const slice = createSlice({
  name: 'measurements',
  initialState,
  reducers: {
    receiveMeasurementData: (state, action) => {
      state.measurementsData = action.payload;
    },
    setSeriesData: (state, action) => {
      state.seriesData = action.payload;
    },
    setAxisData: (state, action) => {
      state.axisData = action.payload;
    },
    setTrafficSeriesData: (state, action) => {
      state.trafficSeriesData = action.payload;
    },
    measurementsApiErrorReceived: (state, action) => {
      state.error = action.payload;
    }
  },
});

export const reducer = slice.reducer;
export const actions = slice.actions;
