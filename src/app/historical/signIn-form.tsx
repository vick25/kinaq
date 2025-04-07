import { authClient } from '@/lib/auth-client'
import React from 'react'
// import CancelSignInForm from './cancel-form'
import { redirect } from 'next/navigation'

type Props = {
    loggedInEmail: string
}

const SignInForm = async ({ loggedInEmail }: Props) => {

    async function handleSubmit(formdata: FormData) {
        'use server'
        const code = formdata.get('code')
        const email = loggedInEmail

        // Sign in with emailed OTP
        const { data, error } = await authClient.signIn.emailOtp({
            email: (email as string).trim(),
            otp: (code as string).trim()
        })
        if (error) {
            console.error("Error verifying OTP:", error)
            if (code === '')
                redirect(`/historical`)
            return
        }
        if (data.token) {
            console.log("OTP verified successfully")
            redirect(`/historical?signup=success`)
        }
        redirect(`/historical`)
    }

    return (
        <form action={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
            <h3 className="text-lg font-semibold text-gray-800 text-center mb-2">Enter CODE emailed to:</h3>
            <div className="lbCode">
                <input type="text" name="code" id="ecode" placeholder="123456"
                    className="w-full border p-2 rounded-md text-gray-700" />
            </div>
            <p id="codeError" className='text-xs text-red-600'></p>
            <div className='flex space-x-4 items-center justify-center'>
                <button type='submit' className="mt-4 w-full bg-[#05b15d] text-white py-2 rounded-md text-lg font-medium hover:bg-green-600" id="btn_proceed_email">
                    Sign-in with code
                </button>

                {/* <CancelSignInForm /> */}
                <button className="mt-4 w-full bg-[#b11605] text-white py-2 rounded-md text-lg font-medium hover:bg-red-600" id="btn_proceed_ed">
                    Cancel
                </button>
            </div>
        </form>
    )
}

export default SignInForm