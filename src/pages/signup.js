import { useState } from 'react';
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
import { signIn } from 'next-auth/react';

export default function SignUpPage() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const router = useRouter();

  const handleSignup = async (e) => {
    e.preventDefault();

    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, username, password }),
    });

    const data = await res.json();

    if (res.ok) {
      // Optional: Log in automatically after signup
      await signIn('credentials', {
        redirect: false,
        email,
        password,
      });
      router.push('/');
    } else {
      setErrorMsg(data.error || 'Signup failed');
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Sign Up
        </Typography>

        <form onSubmit={handleSignup}>
          <Stack spacing={3}>
            <TextField
              label="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              fullWidth
            />
            <TextField
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              fullWidth
            />
            <TextField
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              fullWidth
            />

            {errorMsg && <Alert severity="error">{errorMsg}</Alert>}

            <Button type="submit" variant="contained" color="primary" fullWidth>
              Sign Up
            </Button>
          </Stack>
        </form>
      </Box>
    </Container>
  );
}
