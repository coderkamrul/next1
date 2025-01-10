// import NextAuth from 'next-auth'
// import CredentialsProvider from 'next-auth/providers/credentials'
// import bcrypt from 'bcryptjs'
// import dbConnect from '@/lib/mongodb'
// import User from '@/models/User'

// const handler = NextAuth({
//   providers: [
//     CredentialsProvider({
//       name: 'Credentials',
//       credentials: {
//         login: { label: 'Email or Username', type: 'text' },
//         password: { label: 'Password', type: 'password' },
//       },
//       async authorize(credentials) {
//         // Ensure login and password are provided
//         if (!credentials?.login || !credentials?.password) {
//           throw new Error('Login and password are required.')
//         }

//         // Connect to the database
//         await dbConnect()

//         // Find the user by email or username
//         const user = await User.findOne({
//           $or: [{ email: credentials.login }, { username: credentials.login }],
//         })

//         if (!user) {
//           throw new Error('User not found.')
//         }

//         // Validate the password
//         const isPasswordValid = await bcrypt.compare(
//           credentials.password,
//           user.password
//         )

//         if (!isPasswordValid) {
//           throw new Error('Invalid password.')
//         }

//         // Return user data for the JWT token
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
//   callbacks: {
//     // Attach user details to the JWT token
//     async jwt({ token, user }) {
//       if (user) {
//         token.id = user.id
//         token.username = user.username
//         token.profilePicture = user.profilePicture
//       }
//       return token
//     },

//     // Attach JWT token details to the session
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
//     signIn: '/login', // Custom sign-in page
//   },
//   secret: process.env.NEXTAUTH_SECRET, // Add a secret for JWT signing
// })

// export { handler as GET, handler as POST }

import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import dbConnect from '@/lib/mongodb'
import User from '@/models/User'

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        login: { label: 'Email or Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        // Ensure login and password are provided
        if (!credentials?.login || !credentials?.password) {
          throw new Error('Login and password are required.')
        }

        // Connect to the database
        await dbConnect()

        // Find the user by email or username
        const user = await User.findOne({
          $or: [{ email: credentials.login }, { username: credentials.login }],
        })

        if (!user) {
          throw new Error('User not found.')
        }

        // Validate the password
        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        )

        if (!isPasswordValid) {
          throw new Error('Invalid password.')
        }

        // Return user data for the JWT token
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
    // Attach user details to the JWT token
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.username = user.username
        token.profilePicture = user.profilePicture
      }
      return token
    },

    // Attach JWT token details to the session
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
    signIn: '/login', // Custom sign-in page
  },
  secret: process.env.NEXTAUTH_SECRET, // Add a secret for JWT signing
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
