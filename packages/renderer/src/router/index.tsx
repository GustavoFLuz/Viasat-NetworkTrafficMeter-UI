import {Container} from '@/layout';
import * as pages from '@/pages';
import {createHashRouter} from 'react-router-dom';
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
      },
      {
        path: '/settings',
        element: <pages.Settings />,
      },
    ],
  },
]);
