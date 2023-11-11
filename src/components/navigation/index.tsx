import { NavLink } from 'react-router-dom';

import paths from '../../routes/paths';

const links = [
  {
    path: paths.root,
    label: 'Root',
  },
  {
    path: paths.home,
    label: 'Home',
  },
  {
    path: paths.about,
    label: 'About',
  },
  {
    path: paths.contact,
    label: 'Contact',
  },
  {
    path: paths.blog,
    label: 'Blog',
  },
];

export default function Navigation() {
  return (
    <nav className="flex flex-row justify-center items-center h-16 gap-x-8 bg-orange-400">
      {links.map(({ path, label }) => (
        <NavLink
          className="text-2xl font-bold text-white hover:text-gray-800"
          key={path}
          to={path}
        >
          {({ isActive }) => (
            <p
              className={`
                ${isActive ? 'text-gray-800' : ''}
              `}
            >
              {label}
            </p>
          )}
        </NavLink>
      ))}
    </nav>
  );
}
