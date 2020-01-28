import {createStyles, makeStyles, Theme} from '@material-ui/core/styles'
import {createClient} from "urql";

export const query = `query { getMetrics }`;

export const client = createClient({
    url: 'https://react.eogresources.com/graphql',
});

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    formControl: {
      margin: theme.spacing(1),
      minWidth: 400,
      maxWidth: 400
    },
    chips: {
      display: 'flex',
      flexWrap: 'wrap',
    },
    chip: {
      margin: 2,
    },
    noLabel: {
      marginTop: theme.spacing(3),
    },
  }),
);

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
export const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 400
    },
  },
};

export function getStyles(x: string, selectedMetric: string[], theme: Theme) {
  return {
    fontWeight: selectedMetric.indexOf(x) === -1 ? theme.typography.fontWeightRegular : theme.typography.fontWeightMedium
  };
}

export function formatString(x: string) {
    const result = x.replace( /([A-Z])/g, " $1" );
    return result.charAt(0).toUpperCase() + result.slice(1);
}
