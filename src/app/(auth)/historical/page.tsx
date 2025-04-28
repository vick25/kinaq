import { getLocations } from '@/actions/populateTables'
import ExportData from '@/components/export-data'
import { getUser } from '@/lib/auth-session'
import SignInForm from '../signIn-form'
import SignUpForm from '../signUp-form'

interface PageProps {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export const metadata = {
    title: 'KINAQ | Data Export',
    description: 'Download air quality data from KINAQ',
}

const Historical = async ({ searchParams }: PageProps) => {
    const session = await getUser();
    const locationsData = await getLocations();

    const { signup, email, locq } = await searchParams
    const showSignIn = signup === 'login'
    const showExport = signup === 'success'
    const loggedInEmail = typeof email === 'string' ? email : ''

    return (
        <div className='container mx-auto'>
            <section className='my-5 space-y-4'>
                <div className="text-[#f0f0f0] bg-[#222] text-2xl font-semibold leading-5 relative pl-[2.3rem] pr-0 py-4 rounded-[3rem_0_0_3rem]">
                    KINAQ | Data Export
                </div>

                <div className='mt-8 w-full'>
                    {/* {session && <p className='mb-3 text-center'>Download Requests for <span className='font-bold text-blue-700'>{session.user.email}</span></p>} */}
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

                    {!session && (
                        <div className="my-6 bg-white border shadow-md rounded-md p-6 max-w-3xl mx-auto">
                            {!showSignIn && !showExport && (
                                <div>
                                    <SignUpForm />
                                </div>
                            )}

                            {showSignIn && (
                                <div id="email_code_block">
                                    <SignInForm loggedInEmail={loggedInEmail} />
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </section>

            {(session || showExport) && <ExportData locationQuery={locq as string} locationsData={locationsData} />}
        </div>
    )
}

export default Historical