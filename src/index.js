import React, { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import App from './App';

import { ApolloProvider } from '@apollo/client';
import { ApolloClient, InMemoryCache } from '@apollo/client';

const client = new ApolloClient({
  cache: new InMemoryCache(),
});

const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);

root.render(
  <ApolloProvider client={client}>
    <StrictMode>
      <App />
    </StrictMode>
  </ApolloProvider>
);