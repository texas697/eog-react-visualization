
export const getSelectedMetrics = state => {
    return state.metrics.selectedMetrics;
};


export const getSeriesData = state => {
    return state.measurements.seriesData;
};


export const getAxisData = state => {
    return state.measurements.axisData;
};


export const getTrafficSeriesData = state => {
    return state.measurements.trafficSeriesData;
};


export const getWindowHeight = state => {
    return state.measurements.windowHeight;
};
