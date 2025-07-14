// API route where NextAuth handles authentication handling
// Naming ...nextauth is catch-all route in Next.js

/*
What this file does:
1. Register authentication providers (credentials, google, etc)
2. Define callbacks for customizing sessions and JWTs
3. Export handler for NextAuth to do heavy lifting
*/
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import knex from 'knex';
import knexConfig from '../../../../knexfile';
import { signIn } from 'next-auth/react';
import bcrypt from 'bcrypt';
import db from '@/lib/db';

// Define options for NextAuth
export const authOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const user = await db('users')
          .where({ email: credentials.email })
          .first();

        if (!user) return null;
        const isValid = await bcrypt.compare(
          credentials.password,
          user.password
        );
        if (!isValid) return null;

        return { id: user.id, name: user.username, email: user.email };
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) token.id = user.id;
      return token;
    },
    async session({ session, token }) {
      if (token) session.user.id = token.id;
      return session;
    },
  },
  pages: {
    signIn: '/login',
  },
};

export default NextAuth(authOptions);
