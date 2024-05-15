"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
    const router = useRouter();

    // 서비스 비용 확인하기
    function pricingClick() {
        document.getElementById("pricing")!.classList.remove("minimize");
        document.getElementById("pricing")!.classList.add("expand");
        document.getElementById("pricing")!.style.zIndex = "10";
        document.getElementById("faq")!.style.zIndex = "0";
        setTimeout(() => {
            router.push("/pricing");
        }, 450);
    }

    // 자주 하는 질문
    function faqClick() {
        document.getElementById("faq")!.classList.remove("minimize");
        document.getElementById("faq")!.classList.add("expand");
        document.getElementById("pricing")!.style.zIndex = "0";
        document.getElementById("faq")!.style.zIndex = "10";
        setTimeout(() => {
            router.push("/faq");
        }, 450);
    }

    let colors = ["#F59E0B", "#22C55E", "#3B82F6", "#8B5CF6"];
    let index = 0;
    // '갤럭시' 글자 색 변경
    function fade() {
        const textGalaxy = document.getElementById("text-galaxy");
        if (textGalaxy) document.getElementById("text-galaxy")!.style.color = colors[index];
        index = (index + 1) % colors.length;
    }

    useEffect(() => {
        const _window = (window as Window & { fadeGalaxy?: NodeJS.Timeout });
        if (!_window.fadeGalaxy) {
            _window.fadeGalaxy = setInterval(fade, 3000);
            fade();
        }
    });

    return (
        <main className="flex flex-col min-h-screen">
            <svg className="mx-auto w-24 h-60" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 400" width="200" height="500">
                <rect x="20" y="80" width="160" height="280" rx="20" fill="#EEE" stroke="#000" strokeWidth="7"/>
                <circle cx="100" cy="96" r="5" fill="#000"/>
                <path d="M80,346 L120,346" stroke="#000" strokeWidth="6" strokeLinecap="round"/>
            </svg>

            <span className="text-2xl font-extrabold text-center text-color-fade mb-6">
                당신의 <span id="text-galaxy" className="text-color-fade">갤럭시</span>를 다시 빛내줄,<br/>
                <span className="text-blue-500">삼성전자서비스</span>
            </span>

            <button id="pricing" onClick={ pricingClick } className={ `absolute flex w-auto m-6 bg-gray-100 outline outline-slate-300 rounded-lg ease-out duration-300 active:bg-gray-200 ${typeof history !== "undefined" && history.state?.transition === "pricing" ? "minimize z-10" : ""}`} style={{ width: "calc(100vw - 3rem)", top: "22rem" }}>
                <svg className="ml-3 mr-2 my-3 w-7 h-7" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M10.464 8.746c.227-.18.497-.311.786-.394v2.795a2.252 2.252 0 0 1-.786-.393c-.394-.313-.546-.681-.546-1.004 0-.323.152-.691.546-1.004ZM12.75 15.662v-2.824c.347.085.664.228.921.421.427.32.579.686.579.991 0 .305-.152.671-.579.991a2.534 2.534 0 0 1-.921.42Z" />
                    <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 6a.75.75 0 0 0-1.5 0v.816a3.836 3.836 0 0 0-1.72.756c-.712.566-1.112 1.35-1.112 2.178 0 .829.4 1.612 1.113 2.178.502.4 1.102.647 1.719.756v2.978a2.536 2.536 0 0 1-.921-.421l-.879-.66a.75.75 0 0 0-.9 1.2l.879.66c.533.4 1.169.645 1.821.75V18a.75.75 0 0 0 1.5 0v-.81a4.124 4.124 0 0 0 1.821-.749c.745-.559 1.179-1.344 1.179-2.191 0-.847-.434-1.632-1.179-2.191a4.122 4.122 0 0 0-1.821-.75V8.354c.29.082.559.213.786.393l.415.33a.75.75 0 0 0 .933-1.175l-.415-.33a3.836 3.836 0 0 0-1.719-.755V6Z" clipRule="evenodd" />
                </svg>

                <span className="block my-3 text-xl font-bold">서비스 비용 확인하기</span>
            </button>

            <button id="faq" onClick={ faqClick } className={ `absolute flex w-auto m-6 bg-gray-100 outline outline-slate-300 rounded-lg ease-out duration-300 active:bg-gray-200 ${typeof history !== "undefined" && history.state?.transition === "faq" ? "minimize z-10" : ""}`} style={{ width: "calc(100vw - 3rem)", top: "22rem", marginTop: "6.25rem" }}>
                <svg className="ml-3 mr-2 my-3 w-7 h-7" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M11.25 4.533A9.707 9.707 0 0 0 6 3a9.735 9.735 0 0 0-3.25.555.75.75 0 0 0-.5.707v14.25a.75.75 0 0 0 1 .707A8.237 8.237 0 0 1 6 18.75c1.995 0 3.823.707 5.25 1.886V4.533ZM12.75 20.636A8.214 8.214 0 0 1 18 18.75c.966 0 1.89.166 2.75.47a.75.75 0 0 0 1-.708V4.262a.75.75 0 0 0-.5-.707A9.735 9.735 0 0 0 18 3a9.707 9.707 0 0 0-5.25 1.533v16.103Z" />
                </svg>

                <span className="block my-3 text-xl font-bold">자주 하는 질문</span>
            </button>
        </main>
    );
}