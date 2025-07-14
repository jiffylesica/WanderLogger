// Custom login page
// Calls signIn('credentials), {email, password} to trigger authentication through NextAuth
// NextAuth is backend, this is frontend
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/router';

import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Stack,
  Alert,
} from '@mui/material';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const router = useRouter();

  // For when user hits submit
  // Prevent default prevents browser from reloading
  const handleSubmit = async (e) => {
    // Stop browser's default behavior for this event
    e.preventDefault();

    const res = await signIn('credentials', {
      // prevent redirect after login
      // route manually only AFTER login confirmed successful
      redirect: false,
      email,
      password,
    });

    if (!res.error) {
      router.push('/');
    } else {
      setErrorMsg('Invalid email or password');
    }
  };

  // Login form UI
  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Sign In
        </Typography>

        <form onSubmit={handleSubmit}>
          <Stack spacing={3}>
            <TextField
              label="Email"
              type="email"
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <TextField
              label="Password"
              type="password"
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            {errorMsg && <Alert severity="error">{errorMsg}</Alert>}

            <Button variant="contained" color="primary" type="submit" fullWidth>
              Sign In
            </Button>

            <Button
              variant="text"
              color="secondary"
              onClick={() => router.push('/signup')}
            >
              Don&#39;t have an account? Sign up
            </Button>

            <Button
              variant="outlined"
              onClick={() => {
                localStorage.setItem('isGuest', 'true');
                document.cookie = "isGuest=true; path=/";
                router.push('/guest');
              }}
            >
              Continue as Guest
            </Button>
          </Stack>
        </form>
      </Box>
    </Container>
  );
}
