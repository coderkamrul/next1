import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Clock, RefreshCcw } from "lucide-react";
import axios from "axios";
import { toast } from "@/hooks/use-toast";

const OrderForm = ({ packageDetails, requirements, gig, onSuccess }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
console.log(gig);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post("/api/order", {
        gig: gig._id,
        package: {
          title: packageDetails.title,
          description: packageDetails.description,
          deliveryTime: packageDetails.deliveryTime,
          revisions: packageDetails.revisions,
          features: packageDetails.features,
          price: packageDetails.price,
        },
        client: {
          name,
          email,
          phone,
          message,
        },
      });
      toast({
        title: 'Success',
        description: "Your order has been placed successfully",
        variant: 'positive',
      });
      onSuccess();

    } catch (error) {
      toast({
        title: 'Error',
        description: error.message || 'An unexpected error occurred',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dark:bg-black text-white p-4 rounded-lg ">
      <Card className="p-4 mb-4 dark:bg-gray-800">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-bold">
            <span className="text-primary">{packageDetails.name} -{" "}</span>
            {packageDetails.title}
          </h4>
          <p className="text-base font-bold dark:text-white">
            ${packageDetails.price}
          </p>
        </div>
        <p className="text-sm dark:text-gray-400 text-gray-800 mb-4">
          {packageDetails.description}
        </p>
        <div className="flex items-center text-sm dark:text-gray-400 text-gray-600">
          <span className="flex items-center mr-2">
            <Clock className="w-4 h-4 mr-2" />
            Delivery in {packageDetails.deliveryTime}{" "}
            {packageDetails.deliveryTime > 1 ? "days" : "day"}
          </span>
          <span className="flex items-center">
            <RefreshCcw className="w-4 h-4 mr-2" />
            {packageDetails.revisions} revision
            {packageDetails.revisions > 1 ? "s" : ""}
          </span>
        </div>
      </Card>

      <Label className="mb-2 block dark:text-gray-300 text-black">Requirements:</Label>
      <ul className="text-sm dark:text-gray-300 text-gray-800 list-disc pl-6 pb-4">
        {requirements.map((requirement, index) => (
          <li key={index}>{requirement}</li>
        ))}
      </ul>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="name" className="dark:text-gray-300 text-gray-600">Name</Label>
          <Input
            id="name"
            type="text"
            placeholder="Your name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="dark:bg-gray-800 text-black dark:text-white text-black dark:text-white "
          />
        </div>
        <div>
          <Label htmlFor="email" className="dark:text-gray-300 text-gray-600">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="Your email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="dark:bg-gray-800 text-black dark:text-white  "
          />
        </div>
        <div>
          <Label htmlFor="phone" className="dark:text-gray-300 text-gray-600">Phone</Label>
          <Input
            id="phone"
            type="tel"
            placeholder="Your phone number"
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="dark:bg-gray-800 text-black dark:text-white  "
          />
        </div>
        <div>
          <Label htmlFor="message" className="dark:text-gray-300 text-gray-600">Message</Label>
          <Textarea
            id="message"
            placeholder="Your message"
            required
            className="dark:bg-gray-800 text-black dark:text-white   max-h-40"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </div>
        <Button
          type="submit"
          variant="darkAnimated"
          disabled={loading}
          className=""
        >
          {loading ? "Loading..." : "Submit Order"}
        </Button>
      </form>
    </div>
  );
};

export default OrderForm;

