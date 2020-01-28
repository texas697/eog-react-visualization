import {IState} from "../../store";

export const getMetricsList = (state: IState) => {
    return state.metrics.metricsList;
};

export const getSelectedMetrics = (state: IState) => {
    return state.metrics.selectedMetrics;
};
