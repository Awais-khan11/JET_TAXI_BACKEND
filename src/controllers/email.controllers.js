const { sendCode, sendMail } = require('../services/sendMail');
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ukPhoneRegex = /^\+44\d{10}$/;
const { db } = require("../db/index.js");
const { bookings } = require("../db/schema.ts");
const { eq } = require("drizzle-orm");


async function sendMailCode(req, res) {
    try {
        const { name, email, phone, route, date, time, passengers, paymentMethod } = req.body;
        if (!email || !emailRegex.test(email)) {
            return res.status(400).json({ message: "Invalid email address" });
        }
        if (!phone || !ukPhoneRegex.test(phone)) {
            return res.status(400).json({
                message: "Only valid UK phone numbers allowed (+44XXXXXXXXXX)"
            });
        }
        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000);
        await db
            .insert(bookings)
            .values({
                email,
                code: verificationCode,
                expiresAt,
                name,
                phone,
                route,
                date,
                time,
                passengers,
                paymentMethod
            })
            .onConflictDoUpdate({
                target: bookings.email,
                set: {
                    code: verificationCode,
                    expiresAt,
                    name,
                    phone,
                    route,
                    date,
                    time,
                    passengers,
                    paymentMethod
                }
            });
        await sendCode(email, verificationCode);
        return res.status(200).json({ message: "Code sent successfully", status: "ok", });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error" });
    }
}
async function sendBookingConfirmation(req, res) {
    try {
        const { email, code } = req.body;
        const result = await db
            .select()
            .from(bookings)
            .where(eq(bookings.email, email));

        if (!result.length) {
            return res.status(400).json({ message: "Invalid code or email" });
        }

        const record = result[0];
        if (record.code !== code) {
            return res.status(400).json({ message: "Invalid code" });
        }
        if (new Date(record.expiresAt) < new Date()) {
            return res.status(400).json({ message: "Code expired" });
        }
        await sendMail(email, record)
        res.json({ message: "Email send successfully", status: "ok" });
        await db
            .delete(bookings)
            .where(eq(bookings.email, email));

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error" });
    }

}

module.exports = {
    sendMailCode,
    sendBookingConfirmation
};