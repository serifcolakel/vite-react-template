import ReactDOM from 'react-dom/client';

import { ConfirmProvider } from './utils/confirm/confirm.provider';
import App from './App';

import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <ConfirmProvider>
    <App />
  </ConfirmProvider>
);
