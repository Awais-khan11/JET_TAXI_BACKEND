import { Request, Response } from 'express';
import { sendCode, sendMail } from '../services/sendMail';
import { db } from "../db/index";
import { bookings } from "../db/schema";
import { eq } from "drizzle-orm";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// const ukPhoneRegex = /^\+44\d{10}$/;

export async function sendMailCode(req: Request, res: Response): Promise<void> {
  try {
    const { name, email, phone, route, date, time, passengers, paymentMethod } = req.body;

    if (!email || !emailRegex.test(email)) {
      res.status(400).json({ message: "Invalid email address" });
      return;
    }
    // if (!phone || !ukPhoneRegex.test(phone)) {
    //   res.status(400).json({ message: "Only valid UK phone numbers allowed (+44XXXXXXXXXX)" });
    //   return;
    // }

    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    await db
      .insert(bookings)
      .values({ email, code: verificationCode, expiresAt, name, phone, route, date, time, passengers, paymentMethod })
      .onConflictDoUpdate({
        target: bookings.email,
        set: { code: verificationCode, expiresAt, name, phone, route, date, time, passengers, paymentMethod },
      });

    await sendCode(email, verificationCode);
    res.status(200).json({ message: "Code sent successfully", status: "ok" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error" });
  }
}

export async function sendBookingConfirmation(req: Request, res: Response): Promise<void> {
  try {
    const { email, code } = req.body;

    const result = await db.select().from(bookings).where(eq(bookings.email, email));

    if (!result.length) {
      res.status(400).json({ message: "Invalid code or email" });
      return;
    }

    const record = result[0];

    if (record.code !== code) {
      res.status(400).json({ message: "Invalid code" });
      return;
    }
    if (new Date(record.expiresAt!) < new Date()) {
      res.status(400).json({ message: "Code expired" });
      return;
    }

    await sendMail(email, record);
    res.json({ message: "Email send successfully", status: "ok" });

    await db.delete(bookings).where(eq(bookings.email, email));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error" });
  }
}
