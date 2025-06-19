'use client';

import { cn } from '@/lib/utils';
import { X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button } from './ui/button';

interface ResponsiveAsideProps {
    children: React.ReactNode;
    className?: string;
}

export default function ResponsiveAside({ children, className }: ResponsiveAsideProps) {
    const [isOpen, setIsOpen] = useState(true);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkScreen = () => {
            setIsMobile(window.innerWidth < 768)
        }

        checkScreen()
        window.addEventListener('resize', checkScreen)
        return () => window.removeEventListener('resize', checkScreen)
    }, [])

    return (
        <>
            {/* Mobile: "Show Details" button when closed */}
            {isMobile && !isOpen && (
                <Button
                    onClick={() => setIsOpen(!isOpen)}
                    className="fixed md:hidden bottom-10 z-50 right-4 px-3 py-2 bg-green-600 text-black hover:text-white rounded shadow-lg
                    transition-opacity duration-300 opacity-100"
                >
                    View details
                </Button>
            )}

            <aside
                className={cn(
                    'fixed inset-x-0 bottom-0',
                    'h-[80vh] bg-white',
                    'transform transition-transform duration-300 ease-in-out',
                    'z-40 overflow-y-auto',
                    isOpen ? 'translate-y-0' : 'translate-y-full',
                    className
                )}
            >
                <Button
                    onClick={() => setIsOpen(false)}
                    className="absolute top-4 right-4 p-2 bg-black/30 text-black rounded"
                >
                    <X className="h-6 w-6" />
                </Button>

                <div className="p-4 pt-15 bg-[#05b15d]/45">
                    {children}
                </div>
            </aside>
        </>
    );
}