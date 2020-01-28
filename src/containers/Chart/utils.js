import {TimeSeries} from "pondjs"
import {formatString} from '../Metrics/utils'
import {styler} from 'react-timeseries-charts'

export const buildSeriesData = data => {
  return data.reduce((accum, elem) => {
    const { metric, measurements } = elem;
    const points = measurements.map(m => [m.at, m.value, m.unit, m.metric]);

    const series = new TimeSeries({
      name: formatString(metric),
      columns: ["time", "value", "unit", "metric"],
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

export const assignColor = metric => {
  if (metric === "waterTemp") return "#000000";
  else if (metric === "casingPressure") return "#c7000d";
  else if (metric === "injValveOpen") return "#0013f7";
  else if (metric === "flareTemp") return "#FFC300";
  else if (metric === "oilTemp") return "#249000";
  else if (metric === "tubingPressure") return "#f77800";
}

export const buildLegendCategories = series => {
  const _columns = [];
  series.forEach(x => {
    const _metric = x.atLast().get("metric");
    _columns.push({
      key: _metric,
      label: formatString(_metric)
    });
  });
  return _columns;
}

export const buildLegendStyle = series => {
  const _colors = [];
  series.forEach(x => {
    const _metric = x.atLast().get("metric");
    _colors.push({
      key: _metric,
      color: assignColor(_metric)
    });
  });
  return styler(_colors);
}

const calcThirtyMinutesAgo = () => new Date() - 30 * 60 * 1000;
export const thirtyMinutesAgo = calcThirtyMinutesAgo();
