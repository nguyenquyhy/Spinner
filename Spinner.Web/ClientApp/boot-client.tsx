import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import * as RoutesModule from './routes';

var routes = RoutesModule.routes;

const rootElement = document.getElementById('root');

function renderApp() {
    ReactDOM.render(
        <BrowserRouter>{routes()}</BrowserRouter>,
        rootElement
    );
}

renderApp();

//registerServiceWorker();

// Allow Hot Module Replacement
if (module.hot) {
    module.hot.accept('./routes', () => {
        routes = require<typeof RoutesModule>('./routes').routes;
        renderApp();
    });
}
