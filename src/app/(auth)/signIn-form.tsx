import { SubmitButton } from '@/components/submit-button';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { auth } from '@/lib/auth';
import { headers } from "next/headers";
import Link from 'next/link';
import { redirect } from 'next/navigation';

type Props = {
    loggedInEmail: string
}

const SignInForm = ({ loggedInEmail }: Props) => {

    async function handleSubmit(formdata: FormData) {
        'use server';

        const code = (formdata.get('code') as string).trim();
        if (!/^\d{6}$/.test(code)) {
            return redirect(`/historical?signup=login`);
        }

        // Sign in with emailed OTP
        const response = await auth.api.signInEmailOTP({
            asResponse: true,
            body: {
                email: (loggedInEmail as string).trim(),
                otp: (code as string).trim(),
            },
            headers: await headers(),
        });

        if (!response || !response.status) {
            return redirect(`/historical`);
        }

        if (response.status === 200) {
            return redirect(`/historical?signup=success`);
        }

        return redirect(`/historical?signup=login`);
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
            <div className='flex space-x-4 items-center justify-center'>
                <SubmitButton primaryText='Sign-in with code' secondaryText='Signing in...' />

                {/* <CancelSignInForm /> */}
                <Button asChild className="mt-4 w-full bg-[#b11605] text-white py-2 rounded-md text-lg font-medium hover:bg-red-600" id="btn_proceed_ed">
                    <Link href="/historical">Cancel</Link>
                </Button>
            </div>
        </form>
    )
}

export default SignInForm