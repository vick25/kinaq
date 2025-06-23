import { SubmitButton } from '@/components/submit-button';
import { Input } from '@/components/ui/input';
import { authClient } from '@/lib/auth-client';
import { getTranslations } from 'next-intl/server';
import { redirect } from 'next/navigation';

const SignUpForm = async () => {
    const t = await getTranslations('Auth');

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
        // console.log({ data, error })

        if (error || !data?.success) {
            console.error('OTP sending error:', error)
            return redirect('/historical?signup=error')
        }

        return redirect(`/historical?signup=login&email=${encodeURIComponent(email)}`);
    }

    return (
        <form id='formSignUp' action={handleSubmit} className="flex flex-col gap-4 bg-white shadow-md rounded px-4 md:px-8 pt-6 pb-8 mb-4">
            <h3 className="text-lg font-semibold text-gray-800 text-center mb-2">
                {t('signUp.title')}
            </h3>
            <Input
                type="email"
                name="email"
                placeholder={t('signUp.emailPlaceholder')}
                className="w-full"
                required
            />
            <SubmitButton primaryText={t('signUp.emailCode')} secondaryText={t('signUp.emailingCode')} />
        </form>
    )
}

export default SignUpForm