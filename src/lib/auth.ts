import { betterAuth } from "better-auth";
import { emailOTP } from "better-auth/plugins";
import { openAPI } from "better-auth/plugins";
import { nextCookies } from "better-auth/next-js";
import { prismaAdapter } from "better-auth/adapters/prisma";
// import { PrismaClient } from "@prisma/client";
import transporter from "./transporter";
import { getOtpHtmlTemplate } from "./constants";
import prisma from "./prisma";

// const prisma = new PrismaClient();

// Initialize the auth middleware with the Prisma database adapter.
export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),
    advanced: {
        useSecureCookies: process.env.NODE_ENV === "production",
    },
    session: {
        expiresIn: 60 * 60 * 24 * 7,
        updateAge: 60 * 60 * 24,
        cookieCache: {
            enabled: true,
            maxAge: 5 * 60 // Cache duration in seconds
        }
    },
    emailAndPassword: {
        enabled: true,
        // requireEmailVerification: true
    },
    plugins: [
        emailOTP({
            expiresIn: 600,
            async sendVerificationOTP({ email, otp, type }) {
                // console.log(`Attempting to send OTP ${otp} to ${email} (Type: ${type})`);

                const subject = `KINAQ ${type === 'sign-in' ? 'Sign-In' : (type === 'email-verification' ? 'Verification' : 'Action')} Code: ${otp}`;
                let htmlContent = '';
                let textContent = '';

                // Customize email content based on the verification type
                switch (type) {
                    case 'sign-in': // Example type, check better-auth usage for actual types
                        textContent = `Welcome! Your KINAQ verification code is: ${otp}
                                       If you have not initiated this process, please disregard or contact us at contact@wasaruwash.org.
                                       Thank you,
                                       KINAQ Team`;
                        htmlContent = getOtpHtmlTemplate(otp) || `<p>Welcome!</p><p>Your verification code is: <strong>${otp}</strong></p><p>This code is valid for 5 minutes.</p>`;
                        break;
                    default:
                        textContent = `Your code is: ${otp}`;
                        htmlContent = getOtpHtmlTemplate(otp) || `<p>Your verification code is: <strong>${otp}</strong></p><p>This code is valid for 5 minutes.</p>`;
                }

                // Define email options
                const mailOptions = {
                    from: `"KINAQ" <${process.env.EMAIL_FROM || process.env.EMAIL_USER}>`, // Sender address (use a specific FROM or fallback to user)
                    to: email, // Recipient address from the function arguments
                    subject: subject, // Subject line based on type
                    text: textContent, // Plain text body
                    html: htmlContent, // HTML body for better formatting
                };

                try {
                    // Send the email using the pre-configured transporter
                    await transporter.sendMail(mailOptions);
                    // console.log(`OTP Email sent successfully to ${email}: ${info.messageId}`);
                    // better-auth expects this function to resolve successfully if email is sent
                    // If you want to return any data, you can do so here.
                    // return { success: true, messageId: info.messageId };
                } catch (error) {
                    console.error(`Error sending OTP email to ${email}:`, error);
                    // IMPORTANT: Throw an error here so better-auth knows the operation failed.
                    // This will prevent the authentication flow from proceeding incorrectly.
                    throw new Error(`Failed to send verification email. Please try again later.`);
                    // Or more specific: throw error; if you want the original error upstream
                }
            }
        }),
        openAPI(),
        nextCookies(),
    ],
});

export type Session = typeof auth.$Infer.Session