'use client';

import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";
import { useEffect } from "react";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Optionally log the error to an error reporting service
        console.error(error);
    }, [error]);

    return (
        <div className="flex h-[calc(100vh-4rem)] flex-col items-center justify-center gap-2">
            <div className="text-center">
                <h2 className="text-2xl font-bold tracking-tight">Something went wrong!</h2>
                <p className="mt-2 text-gray-600">
                    {error.message || 'An error occurred while processing your request.'}
                </p>
            </div>
            <div className="mt-6 flex items-center gap-2">
                <Button
                    onClick={() => reset()}
                    className="bg-orange-500 hover:bg-orange-600"
                >
                    Try again
                </Button>
                <Button
                    onClick={() => redirect('/')}
                    variant="outline"
                >
                    Go home
                </Button>
            </div>
        </div>
    );
}