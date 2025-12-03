import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/db";
import Seller from "@/models/user";
import { authConfig } from "@/auth.config";

export const { handlers, signIn, signOut, auth } = NextAuth({
    ...authConfig,
    providers: [
        Credentials({
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            authorize: async (credentials) => {
                const parsedCredentials = z
                    .object({ email: z.string().email(), password: z.string().min(6) })
                    .safeParse(credentials);

                if (parsedCredentials.success) {
                    let { email, password } = parsedCredentials.data;
                    email = email.toLowerCase();

                    await dbConnect();
                    const user = await Seller.findOne({ email }).select("+password");

                    if (!user) return null;

                    const passwordsMatch = await bcrypt.compare(password, user.password);

                    if (passwordsMatch) {
                        return {
                            id: user._id.toString(),
                            name: user.name,
                            email: user.email,
                            image: user.image,
                            role: user.role,
                        };
                    }
                }

                return null;
            },
        }),
    ],
    callbacks: {
        ...authConfig.callbacks,
        async jwt({ token, user }) {
            console.log("[NextAuth][JWT callback] token:", token, "user:", user);
            if (user) {
                token.role = (user as any).role;
                token.id = user.id;
            }
            console.log("[NextAuth][JWT callback] returning token:", token);
            return token;
        },
        async session({ session, token }) {
            console.log("[NextAuth][Session callback] session:", session, "token:", token);
            session.user = {
                id: token.id as string,
                name: token.name as string,
                email: token.email as string,
                image: token.picture as string,
                role: token.role as string,
                emailVerified: null,
            };
            console.log("[NextAuth][Session callback] returning session:", session);
            return session;
        },
    },
    session: {
        strategy: "jwt",
    },
});
