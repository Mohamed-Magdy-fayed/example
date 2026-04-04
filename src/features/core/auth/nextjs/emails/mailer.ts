import "server-only";

import nodemailer from "nodemailer";

import { env } from "@/env/server";

export type SendMailOptions = {
    toEmail: string;
    toName?: string | null;
    subject: string;
    text?: string;
    html: string;
    fromName?: string;
    fromEmail?: string;
};

let cachedTransporter: nodemailer.Transporter | null = null;

function getTransporter() {
    if (cachedTransporter) return cachedTransporter;

    const secure = env.COMMS_EMAIL_PORT === 465;
    cachedTransporter = nodemailer.createTransport({
        host: env.COMMS_EMAIL_HOST,
        port: env.COMMS_EMAIL_PORT,
        secure,
        auth: {
            user: env.COMMS_EMAIL,
            pass: env.COMMS_EMAIL_PASS,
        },
    });

    return cachedTransporter;
}

export async function sendMail(options: SendMailOptions) {
    const transporter = getTransporter();
    const fromEmail = options.fromEmail ?? env.COMMS_EMAIL;
    const fromName = options.fromName ?? env.COMMS_NAME;
    const to = options.toName
        ? `${options.toName} <${options.toEmail}>`
        : options.toEmail;

    await transporter.sendMail({
        from: `${fromName} <${fromEmail}>`,
        to,
        subject: options.subject,
        text: options.text,
        html: options.html,
    });
}