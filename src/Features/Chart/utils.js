import {TimeSeries} from "pondjs"

export const buildSeriesData = data => {
  return data.reduce((accum, elem) => {
    const { metric, measurements } = elem;
    const points = measurements.map(m => [m.at, m.value, m.unit]);

    const series = new TimeSeries({
      name: metric,
      columns: ["time", "value", "unit"],
      points
    });

    if (!accum[metric]) {
      accum[metric] = series;
    } else {
      accum[metric] = TimeSeries.timeSeriesListMerge({
        name: metric,
        seriesList: [accum[metric], series]
      });
    }

    return accum;
  }, []);
};

export const buildAxisData = (seriesData) => {
  return seriesData.filter(r => r).reduce((accum, elem) => {
    const unit = elem.atLast().get("unit");
    const existingElement = accum.find(a => a.id === unit);
    if (!existingElement) {
      accum.push({
        id: unit,
        label: unit,
        min: elem.min(),
        max: elem.max()
      });
    } else {
      const existingMin = elem.min();
      const existingMax = elem.max();
      existingElement.min = Math.min(existingElement.min, existingMin);
      existingElement.max = Math.max(existingElement.max, existingMax);
    }
    return accum;
  }, []);
}

export const buildTrafficSeriesData = (seriesData) => {
  return TimeSeries.timeSeriesListMerge({
    name: "Metrics",
    seriesList: seriesData
  });
}

const calcThirtyMinutesAgo = () => new Date() - 30 * 60 * 1000;
export const thirtyMinutesAgo = calcThirtyMinutesAgo();
