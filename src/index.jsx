import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import reducers from './redux/reducers';
import App from './components/app';
import registerServiceWorker from './registerServiceWorker';
import './components/bundle.scss';

const isDevelopment = process.env.NODE_ENV === 'development';
const createStoreWithMiddleware = applyMiddleware()(createStore);
const applyReduxDevTools = isDevelopment ?
  composeWithDevTools : store => store; // pass-through if production (i.e., don't apply dev-tools)
const store = createStoreWithMiddleware(reducers, applyReduxDevTools(applyMiddleware(thunk)));

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>,
  document.getElementById('root'),
);
registerServiceWorker();
