import { authClient } from '@/lib/auth-client'
import { redirect } from 'next/navigation'

type Props = {
}

const SignUpForm = async (props: Props) => {
    return (
        <form action={async (formdata) => {
            'use server'
            const email = formdata.get('email')
            // Send the email OTP
            const { data, error } = await authClient.emailOtp.sendVerificationOtp({
                email: email as string,
                type: 'sign-in'
            })
            if (error) {
                console.error("Error sending OTP:", error)
                redirect('/historical')
                return
            }
            if (data.success) {
                redirect(`/historical?signup=login&email=${encodeURIComponent(email as string)}`)
            }

        }} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
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
            <button className="mt-4 w-full bg-[#05b15d] text-white py-2 rounded-md text-lg font-medium hover:bg-green-600"
                type='submit'>
                Email Code
            </button>
        </form>
    )
}

export default SignUpForm