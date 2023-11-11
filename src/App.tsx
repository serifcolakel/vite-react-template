import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import { routes } from './routes';

function App() {
  return (
    <RouterProvider
      fallbackElement={<div>Loading...</div>}
      router={createBrowserRouter(routes)}
    />
  );
}

export default App;
