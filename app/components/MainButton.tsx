"use client";

import { useRouter } from "next/navigation";

export default function MainButton() {
    const router = useRouter();

    return (
        <div className="m-8 mt-12 w-auto">
            <button onClick={ () => { history.pushState({ transition: "pricing" }, "", "/"); router.push("/"); } } className="bg-white w-full h-14 outline outline-slate-300 rounded-lg ease-out duration-300 active:bg-gray-200">
                <span className="text-2xl font-semibold">처음으로</span>
            </button>
        </div>
    );
}