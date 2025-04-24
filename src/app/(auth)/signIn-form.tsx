import React from 'react'
import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { headers } from "next/headers";
import { Button } from '@/components/ui/button';
import FormError from '@/components/form-error';
import { Input } from '@/components/ui/input';
import Link from 'next/link';

type Props = {
    loggedInEmail: string
}

const SignInForm = ({ loggedInEmail }: Props) => {

    async function handleSubmit(formdata: FormData) {
        'use server';
        const code = formdata.get('code');

        // Sign in with emailed OTP
        const response = await auth.api.signInEmailOTP({
            asResponse: true,
            body: {
                email: (loggedInEmail as string).trim(),
                otp: (code as string).trim(),
            },
            headers: await headers(),
        });

        if (response !== null && response.status !== 200) {
            return redirect(`/historical?signup=login`);
        }
        if (response.status === 200) {
            return redirect(`/historical?signup=success`);
        }
        return redirect(`/historical`);
    }

    return (
        <form action={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
            <h3 className="text-lg font-semibold text-gray-800 text-center mb-2">
                Enter CODE emailed to:&nbsp;
                <span className='text-blue-700'>{loggedInEmail}</span>
            </h3>
            <div className="lbCode">
                <Input type="text" name="code" placeholder="123456" />
            </div>
            <FormError message='' />
            <div className='flex space-x-4 items-center justify-center'>
                <Button type='submit' className="mt-4 w-full bg-[#05b15d] text-white py-2 rounded-md text-lg font-medium hover:bg-green-600" id="btn_proceed_email">
                    Sign-in with code
                </Button>

                {/* <CancelSignInForm /> */}
                <Button asChild className="mt-4 w-full bg-[#b11605] text-white py-2 rounded-md text-lg font-medium hover:bg-red-600" id="btn_proceed_ed">
                    <Link href="/historical">Cancel</Link>
                </Button>
            </div>
        </form>
    )
}

export default SignInForm