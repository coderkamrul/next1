"use client";

import { useState, useEffect } from "react";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { ScrollArea } from "../ui/scroll-area";

export function Header() {
  const [notifications, setNotifications] = useState([]);
  const router = useRouter();
  const fetchNotifications = async () => {
    const [orderResponse, submissionsResponse] = await Promise.all([
      fetch("/api/order"),
      fetch("/api/submissions"),
    ]);

    const orderData = await orderResponse.json();
    const submissionsData = await submissionsResponse.json();

    if (orderData.success && submissionsData.success) {
      const orders = orderData.data.map((order) => ({
        ...order,
        type: "order",
      }));
      const submissions = submissionsData.data.map((submission) => ({
        ...submission,
        type: "submission",
      }));

      let allNotifications = [...orders, ...submissions].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      const notViewedCount = allNotifications.filter(notification => !notification.viewed).length;
      if (notViewedCount <= 5) {
        allNotifications = allNotifications.slice(0, 6);
      }

      setNotifications(allNotifications);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleNotificationClick = async (notification) => {
    const endpoint =
      notification.type === "order" ? "/api/order" : "/api/submissions";
    const id =
      notification.type === "order" ? notification._id : notification._id;

    const response = await fetch(`${endpoint}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ viewed: true }),
    });

    if (response.ok) {
      // Update local state
      setNotifications((prevNotifications) =>
        prevNotifications.map((n) =>
          n.type === notification.type &&
          (n.type === "order" ? n.orderNumber === id : n.id === id)
            ? { ...n, viewed: true }
            : n
        )
      );

      // Navigate to the appropriate page
      if (notification.type === "order") {
        router.push(`/dashboard/orders`);
        fetchNotifications();
      } else {
        router.push(`/dashboard/submissions`);
        fetchNotifications();
      }
    }
  };

  const unviewedNotifications = notifications.filter((n) => !n.viewed);

  return (
    <header className="flex h-14 lg:h-[60px] items-center gap-4 border-b bg-gray-100/40 px-6 dark:bg-gray-800/40">
      <div className="flex flex-1 items-center gap-4">
        <h1 className="text-lg font-semibold">Dashboard</h1>
      </div>
      <div className="flex items-center gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative" size="icon">
              <Bell className="h-4 w-4" />
              {unviewedNotifications.length > 0 && (
                <span className="absolute top-0 right-0 h-4 w-4 flex items-center justify-center rounded-full bg-red-600 text-white text-xs">
                  {unviewedNotifications.length}
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[300px] p-4">
            <ScrollArea
              className="max-h-[300px] overflow-y-auto"
              style={{ height: "300px" }}
            >
            {notifications.length > 0 ? (
              notifications.map((notification, index) => (
                <DropdownMenuItem
                  key={index}
                  onClick={() => handleNotificationClick(notification)}
                  className={notification.viewed ? "opacity-50" : ""}
                >
                  <span className="line-clamp-2">
                    {notification.type === "order"
                      ? `New Order: ${notification.orderNumber}`
                      : `New Submission: ${notification.name} - ${notification.message}`}
                  </span>
                  <span className="ml-auto text-xs text-gray-500">
                    {new Date(notification.createdAt).toLocaleDateString()}
                  </span>
                </DropdownMenuItem>
              ))
            ) : (
              <DropdownMenuItem>
                <span>No notifications</span>
              </DropdownMenuItem>
            )}
            </ScrollArea>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
