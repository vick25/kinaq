import ExportData from '@/components/export-data'
import React from 'react'

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
                            <h3 className="text-lg font-semibold text-gray-800 text-center">
                                Authentication through Email:
                            </h3>
                            <input
                                type="email"
                                placeholder="Enter email address"
                                className="w-full border p-2 rounded-md text-gray-700"
                            />
                            {/* Email Code Button */}
                            <button className="mt-4 w-full bg-blue-600 text-white py-2 rounded-md text-lg font-medium hover:bg-blue-700">
                                Email Code
                            </button>
                        </div>

                        <div id="email_code_block">
                            <h3 className="text-lg font-semibold text-gray-800 text-center">Enter CODE emailed to:</h3>
                            <div className="lbCode">
                                <input type="text" name="code" id="ecode" value="" placeholder="123456"
                                    className="w-full border p-2 rounded-md text-gray-700" />
                            </div>
                            <p id="codeError" className='text-xs text-red-600'></p>
                            <div className='flex space-x-4 items-center'>
                                <button className="mt-4 w-full bg-blue-600 text-white py-2 rounded-md text-lg font-medium hover:bg-blue-700" id="btn_proceed_email">Login with code</button>
                                <button className="mt-4 w-full bg-blue-600 text-white py-2 rounded-md text-lg font-medium hover:bg-blue-700" id="btn_proceed_ed">Cancel</button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <ExportData />
        </div>
    )
}

export default Historical