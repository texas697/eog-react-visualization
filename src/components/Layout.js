import React from 'react';
import { debounce } from 'throttle-debounce';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import ChartsContainer from '../containers/Chart';
import store from '../store/index';
import { actions } from '../containers/Chart/reducer';

export default class extends React.Component {
  constructor(props) {
    super(props);
    this._throttle = debounce(1000, this._throttle);
  }

  componentDidMount () {
    window.addEventListener('resize', () => this._throttle());
    this._setDimensions();
  }

  _setDimensions = () => {
    store.dispatch(actions.setWindowHeight(window.innerHeight));
  }

  _throttle = () => {
    this._setDimensions();
  }

  render () {
    return (
      <Card>
        <CardContent>
          <ChartsContainer/>
        </CardContent>
      </Card>
    )
  }
}
