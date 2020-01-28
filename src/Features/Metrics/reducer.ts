import { createSlice, PayloadAction } from 'redux-starter-kit';

export type MetricsForDropdown = {
    metricsList: Array<{ value: number, label: string }>;
};

export type ApiErrorAction = {
    error: string;
};

const initialState = {
    metricsList: []
};

const slice = createSlice({
    name: 'metrics',
    initialState,
    reducers: {
        metricsDataRecevied: (state, action: PayloadAction<MetricsForDropdown>) => {
            // @ts-ignore
            state.metricsList = action.payload;
        },
        metricsApiErrorReceived: (state, action: PayloadAction<ApiErrorAction>) => state,
    },
});

export const reducer = slice.reducer;
export const actions = slice.actions;
