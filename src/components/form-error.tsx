'use client';

import { useEffect, useState } from 'react';

interface ErrorMessageProps {
    message: string;
}

export default function FormError({ message }: ErrorMessageProps) {
    const [error, setError] = useState('');

    useEffect(() => {
        if (message) {
            setError(message);
            const timer = setTimeout(() => setError(''), 5000);
            return () => clearTimeout(timer);
        }
    }, [message]);

    return <p className="text-xs text-red-600">{error}</p>;
}