import type { NextAuthConfig } from "next-auth";

export const authConfig = {
    pages: { signIn: "/login" },
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;
            const pathname = nextUrl.pathname;
            const isProtected = (pathname === "/seller") || pathname.startsWith("/products/new");
            if (isProtected) return isLoggedIn;
            return true;
        },
    },
    providers: []
} satisfies NextAuthConfig;
