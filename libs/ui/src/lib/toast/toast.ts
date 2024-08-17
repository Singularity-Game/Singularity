export interface Toast {
  header: string;
  message: string;
  type: 'success' | 'warning' | 'error' | 'info';
}
