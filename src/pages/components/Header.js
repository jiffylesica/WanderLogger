import { Box, Stack, Typography } from '@mui/material';
import Image from 'next/image';
import ReturnHome from './ReturnHomeButton';
import { useRouter } from 'next/router';
import AuthButtons from './AuthButtons';
import { useSession } from 'next-auth/react';
import { GuestContext } from '@/pages/_app';
import { useContext } from 'react';

export default function Header() {
  const router = useRouter();
  const { isGuest } = useContext(GuestContext);

  const handleLogoClick = () => {
    if (session) {
      router.push('/');
    } else if (isGuest) {
      router.push('/guest');
    } else {
      router.push('/login');
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 2,
        borderBottom: '1px solid #ddd',
        backgroundColor: '#f9f9f9',
      }}
    >
      <Box
        onClick={() => router.push('/')}
        sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
      >
        <Stack direction="row" alignItems="center">
          <Image
            src="/WanderLoggerLogo.png"
            alt="WanderLogger Logo"
            width={55}
            height={40}
            priority
          />
          <Typography variant="h6" sx={{ ml: 2, fontWeight: 600 }}>
            WanderLogger
          </Typography>
        </Stack>
      </Box>

      <AuthButtons />
    </Box>
  );
}
