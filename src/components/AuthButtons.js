import { signIn, signOut, useSession } from 'next-auth/react';
import { Button } from '@mui/material';
import { useRouter } from 'next/router';

export default function AuthButtons() {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === 'loading') return null;
  return (
    <div>
      {session ? (
        <>
          <Button variant="outlined" onClick={() => signOut({ callbackUrl: '/login'})}>
            Sign Out
          </Button>
        </>
      ) : (
        <Button variant="contained" onClick={() => signIn()}>
          Sign In/Sign Up
        </Button>
      )}
    </div>
  );
}
