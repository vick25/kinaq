'use client'
import { useRouter } from 'next/navigation'
import React, { useState, useEffect, useCallback } from 'react'

const LocaleSwitcher = () => {
    const [locale, setLocale] = useState<string>('')
    const router = useRouter()

    const handleChange = useCallback(
        (e: React.ChangeEvent<HTMLSelectElement>) => {
            const newLocale = e.target.value
            setLocale(newLocale)
            document.cookie = `KINAQ_LOCALE=${newLocale};`
            router.refresh()
        },
        [router]
    )

    useEffect(() => {
        const cookieLocale = document.cookie
            .split('; ')
            .find((row) => row.startsWith('KINAQ_LOCALE='))?.split('=')[1]

        if (cookieLocale) {
            setLocale(cookieLocale)
        } else {
            const browserLocale = navigator.language.slice(0, 2);
            setLocale(browserLocale)
            document.cookie = `KINAQ_LOCALE=${browserLocale};`
            router.refresh()
        }
    }, [router])

    return (
        <select id='locale'
            name='locale'
            value={locale}
            onChange={handleChange}
            className='h-full rounded-md border-0 bg-transparent py-0 pl-2 text-gray-500 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm font-bold'>
            <option value="en" className={`font-bold ${locale === 'en' ? 'text-red-600' : ''}`}>
                en
            </option>
            <option value="fr" className={`font-bold ${locale === 'fr' ? 'text-red-600' : ''}`}>
                fr
            </option>
        </select>
    )
}

export default LocaleSwitcher