/* eslint-disable padding-line-between-statements */
import { RouteObject } from 'react-router-dom';

import MainLayout from '../layout/main';
import { loadable } from '../utils/async';

import paths from './paths';

const HomePage = loadable(() => import('../pages/home'));
const ContactPage = loadable(() => import('../pages/contact'));
const BlogPage = loadable(() => import('../pages/blog'));
const AboutPage = loadable(() => import('../pages/about'));

export const routes: RouteObject[] = [
  {
    path: paths.root,
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <div>Root</div>,
      },
      {
        path: paths.home,
        element: <HomePage />,
      },
      {
        path: paths.about,
        element: <AboutPage />,
      },
      {
        path: paths.contact,
        element: <ContactPage />,
      },
      {
        path: paths.blog,
        element: <BlogPage />,
      },
    ],
  },
];
