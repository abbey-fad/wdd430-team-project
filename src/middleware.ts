import NextAuth from "next-auth";
import { authConfig } from "@/auth.config";

export default NextAuth(authConfig as any).auth;

export const config = {
  matcher: [
    "/seller",
    "/seller/:path*",
    "/products/new",
  ],
};
