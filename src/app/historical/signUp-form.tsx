import React from 'react'

type Props = {}

const SignUpForm = (props: Props) => {
    return (
        <>
            <h3 className="text-lg font-semibold text-gray-800 text-center">
                Authentication through Email:
            </h3>
            <input
                type="email"
                placeholder="Enter email address"
                className="w-full border p-2 rounded-md text-gray-700"
            />
            {/* Email Code Button */}
            <button className="mt-4 w-full bg-[#05b15d] text-white py-2 rounded-md text-lg font-medium hover:bg-green-600">
                Email Code
            </button>
        </>
    )
}

export default SignUpForm