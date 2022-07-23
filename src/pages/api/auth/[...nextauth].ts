//https://next-auth.js.org/getting-started/example

import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";

import { fauna } from "../../../services/fauna";
import { query as q, query } from "faunadb";
import { getSession } from "next-auth/react";

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
    async session({ session }) {
      try {
        const userActivesubscription = await fauna.query(
          q.Get(
            q.Intersection([
              q.Match(
                q.Index("subscription_by_user_ref"),
                q.Select(
                  "ref",
                  q.Get(q.Match(q.Index("user_by_email"), q.Casefold(session.user.email)))
                )
              ),
              q.Match(q.Index("subscriptions_by_status"), "active"),
            ])
          )
        );
        return {
          ...session,
          activesubscription: userActivesubscription,
        };
      } catch (e) {
        return {
          ...session,
          activesubscription: null,
        };
      }
    },
    async signIn({ user, account, profile }) {
      const { email } = user;
      try {
        await fauna.query(
          q.If(
            q.Not(q.Exists(q.Match(q.Index("user_by_email"), q.Casefold(user.email)))),
            q.Create(q.Collection("users"), { data: { email } }),
            q.Get(q.Match(q.Index("user_by_email"), q.Casefold(user.email)))
          )
        );
        return true;
      } catch (erro) {
        return false;
      }
    },
  },
});
