import { DrizzleAdapter } from '@auth/drizzle-adapter'
import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { db } from "./db"
import { verifyPassword } from "./utils"

export const { handlers, signIn, signOut, auth } = NextAuth({
    adapter: DrizzleAdapter(db),
    providers: [
        Credentials({
            // You can specify which fields should be submitted, by adding keys to the `credentials` object.
            // e.g. domain, username, password, 2FA token, etc.
            credentials: {
                email: {
                    label: "Email",
                    type: "email",
                },
                password: {
                    label: "Password", type: "password"
                },
            },
            authorize: async (credentials) => {

                if (!credentials) {
                    throw new Error("Credentials are missing.")
                }

                const user = await db.query.usertable.findFirst({
                    where: (users, { eq }) => eq(users.email, credentials.email)
                })

                if (!user || !(await verifyPassword(credentials.password, user.password))) {
                    throw new Error("Invalid credentials.")
                }

                // return user object with their profile data
                return user
            },
        }),
    ],
})