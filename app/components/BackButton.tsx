"use client";

import { useRouter } from "next/navigation";

export default function BackButton({ onClick }: { onClick: string | (() => void) }) {
    const router = useRouter();

    return (
        <button onClick={ () => { typeof onClick === "string" ? router.push(onClick) : onClick() } } className="flex p-4 ml-3 mb-4 text-gray-400 ease-out duration-200 active:text-gray-500">
            <svg className="w-5 h-5 mt-0.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
            </svg>
            <span className="ml-1 text-medium">
                돌아가기
            </span>
        </button>
    );
}