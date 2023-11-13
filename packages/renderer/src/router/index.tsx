import {Container} from '@/layout';
import * as pages from '@/pages';
import {createHashRouter, redirect} from 'react-router-dom';
import {NetworkUsageProvider} from '@/shared/contexts';

export const router = createHashRouter([
  {
    element: <Container />,
    children: [
      {
        path: '/',
        element: (
          <NetworkUsageProvider>
            <pages.Dashboard />
          </NetworkUsageProvider>
        ),
        loader: async () => {
          await new Promise(res=>setTimeout(res, 100))
          const chosenInterface = await window.backend.get_interface();
          if (chosenInterface===undefined) {
            return redirect("/setinterface");
          }
          return null;
        },
      },
      {
        path: '/settings',
        element: <pages.Settings />,
      },
      {
        path: '/setinterface',
        element: <pages.SetInterface />,
      },
    ],
  },
]);
