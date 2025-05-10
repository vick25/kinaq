'use client';

import { useFormStatus } from "react-dom";
import { Button } from "./ui/button";

type Props = {
    primaryText: string;
    secondaryText: string;
}

export function SubmitButton({ primaryText, secondaryText }: Props) {

    const { pending } = useFormStatus();

    return (
        <Button className="mt-4 w-full bg-[#05b15d] text-white py-2 rounded-md text-lg font-medium hover:bg-green-600"
            type="submit" disabled={pending}>
            {pending ? secondaryText : primaryText}
        </Button>
    )
}