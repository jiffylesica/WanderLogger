import { withAuth } from 'next-auth/middleware';

export default withAuth({
  pages: {
    signIn: '/login',
  },
  callbacks: {
    authorized({ token }) {
      // Allow access if token exists (user is signed in)
      return !!token;
    },
  },
});

export const config = {
  matcher: ['/', '/journeymaker', '/api/journeys/:path*', '/api/user/:path*'],
};
