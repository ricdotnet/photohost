import { ReactNode } from 'react';

interface LoadingPropsInterface {
  loading: boolean;
  message?: string | ReactNode;
  children: ReactNode;
}

export default function Loading({ loading, message, children }: LoadingPropsInterface) {
  return loading ? <>{message}</> : <>{children}</>;
}
