"use client";

import { useState, MouseEvent } from "react";

interface Parameters {
    title: string;
    description: string;
}

export default function CollapsibleTextBox({ title, description }: Parameters) {
    const [ collapsed, setCollapsed ] = useState(false);
    const [ height, setHeight ] = useState("auto");
    const [ originalY, setOriginalY ] = useState(-1);

    // 커스텀 여닫이 애니메이션
    function collapse(event: MouseEvent) {
        const target = document.getElementById(title) as HTMLDivElement;

        let y = originalY;
        if (y === -1) {
            y = target.getBoundingClientRect().height;
            setOriginalY(y);
        }

        if (collapsed) {
            setHeight(y + "px");
        }
        else {
            // 처음 호출되는 경우 height가 지정되어 있지 않아 애니메이션이 재생되지 않는 문제 해결
            if (y !== originalY) {
                setHeight(y + "px");
                setTimeout(() => {
                    setHeight("2.5rem");
                }); // await tick(); 과 비슷하게 동작함
            }
            else setHeight("2.5rem");
        }
        setCollapsed(!collapsed);
    }

    return (
        <div id={ title } onClick={ collapse } className="bg-white mt-0.5 m-6 w-auto overflow-hidden outline outline-slate-300 rounded-lg active:bg-gray-200" style={{ height, transitionProperty: "height, background-color", transitionDuration: "300ms", transitionTimingFunction: "ease-out" }}>
            <div className="h-10">
                <span className="block py-1.5 ml-2.5 text-lg text-gray-800 text-left font-semibold">{ title }</span>
            </div>

            <div className="px-2.5 py-2 border-t outline-slate-500">
                <pre className="Pretendard text-gray-500 text-sm text-wrap">
                    { description.trim().replace(/ {4}/g, "") }
                </pre>
            </div>
        </div>
    );
}