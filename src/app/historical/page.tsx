import ExportData from '@/components/export-data'
import React from 'react'
import SignUpForm from './signUp-form'
import SignInForm from './signIn-form'

type Props = {}

const Historical = (props: Props) => {
    return (
        <div className='container mx-auto'>
            <section className='my-5 space-y-4'>
                <div className="text-[#f0f0f0] bg-[#222] text-2xl font-semibold leading-5 relative pl-[2.3rem] pr-0 py-4 rounded-[3rem_0_0_3rem]">
                    KINSHASA | Data Export
                </div>

                <div className='mt-8 w-full'>
                    <div>
                        <h2 className="text-xl font-semibold text-gray-800">
                            Download active air quality information older than the last 7 days:
                        </h2>
                        <ul className="mt-2 space-y-1 list-inside list-disc relative left-8">
                            <li className="text-blue-600 hover:underline">
                                comma-separated text files (.csv) or
                            </li>
                            <li className="text-blue-600 hover:underline">
                                JSON files (.json)
                            </li>
                        </ul>
                    </div>

                    <div className="my-6 bg-white border shadow-md rounded-md p-6 max-w-3xl mx-auto">
                        <div>
                            <SignUpForm />
                        </div>

                        <div id="email_code_block">
                            <SignInForm />
                        </div>
                    </div>
                </div>
            </section>

            <ExportData />
        </div>
    )
}

export default Historical