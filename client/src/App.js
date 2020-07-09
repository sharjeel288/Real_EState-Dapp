import './App.css';
import React, { useEffect, Fragment } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import Navbar from '../src/components/layout/Navbar';
import Landing from '../src/components/layout/Landing';
import CoustomRoutes from './components/Router/Routes';
import Web3 from 'web3';

//RedUx
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from './reducer/index';
import setToken from './utils/setAuthToken';
import { userLoaded } from './actions/auth';

export let Account = '';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const initialState = {};
const store = createStore(
  rootReducer,
  initialState,
  composeEnhancers(applyMiddleware(thunk))
);

if (localStorage.token) {
  setToken(localStorage.token);
}

//connection with Meta Mask

const App = () => {
  useEffect(() => {
    // Connecting to metaMask
    async function loadweb3() {
      if (window.ethereum) {
        window.web3 = new Web3(window.ethereum);
        await window.ethereum.enable();
      } else if (window.web3) {
        window.web3 = new Web3(window.web3.currentProvider);
      } else {
        window.alert(
          'Non-Ethereum browser detected. You should consider trying MetaMask!'
        );
      }
      const web3 = window.web3;
      const account = await web3.eth.getAccounts();
      Account = account[0].toString();
    }
    loadweb3();
    store.dispatch(userLoaded());
  }, [Account]);
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Fragment>
          <Navbar />
          <Switch>
            <Route exact path='/' component={Landing}></Route>
            <Route component={CoustomRoutes} />
          </Switch>
        </Fragment>
      </BrowserRouter>
    </Provider>
  );
};

export default App;
