"use client";
import ReviewCard from "@/components/ReviewCard";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  ExternalLink,
  Github,
  MessageSquareShare,
  MoveRight,
  Quote,
  RefreshCw,
  Send,
  Star,
  Youtube,
} from "lucide-react";
import Link from "next/link";
import {
  FaGithub,
  FaDiscord,
  FaYoutube,
  FaStar,
  FaWhatsapp,
} from "react-icons/fa";
import { motion } from "framer-motion";
import Services from "@/components/Services";
import ViewWork from "@/components/ViewWork";
import { IoCodeSlashOutline } from "react-icons/io5";
import {
  HiOutlineAcademicCap,
  HiOutlineChartBar,
  HiOutlinePuzzlePiece,
  HiOutlineUserGroup,
} from "react-icons/hi2";
import Hireme from "@/components/Hireme";
import HiremeHero from "@/components/HiremeHero";
import EmailMe from "@/components/Emailme";
import Image from "next/image";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useState } from "react";
import { toast } from "@/hooks/use-toast";
import TestimonialCard from "@/components/TestimonialCard";
import { Marquee } from "@/components/ui/marquee";
import { CustomCarousel } from "@/components/ui/custom-carousel";
import { SiFiverr } from "react-icons/si";
import ViewServices from "@/components/ViewServices";

const experiencedata = [
  {
    id: 1,
    title: "Full-Stack",
    description: "Next.js, React, MERN, TypeScript, WordPress",
    icon: <IoCodeSlashOutline size={25} className="text-white" />,
  },
  {
    id: 2,
    title: "Problem-Solving",
    description: "Innovative solutions to complex challenges",
    icon: <HiOutlinePuzzlePiece size={25} className="text-white" />,
  },
  {
    id: 3,
    title: "Collaboration",
    description: "Effective team player and communicator",
    icon: <HiOutlineUserGroup size={25} className="text-white" />,
  },
  {
    id: 4,
    title: "Continuous Learning",
    description: "Up-to-date with latest web technologies",
    icon: <HiOutlineAcademicCap size={25} className="text-white" />,
  },
  {
    id: 5,
    title: "Versatility",
    description: "Seamless front-end and back-end development",
    icon: <RefreshCw size={25} className="text-white" />,
  },
  {
    id: 6,
    title: "Performance",
    description: "Efficient, scalable web applications",
    icon: <HiOutlineChartBar size={25} className="text-white" />,
  },
];

export default function Home() {
  const [youtubedata, setyoutubedata] = useState([]);
  const [blogdata, setblogdata] = useState([]);
  const [reviewdata, setreviewdata] = useState([]);
  const [allReviews, setAllReviews] = useState([]);

  useEffect(() => {
    fetchYoutubes();
    fetchBlogs();
    fetchReviews();
  }, []);
  const fetchYoutubes = async () => {
    const res = await fetch("/api/youtube/all");
    const data = await res.json();
    if (data.success) {
      setyoutubedata(data.data);
    }
  };
  const fetchBlogs = async () => {
    const res = await fetch("/api/blogs/admin");
    const data = await res.json();
    if (data.success) {
      setblogdata(data.data);
    }
  };
  const fetchReviews = async () => {
    const res = await fetch("/api/reviews");
    const data = await res.json();
    if (data.success) {
      setAllReviews(data.data);
      const sortedReviews = data.data.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      const latestTwoReviews = sortedReviews.slice(0, 2);
      setreviewdata(latestTwoReviews);
    }
  };

  const { register, handleSubmit, reset } = useForm();
  const [loading, setLoading] = useState(false);
  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const res = await fetch("/api/submissions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        toast({
          title: "Submission Successful",
          description: "Your submission has been send successfully.",
        });
        reset();
      } else {
        throw new Error("Failed to create submission");
      }
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description: "Failed to create submission. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative z-0 mb-32 ">
      <div className="relative isolate md:px-4 md:pt-14 lg:px-8">
        <div
          className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
          aria-hidden="true"
        >
          <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-primary to-secondary opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem] path"></div>
        </div>

        {/* Hero Section */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative isolate overflow-hidden rounded-2xl sm:rounded-3xl py-8 sm:py-12 lg:py-16">
            <svg
              viewBox="0 0 1024 1024"
              className="absolute left-1/2 top-1/2 -z-10 h-[64rem] w-[64rem] -translate-y-1/2 [mask-image:radial-gradient(closest-side,white,transparent)] sm:left-full sm:-ml-80 lg:left-1/2 lg:ml-0 lg:-translate-x-1/2 lg:translate-y-0"
              aria-hidden="true"
            >
              <circle
                cx="512"
                cy="512"
                r="512"
                fill="url(#759c1415-0410-454c-8f7c-9a820de03641)"
                fillOpacity="0.7"
              ></circle>
              <defs>
                <radialGradient id="759c1415-0410-454c-8f7c-9a820de03641">
                  <stop stopColor="#8F00FF"></stop>
                  <stop offset="1" stopColor="#7F00FF"></stop>
                </radialGradient>
              </defs>
            </svg>
            <div className="grid lg:grid-cols-2 gap-8 px-4 sm:px-8 lg:px-12">
              <div className="max-w-xl mx-auto lg:mx-0 text-center lg:text-left">
                <motion.h1
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  viewport={{ once: true }}
                  className="font-semibold tracking-tight text-text dark:text-gray-200 text-4xl sm:text-5xl lg:text-6xl"
                >
                  Hello <span className="inline-block animate-bounce">👋</span>
                  <br />
                  I'm <span className="text-primary">Shahin Alam</span>
                </motion.h1>
                <p className="mt-4 text-text dark:text-gray-200 text-lg sm:text-xl">
                  A <b>Next.js</b>, React, Wordpress, Go High Level and{" "}
                  <b>MERN</b> stack developer and
                  <b> Youtuber</b> with over 5 years of experience in creating
                  robust and scalable web applications. I'm a{" "}
                  <b>Fiverr Level 2 seller</b> with a 5-star rating.
                </p>
                <div className="mt-8 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                  <div className="w-full sm:w-auto hover:scale-105 transition-all duration-300">
                    <Link href="/projects">
                      <Button variant="animated" className="!h-10 sm:text-lg">
                        View my work
                      </Button>
                    </Link>
                  </div>
                  <div className="w-full sm:w-auto hover:scale-105 transition-all duration-300">
                    <HiremeHero />
                  </div>
                </div>
                <div className="mt-8 flex items-center justify-center lg:justify-start gap-6">
                  <Link
                    href="https://github.com/coderkamrul"
                    rel="noopener noreferrer"
                    className="text-text text-2xl sm:text-3xl dark:text-gray-300 hover:text-primary duration-300 hover:scale-125 hover:rotate-12 transition-all "
                    target="_blank"
                  >
                    <FaGithub size={30} />
                  </Link>
                  <Link
                    href="https://wa.me/+8801302032326"
                    rel="noopener noreferrer"
                    className="text-text text-2xl sm:text-3xl dark:text-gray-300 hover:text-primary duration-300 hover:scale-125 hover:rotate-12 transition-all "
                    target="_blank"
                  >
                    <FaWhatsapp size={30} />
                  </Link>
                  <Link
                    href="https://www.fiverr.com/mojidm"
                    rel="noopener noreferrer"
                    className="text-text text-2xl sm:text-3xl dark:text-gray-300 hover:text-primary duration-300 hover:scale-125 hover:rotate-12 transition-all "
                    target="_blank"
                  >
                    <SiFiverr size={30} />
                  </Link>
                  <Link
                    href="https://www.youtube.com/@codingreact"
                    rel="noopener noreferrer"
                    className="text-text text-2xl sm:text-3xl dark:text-gray-300 hover:text-primary duration-300 hover:scale-125 hover:rotate-12 transition-all "
                    target="_blank"
                  >
                    <FaYoutube size={30} />
                  </Link>
                </div>
              </div>
              <div className="relative mt-4 lg:mt-0">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {reviewdata.length === 0 ? (
                    <>
                      <motion.div
                        whileHover={{
                          scale: [null, 1.05, 1.02, 1.05],
                          translateY: [null, 0, 0, -5],
                        }}
                        transition={{ duration: 0.5 }}
                        className="relative p-6 rounded-2xl bg-white/90 dark:bg-gray-950 backdrop-blur-sm
                        shadow-[0_0_15px_rgba(0,0,0,0.1)] dark:shadow-[0_0_15px_rgba(0,0,0,0.3)] transform-gpu transition-colors duration-300 ease-in-out min-h-[260px]"
                      >
                        <div className="absolute -top-3 -left-3">
                          <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                            <span className="bg-primary w-full h-full rounded-full flex items-center justify-center">
                              L
                            </span>
                          </div>
                        </div>
                        <div className="mt-20">
                          <div className="mt-4 border-t border-gray-100 dark:border-gray-700 pt-12"></div>
                        </div>
                        <div className="absolute -bottom-2 -right-2 w-4 h-4 bg-gradient-to-br from-primary to-primary-600 rounded-full"></div>
                      </motion.div>
                      <motion.div
                        whileHover={{
                          scale: [null, 1.05, 1.02, 1.05],
                          translateY: [null, 0, 0, -5],
                        }}
                        transition={{ duration: 0.5 }}
                        className="relative p-6 rounded-2xl bg-white/90 dark:bg-gray-950 backdrop-blur-sm
                        shadow-[0_0_15px_rgba(0,0,0,0.1)] dark:shadow-[0_0_15px_rgba(0,0,0,0.3)] transform-gpu transition-colors duration-300 ease-in-out min-h-[260px]"
                      >
                        <div className="absolute -top-3 -left-3">
                          <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                            <span className="bg-primary w-full h-full rounded-full flex items-center justify-center">
                              U
                            </span>
                          </div>
                        </div>
                        <div className="mt-20">
                          <div className="mt-4 border-t border-gray-100 dark:border-gray-700 pt-12"></div>
                        </div>
                        <div className="absolute -bottom-2 -right-2 w-4 h-4 bg-gradient-to-br from-primary to-primary-600 rounded-full"></div>
                      </motion.div>
                    </>
                  ) : (
                    reviewdata.map((review) => (
                      <ReviewCard
                        key={review._id}
                        from="Fiverr Buyer"
                        name={review.name}
                        star={review.rating}
                        image={review.profilePicture}
                        message={review.review}
                        color="bg-primary"
                      />
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Services platform  */}
        <section className="py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Services />
          </div>
        </section>

        

        {/* Work  */}
        <ViewWork />

        {/* Experience  */}
        <section className="py-24 sm:py-32 mb-4 bg-gradient-to-b from-white to-gray-50 dark:from-transparent dark:to-transparent transition-colors duration-200">
          <div className="mx-auto max-w-7xl px-6 lg:px-8 max-sm:text-center">
            <div className="mx-auto lg:text-center">
              <h2 className="text-base font-semibold leading-7 text-indigo-600 dark:text-indigo-400">
                Expertise
              </h2>
              <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
                Full-Stack Developer & YouTuber
              </p>
              <p className="mt-3 text-lg leading-8 text-gray-600 dark:text-gray-300">
                Delivering cutting-edge web solutions and Sharing knowledge
                through YouTube content creation.
              </p>
            </div>
            <div className="mx-auto mt-12 sm:mt-16 lg:mt-20 lg:max-w-4xl">
              <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
                {experiencedata.map((experience, index) => (
                  <div className="relative pl-16 group" key={index}>
                    <dt className="text-base font-semibold leading-7 text-gray-900 dark:text-white">
                      <motion.div
                        initial={{
                          rotate: [0, -60, -360],
                          transition: {
                            duration: 2,
                            ease: "easeInOut",
                            repeatType: "mirror",
                          },
                        }}
                        whileHover={{
                          rotate: [0, 60, 360],
                          transition: {
                            duration: 2,
                            ease: "easeInOut",
                            repeatType: "mirror",
                          },
                        }}
                        className="absolute left-0 top-0 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-indigo-700 dark:from-indigo-500 dark:to-indigo-600 shadow-lg"
                      >
                        {experience.icon}
                      </motion.div>
                      {experience.title}
                    </dt>
                    <dd className="mt-2 text-base leading-7 text-gray-600 dark:text-gray-400">
                      {experience.description}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
            <div className="mt-16 flex items-center justify-center gap-x-6">
              <EmailMe />
              <Link href="/projects">
                <Button variant="gost">
                  View Work
                  <motion.span
                    animate={{ x: [0, 3, -3, 0] }}
                    transition={{
                      repeat: Infinity,
                      duration: 1.5,
                      ease: "linear",
                    }}
                  >
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </motion.span>
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Services  */}
        <ViewServices />

        {/* textimonials  */}
        <section className="flex justify-center items-center mt-8">
          <div className="py-16 bg-gradient-to-b from-muted/20 to-background">
            <div className=" px-1  md:max-w-4xl lg:max-w-6xl mx-auto space-y-10 max-sm:px-4">
              <div className="text-center space-y-4 mb-12">
                <h2 className="text-3xl font-bold tracking-tight">
                  Client Testimonials
                </h2>
                <p className="text-muted-foreground max-w-md mx-auto px-4">
                  Don't just take our word for it - hear what our clients have
                  to say!
                </p>
              </div>
              <div className="w-full">
                <div className="hidden">
                  {/* {allReviews.map((testimonial) => (
                  <div
                    key={testimonial.name}
                    className="group relative overflow-hidden rounded-xl bg-card p-6 shadow-md hover:shadow-xl transition-all duration-300"
                  >
                    <div className="absolute top-0 right-0 p-4">
                      <Quote className="h-6 w-6 text-primary/20" />
                    </div>
                    <div className="flex items-center gap-4 mb-6">
                      <div className="relative">
                        {testimonial.profilePicture ? (
                          <Image
                            src={testimonial.profilePicture}
                            alt={testimonial.name}
                            width={40}
                            height={40}
                            className="w-14 h-14 rounded-full object-cover ring-2 ring-primary/20"
                          />
                        ) : (
                          <span className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary text-white font-semibold">
                            {testimonial.name.slice(0, 1)}
                          </span>
                        )}
                        <div className="absolute hover:scale-110 transition-all duration-300 -bottom-1 -right-1 bg-primary text-white p-1 rounded-full">
                          <Star className="w-3 h-3 text-secondary " />
                        </div>
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">
                          {testimonial.name}
                        </h3>
                        <p className="text-sm text-muted-foreground">Client</p>
                      </div>
                    </div>
                    <p className="text-muted-foreground leading-relaxed line-clamp-5">
                      {testimonial.review}
                    </p>
                  </div>
                ))} */}
                </div>
                {allReviews.length > 0 ? (
                  <CustomCarousel
                    testimonials={allReviews.map((testimonial) => (
                      <TestimonialCard
                        key={testimonial._id}
                        imageUrl={testimonial.projectImage}
                        clientReview={testimonial.review}
                        reply={testimonial.reply}
                        clientName={testimonial.name}
                        projectUrl={testimonial.projectLink}
                        avatarUrl={testimonial.profilePicture}
                        star={testimonial.rating}
                      />
                    ))}
                  />
                ) : (
                  <Marquee className="flex gap-2" pauseOnHover speed={20}>
                    {allReviews.map((testimonial) => (
                      <TestimonialCard
                        key={testimonial._id}
                        imageUrl={testimonial.projectImage}
                        clientReview={testimonial.review}
                        reply={testimonial.reply}
                        clientName={testimonial.name}
                        projectUrl={testimonial.projectLink}
                        avatarUrl={testimonial.profilePicture}
                        star={testimonial.rating}
                      />
                    ))}
                  </Marquee>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Youtube  */}
        {youtubedata.length > 0 && (
          <section className="py-16 bg-gradient-to-b from-background to-muted/20">
            <div className="max-w-6xl mx-auto space-y-10 max-sm:px-4">
              <div className="text-center space-y-6">
                <h2 className="text-2xl font-semibold text-foreground lg:text-3xl">
                  Uploaded to Youtube
                </h2>
                <div className="flex justify-center items-center space-x-1">
                  <span className="h-1 bg-primary rounded-full w-40"></span>
                  <span className="h-1 bg-primary rounded-full w-3"></span>
                  <span className="h-1 bg-primary rounded-full w-1"></span>
                </div>
                <p className="max-w-2xl mx-auto text-muted-foreground">
                  Watch on demand videos I have uploaded to Youtube.
                </p>
              </div>
              <div className="flex justify-center items-center gap-4">
                <Link href="https://www.youtube.com/channel/UC6n7lks7DmpXMJxS_g73sqg?sub_confirmation=1">
                  <Button variant="animated" className="w-fit h-10">
                    <Youtube />
                    Subscribe
                  </Button>
                </Link>
                <Link href="/videos">
                  <Button variant="outline" className="w-fit h-10">
                    All Videos
                    <motion.span
                      animate={{ x: [0, 3, -3, 0] }}
                      transition={{
                        repeat: Infinity,
                        duration: 1.5,
                        ease: "linear",
                      }}
                    >
                      <MoveRight />
                    </motion.span>
                  </Button>
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {youtubedata.map((video, index) => (
                  <div
                    className="group relative overflow-hidden rounded-xl border bg-card text-card-foreground shadow-sm hover:shadow-lg transition-all duration-300"
                    key={index}
                  >
                    <Link
                      href={`/videos/${video._id}`}
                      className="flex flex-col h-full"
                    >
                      <div className="relative aspect-video overflow-hidden">
                        <Image
                          src={video.image}
                          alt={video.title}
                          className="h-full w-full object-cover group-hover:scale-110 transition-all duration-300"
                          width={500}
                          height={500}
                        />
                      </div>
                      <div className="flex-grow p-4">
                        <h3 className="text-base sm:text-lg font-semibold line-clamp-2 group-hover:text-primary transition-colors duration-300">
                          {video.title}
                        </h3>
                        <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                          {video.description}
                        </p>
                      </div>
                      <div className="w-full bg-muted/50 p-3 border-t">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-muted-foreground">
                            {video.category}
                          </span>
                          <button variant="ghost" href={video.link}>
                            <ExternalLink className="h-5 w-5 text-primary hover:scale-110 transition-all duration-300" />
                          </button>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Blog  */}
        {blogdata.length > 0 && (
          <section className="py-16 bg-gradient-to-b from-background to-muted/20">
            <div className="max-w-6xl mx-auto space-y-10 max-sm:px-4">
              <div className="text-center space-y-6">
                <h2 className="text-2xl font-semibold text-foreground lg:text-3xl">
                  Latest Blog Posts
                </h2>
                <div className="flex justify-center items-center space-x-1">
                  <span className="h-1 bg-primary rounded-full w-40"></span>
                  <span className="h-1 bg-primary rounded-full w-3"></span>
                  <span className="h-1 bg-primary rounded-full w-1"></span>
                </div>
                <p className="max-w-2xl mx-auto text-muted-foreground">
                  Check out my latest blog posts.
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {blogdata.map((blog, index) => (
                  <div
                    className="group relative overflow-hidden rounded-xl border bg-card text-card-foreground shadow-sm hover:shadow-lg transition-all duration-300"
                    key={index}
                  >
                    <Link
                      href={`/blogs/${blog._id}`}
                      className="flex flex-col h-full"
                    >
                      <div className="relative aspect-video overflow-hidden">
                        <Image
                          src={blog.image}
                          alt={blog.title}
                          className="h-full w-full object-cover group-hover:scale-110 transition-all duration-300"
                          width={500}
                          height={500}
                        />
                      </div>
                      <div className="flex-grow p-4">
                        <h3 className="text-base sm:text-lg font-semibold line-clamp-2 group-hover:text-primary transition-colors duration-300">
                          {blog.title}
                        </h3>
                        <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                          {blog.description}
                        </p>
                      </div>
                      <div className="w-full bg-muted/50 p-3 border-t">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-muted-foreground">
                            {blog.tags && blog.tags[0]}
                          </span>
                          <button variant="ghost" href={blog.link}>
                            <ExternalLink className="h-5 w-5 text-primary hover:scale-110 transition-all duration-300" />
                          </button>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
        {/* Contact me  */}
        <section className="py-16 bg-gradient-to-b from-background to-muted/20">
          <div className=" max-w-4xl mx-auto">
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-bold tracking-tight">
                Get in touch!
              </h2>
              <p className="text-muted-foreground max-w-md mx-auto">
                Elevate your brand and leave a lasting impression with a
                meticulously crafted website tailored to your needs.
              </p>
            </div>
            {/* form  */}
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="mt-8 space-y-6 bg-card p-6 rounded-xl shadow-lg"
            >
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    {...register("email", { required: "Email is required" })}
                    placeholder="Your email"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      {...register("name")}
                      placeholder="Your name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      type="tel"
                      {...register("phone")}
                      placeholder="Your phone number"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Message *</Label>
                  <Textarea
                    id="message"
                    {...register("message")}
                    placeholder="Your message"
                    className="min-h-[150px]"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-4">
                <Button type="submit" variant="animated">
                  Send Message <Send />
                </Button>
              </div>
            </form>
          </div>
        </section>

        <div
          className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)] pointer-events-none"
          aria-hidden="true"
        >
          <div
            className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-primary to-accent opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
            style={{
              clipPath:
                "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
            }}
          ></div>
        </div>
      </div>
    </div>
  );
}
