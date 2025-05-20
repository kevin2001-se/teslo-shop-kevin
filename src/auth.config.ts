import NextAuth, { type NextAuthConfig } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';
import { prisma } from './lib/prisma';
import bcrypt from 'bcryptjs';

const checkoutAddressRoute  = [
    '/checkout/address'
]

const authenticatedRoutes = [
    '/auth/login',
    '/auth/new-account'
]

interface User {
    id: string;
    name: string;
    email: string;
    emailVerified: Date;
    role: string;
    image?: string;
}
 
export const authConfig: NextAuthConfig = {
    pages: {
        signIn: '/auth/login',
        newUser: 'auth/new-account'
    },
    callbacks: {
         authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;
            const isAuthRoute = authenticatedRoutes.includes(nextUrl.pathname)
            const isProtectedRoute = checkoutAddressRoute.includes(nextUrl.pathname)

            if (isAuthRoute && isLoggedIn) {
                return Response.redirect(new URL('/', nextUrl));
            }

            if (isProtectedRoute) {
                if (isLoggedIn) return true;
                return Response.redirect(
                    new URL( `/auth/login?origin=${nextUrl.pathname}` ,nextUrl)
                );
            } 
            return true;
        },
        jwt({ token, user }) {
            if ( user ) {
                token.data = user;
            }

            return token;
        },
        async session({ session, token }) {

            session.user = token.data as User;

            return session;
        }
    },
    providers: [
        Credentials({
            async authorize(credentials) {
                const parsedCredentials = z
                .object({ email: z.string().email(), password: z.string().min(6) })
                .safeParse(credentials);

                if (!parsedCredentials.success) return null;

                const { email, password } = parsedCredentials.data;
                
                // Buscar el correo
                const user = await prisma.user.findUnique({
                    where: {
                        email: email.toLowerCase()
                    }
                })

                if (!user) {
                    return null
                }

                // Comparar las contraseñas

                if (!bcrypt.compareSync(password, user.password)) return null;

                const { name, id, image, email: emailUser, emailVerified, role } = user;

                return {
                    name,
                    id,
                    image,
                    email: emailUser,
                    emailVerified,
                    role
                };
            },
        }),
    ]
}

export const { signIn, signOut, auth, handlers } = NextAuth(authConfig)