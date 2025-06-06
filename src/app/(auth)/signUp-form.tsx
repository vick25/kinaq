import { SubmitButton } from '@/components/submit-button';
import { Input } from '@/components/ui/input';
import { authClient } from '@/lib/auth-client';
import { redirect } from 'next/navigation';

const SignUpForm = () => {

    async function handleSubmit(formdata: FormData) {
        'use server';

        const email = (formdata.get('email') as string)?.trim();

        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return redirect('/historical?signup=invalid')
        }
        // Send the email OTP
        const { data, error } = await authClient.emailOtp.sendVerificationOtp({
            email,
            type: 'sign-in'
        });
        console.log({ data, error })

        if (error || !data?.success) {
            console.error('OTP sending error:', error)
            return redirect('/historical?signup=error')
        }

        return redirect(`/historical?signup=login&email=${encodeURIComponent(email)}`);
    }

    return (
        <form id='formSignUp' action={handleSubmit} className="flex flex-col gap-4 bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
            <h3 className="text-lg font-semibold text-gray-800 text-center mb-2">
                Authentication through Email:
            </h3>
            <Input
                type="email"
                name="email"
                placeholder="Enter email address"
                className="w-full"
                required
            />
            <SubmitButton primaryText='Email Code' secondaryText='Emailing code...' />
        </form>
    )
}

export default SignUpForm