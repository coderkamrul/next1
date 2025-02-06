"use client";

import { useState, useCallback, useMemo } from "react"
import { X, Lock, CreditCard } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerClose, DrawerTrigger } from "@/components/ui/drawer"
import { useMediaQuery } from "@/hooks/use-media-query"
import { Input } from "@/components/ui/input"
import { toast } from "@/hooks/use-toast"
import axios from "axios"
import { useRouter } from "next/navigation"
import { Description } from "@radix-ui/react-dialog"

const Enroll = ({ course }) => {
  const router = useRouter()
  const isMobile = useMediaQuery("(max-width: 768px)")
  const [formData, setFormData] = useState({ name: "", email: "" })
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const [isOpen, setIsOpen] = useState(false)

  const handleChange = useCallback((e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    setErrors((prev) => ({ ...prev, [e.target.name]: "" }))
  }, [])

  const validateForm = useCallback(() => {
    const newErrors = {}
    if (!formData.name.trim()) newErrors.name = "Name is required"
    if (!formData.email.trim()) newErrors.email = "Email is required"
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email is invalid"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }, [formData])

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      if (!validateForm()) return;

      setIsLoading(true);
      try {
        const { data } = await axios.post("/api/subscriber", {
          ...formData,
          courseId: course._id,
        });
 
          // Save to localStorage
          router.reload();

          toast({
            title: "Subscribed successfully",
            description: "Your submission has been send successfully.",
            variant: "success",
          });
          setIsOpen(false); // Close the dialog/drawer after successful submission
        
      } catch (error) {
        if (error.response?.status === 401) {
          router.push("/login");
          toast({
            title: "Subscription Error",
            description: "You need to login first to subscribe. If you don't have an account, you can create one at /signup.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Failed to subscribe. Please try again.",
            description: "Error Last",
          });
        }
      } finally {
        setIsLoading(false);
      }
    },
    [formData, course, validateForm, router],
  );


  const Content = useMemo(
    () => (
      <div className="grid gap-6">
        <div className="space-y-2 bg-accent border rounded-lg p-4">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Subscribe to Our Newsletter</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CreditCard size={18} className="text-primary" />
              <span>Course Price</span>
            </div>
            <span className="font-semibold line-through">${course.price}</span>
            <span className="font-semibold text-green-500">Free</span>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-semibold">Subscribe to Unlock Free Access</h3>
          <form className="grid gap-3 text-sm" onSubmit={handleSubmit}>
            <div>
              <Input
                placeholder="Your Name"
                className="w-full"
                name="name"
                value={formData.name}
                onChange={handleChange}
                aria-invalid={!!errors.name}
                aria-describedby="name-error"
              />
              {errors.name && (
                <p id="name-error" className="text-xs text-red-500 mt-1">
                  {errors.name}
                </p>
              )}
            </div>
            <div>
              <Input
                type="email"
                placeholder="Your Email"
                className="w-full"
                name="email"
                value={formData.email}
                onChange={handleChange}
                aria-invalid={!!errors.email}
                aria-describedby="email-error"
              />
              {errors.email && (
                <p id="email-error" className="text-xs text-red-500 mt-1">
                  {errors.email}
                </p>
              )}
            </div>
            <Button type="submit" className="w-full bg-purple-500 hover:bg-purple-600" disabled={isLoading}>
              {isLoading ? "Subscribing..." : "Subscribe Now"}
            </Button>
          </form>
        </div>

        <p className="text-center text-sm text-muted-foreground">Secure your free access by subscribing now</p>
      </div>
    ),
    [course.price, formData, handleChange, handleSubmit, errors, isLoading],
  )

  const MobileDrawer = useMemo(
    () => (
      <Drawer open={isOpen} onOpenChange={setIsOpen}>
        <DrawerTrigger asChild>
          <Button variant="animated">Enroll</Button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader className="border-b">
            <DrawerTitle>Enroll in {course.title}</DrawerTitle>
            <p className="text-sm text-muted-foreground">Secure your free access by subscribing now</p>
            <DrawerClose asChild>
              <Button variant="ghost" size="icon" className="absolute right-4 top-4">
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </Button>
            </DrawerClose>
          </DrawerHeader>
          <div className="p-6">{Content}</div>
        </DrawerContent>
      </Drawer>
    ),
    [Content, course.title, isOpen],
  )

  const DesktopDialog = useMemo(
    () => (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant="animated">Enroll</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Enroll in {course.title}</DialogTitle>
            <p className="text-sm text-muted-foreground">Secure your free access by subscribing now</p>
          </DialogHeader>
          {Content}
        </DialogContent>
      </Dialog>
    ),
    [Content, course.title, isOpen],
  )

  return isMobile ? MobileDrawer : DesktopDialog
}

export default Enroll