import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Order from "@/models/Order";
import Gig from "@/models/gigModels";
import { sendEmail } from "@/lib/email";

export async function GET() {
  await dbConnect();
  try {
    const orders = await Order.find().populate("gig", "title", Gig);
    return NextResponse.json({ success: true, data: orders });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message });
  }
}

export async function POST(request) {
  await dbConnect();
  try {
    const body = await request.json();
    const orderNumber = `ORD-${new Date()
      .getFullYear()
      .toString()
      .substr(2, 2)}${("0" + (new Date().getMonth() + 1)).slice(-2)}${(
      "0" + new Date().getDate()
    ).slice(-2)}-${Math.random().toString(36).substring(2, 6)}`;
    const order = new Order({ ...body, orderNumber });
    await order.save();
    await sendEmail({
      to: body.client.email,
      subject: "New Order",
      html: `
      <!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Order Confirmation</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 600px;
            margin: 20px auto;
            background-color: #ffffff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        .header {
            text-align: center;
            padding-bottom: 20px;
            border-bottom: 2px solid #ddd;
        }
        .header h2 {
            color: #333;
        }
        .content {
            padding: 20px 0;
        }
        .content p {
            font-size: 16px;
            color: #555;
        }
        .details {
            background-color: #f9f9f9;
            padding: 15px;
            border-radius: 6px;
            margin-top: 10px;
        }
        .details p {
            margin: 5px 0;
            font-size: 14px;
            color: #333;
        }
        .footer {
            text-align: center;
            padding-top: 20px;
            border-top: 2px solid #ddd;
            font-size: 14px;
            color: #777;
        }
        .button {
            display: inline-block;
            margin-top: 15px;
            padding: 10px 15px;
            background-color: #f4f4f4;
            border: 1px solid #ccc;
            color: #ffffff;
            text-decoration: none;
            border-radius: 5px;
            font-weight: bold;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h2>Thank You for Your Order!</h2>
        </div>
        <div class="content">
            <p>Dear <strong>${body.client.name}</strong>,</p>
            <p>We appreciate your business and are excited to start working on your web development project. Below are the details of your order:</p>
            
            <div class="details">
                <p><strong>Order Number:</strong> ${orderNumber}</p>
                <p><strong>Service:</strong> Web Development</p>
                <p><strong>Package:</strong> ${body.package.title}</p>
                <p><strong>Price:</strong> $${body.package.price}</p>
                <p><strong>Estimated Delivery Time:</strong> ${body.package.deliveryTime} days</p>
            </div>

            <p>If you have any questions or need further assistance, feel free to contact us.</p>

            <p>Best Regards,</p>
            <p><strong>Md Shain Alam</strong></p>
            <p><strong>Coder Team</strong></p>
            <p><strong>kamrulhasan13020@gmail.com</strong></p>

            <a href="https://codershahin.vercel.app" class="button">Visit Our Website</a>
        </div>
        <div class="footer">
            <p>&copy; 2025 Coder Team. All rights reserved.</p>
        </div>
    </div>
</body>
</html>

      `,
    });
    return NextResponse.json({ success: true, data: order });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message });
  }
}
