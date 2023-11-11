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
        <button
          className="bg-orange-500 text-white rounded-md p-2 disabled:opacity-50 disabled:cursor-not-allowed mr-0 ml-auto"
          disabled={!canSubmit}
          type="submit"
        >
          Submit
        </button>
      </form>
    </div>
  );
}
