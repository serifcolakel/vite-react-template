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
