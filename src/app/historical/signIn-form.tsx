import React from 'react'

type Props = {}

const SignInForm = (props: Props) => {
    return (
        <div>
            <h3 className="text-lg font-semibold text-gray-800 text-center">Enter CODE emailed to:</h3>
            <div className="lbCode">
                <input type="text" name="code" id="ecode" value="" placeholder="123456"
                    className="w-full border p-2 rounded-md text-gray-700" />
            </div>
            <p id="codeError" className='text-xs text-red-600'></p>
            <div className='flex space-x-4 items-center'>
                <button className="mt-4 w-full bg-[#05b15d] text-white py-2 rounded-md text-lg font-medium hover:bg-green-600" id="btn_proceed_email">
                    Login with code
                </button>
                <button className="mt-4 w-full bg-[#05b15d] text-white py-2 rounded-md text-lg font-medium hover:bg-green-600" id="btn_proceed_ed">
                    Cancel
                </button>
            </div>
        </div>
    )
}

export default SignInForm