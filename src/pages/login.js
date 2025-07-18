// Custom login page
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/router';
// Remove Script import - not needed

import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Stack,
  Alert,
} from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google'; // Optional: for Google icon

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await signIn('credentials', {
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

  // Handle Google sign in
  const handleGoogleSignIn = () => {
    signIn('google', { callbackUrl: '/' });
  };

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

            <Stack alignItems="center" spacing={2}>
              {/* Replace the Google Sign-In div with this button */}
              <Button
                variant="outlined"
                fullWidth
                onClick={handleGoogleSignIn}
                startIcon={<GoogleIcon />}
                sx={{ 
                  borderColor: '#dadce0',
                  color: '#3c4043',
                  '&:hover': {
                    borderColor: '#dadce0',
                    backgroundColor: '#f8f9fa',
                  },
                  textTransform: 'none',
                  py: 1,
                }}
              >
                Sign in with Google
              </Button>

              <Button
                variant="outlined"
                fullWidth
                onClick={() => {
                  localStorage.setItem('isGuest', 'true');
                  document.cookie = 'isGuest=true; path=/';
                  router.push('/guest');
                }}
              >
                Continue as Guest
              </Button>
            </Stack>

            <Button
              variant="text"
              color="secondary"
              onClick={() => router.push('/signup')}
            >
              Don&#39;t have an account? Sign up
            </Button>
          </Stack>
        </form>
      </Box>
    </Container>
  );
}