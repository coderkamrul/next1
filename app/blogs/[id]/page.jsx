// 'use client'

// import { use, useEffect, useState } from 'react'
// import { useRouter } from 'next/navigation'
// import Image from 'next/image'
// import { motion } from 'framer-motion'
// import { Badge } from '@/components/ui/badge'
// import { Button } from '@/components/ui/button'
// import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
// import { Skeleton } from '@/components/ui/skeleton'
// import { toast } from '@/hooks/use-toast'
// import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
// import { Textarea } from '@/components/ui/textarea'
// import { ScrollArea } from '@/components/ui/scroll-area'
// import { Separator } from '@/components/ui/separator'
// import InstructionBlock from '@/components/InstructionBlock'
// import { Heart, MessageCircle, Share2, Trash2 } from 'lucide-react'
// import { useSession } from 'next-auth/react'

// function formatDate(dateString) {
//   return new Date(dateString).toLocaleDateString('en-US', {
//     year: 'numeric',
//     month: 'long',
//     day: 'numeric',
//   })
// }

// export default function BlogDetails({ params: paramsPromise }) {
//   const { id } = use(paramsPromise)
//   const [blog, setBlog] = useState(null)
//   const [isLoading, setIsLoading] = useState(true)
//   const [likes, setLikes] = useState(0)
//   const [comments, setComments] = useState([])
//   const [newComment, setNewComment] = useState('')
//   const { data: session } = useSession()
//   const router = useRouter()

// useEffect(() => {
//   const fetchBlog = async () => {
//     try {
//       const res = await fetch(`/api/blogs/views/${id}`, { method: 'GET' })
//       const data = await res.json()
//       if (data.success) {
//         setBlog(data.data)
//         setLikes(data.data.likes.length)
//         setComments(data.data.comments)
//       } else {
//         throw new Error('Failed to fetch blog details')
//       }
//     } catch (error) {
//       console.error(error)
//       toast({
//         title: 'Error',
//         description: 'Failed to fetch blog details. Please try again.',
//         variant: 'destructive',
//       })
//       router.push('/blogs')
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   fetchBlog()
// }, [])

// const handleLike = async () => {
//   try {
//     const res = await fetch(`/api/blogs/likes/${id}`, { method: 'POST' })
//     const data = await res.json()
//     if (data.success) {
//       setLikes(data.likes)
//       toast({
//         title: 'Success',
//         description: 'Blog post liked!',
//       })
//     } else {
//       throw new Error('Failed to like blog post')
//     }
//   } catch (error) {
//     console.error(error)
//     toast({
//       title: 'Error',
//       description: 'Failed to like blog post. Please try again.',
//       variant: 'destructive',
//     })
//   }
// }

// const handleComment = async (e) => {
//   e.preventDefault()
//   if (!newComment.trim()) return

//   try {
//     const res = await fetch(`/api/blogs/comments/${id}`, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ comment: newComment }),
//     })
//     const data = await res.json()
//     if (data.success) {
//       setBlog(data.data)
//       setComments(data.data.comments)
//       setNewComment('')
//       toast({
//         title: 'Success',
//         description: 'Comment added successfully!',
//       })
//     } else {
//       throw new Error('Failed to add comment')
//     }
//   } catch (error) {
//     console.error(error)
//     toast({
//       title: 'Error',
//       description: 'Failed to add comment. Please try again.',
//       variant: 'destructive',
//     })
//   }
// }

// const handleDeleteComment = async (commentId) => {
//   try {
//     const res = await fetch(`/api/blogs/comments/${commentId}`, {
//       method: 'DELETE',
//     })
//     const data = await res.json()

//     if (data.success) {
//       setComments(comments.filter((comment) => comment._id !== commentId))
//       toast({
//         title: 'Success',
//         description: 'Comment deleted successfully!',
//       })
//     } else {
//       throw new Error('Failed to delete comment')
//     }
//   } catch (error) {
//     console.error(error)
//     toast({
//       title: 'Error',
//       description: 'Failed to delete comment. Please try again.',
//       variant: 'destructive',
//     })
//   }
// }

//   if (isLoading) {
//     return <LoadingSkeleton />
//   }

//   if (!blog) {
//     return (
//       <div className='min-h-screen flex justify-center items-center'>
//         <p className='text-xl font-semibold'>Blog not found</p>
//       </div>
//     )
//   }

//   return (
//     <motion.div
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       transition={{ duration: 0.5 }}
//       className='min-h-screen pb-16 bg-gray-50 dark:bg-gray-900'
//     >
//       <div className='relative h-96 w-full'>
//         <Image
//           src={blog.image}
//           alt={blog.title}
//           fill
//           className='object-cover'
//           priority
//         />
//         <div className='absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center'>
//           <div className='text-center text-white px-4 max-w-4xl'>
//             <h1 className='text-4xl md:text-5xl lg:text-6xl font-bold mb-4'>
//               {blog.title}
//             </h1>
//             <p className='text-xl md:text-2xl text-gray-300'>
//               {blog.description}
//             </p>
//           </div>
//         </div>
//       </div>

//       <div className='container mx-auto max-w-4xl px-4 py-12'>
//         <Card className='shadow-lg'>
//           <CardHeader>
//             <div className='flex flex-col md:flex-row md:items-center justify-between mb-6'>
//               <div className='flex items-center gap-4 mb-4 md:mb-0'>
//                 <Avatar className='h-12 w-12'>
//                   <AvatarImage
//                     src={blog?.author?.profilePicture}
//                     alt={blog?.author?.name}
//                   />
//                   <AvatarFallback>
//                     {blog?.author?.name?.charAt(0)}
//                   </AvatarFallback>
//                 </Avatar>
//                 <div>
//                   <h2 className='text-xl font-semibold'>
//                     {blog?.author?.name}
//                   </h2>
//                   <p className='text-sm text-muted-foreground'>
//                     Published on {formatDate(blog.createdAt)}
//                   </p>
//                 </div>
//               </div>
//               <div className='flex items-center gap-4'>
//                 <span className='text-sm text-muted-foreground'>
//                   {blog.views} Views
//                 </span>
//                 <div className='flex items-center gap-2'>
//                   <Button variant='ghost' size='sm' onClick={handleLike}>
//                     <Heart
//                       className={`h-5 w-5 ${
//                         !blog.likes.includes(session.user.id)
//                           ? ''
//                           : 'fill-red-500 text-red-500'
//                       }`}
//                     />
//                     <span className='ml-1'>{likes}</span>
//                   </Button>
//                   <Button variant='ghost' size='sm'>
//                     <MessageCircle className='h-5 w-5' />
//                     <span className='ml-1'>{comments.length}</span>
//                   </Button>
//                   <Button variant='ghost' size='sm'>
//                     <Share2 className='h-5 w-5' />
//                   </Button>
//                 </div>
//               </div>
//             </div>
//             <div className='flex flex-wrap gap-2 mb-6'>
//               {blog.tags.map((tag) => (
//                 <Badge key={tag} variant='secondary'>
//                   {tag}
//                 </Badge>
//               ))}
//             </div>
//           </CardHeader>
//           <CardContent>
//             <div className='prose prose-lg dark:prose-invert max-w-none'>
//               {blog.content[0].blocks.map((block, index) => (
//                 <motion.div
//                   key={index}
//                   initial={{ opacity: 0, y: 20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ duration: 0.5, delay: index * 0.1 }}
//                 >
//                   <InstructionBlock instruction={block} />
//                 </motion.div>
//               ))}
//             </div>
//           </CardContent>
//           <CardFooter className='flex flex-col items-start'>
//             <h3 className='text-2xl font-semibold mb-4'>Comments</h3>
//             <ScrollArea className='h-[300px] w-full rounded-md border p-4'>
//               {comments?.map((comment, index) => (
//                 <div key={index} className='mb-6'>
//                   <div className='bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4'>
//                     <div className='flex items-center gap-4'>
//                       <Avatar className='h-10 w-10'>
//                         <AvatarImage
//                           src={
//                             comment.author?.profilePicture ||
//                             '/default-avatar.png'
//                           }
//                           alt={comment.author?.name || 'Anonymous'}
//                         />
//                         <AvatarFallback>
//                           {comment.author?.name?.charAt(0) || 'A'}
//                         </AvatarFallback>
//                       </Avatar>

//                       <div className='flex flex-col'>
//                         <span className='font-semibold text-lg text-gray-900 dark:text-white'>
//                           {comment.author?.name || 'Anonymous'}
//                         </span>
//                         <span className='text-sm text-gray-500 dark:text-gray-400'>
//                           {formatDate(comment.createdAt)}
//                         </span>
//                       </div>

//                       {session?.user?.id === comment.author._id && (
//                         <button
//                           onClick={() => handleDeleteComment(comment._id)}
//                           className='ml-auto text-red-500 hover:text-red-700 transition-colors'
//                         >
//                           <Trash2 className='h-5 w-5' />
//                         </button>
//                       )}
//                     </div>

//                     <p className='mt-3 text-gray-800 dark:text-gray-200'>
//                       {comment.comment}
//                     </p>
//                   </div>

//                   {index < comments.length - 1 && (
//                     <Separator className='my-4' />
//                   )}
//                 </div>
//               ))}
//             </ScrollArea>

//             <form onSubmit={handleComment} className='w-full mt-6'>
//               <Textarea
//                 placeholder='Add a comment...'
//                 value={newComment}
//                 onChange={(e) => setNewComment(e.target.value)}
//                 className='mb-2'
//               />
//               <Button type='submit'>Post Comment</Button>
//             </form>
//           </CardFooter>
//         </Card>
//         <div className='mt-8 flex justify-center'>
//           <Button variant='outline' onClick={() => router.push('/blogs')}>
//             Back to Blogs
//           </Button>
//         </div>
//       </div>
//     </motion.div>
//   )
// }

// function LoadingSkeleton() {
//   return (
//     <div className='min-h-screen pb-16 bg-gray-50 dark:bg-gray-900'>
//       <div className='h-96 w-full bg-gray-200 dark:bg-gray-800'></div>
//       <div className='container mx-auto max-w-4xl px-4 py-12'>
//         <Card>
//           <CardHeader>
//             <div className='flex flex-col md:flex-row md:items-center justify-between mb-6'>
//               <div className='flex items-center gap-4 mb-4 md:mb-0'>
//                 <Skeleton className='h-12 w-12 rounded-full' />
//                 <div>
//                   <Skeleton className='h-6 w-32 mb-2' />
//                   <Skeleton className='h-4 w-24' />
//                 </div>
//               </div>
//               <Skeleton className='h-4 w-16' />
//             </div>
//             <div className='flex gap-2 mb-6'>
//               <Skeleton className='h-6 w-16' />
//               <Skeleton className='h-6 w-16' />
//               <Skeleton className='h-6 w-16' />
//             </div>
//           </CardHeader>
//           <CardContent>
//             <Skeleton className='h-4 w-full mb-4' />
//             <Skeleton className='h-4 w-full mb-4' />
//             <Skeleton className='h-4 w-3/4 mb-4' />
//           </CardContent>
//           <CardFooter>
//             <Skeleton className='h-10 w-full' />
//           </CardFooter>
//         </Card>
//       </div>
//     </div>
//   )
// }

// 'use client'

// import { use, useEffect, useState } from 'react'
// import { useRouter } from 'next/navigation'
// import Image from 'next/image'
// import { motion } from 'framer-motion'
// import { Badge } from '@/components/ui/badge'
// import { Button } from '@/components/ui/button'
// import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
// import { Skeleton } from '@/components/ui/skeleton'
// import { toast } from '@/hooks/use-toast'
// import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
// import { Textarea } from '@/components/ui/textarea'
// import { ScrollArea } from '@/components/ui/scroll-area'
// import { Separator } from '@/components/ui/separator'
// import InstructionBlock from '@/components/InstructionBlock'
// import { Heart, MessageCircle, Share2, Trash2 } from 'lucide-react'
// import { useSession } from 'next-auth/react'

// function formatDate(dateString) {
//   return new Date(dateString).toLocaleDateString('en-US', {
//     year: 'numeric',
//     month: 'long',
//     day: 'numeric',
//   })
// }

// export default function BlogDetails({ params: paramsPromise }) {
//   const { id } = use(paramsPromise)
//   const [blog, setBlog] = useState(null)
//   const [isLoading, setIsLoading] = useState(true)
//   const [likes, setLikes] = useState(0)
//   const [comments, setComments] = useState([])
//   const [newComment, setNewComment] = useState('')
//   const { data: session } = useSession()
//   const router = useRouter()

//   useEffect(() => {
//     const fetchBlog = async () => {
//       try {
//         const res = await fetch(`/api/blogs/views/${id}`, { method: 'GET' })
//         const data = await res.json()
//         if (data.success) {
//           setBlog(data.data)
//           setLikes(data.data.likes.length)
//           setComments(data.data.comments)
//         } else {
//           throw new Error('Failed to fetch blog details')
//         }
//       } catch (error) {
//         console.error(error)
//         toast({
//           title: 'Error',
//           description: 'Failed to fetch blog details. Please try again.',
//           variant: 'destructive',
//         })
//         router.push('/blogs')
//       } finally {
//         setIsLoading(false)
//       }
//     }

//     fetchBlog()
//   }, [])

//   const handleLike = async () => {
//     try {
//       const res = await fetch(`/api/blogs/likes/${id}`, { method: 'POST' })
//       const data = await res.json()
//       if (data.success) {
//         setLikes(data.likes)
//         toast({
//           title: 'Success',
//           description: 'Blog post liked!',
//         })
//       } else {
//         throw new Error('Failed to like blog post')
//       }
//     } catch (error) {
//       console.error(error)
//       toast({
//         title: 'Error',
//         description: 'Failed to like blog post. Please try again.',
//         variant: 'destructive',
//       })
//     }
//   }

//   const handleComment = async (e) => {
//     e.preventDefault()
//     if (!newComment.trim()) return

//     try {
//       const res = await fetch(`/api/blogs/comments/${id}`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ comment: newComment }),
//       })
//       const data = await res.json()
//       if (data.success) {
//         setBlog(data.data)
//         setComments(data.data.comments)
//         setNewComment('')
//         toast({
//           title: 'Success',
//           description: 'Comment added successfully!',
//         })
//       } else {
//         throw new Error('Failed to add comment')
//       }
//     } catch (error) {
//       console.error(error)
//       toast({
//         title: 'Error',
//         description: 'Failed to add comment. Please try again.',
//         variant: 'destructive',
//       })
//     }
//   }

//   const handleDeleteComment = async (commentId) => {
//     try {
//       const res = await fetch(`/api/blogs/comments/${commentId}`, {
//         method: 'DELETE',
//       })
//       const data = await res.json()

//       if (data.success) {
//         setComments(comments.filter((comment) => comment._id !== commentId))
//         toast({
//           title: 'Success',
//           description: 'Comment deleted successfully!',
//         })
//       } else {
//         throw new Error('Failed to delete comment')
//       }
//     } catch (error) {
//       console.error(error)
//       toast({
//         title: 'Error',
//         description: 'Failed to delete comment. Please try again.',
//         variant: 'destructive',
//       })
//     }
//   }

//   if (isLoading) {
//     return <LoadingSkeleton />
//   }

//   if (!blog) {
//     return (
//       <div className='min-h-screen flex justify-center items-center'>
//         <p className='text-xl font-semibold'>Blog not found</p>
//       </div>
//     )
//   }

//   return (
//     <motion.div
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       transition={{ duration: 0.5 }}
//       className='min-h-screen pb-16 bg-gray-50 dark:bg-gray-900'
//     >
//       <div className='relative h-96 w-full'>
//         <Image
//           src={blog.image}
//           alt={blog.title}
//           fill
//           className='object-cover'
//           priority
//         />
//         <div className='absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center'>
//           <div className='text-center text-white px-4 max-w-4xl'>
//             <h1 className='text-4xl md:text-5xl lg:text-6xl font-bold mb-4'>
//               {blog.title}
//             </h1>
//             <p className='text-xl md:text-2xl text-gray-300'>
//               {blog.description}
//             </p>
//           </div>
//         </div>
//       </div>

//       <div className='container mx-auto max-w-4xl px-4 py-12'>
//         <Card className='shadow-lg'>
//           <CardHeader>
//             <div className='flex flex-col md:flex-row md:items-center justify-between mb-6'>
//               <div className='flex items-center gap-4 mb-4 md:mb-0'>
//                 <Avatar className='h-12 w-12'>
//                   <AvatarImage
//                     src={blog?.author?.profilePicture}
//                     alt={blog?.author?.name}
//                   />
//                   <AvatarFallback>
//                     {blog?.author?.name?.charAt(0)}
//                   </AvatarFallback>
//                 </Avatar>
//                 <div>
//                   <h2 className='text-xl font-semibold'>
//                     {blog?.author?.name}
//                   </h2>
//                   <p className='text-sm text-muted-foreground'>
//                     Published on {formatDate(blog.createdAt)}
//                   </p>
//                 </div>
//               </div>
//               <div className='flex items-center gap-4'>
//                 <span className='text-sm text-muted-foreground'>
//                   {blog.views} Views
//                 </span>
//                 <div className='flex items-center gap-2'>
//                   <Button variant='ghost' size='sm' onClick={handleLike}>
//                     <Heart
//                       className={`h-5 w-5 ${
//                         !blog.likes.includes(session.user.id)
//                           ? ''
//                           : 'fill-red-500 text-red-500'
//                       }`}
//                     />
//                     <span className='ml-1'>{likes}</span>
//                   </Button>
//                   <Button variant='ghost' size='sm'>
//                     <MessageCircle className='h-5 w-5' />
//                     <span className='ml-1'>{comments.length}</span>
//                   </Button>
//                   <Button variant='ghost' size='sm'>
//                     <Share2 className='h-5 w-5' />
//                   </Button>
//                 </div>
//               </div>
//             </div>
//             <div className='flex flex-wrap gap-2 mb-6'>
//               {blog.tags.map((tag) => (
//                 <Badge key={tag} variant='secondary'>
//                   {tag}
//                 </Badge>
//               ))}
//             </div>
//           </CardHeader>
//           <CardContent>
//             <div className='prose prose-lg dark:prose-invert max-w-none'>
//               {blog.content[0].blocks.map((block, index) => (
//                 <motion.div
//                   key={index}
//                   initial={{ opacity: 0, y: 20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ duration: 0.5, delay: index * 0.1 }}
//                 >
//                   <InstructionBlock instruction={block} />
//                 </motion.div>
//               ))}
//             </div>
//           </CardContent>
//           <CardFooter className='flex flex-col items-start'>
//             <h3 className='text-2xl font-semibold mb-4'>Comments</h3>
//             <ScrollArea className='h-[300px] w-full rounded-md border p-4'>
//               {comments?.map((comment, index) => (
//                 <div key={index} className='mb-6'>
//                   <div className='bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4'>
//                     <div className='flex items-center gap-4'>
//                       <Avatar className='h-10 w-10'>
//                         <AvatarImage
//                           src={
//                             comment.author?.profilePicture ||
//                             '/default-avatar.png'
//                           }
//                           alt={comment.author?.name || 'Anonymous'}
//                         />
//                         <AvatarFallback>
//                           {comment.author?.name?.charAt(0) || 'A'}
//                         </AvatarFallback>
//                       </Avatar>

//                       <div className='flex flex-col'>
//                         <span className='font-semibold text-lg text-gray-900 dark:text-white'>
//                           {comment.author?.name || 'Anonymous'}
//                         </span>
//                         <span className='text-sm text-gray-500 dark:text-gray-400'>
//                           {formatDate(comment.createdAt)}
//                         </span>
//                       </div>

//                       {session?.user?.id === comment.author._id && (
//                         <button
//                           onClick={() => handleDeleteComment(comment._id)}
//                           className='ml-auto text-red-500 hover:text-red-700 transition-colors'
//                         >
//                           <Trash2 className='h-5 w-5' />
//                         </button>
//                       )}
//                     </div>

//                     <p className='mt-3 text-gray-800 dark:text-gray-200'>
//                       {comment.comment}
//                     </p>
//                   </div>

//                   {index < comments.length - 1 && (
//                     <Separator className='my-4' />
//                   )}
//                 </div>
//               ))}
//             </ScrollArea>

//             <form onSubmit={handleComment} className='w-full mt-6'>
//               <Textarea
//                 placeholder='Add a comment...'
//                 value={newComment}
//                 onChange={(e) => setNewComment(e.target.value)}
//                 className='mb-2'
//               />
//               <Button type='submit'>Post Comment</Button>
//             </form>
//           </CardFooter>
//         </Card>
//         <div className='mt-8 flex justify-center'>
//           <Button variant='outline' onClick={() => router.push('/blogs')}>
//             Back to Blogs
//           </Button>
//         </div>
//       </div>
//     </motion.div>
//   )
// }

// function LoadingSkeleton() {
//   return (
//     <div className='min-h-screen pb-16 bg-gray-50 dark:bg-gray-900'>
//       <div className='h-96 w-full bg-gray-200 dark:bg-gray-800'></div>
//       <div className='container mx-auto max-w-4xl px-4 py-12'>
//         <Card>
//           <CardHeader>
//             <div className='flex flex-col md:flex-row md:items-center justify-between mb-6'>
//               <div className='flex items-center gap-4 mb-4 md:mb-0'>
//                 <Skeleton className='h-12 w-12 rounded-full' />
//                 <div>
//                   <Skeleton className='h-6 w-32 mb-2' />
//                   <Skeleton className='h-4 w-24' />
//                 </div>
//               </div>
//               <Skeleton className='h-4 w-16' />
//             </div>
//             <div className='flex gap-2 mb-6'>
//               <Skeleton className='h-6 w-16' />
//               <Skeleton className='h-6 w-16' />
//               <Skeleton className='h-6 w-16' />
//             </div>
//           </CardHeader>
//           <CardContent>
//             <Skeleton className='h-4 w-full mb-4' />
//             <Skeleton className='h-4 w-full mb-4' />
//             <Skeleton className='h-4 w-3/4 mb-4' />
//           </CardContent>
//           <CardFooter>
//             <Skeleton className='h-10 w-full' />
//           </CardFooter>
//         </Card>
//       </div>
//     </div>
//   )
// }

'use client'

import { use, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { toast } from '@/hooks/use-toast'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Textarea } from '@/components/ui/textarea'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import InstructionBlock from '@/components/InstructionBlock'
import {
  Heart,
  MessageCircle,
  Share2,
  Trash2,
  Calendar,
  Eye,
  ArrowLeft,
} from 'lucide-react'
import { useSession } from 'next-auth/react'

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export default function BlogDetails({ params: paramsPromise }) {
  const { id } = use(paramsPromise)
  const [blog, setBlog] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [likes, setLikes] = useState(0)
  const [comments, setComments] = useState([])
  const [newComment, setNewComment] = useState('')
  const { data: session } = useSession()
  const router = useRouter()

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await fetch(`/api/blogs/views/${id}`, { method: 'GET' })
        const data = await res.json()
        if (data.success) {
          setBlog(data.data)
          setLikes(data.data.likes.length)
          setComments(data.data.comments)
        } else {
          throw new Error('Failed to fetch blog details')
        }
      } catch (error) {
        console.error(error)
        toast({
          title: 'Error',
          description: 'Failed to fetch blog details. Please try again.',
          variant: 'destructive',
        })
        router.push('/blogs')
      } finally {
        setIsLoading(false)
      }
    }

    fetchBlog()
  }, [])

  const handleLike = async () => {
    try {
      const res = await fetch(`/api/blogs/likes/${id}`, { method: 'POST' })
      const data = await res.json()
      if (data.success) {
        setLikes(data.likes)
        toast({
          title: 'Success',
          description: 'Blog post liked!',
        })
      } else {
        throw new Error('Failed to like blog post')
      }
    } catch (error) {
      console.error(error)
      toast({
        title: 'Error',
        description: 'Failed to like blog post. Please try again.',
        variant: 'destructive',
      })
    }
  }

  const handleComment = async (e) => {
    e.preventDefault()
    if (!newComment.trim()) return

    try {
      const res = await fetch(`/api/blogs/comments/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ comment: newComment }),
      })
      const data = await res.json()
      if (data.success) {
        setBlog(data.data)
        setComments(data.data.comments)
        setNewComment('')
        toast({
          title: 'Success',
          description: 'Comment added successfully!',
        })
      } else {
        throw new Error('Failed to add comment')
      }
    } catch (error) {
      console.error(error)
      toast({
        title: 'Error',
        description: 'Failed to add comment. Please try again.',
        variant: 'destructive',
      })
    }
  }

  const handleDeleteComment = async (commentId) => {
    try {
      const res = await fetch(`/api/blogs/comments/${commentId}`, {
        method: 'DELETE',
      })
      const data = await res.json()

      if (data.success) {
        setComments(comments.filter((comment) => comment._id !== commentId))
        toast({
          title: 'Success',
          description: 'Comment deleted successfully!',
        })
      } else {
        throw new Error('Failed to delete comment')
      }
    } catch (error) {
      console.error(error)
      toast({
        title: 'Error',
        description: 'Failed to delete comment. Please try again.',
        variant: 'destructive',
      })
    }
  }

  if (isLoading) {
    return <LoadingSkeleton />
  }

  if (!blog) {
    return (
      <div className='min-h-screen flex justify-center items-center bg-gradient-to-b from-background to-muted'>
        <p className='text-xl font-semibold'>Blog not found</p>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className='min-h-screen bg-gradient-to-b from-background to-muted'
    >
      {/* Hero Section */}
      <div className='relative h-[50vh] w-full'>
        <Image
          src={blog.image}
          alt={blog.title}
          fill
          className='object-cover'
          priority
        />
        <div className='absolute inset-0 bg-gradient-to-b from-black/70 to-black/40 backdrop-blur-sm'>
          <div className='max-w-7xl mx-auto h-full flex flex-col justify-end pb-20 px-4'>
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className='max-w-4xl'
            >
              <div className='flex flex-wrap gap-2 mb-4'>
                {blog.tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant='secondary'
                    className='bg-primary/10 text-primary'
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
              <h1 className='text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight'>
                {blog.title}
              </h1>
              <p className='text-xl text-gray-200 max-w-2xl'>
                {blog.description}
              </p>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className='container mx-auto max-w-6xl px-4 -mt-16 relative z-10'>
        <Card className='shadow-xl border-none bg-card/80 backdrop-blur supports-[backdrop-filter]:bg-card/80'>
          <CardHeader>
            <div className='flex flex-col space-y-4'>
              {/* Author Info */}
              <div className='flex items-center gap-4'>
                <Avatar className='h-14 w-14 ring-2 ring-primary/10'>
                  <AvatarImage
                    src={blog?.author?.profilePicture}
                    alt={blog?.author?.name}
                  />
                  <AvatarFallback>
                    {blog?.author?.name?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className='text-xl font-semibold'>
                    {blog?.author?.name}
                  </h2>
                  <div className='flex items-center gap-4 text-sm text-muted-foreground'>
                    <span className='flex items-center gap-1'>
                      <Calendar className='h-4 w-4' />
                      {formatDate(blog.createdAt)}
                    </span>
                    <span className='flex items-center gap-1'>
                      <Eye className='h-4 w-4' />
                      {blog.views} views
                    </span>
                  </div>
                </div>
              </div>

              {/* Engagement Buttons */}
              <div className='flex items-center gap-4 pt-2'>
                <Button
                  variant='ghost'
                  size='sm'
                  onClick={handleLike}
                  className='hover:bg-primary/10'
                >
                  <Heart
                    className={`h-5 w-5 mr-1 ${
                      !blog.likes.includes(session?.user?.id)
                        ? ''
                        : 'fill-red-500 text-red-500'
                    }`}
                  />
                  {likes}
                </Button>
                <Button
                  variant='ghost'
                  size='sm'
                  className='hover:bg-primary/10'
                >
                  <MessageCircle className='h-5 w-5 mr-1' />
                  {comments.length}
                </Button>
                <Button
                  variant='ghost'
                  size='sm'
                  className='hover:bg-primary/10'
                >
                  <Share2 className='h-5 w-5 mr-1' />
                  Share
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <div className='prose prose-lg dark:prose-invert max-w-none'>
              {blog.content[0].blocks.map((block, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <InstructionBlock instruction={block} />
                </motion.div>
              ))}
            </div>
          </CardContent>

          {/* Comments Section */}
          <CardFooter className='flex flex-col items-start'>
            <h3 className='text-2xl font-semibold mb-6'>Discussion</h3>

            {/* New Comment Form */}
            <form onSubmit={handleComment} className='w-full mb-8'>
              <Textarea
                placeholder='Share your thoughts...'
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className='mb-3 min-h-[100px]'
              />
              <Button type='submit' className='w-full sm:w-auto'>
                Post Comment
              </Button>
            </form>

            {/* Comments List */}
            <ScrollArea className='h-[400px] w-full rounded-md'>
              {comments?.map((comment, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className='mb-6'
                >
                  <div className='bg-card/50 backdrop-blur-sm rounded-lg p-4'>
                    <div className='flex items-center gap-4'>
                      <Avatar className='h-10 w-10'>
                        <AvatarImage
                          src={
                            comment.author?.profilePicture ||
                            '/default-avatar.png'
                          }
                          alt={comment.author?.name || 'Anonymous'}
                        />
                        <AvatarFallback>
                          {comment.author?.name?.charAt(0) || 'A'}
                        </AvatarFallback>
                      </Avatar>

                      <div className='flex-1'>
                        <div className='flex items-center justify-between'>
                          <span className='font-semibold'>
                            {comment.author?.name || 'Anonymous'}
                          </span>
                          <span className='text-sm text-muted-foreground'>
                            {formatDate(comment.createdAt)}
                          </span>
                        </div>
                        <p className='mt-2 text-foreground/90'>
                          {comment.comment}
                        </p>
                      </div>

                      {session?.user?.id === comment.author._id && (
                        <Button
                          variant='ghost'
                          size='icon'
                          onClick={() => handleDeleteComment(comment._id)}
                          className='text-destructive hover:text-destructive/90'
                        >
                          <Trash2 className='h-4 w-4' />
                        </Button>
                      )}
                    </div>
                  </div>

                  {index < comments.length - 1 && (
                    <Separator className='my-6' />
                  )}
                </motion.div>
              ))}
            </ScrollArea>
          </CardFooter>
        </Card>

        {/* Back Button */}
        <div className='mt-8 mb-16 flex justify-center'>
          <Button
            variant='outline'
            onClick={() => router.push('/blogs')}
            className='group'
          >
            <ArrowLeft className='mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1' />
            Back to Blogs
          </Button>
        </div>
      </div>
    </motion.div>
  )
}

function LoadingSkeleton() {
  return (
    <div className='min-h-screen bg-gradient-to-b from-background to-muted'>
      <div className='h-[70vh] w-full bg-muted animate-pulse'></div>
      <div className='container mx-auto max-w-4xl px-4 -mt-16 relative z-10'>
        <Card className='shadow-xl border-none bg-card/80 backdrop-blur'>
          <CardHeader>
            <div className='flex items-center gap-4 mb-6'>
              <Skeleton className='h-14 w-14 rounded-full' />
              <div className='space-y-2'>
                <Skeleton className='h-6 w-32' />
                <Skeleton className='h-4 w-24' />
              </div>
            </div>
            <div className='flex gap-2 mb-4'>
              <Skeleton className='h-6 w-16' />
              <Skeleton className='h-6 w-16' />
              <Skeleton className='h-6 w-16' />
            </div>
          </CardHeader>
          <CardContent className='space-y-4'>
            <Skeleton className='h-4 w-full' />
            <Skeleton className='h-4 w-full' />
            <Skeleton className='h-4 w-3/4' />
          </CardContent>
          <CardFooter className='flex flex-col gap-4'>
            <Skeleton className='h-32 w-full' />
            <Skeleton className='h-10 w-32' />
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
