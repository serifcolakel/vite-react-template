import { useContext } from 'react';

import { ConfirmCtx } from './confirm.provider';

export const useConfirm = () => {
  const context = useContext(ConfirmCtx);

  if (!context) {
    throw new Error('useConfirm must be used within a ConfirmProvider');
  }

  return context;
};
