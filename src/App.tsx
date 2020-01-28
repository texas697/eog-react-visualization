import React from 'react';
import store from './store';
import { Provider } from 'react-redux';
import {
  Provider as UrqlProvider,
  createClient,
  defaultExchanges,
  subscriptionExchange
} from "urql";
import { SubscriptionClient } from "subscriptions-transport-ws";
import { ToastContainer } from 'react-toastify';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import 'react-toastify/dist/ReactToastify.css';
import './index.css';
import Header from './components/Header';
import Wrapper from './components/Wrapper';
import Layout from './components/Layout';
import * as process from "process";

const theme = createMuiTheme({
  palette: {
    primary: {
      main: 'rgb(39,49,66)',
    },
    secondary: {
      main: 'rgb(197,208,222)',
    },
    background: {
      default: 'rgb(226,231,238)',
    }
  },
  overrides: {
    MuiInput: {
      underline: {
        "&:before": {
          borderBottom: `1px solid #ffffff`
        }
      }
    }
  },
});

const subscriptionClient = new SubscriptionClient(
    `${process.env.NODE_ENV === "production" ? "wss" : "ws"}://react.eogresources.com/graphql`,
    {
      reconnect: true,
      timeout: 30000
    }
);

const client = createClient({
  url: "https://react.eogresources.com/graphql",
  exchanges: [
    ...defaultExchanges,
    subscriptionExchange({
      forwardSubscription: operation => subscriptionClient.request(operation)
    })
  ]
});

const App = () => (
  <MuiThemeProvider theme={theme}>
    <CssBaseline />
    <Provider store={store}>
      <Wrapper>
        <UrqlProvider value={client}>
        <Header />
        <Layout />
        <ToastContainer />
        </UrqlProvider>
      </Wrapper>
    </Provider>
  </MuiThemeProvider>
);

export default App;
