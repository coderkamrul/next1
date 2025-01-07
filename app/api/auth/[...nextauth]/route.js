// import NextAuth from 'next-auth'
// import CredentialsProvider from 'next-auth/providers/credentials'
// import bcrypt from 'bcryptjs'
// import dbConnect from '@/lib/mongodb'
// import User from '@/models/User'

// // Ensure we have a secret
// if (!process.env.NEXTAUTH_SECRET) {
//   throw new Error('Please define NEXTAUTH_SECRET environment variable')
// }

// const handler = NextAuth({
//   secret: process.env.NEXTAUTH_SECRET,
//   providers: [
//     CredentialsProvider({
//       name: 'Credentials',
//       credentials: {
//         login: { label: 'Email or Username', type: 'text' },
//         password: { label: 'Password', type: 'password' },
//       },
//       async authorize(credentials) {
//         if (!credentials?.login || !credentials?.password) {
//           return null
//         }

//         await dbConnect()

//         const user = await User.findOne({
//           $or: [{ email: credentials.login }, { username: credentials.login }],
//         })

//         if (!user) {
//           return null
//         }

//         const isPasswordValid = await bcrypt.compare(
//           credentials.password,
//           user.password
//         )

//         if (!isPasswordValid) {
//           return null
//         }

//         return {
//           id: user._id.toString(),
//           name: user.name,
//           email: user.email,
//           username: user.username,
//           profilePicture: user.profilePicture,
//         }
//       },
//     }),
//   ],
//   session: {
//     strategy: 'jwt',
//     maxAge: 30 * 24 * 60 * 60, // 30 days
//   },
//   callbacks: {
//     async jwt({ token, user }) {
//       if (user) {
//         token.id = user.id
//         token.username = user.username
//         token.profilePicture = user.profilePicture
//       }
//       return token
//     },
//     async session({ session, token }) {
//       if (token) {
//         session.user.id = token.id
//         session.user.username = token.username
//         session.user.profilePicture = token.profilePicture
//       }
//       return session
//     },
//   },
//   pages: {
//     signIn: '/login',
//     error: '/auth/error',
//   },
// })

// export { handler as GET, handler as POST }

import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import dbConnect from '@/lib/mongodb'
import User from '@/models/User'

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        login: { label: 'Email or Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.login || !credentials?.password) {
          return null
        }

        await dbConnect()

        const user = await User.findOne({
          $or: [{ email: credentials.login }, { username: credentials.login }],
        })

        if (!user) {
          return null
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        )

        if (!isPasswordValid) {
          return null
        }

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          username: user.username,
          profilePicture: user.profilePicture,
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.username = user.username
        token.profilePicture = user.profilePicture
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id
        session.user.username = token.username
        session.user.profilePicture = token.profilePicture
      }
      return session
    },
  },
  pages: {
    signIn: '/login',
  },
})

export { handler as GET, handler as POST }
