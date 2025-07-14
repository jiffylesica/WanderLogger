import { signIn, signOut, useSession } from 'next-auth/react';
import { Button } from '@mui/material';

export default function AuthButtons() {
  const { data: session, status } = useSession();

  if (status === 'loading') return null;
  return (
    <div>
      {session ? (
        <>
          <Button variant="outlined" onClick={() => signOut()}>
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
