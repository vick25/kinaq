import { redirect } from 'next/navigation'

export default async function CancelSignInForm() {
    async function handleCancel() {
        'use server'
        redirect('/historical')
    }

    return (
        <form action={handleCancel} className="mt-4 w-full">
            <button
                type="submit"
                className="w-full bg-[#b11605] text-white py-2 rounded-md text-lg font-medium hover:bg-red-600" id="btn_proceed_ed"
            >
                Cancel sign-in
            </button>
        </form>
    )
}
