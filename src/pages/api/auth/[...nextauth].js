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
import GoogleProvider from 'next-auth/providers/google';

console.log('Google Client ID:', process.env.GOOGLE_CLIENT_ID);
console.log('NextAuth URL:', process.env.NEXTAUTH_URL);
console.log('NextAuth Secret exists:', !!process.env.NEXTAUTH_SECRET);

// Define options for NextAuth
export const authOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: 'select_account', // 👈 this forces account picker
          access_type: 'offline',
          response_type: 'code',
        },
      },
    }),
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
    async signIn({ user, account }) {
      if (account.provider === 'google') {
        const existingUser = await db('users')
          .where({ email: user.email })
          .first();

        if (!existingUser) {
          const fakePassword = await bcrypt.hash(
            Math.random().toString(36),
            10
          );
          await db('users').insert({
            username: user.name || user.email,
            email: user.email,
            password: fakePassword, // we fake a password for now
          });
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        const dbUser = await db('users').where({ email: user.email }).first();
        if (dbUser) token.id = dbUser.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) session.user.id = token.id;
      return session;
    },
  },
};

export default NextAuth(authOptions);
