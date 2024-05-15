"use client";

import { useState, MouseEvent } from "react";

interface Parameters {
    title: string;
    items: {
        title: string;
        price: number;
    }[];
}

export default function CollapsibleTable({ title, items }: Parameters) {
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
                    setHeight("calc(3rem - 1px)");
                }); // await tick(); 과 비슷하게 동작함
            }
            else setHeight("calc(3rem - 1px)");
        }
        setCollapsed(!collapsed);
    }

    return (
        <div id={ title } onClick={ collapse } className="bg-white mt-0.5 m-8 w-auto overflow-hidden outline outline-slate-300 rounded-lg active:bg-gray-200" style={{ height, transitionProperty: "height, background-color", transitionDuration: "300ms", transitionTimingFunction: "ease-out" }}>
            <div className="h-12">
                <span className="block py-2.5 text-xl font-bold">{ title }</span>
            </div>

            {
                new Array(Math.floor(items.length / 2)).fill(null).map(
                    (_, i) =>
                        <div key={ i } className={ `flex w-auto ${i !== 0 ? "mt-px" : ""}` }>
                            <div className="flex-1 py-4 outline outline-1 outline-slate-300">
                            <span className="block text-lg font-semibold text-gray-800">{ items[i * 2].title }</span>
                                <span className="block font-medium text-gray-600">{ Math.ceil(items[i * 2].price).toLocaleString() } 원</span>
                            </div>
                            <div className="h-14 my-auto w-px bg-gray-300"></div>
                            <div className="flex-1 py-4 outline outline-1 outline-slate-300">
                                <span className="block text-lg font-semibold text-gray-800">{ items[i * 2 + 1].title }</span>
                                <span className="block font-medium text-gray-600">{ Math.ceil(items[i * 2 + 1].price).toLocaleString() } 원</span>
                            </div>
                        </div>
                )
            }
            
            {
                items.length % 2 === 1 ?
                    <div className={ `py-4 ${ items.length === 1 ? "outline outline-1 outline-slate-300" : "" }` }>
                        <span className="block text-lg font-semibold text-gray-800">{ items[items.length - 1].title }</span>
                        <span className="block font-medium text-gray-600">{ Math.ceil(items[items.length - 1].price).toLocaleString() } 원</span>
                    </div> :
                    null
            }
        </div>
    );
}