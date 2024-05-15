import { useEffect, useState, Dispatch, SetStateAction } from "react";
import models from "@/public/models.json";

export default function DeviceCategory(
    navigateTab: (i: number) => void,
    categoryManager: {
        category: string,
        setCategory: Dispatch<SetStateAction<string>>
    },
    modelManager: {
        model: string,
        setModel: Dispatch<SetStateAction<string>>,
    }
) {
    const [ model, setModel ] = useState(/SM-\w\d\d\d\w/.test(navigator.userAgent) ? navigator.userAgent.match(/SM-\w\d\d\d\w/)![0].substring(0, 7) : null);

    function proceed(category: string) {
        categoryManager.setCategory(category);
        modelManager.setModel("");
        navigateTab(1);
    }

    function proceedModel(_model: string) {
        if (!Object.keys(models).includes(_model)) return;

        const model = _model as keyof typeof models;
        categoryManager.setCategory(models[model].category);
        modelManager.setModel(model);
        navigateTab(2);
    }

    useEffect(() => {
        (async function() {
            const _navigator = navigator as Navigator & { userAgentData?: any };
            if (_navigator.userAgentData) {
                // UserAgentData에서 기기 모델명 받아오기 (SSL 사용할 경우, 즉 HTTPS에서만 접근 가능)
                const userAgentData = await _navigator.userAgentData.getHighEntropyValues([ "model" ]);

                if (userAgentData.model) {
                    setModel(userAgentData.model.substring(0, 7));
                }
            }
        })();
    });

    return (
        <div>
            <span className="block text-2xl font-bold mb-8">기기 종류를 선택해 주세요</span>

            {
                model && Object.keys(models).includes(model) ?
                    <div className="w-auto mx-8">
                        <button onClick={ () => proceedModel(model) } className="bg-white w-full h-14 mb-8 outline outline-slate-300 rounded-lg ease-out duration-300 active:bg-gray-200">
                            <span className="text-xl font-semibold">자동 (갤럭시 { models[model as keyof typeof models].name })</span>
                        </button>
                    </div> :
                    null
            }

            <ul className="overflow-y-scroll mx-8 w-auto text-xl font-semibold outline outline-slate-300 rounded-lg">
                <li>
                    <button onClick={ () => proceed("S") } className={ `${ categoryManager.category === "S" ? "bg-gray-100" : "bg-white" } w-full h-14 outline outline-slate-300 rounded-t-lg ease-out duration-300 active:bg-gray-200` }>
                        갤럭시 S
                    </button>
                </li>
                <li>
                    <button onClick={ () => proceed("Z") } className={ `${ categoryManager.category === "Z" ? "bg-gray-100" : "bg-white" } w-full h-14 outline outline-slate-300 ease-out duration-300 active:bg-gray-200` }>
                        갤럭시 Z
                    </button>
                </li>
                <li>
                    <button onClick={ () => proceed("A") } className={ `${ categoryManager.category === "A" ? "bg-gray-100" : "bg-white" } w-full h-14 outline outline-slate-300 ease-out duration-300 active:bg-gray-200` }>
                        갤럭시 A
                    </button>
                </li>
                <li>
                    <button onClick={ () => proceed("O") } className={ `${ categoryManager.category === "O" ? "bg-gray-100" : "bg-white" } w-full h-14 outline outline-slate-300 rounded-b-lg ease-out duration-300 active:bg-gray-200` }>
                        기타
                    </button>
                </li>
            </ul>
        </div>
    );
}