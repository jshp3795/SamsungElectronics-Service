"use client";

import { useState, useEffect, MouseEvent } from "react";
import { useRouter } from "next/navigation";
import Category from "./tabs/Category";
import Device from "./tabs/Device";
import CarePlus from "./tabs/CarePlus";
import Loading from "./tabs/Loading";
import TopBar from "@/app/components/TopBar";
import BackButton from "../components/BackButton";

export default function Pricing() {
    const router = useRouter();

    const [ tabIndex, setTabIndex ] = useState(-1);
    const [ category, setCategory ] = useState("");
    const [ model, setModel ] = useState("");

    useEffect(() => {
        if (tabIndex === -1) {
            // 탭 핸들 글라이더 애니메이션
            const glider: HTMLSpanElement = document.getElementById("glider")!;
            glider.style.animation = "slide-from-left 300ms ease-in-out";
            glider.style.opacity = "1";

            // 탭 애니메이션
            const tab = document.getElementById("tab") as HTMLDivElement;
            tab.style.animation = "0.3s ease-in-out both slide-from-right";

            // 첫 번째 탭 보여주기
            setTabIndex(0);
        }
    }, [ tabIndex ]);

    const tabs = [
        Category(navigateTab, { category, setCategory }, { model, setModel }),
        Device(navigateTab, { category, setCategory }, { model, setModel }),
        CarePlus(navigateTab),
        Loading()
    ];

    function navigateTab(index: number, carePlus?: number) {
        const _document = document as Document & { startViewTransition: any };
        if (!_document.startViewTransition) { // Safari 및 iOS 웹 브라우저
            setTabIndex(index);
            return;
        }

        // 메인 화면으로 돌아가기
        if (index === -1) {
            history.pushState({ transition: "pricing" }, "", "/");
            router.push("/");
            return;
        }

        // 결과 페이지로 이동
        if (index === 3) {
            // 탭 핸들 글라이더 애니메이션
            const glider: HTMLSpanElement = document.getElementById("glider")!;
            glider.style.animation = "slide-to-right 300ms ease-in-out";
            glider.style.opacity = "0";

            setTimeout(() => {
                // 탭 핸들 글라이더 애니메이션 (사라질 때)
                const tabHandle = document.getElementById("tabHandle") as HTMLDivElement;
                if (!tabHandle) return;

                tabHandle.style.animation = "slide-to-left 300ms ease-in-out";
                tabHandle.style.opacity = "0";
            }, 600);

            // 삼성케어 가입일
            const carePlusDates = [
                "",
                "081420",
                "081421",
                "080123",
                "122923"
            ];
            router.push(`/pricing/result?model=${model}&careplus=${carePlusDates[carePlus!]}`);
        }

        // View Transition 설정 (이전 페이지, 다음 페이지)
        if (index < tabIndex) {
            (document.getElementById("tab") as any).style.viewTransitionName = "tab-backward";
        }
        else {
            (document.getElementById("tab") as any).style.viewTransitionName = "tab-forward";
        }
        _document.startViewTransition(() => {
            setTabIndex(index);
        });
    }

    function handleRadioClick(event: MouseEvent) {
        switch ((event.target as HTMLInputElement).value) {
            case "0":
                if (tabIndex !== 0) navigateTab(0);
                break;
            case "1":
                if (tabIndex !== 1) {
                    if (category === "") {
                        // 기기 카테고리를 선택하지 않았을 경우 탭 핸들이 좌우로 흔들리는 애니메이션
                        const tabHandle = (document.getElementById("tabHandle") as HTMLDivElement);
                        if (tabHandle.style.animation.includes("horizontal-shaking2")) {
                            tabHandle.style.animation = "horizontal-shaking 500ms";
                        }
                        else {
                            tabHandle.style.animation = "horizontal-shaking2 500ms";
                        }
                    }
                    else navigateTab(1);
                }
                break;
            case "2":
                if (tabIndex !== 2) {
                    if (model === "") {
                        // 기기를 선택하지 않았을 경우 탭 핸들이 좌우로 흔들리는 애니메이션
                        const tabHandle = (document.getElementById("tabHandle") as HTMLDivElement);
                        if (tabHandle.style.animation.includes("horizontal-shaking2")) {
                            tabHandle.style.animation = "horizontal-shaking 500ms";
                        }
                        else {
                            tabHandle.style.animation = "horizontal-shaking2 500ms";
                        }
                    }
                    else navigateTab(2);
                }
                break;
        }
    }

    return (
        <main style={{ height: "calc(100dvh - 3rem)" }}>
            <div className="flex flex-col w-auto h-full m-6 bg-gray-100 outline outline-slate-300 rounded-lg">
                <TopBar path="pricing" />

                <BackButton onClick={ () => navigateTab(tabIndex - 1) } />

                { /* https://codepen.io/havardob/pen/ExVaELV */}
                <div id="tabHandle" className="mx-8 mb-8 flex">
                    <div className="flex w-full px-2 bg-white text-lg font-bold rounded-full shadow-md outline outline-slate-300">
                        <div className="flex-auto h-13">
                            <input onClick={handleRadioClick} className="hidden" type="radio" id="radio1" name="tab" value="0" />
                            <label className="tab flex py-3 cursor-pointer" htmlFor="radio1">
                                <span className="z-20 block text-center w-full flex justify-center">
                                    카테고리
                                </span>
                            </label>
                        </div>
                        <div className="flex-auto h-13">
                            <input onClick={handleRadioClick} className="hidden" type="radio" id="radio2" name="tab" value="1" />
                            <label className="tab flex py-3 cursor-pointer" htmlFor="radio2">
                                <span className="z-20 block text-center w-full flex justify-center">
                                    기기선택
                                </span>
                            </label>
                        </div>
                        <div className="flex-auto h-13">
                            <input onClick={handleRadioClick} className="hidden" type="radio" id="radio3" name="tab" value="2" />
                            <label className="tab flex py-3 cursor-pointer" htmlFor="radio3">
                                <span className="z-20 block text-center w-full flex justify-center">
                                    삼성케어
                                </span>
                            </label>
                        </div>
                        <span id="glider" className="absolute z-10 h-9 my-2 bg-blue-100 rounded-full duration-500 ease-in-out" style={{ width: "calc((100vw - 8rem) / 3)", translate: (Math.min(Math.max(tabIndex, 0), 2) * 100) + "%", opacity: 0 }}></span>
                    </div>
                </div>

                <div id="tab" className="text-center" style={{ viewTransitionName: "tab-forward" }}>
                    {
                        tabs[tabIndex] ?? null
                    }
                </div>
            </div>
        </main>
    );
}