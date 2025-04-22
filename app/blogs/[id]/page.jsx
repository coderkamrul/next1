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
// import {
//   Heart,
//   MessageCircle,
//   Share2,
//   Trash2,
//   Calendar,
//   Eye,
//   ArrowLeft,
// } from 'lucide-react'
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
//       <div className='min-h-screen flex justify-center items-center bg-gradient-to-b from-background to-muted'>
//         <p className='text-xl font-semibold'>Blog not found</p>
//       </div>
//     )
//   }

//   return (
//     <motion.div
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       transition={{ duration: 0.5 }}
//       className='min-h-screen bg-gradient-to-b from-background to-muted'
//     >
//       {/* Hero Section */}
//       <div className='relative h-[50vh] w-full'>
//         <Image
//           src={blog.image}
//           alt={blog.title}
//           fill
//           className='object-cover'
//           priority
//         />
//         <div className='absolute inset-0 bg-gradient-to-b from-black/70 to-black/40 backdrop-blur-sm'>
//           <div className='max-w-7xl mx-auto h-full flex flex-col justify-end pb-20 px-4'>
//             <motion.div
//               initial={{ y: 20, opacity: 0 }}
//               animate={{ y: 0, opacity: 1 }}
//               transition={{ delay: 0.2 }}
//               className='max-w-4xl'
//             >
//               <div className='flex flex-wrap gap-2 mb-4'>
//                 {blog.tags.map((tag) => (
//                   <Badge
//                     key={tag}
//                     variant='secondary'
//                     className='bg-primary/10 text-primary'
//                   >
//                     {tag}
//                   </Badge>
//                 ))}
//               </div>
//               <h1 className='text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight'>
//                 {blog.title}
//               </h1>
//               <p className='text-xl text-gray-200 max-w-2xl'>
//                 {blog.description}
//               </p>
//             </motion.div>
//           </div>
//         </div>
//       </div>

//       {/* Main Content */}
//       <div className='container mx-auto max-w-6xl px-4 -mt-16 relative z-10'>
//         <Card className='shadow-xl border-none bg-card/80 backdrop-blur supports-[backdrop-filter]:bg-card/80'>
//           <CardHeader>
//             <div className='flex flex-col space-y-4'>
//               {/* Author Info */}
//               <div className='flex items-center gap-4'>
//                 <Avatar className='h-14 w-14 ring-2 ring-primary/10'>
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
//                   <div className='flex items-center gap-4 text-sm text-muted-foreground'>
//                     <span className='flex items-center gap-1'>
//                       <Calendar className='h-4 w-4' />
//                       {formatDate(blog.createdAt)}
//                     </span>
//                     <span className='flex items-center gap-1'>
//                       <Eye className='h-4 w-4' />
//                       {blog.views} views
//                     </span>
//                   </div>
//                 </div>
//               </div>

//               {/* Engagement Buttons */}
//               <div className='flex items-center gap-4 pt-2'>
//                 <Button
//                   variant='ghost'
//                   size='sm'
//                   onClick={handleLike}
//                   className='hover:bg-primary/10'
//                 >
//                   <Heart
//                     className={`h-5 w-5 mr-1 ${
//                       !blog.likes.includes(session?.user?.id)
//                         ? ''
//                         : 'fill-red-500 text-red-500'
//                     }`}
//                   />
//                   {likes}
//                 </Button>
//                 <Button
//                   variant='ghost'
//                   size='sm'
//                   className='hover:bg-primary/10'
//                 >
//                   <MessageCircle className='h-5 w-5 mr-1' />
//                   {comments.length}
//                 </Button>
//                 <Button
//                   variant='ghost'
//                   size='sm'
//                   className='hover:bg-primary/10'
//                 >
//                   <Share2 className='h-5 w-5 mr-1' />
//                   Share
//                 </Button>
//               </div>
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

//           {/* Comments Section */}
//           <CardFooter className='flex flex-col items-start'>
//             <h3 className='text-2xl font-semibold mb-6'>Discussion</h3>

//             {/* New Comment Form */}
//             <form onSubmit={handleComment} className='w-full mb-8'>
//               <Textarea
//                 placeholder='Share your thoughts...'
//                 value={newComment}
//                 onChange={(e) => setNewComment(e.target.value)}
//                 className='mb-3 min-h-[100px]'
//               />
//               <Button type='submit' className='w-full sm:w-auto'>
//                 Post Comment
//               </Button>
//             </form>

//             {/* Comments List */}
//             <ScrollArea className='h-[400px] w-full rounded-md'>
//               {comments?.map((comment, index) => (
//                 <motion.div
//                   key={index}
//                   initial={{ opacity: 0, y: 10 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ delay: index * 0.1 }}
//                   className='mb-6'
//                 >
//                   <div className='bg-card/50 backdrop-blur-sm rounded-lg p-4'>
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

//                       <div className='flex-1'>
//                         <div className='flex items-center justify-between'>
//                           <span className='font-semibold'>
//                             {comment.author?.name || 'Anonymous'}
//                           </span>
//                           <span className='text-sm text-muted-foreground'>
//                             {formatDate(comment.createdAt)}
//                           </span>
//                         </div>
//                         <p className='mt-2 text-foreground/90'>
//                           {comment.comment}
//                         </p>
//                       </div>

//                       {session?.user?.id === comment.author._id && (
//                         <Button
//                           variant='ghost'
//                           size='icon'
//                           onClick={() => handleDeleteComment(comment._id)}
//                           className='text-destructive hover:text-destructive/90'
//                         >
//                           <Trash2 className='h-4 w-4' />
//                         </Button>
//                       )}
//                     </div>
//                   </div>

//                   {index < comments.length - 1 && (
//                     <Separator className='my-6' />
//                   )}
//                 </motion.div>
//               ))}
//             </ScrollArea>
//           </CardFooter>
//         </Card>

//         {/* Back Button */}
//         <div className='mt-8 mb-16 flex justify-center'>
//           <Button
//             variant='outline'
//             onClick={() => router.push('/blogs')}
//             className='group'
//           >
//             <ArrowLeft className='mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1' />
//             Back to Blogs
//           </Button>
//         </div>
//       </div>
//     </motion.div>
//   )
// }

// function LoadingSkeleton() {
//   return (
//     <div className='min-h-screen bg-gradient-to-b from-background to-muted'>
//       <div className='h-[70vh] w-full bg-muted animate-pulse'></div>
//       <div className='container mx-auto max-w-4xl px-4 -mt-16 relative z-10'>
//         <Card className='shadow-xl border-none bg-card/80 backdrop-blur'>
//           <CardHeader>
//             <div className='flex items-center gap-4 mb-6'>
//               <Skeleton className='h-14 w-14 rounded-full' />
//               <div className='space-y-2'>
//                 <Skeleton className='h-6 w-32' />
//                 <Skeleton className='h-4 w-24' />
//               </div>
//             </div>
//             <div className='flex gap-2 mb-4'>
//               <Skeleton className='h-6 w-16' />
//               <Skeleton className='h-6 w-16' />
//               <Skeleton className='h-6 w-16' />
//             </div>
//           </CardHeader>
//           <CardContent className='space-y-4'>
//             <Skeleton className='h-4 w-full' />
//             <Skeleton className='h-4 w-full' />
//             <Skeleton className='h-4 w-3/4' />
//           </CardContent>
//           <CardFooter className='flex flex-col gap-4'>
//             <Skeleton className='h-32 w-full' />
//             <Skeleton className='h-10 w-32' />
//           </CardFooter>
//         </Card>
//       </div>
//     </div>
//   )
// }

"use client"

import { use, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "@/hooks/use-toast"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import InstructionBlock from "@/components/InstructionBlock"
import { Heart, MessageCircle, Share2, Trash2, Calendar, Eye, ArrowLeft } from "lucide-react"
import { useSession } from "next-auth/react"

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

export default function BlogDetails({ params: paramsPromise }) {
  const { id } = use(paramsPromise)
  const [blog, setBlog] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [likes, setLikes] = useState(0)
  const [comments, setComments] = useState([])
  const [newComment, setNewComment] = useState("")
  const { data: session } = useSession()
  const router = useRouter()

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await fetch(`/api/blogs/views/${id}`, { method: "GET" })
        const data = await res.json()
        if (data.success) {
          setBlog(data.data)
          setLikes(data.data.likes.length)
          setComments(data.data.comments)
        } else {
          throw new Error("Failed to fetch blog details")
        }
      } catch (error) {
        console.error(error)
        toast({
          title: "Error",
          description: "Failed to fetch blog details. Please try again.",
          variant: "destructive",
        })
        router.push("/blogs")
      } finally {
        setIsLoading(false)
      }
    }

    fetchBlog()
  }, [])

  const handleLike = async () => {
    try {
      const res = await fetch(`/api/blogs/likes/${id}`, { method: "POST" })
      const data = await res.json()
      if (data.success) {
        setLikes(data.likes)
        toast({
          title: "Success",
          description: "Blog post liked!",
        })
      } else {
        throw new Error("Failed to like blog post")
      }
    } catch (error) {
      console.error(error)
      toast({
        title: "Error",
        description: "Failed to like blog post. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleComment = async (e) => {
    e.preventDefault()
    if (!newComment.trim()) return

    try {
      const res = await fetch(`/api/blogs/comments/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ comment: newComment }),
      })
      const data = await res.json()
      if (data.success) {
        setBlog(data.data)
        setComments(data.data.comments)
        setNewComment("")
        toast({
          title: "Success",
          description: "Comment added successfully!",
        })
      } else {
        throw new Error("Failed to add comment")
      }
    } catch (error) {
      console.error(error)
      toast({
        title: "Error",
        description: "Failed to add comment. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleDeleteComment = async (commentId) => {
    try {
      const res = await fetch(`/api/blogs/comments/${commentId}`, {
        method: "DELETE",
      })
      const data = await res.json()

      if (data.success) {
        setComments(comments.filter((comment) => comment._id !== commentId))
        toast({
          title: "Success",
          description: "Comment deleted successfully!",
        })
      } else {
        throw new Error("Failed to delete comment")
      }
    } catch (error) {
      console.error(error)
      toast({
        title: "Error",
        description: "Failed to delete comment. Please try again.",
        variant: "destructive",
      })
    }
  }

  if (isLoading) {
    return <LoadingSkeleton />
  }

  if (!blog) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gradient-to-b from-background to-muted">
        <p className="text-xl font-semibold">Blog not found</p>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-b from-background to-muted/50"
    >
      {/* Hero Section */}
      <div className="relative max-w-7xl m-auto">
        {/* Back Navigation */}
        <div className="absolute top-6 left-6 z-20">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push("/blogs")}
            className="bg-background/80 backdrop-blur-sm hover:bg-background/90 group"
          >
            <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Back
          </Button>
        </div>

        {/* Background Image with Overlay */}
        <div className="h-[60vh] w-full relative">
          <Image src={blog.image || "/placeholder.svg"} alt={blog.title} fill className="object-cover" priority />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
        </div>

        {/* Content positioned over the image */}
        <div className="container mx-auto px-4 relative -mt-64 z-10 pb-16">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="max-w-6xl mx-auto"
          >
            <div className="flex flex-wrap gap-2 mb-4">
              {blog.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="bg-primary/10 text-primary">
                  {tag}
                </Badge>
              ))}
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">{blog.title}</h1>
            <p className="text-xl text-muted-foreground max-w-2xl">{blog.description}</p>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto max-w-7xl px-4 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_280px] gap-8">
          {/* Main Article */}
          <Card className="shadow-md border-none bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/90 order-2 md:order-1">
            <CardHeader>
              {/* Engagement Buttons */}
              <div className="flex items-center justify-between border-b pb-4">
                <div className="flex items-center gap-4">
                  <Button variant="ghost" size="sm" onClick={handleLike} className="hover:bg-primary/10 rounded-full">
                    <Heart
                      className={`h-5 w-5 mr-1 ${
                        !blog.likes.includes(session?.user?.id) ? "" : "fill-red-500 text-red-500"
                      }`}
                    />
                    {likes}
                  </Button>
                  <Button variant="ghost" size="sm" className="hover:bg-primary/10 rounded-full">
                    <MessageCircle className="h-5 w-5 mr-1" />
                    {comments.length}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="hover:bg-primary/10 rounded-full"
                    onClick={() => {
                      const shareUrl = window.location.href;
                      const shareText = `Check out this blog: ${blog.title}`;
                      if (navigator.share) {
                        navigator.share({
                          title: blog.title,
                          text: shareText,
                          url: shareUrl,
                        });
                      } else {
                        window.open(
                          `https://twitter.com/intent/tweet?text=${encodeURIComponent(
                            shareText
                          )}&url=${encodeURIComponent(shareUrl)}`,
                          "_blank"
                        );
                      }
                    }}
                  >
                    <Share2 className="h-5 w-5 mr-1" />
                    Share
                  </Button>
                </div>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Eye className="h-4 w-4" />
                  {blog.views} views
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <div className="prose prose-lg dark:prose-invert max-w-none">
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
          </Card>

          {/* Author Sidebar */}
          <div className="order-1 md:order-2">
            <Card className="shadow-md border-none bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/90 sticky top-20">
              <CardHeader>
                <div className="flex flex-col items-center text-center">
                  <Avatar className="h-20 w-20 ring-2 ring-primary/10 mb-4">
                    <AvatarImage src={blog?.author?.profilePicture || "/placeholder.svg"} alt={blog?.author?.name} />
                    <AvatarFallback>{blog?.author?.name?.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <h2 className="text-xl font-semibold">{blog?.author?.name}</h2>
                  <div className="text-sm text-muted-foreground mt-1">
                    <span className="flex items-center justify-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {formatDate(blog.createdAt)}
                    </span>
                  </div>
                </div>
              </CardHeader>
            </Card>
          </div>
        </div>

        {/* Comments Section */}
        <Card className="shadow-md border-none bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/90 mt-8">
          <CardHeader>
            <h3 className="text-2xl font-semibold">Discussion ({comments.length})</h3>
          </CardHeader>
          <CardContent>
            {/* New Comment Form */}
            <form onSubmit={handleComment} className="w-full mb-8">
              <Textarea
                placeholder="Share your thoughts..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="mb-3 min-h-[100px]"
              />
              <Button type="submit" className="w-full sm:w-auto">
                Post Comment
              </Button>
            </form>

            {/* Comments List */}
            <ScrollArea className="h-[400px] w-full rounded-md">
              {comments.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">Be the first to comment on this post!</div>
              ) : (
                comments?.map((comment, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="mb-6"
                  >
                    <div className="bg-muted/30 backdrop-blur-sm rounded-lg p-4">
                      <div className="flex items-start gap-4">
                        <Avatar className="h-10 w-10">
                          <AvatarImage
                            src={comment.author?.profilePicture || "/default-avatar.png" || "/placeholder.svg"}
                            alt={comment.author?.name || "Anonymous"}
                          />
                          <AvatarFallback>{comment.author?.name?.charAt(0) || "A"}</AvatarFallback>
                        </Avatar>

                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="font-semibold">{comment.author?.name || "Anonymous"}</span>
                            <span className="text-sm text-muted-foreground">{formatDate(comment.createdAt)}</span>
                          </div>
                          <p className="mt-2 text-foreground/90">{comment.comment}</p>
                        </div>

                        {session?.user?.id === comment.author._id && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteComment(comment._id)}
                            className="text-destructive hover:text-destructive/90"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>

                    {index < comments.length - 1 && <Separator className="my-6" />}
                  </motion.div>
                ))
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  )
}

function LoadingSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      {/* Hero Skeleton */}
      <div className="h-[60vh] w-full bg-muted animate-pulse"></div>

      {/* Content Skeleton */}
      <div className="container mx-auto max-w-7xl px-4 -mt-32 relative z-10 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_280px] gap-8">
          {/* Main Content Skeleton */}
          <Card className="shadow-md border-none bg-card/95 backdrop-blur order-2 md:order-1">
            <CardHeader>
              <div className="flex justify-between border-b pb-4">
                <div className="flex gap-4">
                  <Skeleton className="h-8 w-20" />
                  <Skeleton className="h-8 w-20" />
                  <Skeleton className="h-8 w-20" />
                </div>
                <Skeleton className="h-6 w-24" />
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-2/3" />
            </CardContent>
          </Card>

          {/* Author Sidebar Skeleton */}
          <div className="order-1 md:order-2">
            <Card className="shadow-md border-none bg-card/95 backdrop-blur">
              <CardHeader>
                <div className="flex flex-col items-center text-center">
                  <Skeleton className="h-20 w-20 rounded-full mb-4" />
                  <Skeleton className="h-6 w-32" />
                  <Skeleton className="h-4 w-24 mt-2" />
                </div>
              </CardHeader>
            </Card>
          </div>
        </div>

        {/* Comments Skeleton */}
        <Card className="shadow-md border-none bg-card/95 backdrop-blur mt-8">
          <CardHeader>
            <Skeleton className="h-8 w-40" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-32 w-full mb-4" />
            <Skeleton className="h-10 w-32 mb-8" />
            <div className="space-y-6">
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
