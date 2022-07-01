//https://next-auth.js.org/getting-started/example

import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";

import { fauna } from "../../../services/fauna";
import { query } from "faunadb";
import { FaUserAlt } from "react-icons/fa";

export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
      authorization: {
        params: { scope: "read:user" },
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      const { email } = user;
      console.log(email);
      try {
        await fauna.query(query.Create(query.Collection("users"), { data: { email } }));
        return true;
      } catch {
        console.log(user);
        return false;
      }
    },
  },
});
