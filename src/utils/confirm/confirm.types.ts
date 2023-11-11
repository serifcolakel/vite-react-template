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
