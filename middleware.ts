import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: { signIn: "/" },
  callbacks: {
    authorized: ({ token, req }) => {

      if (!token) return false;

      const pathname = req.nextUrl.pathname;

      if (pathname.startsWith("/dashboard/admin")) {
        return token.role === "ADMIN";
      }

      return true;
    },
  },
});

export const config = {
  matcher: ["/dashboard/:path*"],
};
