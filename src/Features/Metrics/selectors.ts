import {IState} from "../../store";

export const getMetricsList = (state: IState) => {
    const { metricsList } = state.metrics;
    return {
        metricsList
    };
};

export const getSelectedMetrics = (state: IState) => {
    const { metricsSelected } = state.metrics;
    return {
        metricsSelected
    };
};
