import { Button } from '@mui/material';
import { useRouter } from 'next/router';

export default function ReturnHome() {
  const router = useRouter();
  return (
    <div style={{ position: 'relative', zIndex: 1000 }}>
      <Button variant="contained" onClick={() => router.push('/')}>
        Return Home
      </Button>
    </div>
  );
}
