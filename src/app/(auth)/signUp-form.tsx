import { SubmitButton } from '@/components/submit-button'
import { authClient } from '@/lib/auth-client'
import { redirect } from 'next/navigation'

type Props = {
}

const SignUpForm = (props: Props) => {

    async function handleSubmit(formdata: FormData) {
        'use server';

        const email = formdata.get('email');
        if (!email) {
            return;
        }
        // Send the email OTP
        const { data, error } = await authClient.emailOtp.sendVerificationOtp({
            email: email as string,
            type: 'sign-in'
        });
        if (error) {
            // console.error("Error sending OTP:", error)
            return redirect('/historical');
        }
        if (data.success) {
            return redirect(`/historical?signup=login&email=${encodeURIComponent(email as string)}`);
        }
    }

    return (
        <form action={handleSubmit} className="flex flex-col gap-1bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
            <h3 className="text-lg font-semibold text-gray-800 text-center mb-2">
                Authentication through Email:
            </h3>
            <input
                type="email"
                name="email"
                placeholder="Enter email address"
                className="w-full border p-2 rounded-md text-gray-700"
            />
            {/* Email Code Button */}
            <SubmitButton />
        </form>
    )
}

export default SignUpForm