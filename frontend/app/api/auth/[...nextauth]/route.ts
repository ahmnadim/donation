import { url } from "@/lib/constants";
import fetchClient from "@/lib/request";
import NextAuth, { AuthOptions, getServerSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        if (credentials) {
          const res = await fetchClient.post(url.signin, credentials);

          if (res.status === "success") {
            const { data } = res;
            // Combine `data` and `token` into a single object for session storage
            return data;
          }
        }
        return null; // Return null if login fails
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }: any) {
      if (user) {
        token.name = user.name;
        token.email = user.email;
        token.access_token = user.access_token; // Add the JWT token
        token.role = user.role;
      }
      return token;
    },
    // Include the custom data in the session
    async session({ session, token }: any) {
      session.user = {
        name: token.name,
        email: token.email,
        token: token.apiToken, // Include the JWT token for API calls
        role: token.role,
        access_token: token.access_token,
      };
      return session;
    },
  },
  session: { strategy: "jwt" },
  pages: {
    signIn: "/signin",
  },
};

const handler = NextAuth(authOptions);
export const getSession = async () => await getServerSession(authOptions);
export { handler as GET, handler as POST };
