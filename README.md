# Building a Robust Unsaved Changes Prompt with React and React Router DOM

[Full Code on Github](https://github.com/serifcolakel/vite-react-template)

## Introduction:

In the dynamic world of web applications, providing a seamless user experience is crucial. One aspect often overlooked is handling unsaved changes when a user navigates away from a page. In this article, we'll explore a custom React hook, `usePrompt`, which leverages the power of React Router DOM's `useBlocker` and a custom confirm popup to create a robust solution for preventing users from accidentally leaving a page with unsaved changes.

## Part 1: Introducing the usePrompt Hook

- **Motivation:**
  Unsaved changes can lead to data loss and a frustrating user experience. The `usePrompt` hook addresses this challenge by integrating with React Router DOM's `useBlocker` and a custom confirmation popup.

- **Key Features:**
  ✅ **React Router DOM Integration:** Leveraging the useBlocker hook ensures that the user is prompted when attempting to navigate away from a page with unsaved changes.

✅ **Custom Confirm Popup with useConfirm:** Utilizing a custom confirmation popup through the useConfirm hook allows for a personalized and visually consistent user experience.
✅ **Configurability:** The hook is highly configurable, allowing developers to customize the appearance and behavior of the confirmation dialog.

The `usePrompt` hook is designed to be a flexible and reusable solution for handling unsaved changes in a React application. Let's break down its key features:

```tsx
import { useCallback, useEffect } from 'react';
import { unstable_useBlocker as useBlocker } from 'react-router-dom';

import { useConfirm } from '../utils/confirm/confirm.hooks';
import { ConfirmOptions } from '../utils/confirm/confirm.types';

export const usePrompt = ({
  isDirty = false,
  title = 'You have unsaved changes!',
  subtitle = 'Are you sure you want to leave?',
  confirmText = 'Leave',
  cancelText = 'Stay',
  onConfirm,
  onCancel,
  type = 'warning',
}: ConfirmOptions & { isDirty?: boolean }) => {
  const blocker = useBlocker(isDirty);

  const { show } = useConfirm();

  const confirm = useCallback(() => {
    if (!isDirty) return Promise.resolve(true);

    return new Promise<boolean>((resolve) => {
      show({
        title,
        subtitle,
        confirmText,
        cancelText,
        type,
        onConfirm: () => {
          resolve(true);
          onConfirm?.();
        },
        onCancel: () => {
          resolve(false);
          onCancel?.();
        },
      });
    });
  }, [
    cancelText,
    confirmText,
    isDirty,
    onCancel,
    onConfirm,
    show,
    subtitle,
    title,
    type,
  ]);

  useEffect(() => {
    if (blocker.state === 'blocked') {
      confirm().then((result) => {
        if (result) blocker.proceed();
        else blocker.reset();
      });
    }
  }, [blocker, confirm]);

  useEffect(() => {
    if (isDirty) {
      window.onbeforeunload = () => subtitle;
    }

    return () => {
      window.onbeforeunload = null;
    };
  }, [isDirty, subtitle]);

  return {
    confirm,
  };
};
```

### React Router DOM Integration with useBlocker:

The `useBlocker` hook from React Router DOM is a crucial part of this solution. It ensures that the user is prompted when they attempt to navigate away from a page with unsaved changes. By leveraging `useBlocker`, the hook seamlessly integrates with React Router DOM, making it an ideal choice for handling route navigation.

### Configurable Options:

The usePrompt hook is highly configurable, allowing developers to customize the appearance and behavior of the confirmation dialog. Options include specifying whether the page has unsaved changes `(isDirty)`, customizing the popup's title, subtitle, confirm and cancel text, and providing callbacks for confirmation and cancellation actions.

## Part 2: The ConfirmProvider Component

- **Purpose:**
  The `ConfirmProvider` component serves as the orchestrator for managing confirmation dialogs using `React Context`. It encapsulates the state and logic required for displaying confirmation popups across the application.

- **Key Components:**

✅ **Context Creation with createContext:** The `ConfirmCtx` context is created using `createContext` to share confirmation dialog information.

✅ **State Management with useState:** The component manages the state of confirmation dialogs using `useState` for confirm options and the visibility `(open)` of the confirmation popup.

✅ **Displaying Confirmation Popups with Confirm Component:** The Confirm component is rendered within `ConfirmProvider` to display confirmation dialogs based on the provided options.

When it comes to creating a smooth and intuitive user interface, having a well-designed confirmation popup can make all the difference. In this article, we'll explore the `ConfirmProvider` component, a crucial part of a React application that enables the seamless display of confirmation popups through the use of React Context.

```tsx
// ./utils/confirm/confirm.provider.tsx
import {
  createContext,
  type ReactNode,
  useCallback,
  useMemo,
  useState,
} from 'react';

import { Confirm } from './confirm';
import { ConfirmContext, ConfirmOptions, Nullable } from './confirm.types';

export const ConfirmCtx = createContext<Nullable<ConfirmContext>>(null);

interface Props {
  children: ReactNode;
}

export function ConfirmProvider({ children }: Props) {
  const [confirm, setConfirm] = useState<Nullable<ConfirmOptions>>(null);

  const [open, toggle] = useState(false);

  const show = useCallback(
    (confirmOptions: Nullable<ConfirmOptions>) => {
      setConfirm(confirmOptions);
      toggle(true);
    },
    [toggle]
  );

  const onConfirm = () => {
    confirm?.onConfirm?.();
    toggle(false);
  };

  const onCancel = () => {
    confirm?.onCancel?.();
    toggle(false);
  };

  const value = useMemo(() => ({ show }), [show]);

  return (
    <ConfirmCtx.Provider value={value}>
      <Confirm
        type="warning"
        {...confirm}
        onCancel={onCancel}
        onConfirm={onConfirm}
        open={open}
      />
      {children}
    </ConfirmCtx.Provider>
  );
}
```

### Understanding ConfirmProvider

The ConfirmProvider component is designed to manage the state of confirmation popups within a React application. It leverages the power of React Context to provide a centralized way of triggering and handling confirmation dialogs. Let's dive into its key features:

#### The ConfirmContext Type:

The `ConfirmContext` type is an interface that defines the shape of the context value. It contains a single function, `show`, which is responsible for displaying the confirmation popup. The `show` function takes a `ConfirmOptions` object as an argument and returns a promise that resolves to a boolean indicating whether the user confirmed the action or not.

```tsx
export interface ConfirmOptions {
  title?: string;
  subtitle?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  type?: 'success' | 'error' | 'warning' | 'info';
}

export type Nullable<T> = T | null;

export interface ConfirmContext {
  show: (options: Nullable<ConfirmOptions>) => void;
}
```

#### Context Creation with createContext:

The `ConfirmCtx` is a context created using `createContext` from the React library. This context holds the information about the confirmation dialog and provides a way to share this information with the rest of the application.

```tsx
export const ConfirmCtx = createContext<Nullable<ConfirmContext>>(null);
```

#### State Management with useState:

The component uses the useState hook to manage the state of the confirmation dialog. The `confirm` state holds the configuration options for the confirmation popup, such as title, subtitle, confirm text, and cancel text. The `open` state is a boolean indicating whether the confirmation dialog should be visible.

```tsx
const [confirm, setConfirm] = useState<Nullable<ConfirmOptions>>(null);
```

#### Handling Confirmation and Cancellation:

The `onConfirm` and `onCancel` functions are callbacks that are triggered when the user confirms or cancels the action in the confirmation popup. These functions execute the corresponding actions specified in the confirmation options and then close the confirmation dialog by toggling the `open` state.

```tsx
const onConfirm = () => {
  confirm?.onConfirm?.();
  toggle(false);
};

const onCancel = () => {
  confirm?.onCancel?.();
  toggle(false);
};
```

#### Providing Context Value with useMemo:

The value prop provided to the ConfirmCtx.Provider is memoized using the `useMemo` hook. This ensures that the context value only changes when the show function (responsible for displaying the confirmation popup) changes. This optimization prevents unnecessary re-renders of components consuming the context.

```tsx
const value = useMemo(() => ({ show }), [show]);
```

#### Understanding useConfirm Hook:

The `useConfirm` hook is designed to be used within components to access the confirmation dialog functionalities provided by the `ConfirmProvider`. Let's break down its essential features:

- Accessing ConfirmContext with useContext:
  The hook utilizes the `useContext` hook from React to access the confirmation context `(ConfirmCtx)`. This context holds the `show` function, which is responsible for triggering the display of confirmation dialogs.

- Throwing an Error for Missing Provider:
  To ensure the `useConfirm` hook is used within a component hierarchy that includes the `ConfirmProvider`, a check is implemented. If the context is not available (i.e., `ConfirmProvider` is not a parent), an error is thrown, guiding developers to include the necessary provider in the component tree.

- Returning Confirm Context:
  If the context is available, the hook returns the `context`, providing access to the `show` function. Developers can then use this function to display confirmation dialogs as needed in their components.

```tsx
// ./utils/confirm/confirm.hooks.tsx
import { useContext } from 'react';

import { ConfirmCtx } from './confirm.provider';

export const useConfirm = () => {
  const context = useContext(ConfirmCtx);

  if (!context) {
    throw new Error('useConfirm must be used within a ConfirmProvider');
  }

  return context;
};
```

#### Using ConfirmProvider in Your Application:

To integrate the `ConfirmProvider` into your application, simply wrap it around the components that require confirmation dialogs. Here's an example of how you can use it:

```tsx
import ReactDOM from 'react-dom/client';

import { ConfirmProvider } from './utils/confirm/confirm.provider';
import App from './App';

import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <ConfirmProvider>
    <App />
  </ConfirmProvider>
);
```

Now, any component within the `ConfirmProvider` will have access to the `show` function from the context, enabling them to trigger confirmation popups with ease.

## Part 3: The Confirm Component - Crafting Visual Dialogs

- **Purpose:**

The `Confirm` component is designed to render visually appealing confirmation dialogs with icons, customizable colors, and seamless user interactions.

- **Key Features:**
  ✅ **Icons for Visual Representation:** Utilizes SVG icons `(CloseIcon, WarningIcon, etc.)` to visually represent different confirmation types.

✅ **Color Customization:** Dynamically sets background, text, and icon colors based on the specified confirmation type.

✅ **Handling User Actions:** Provides buttons for confirmation and cancellation actions styled with dynamic colors.

✅ **Customizable Content:** Renders the title, subtitle, confirm text, and cancel text based on the provided options.

When it comes to creating a smooth and intuitive user interface, having a well-designed confirmation popup can make all the difference. In this article, we'll explore the `Confirm` component, a crucial part of a React application that enables the seamless display of confirmation popups through the use of React Context.

```tsx
// ./utils/confirm/confirm.tsx

/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable max-len */
import React from 'react';

import type { ConfirmOptions } from './confirm.types';

type Props = ConfirmOptions & { open: boolean };

function CloseIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      fill="none"
      height="24"
      viewBox="0 0 36 36"
      width="24"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M9 9L27 27M9 27L27 9"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  );
}

function WarningIcon() {
  return (
    <svg
      fill="none"
      height="24"
      viewBox="0 0 36 36"
      width="24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M18 9.735L29.295 29.25H6.705L18 9.735ZM18 3.75L1.5 32.25H34.5L18 3.75Z"
        fill="#ED6C02"
      />
      <path d="M19.5 24.75H16.5V27.75H19.5V24.75Z" fill="#ED6C02" />
      <path d="M19.5 15.75H16.5V23.25H19.5V15.75Z" fill="#ED6C02" />
    </svg>
  );
}

function ErrorIcon() {
  return (
    <svg
      fill="none"
      height="24"
      viewBox="0 0 36 36"
      width="24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M18 25.5H18.015M18 15V21M9.61808 31.5H26.3819C29.0544 31.5 30.3906 31.5 31.1744 30.938C31.8583 30.4476 32.3047 29.6925 32.4049 28.8569C32.5196 27.8993 31.8756 26.7285 30.5877 24.3868L22.2058 9.14696C20.8345 6.65373 20.1489 5.40711 19.2429 4.99469C18.4533 4.63523 17.5467 4.63523 16.7571 4.99469C15.8511 5.40711 15.1654 6.65372 13.7941 9.14695L5.41224 24.3868C4.12432 26.7285 3.48036 27.8993 3.59509 28.8569C3.69521 29.6925 4.14168 30.4476 4.82558 30.938C5.60935 31.5 6.94559 31.5 9.61808 31.5Z"
        stroke="#D92D20"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  );
}

function SuccessIcon() {
  return (
    <svg
      fill="none"
      height="24"
      viewBox="0 0 36 36"
      width="24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M24.885 11.37L15 21.255L9.615 15.885L7.5 18L15 25.5L27 13.5L24.885 11.37ZM18 3C9.72 3 3 9.72 3 18C3 26.28 9.72 33 18 33C26.28 33 33 26.28 33 18C33 9.72 26.28 3 18 3ZM18 30C11.37 30 6 24.63 6 18C6 11.37 11.37 6 18 6C24.63 6 30 11.37 30 18C30 24.63 24.63 30 18 30Z"
        fill="#2E7D32"
      />
    </svg>
  );
}

function InfoIcon() {
  return (
    <svg
      fill="none"
      height="24"
      viewBox="0 0 36 36"
      width="24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M18 12H18.015M18 16.5V24M31.5 18C31.5 25.4558 25.4558 31.5 18 31.5C10.5442 31.5 4.5 25.4558 4.5 18C4.5 10.5442 10.5442 4.5 18 4.5C25.4558 4.5 31.5 10.5442 31.5 18Z"
        stroke="#026AA2"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  );
}

type ColorValues = {
  bgColor: string;
  textColor: string;
  iconColor: string;
};

type NotOptional<T> = T extends undefined ? never : T;

const colorMap: Record<NotOptional<Props['type']>, ColorValues> = {
  error: {
    bgColor: '#FDEDED',
    iconColor: '#D92D20',
    textColor: '#5F2120',
  },
  info: {
    bgColor: '#EDF7ED',
    iconColor: '#026AA2',
    textColor: '#026AA2',
  },
  success: {
    bgColor: '#EDF7ED',
    iconColor: '#2E7D32',
    textColor: '#1E4620',
  },
  warning: {
    bgColor: '#FFF4E5',
    iconColor: '#ED6C02',
    textColor: '#663C00',
  },
};

const iconMap: Record<NotOptional<Props['type']>, React.ReactNode> = {
  error: <ErrorIcon />,
  info: <InfoIcon />,
  success: <SuccessIcon />,
  warning: <WarningIcon />,
};

export function Confirm({
  open,
  title,
  subtitle,
  cancelText,
  confirmText,
  onCancel,
  onConfirm,
  type = 'warning',
}: Props) {
  return (
    <dialog
      className={`absolute top-0 left-0 z-50 flex-col items-center justify-center w-full h-full overflow-auto bg-black bg-opacity-50 ${
        open ? 'flex' : 'hidden'
      }`}
    >
      <div
        className="flex flex-col items-center justify-between w-10/12 p-4 rounded-lg lg:w-5/12 h-48"
        style={{
          background: colorMap[type].bgColor,
        }}
      >
        <header
          className="flex items-center justify-between w-full pb-2 border-b-2"
          style={{
            color: colorMap[type].textColor,
            borderColor: colorMap[type].textColor,
          }}
        >
          <div className="flex flex-row items-center justify-center gap-x-4">
            {iconMap[type]}
            <label className="text-lg font-bold ">{title}</label>
          </div>
          <CloseIcon className="cursor-pointer" onClick={onCancel} />
        </header>
        <div className="flex items-center justify-center m-auto rounded-lg">
          <label
            className="text-sm text-center"
            style={{
              color: colorMap[type].textColor,
            }}
          >
            {subtitle}
          </label>
        </div>
        <div className="flex items-center justify-center gap-x-4">
          <button
            onClick={onCancel}
            style={{
              background: 'gray',
            }}
            type="button"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            style={{
              background: colorMap[type].iconColor,
            }}
            type="button"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </dialog>
  );
}
```

### Understanding Confirm

The Confirm component is designed to render visually appealing confirmation dialogs with icons, customizable colors, and seamless user interactions. Let's dive into its key features:

#### Icons for Visual Representation:

The Confirm component utilizes SVG icons `(CloseIcon, WarningIcon, etc.)` to visually represent different confirmation types. These icons are rendered based on the specified confirmation type, ensuring that the user can easily identify the type of action they are confirming.

```tsx
type Props = ConfirmOptions & { open: boolean };
```

#### Color Customization:

The Confirm component dynamically sets background, text, and icon colors based on the specified confirmation type. This ensures that the confirmation dialogs are visually consistent with the rest of the application.

```tsx
const colorMap: Record<NotOptional<Props['type']>, ColorValues> = {
  error: {
    bgColor: '#FDEDED',
    iconColor: '#D92D20',
    textColor: '#5F2120',
  },
  info: {
    bgColor: '#EDF7ED',
    iconColor: '#026AA2',
    textColor: '#026AA2',
  },
  success: {
    bgColor: '#EDF7ED',
    iconColor: '#2E7D32',
    textColor: '#1E4620',
  },
  warning: {
    bgColor: '#FFF4E5',
    iconColor: '#ED6C02',
    textColor: '#663C00',
  },
};
```

#### Handling User Actions:

The Confirm component provides buttons for confirmation and cancellation actions styled with dynamic colors. This ensures that the user can easily identify the type of action they are confirming.

```tsx
<div className="flex items-center justify-center gap-x-4">
  <button
    onClick={onCancel}
    style={{
      background: 'gray',
    }}
    type="button"
  >
    {cancelText}
  </button>
  <button
    onClick={onConfirm}
    style={{
      background: colorMap[type].iconColor,
    }}
    type="button"
  >
    {confirmText}
  </button>
```

#### Customizable Content:

The Confirm component renders the title, subtitle, confirm text, and cancel text based on the provided options. This ensures that the confirmation dialogs are personalized and provide the user with the necessary information to make an informed decision.

```tsx
<div className="flex flex-col items-center justify-between w-10/12 p-4 rounded-lg lg:w-5/12 h-48">
  <header
    className="flex items-center justify-between w-full pb-2 border-b-2"
    style={{
      color: colorMap[type].textColor,
      borderColor: colorMap[type].textColor,
    }}
  >
    <div className="flex flex-row items-center justify-center gap-x-4">
      {iconMap[type]}
      <label className="text-lg font-bold ">{title}</label>
    </div>
    <CloseIcon className="cursor-pointer" onClick={onCancel} />
  </header>
  <div className="flex items-center justify-center m-auto rounded-lg">
    <label
      className="text-sm text-center"
      style={{
        color: colorMap[type].textColor,
      }}
    >
      {subtitle}
    </label>
  </div>
  <div className="flex items-center justify-center gap-x-4">
    <button
      onClick={onCancel}
      style={{
        background: 'gray',
      }}
      type="button"
    >
      {cancelText}
    </button>
    <button
      onClick={onConfirm}
      style={{
        background: colorMap[type].iconColor,
      }}
      type="button"
    >
      {confirmText}
    </button>
  </div>
</div>
```

## Part 4: The useConfirm Hook - Bridging Components

- **Purpose:**
  The `useConfirm` hook acts as a bridge, allowing components to easily access and trigger confirmation dialogs.

- **Key Features:**
  ✅ **Accessing ConfirmContext with useContext:** Utilizes the useContext hook to access the confirmation context (ConfirmCtx).

✅ **Throwing an Error for Missing Provider:** Throws an error if the context is not available, guiding developers to include the necessary ConfirmProvider in the component tree.

✅ **Returning Confirm Context:** Returns the context (including the show function) if available, enabling components to trigger confirmation dialogs.

When it comes to creating a smooth and intuitive user interface, having a well-designed confirmation popup can make all the difference. In this article, we'll explore the `useConfirm` hook, a crucial part of a React application that enables the seamless display of confirmation popups through the use of React Context.

```tsx
// ./utils/confirm/confirm.hooks.tsx

import { useContext } from 'react';

import { ConfirmCtx } from './confirm.provider';

export const useConfirm = () => {
  const context = useContext(ConfirmCtx);

  if (!context) {
    throw new Error('useConfirm must be used within a ConfirmProvider');
  }

  return context;
};
```

### Understanding useConfirm

The `useConfirm` hook acts as a bridge, allowing components to easily access and trigger confirmation dialogs. Let's dive into its key features:

#### Accessing ConfirmContext with useContext:

The hook utilizes the `useContext` hook from React to access the confirmation context `(ConfirmCtx)`. This context holds the `show` function, which is responsible for triggering the display of confirmation dialogs.

```tsx

import { useContext } from 'react';

import { ConfirmCtx } from './confirm.provider';

export const useConfirm = () => {
  const context = useContext(ConfirmCtx);

  if (!context) {
    throw new Error('useConfirm must be used within a ConfirmProvider');
  }

  return context;
};

```

#### Throwing an Error for Missing Provider:

To ensure the `useConfirm` hook is used within a component hierarchy that includes the `ConfirmProvider`, a check is implemented. If the context is not available (i.e., `ConfirmProvider` is not a parent), an error is thrown, guiding developers to include the necessary provider in the component tree.

## Part 5: The usePropmt Hook Usage - Handling Unsaved Changes

The `usePrompt` hook is designed to be a flexible and reusable solution for handling unsaved changes in a React application. Here is an example of how you can use it:

### First Usage without Form

This example demonstrates how to use the `usePrompt` hook to prevent users from accidentally leaving a page with unsaved changes. The `usePrompt` hook is used within the `HomePage` component to display a confirmation dialog when the user attempts to navigate away from the page with unsaved changes.

```tsx
// ./pages/home/index.tsx

import { usePrompt } from '../../hooks/usePrompt';

export default function HomePage() {
  usePrompt({
    isDirty: true,
  });

  return <div>HomePage</div>;
}
```

### Enhancing User Experience with usePrompt and Form Validation in React

In the realm of web development, creating forms that provide a smooth user experience is crucial. In this article, we'll explore how to integrate the `usePrompt` hook into a form, ensuring that users are prompted before navigating away from the page when they have unsaved changes.

- **Overview:**
  The `usePrompt` hook, in combination with React's `useReducer` and form state management, can significantly enhance the user experience by preventing accidental navigation away from a page with unsaved changes.

```tsx
/* eslint-disable no-alert */
/* eslint-disable jsx-a11y/label-has-associated-control */
import { ChangeEvent, FormEvent, useReducer, useState } from 'react';

import { usePrompt } from '../../hooks/usePrompt';

const FORM_ACTIONS = {
  UPDATE_FIELD: 'UPDATE_FIELD',
  RESET_FORM: 'RESET_FORM',
} as const;

interface FormState {
  name: string;
  email: string;
  message: string;
}

type FormAction =
  | { type: typeof FORM_ACTIONS.UPDATE_FIELD; field: string; value: string }
  | { type: typeof FORM_ACTIONS.RESET_FORM };

const initialState: FormState = {
  name: '',
  email: '',
  message: '',
};

const formReducer = (state: FormState, action: FormAction): FormState => {
  switch (action.type) {
    case FORM_ACTIONS.UPDATE_FIELD:
      return { ...state, [action.field]: action.value };
    case FORM_ACTIONS.RESET_FORM:
      return initialState;
    default:
      return state;
  }
};

export default function ContactPage() {
  const [state, dispatch] = useReducer(formReducer, initialState);

  const [isDirty, setIsDirty] = useState(false);

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void => {
    const { name, value } = e.target;

    setIsDirty(true);
    dispatch({ type: FORM_ACTIONS.UPDATE_FIELD, field: name, value });
  };

  const handleSubmit = (e: FormEvent): void => {
    e.preventDefault();
    alert(JSON.stringify(state, null, 2));
    setIsDirty(false);
    dispatch({ type: FORM_ACTIONS.RESET_FORM });
  };

  usePrompt({
    isDirty,
  });

  const canSubmit = state.name && state.email && state.message;

  return (
    <div className="w-6/12 m-auto h-full">
      <form className="flex flex-col gap-y-2" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-x-1">
          <label htmlFor="name">Name</label>
          <input
            className="border rounded-md p-2"
            id="name"
            name="name"
            onChange={handleInputChange}
            type="text"
            value={state.name}
          />
        </div>
        <div className="flex flex-col gap-x-1">
          <label htmlFor="email">Email</label>
          <input
            className="border rounded-md p-2"
            id="email"
            name="email"
            onChange={handleInputChange}
            type="email"
            value={state.email}
          />
        </div>
        <div className="flex flex-col gap-x-1">
          <label htmlFor="message">Message</label>
          <textarea
            className="border rounded-md p-2"
            id="message"
            name="message"
            onChange={handleInputChange}
            value={state.message}
          />
        </div>
        <div className="flex flex-row justify-between gap-x-2 items-center">
          <div
            className={`w-4 h-4 rounded-full ${
              isDirty ? 'bg-red-500' : 'bg-green-500'
            }`}
          />
          <p>{isDirty ? 'Form is dirty' : 'Form is clean'}</p>
          <button
            className="bg-orange-500 text-white rounded-md p-2 disabled:opacity-50 disabled:cursor-not-allowed mr-0 ml-auto"
            disabled={!canSubmit}
            type="submit"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}
```

- **Form State Management:**
  We employ a `useReducer` hook to manage the form state and handle updates to form fields efficiently. The form state includes fields for name, email, and message.

- **usePrompt Integration:**
  The `usePrompt` hook is introduced to monitor the form's `isDirty` state, indicating whether there are unsaved changes. When the user attempts to navigate away, they are prompted to confirm if they have unsaved changes.

- **Input Handling::**
  The `handleInputChange` function is responsible for updating the form state when the user enters data into the form fields. It also sets the `isDirty` state to true, indicating that there are unsaved changes.

- **Form Submission:**
  The `handleSubmit` function is responsible for handling form submissions. It alerts the form state and resets the form state and `isDirty` state to their initial values.

- **Visual Indicators:**
  The `isDirty` state is used to display visual indicators to the user, indicating whether the form has unsaved changes. A red dot is displayed when the form is dirty, and a green dot is displayed when the form is clean.

- **Form Validation:**
  The `canSubmit` variable is used to disable the submit button when the form is invalid. This ensures that the user cannot submit the form until all required fields are filled out.

## Part 6: Conclusion

In this article, we explored the `usePrompt` hook, a flexible and reusable solution for handling unsaved changes in a React application. We also explored how to integrate the `usePrompt` hook into a form, ensuring that users are prompted before navigating away from the page when they have unsaved changes.

## Part 7: Resources

- [React Router DOM](https://reactrouter.com/en/6.18.0/start/overview)
- [React useReducer Hook](https://react.dev/reference/react/useReducer)
- [React useState Hook](https://react.dev/reference/react/useState)
- [React useContext Hook](https://react.dev/reference/react/useContext)
- [React useMemo Hook](https://react.dev/reference/react/useMemo)