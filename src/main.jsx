import React, { Suspense, lazy } from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './store/store';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './index.css';
import ErrorBoundary from './components/ErrorBoundary';
import Loading from './components/Loading';

const App = lazy(() => import('./App'));

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <ErrorBoundary>
        <Suspense fallback={<Loading />}>
          <App />
        </Suspense>
      </ErrorBoundary>
    </Provider>
  </React.StrictMode>
);
