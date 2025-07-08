// src/components/GlobalLoading.tsx
import { Backdrop, CircularProgress } from '@mui/material';
import { useLoading } from '../context/LoadingContext';

export const GlobalLoading = () => {
  const { loading } = useLoading();

  return (
    <Backdrop open={loading} sx={{ zIndex: 1300, color: '#fff' }}>
      <CircularProgress color="inherit" />
    </Backdrop>
  );
};
