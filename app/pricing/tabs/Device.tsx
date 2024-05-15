import { Dispatch, SetStateAction } from "react";
import models from "@/public/models.json";

export default function Device(
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
    function proceedModel(_model: string) {
        if (!Object.keys(models).includes(_model)) return;

        const model = _model as keyof typeof models;
        modelManager.setModel(model);
        navigateTab(2);
    }

    // 선택한 카테고리의 기기들만 표시
    const filtered = Object.entries(models)
        .filter(model => model[1].category === categoryManager.category);

    return (
        <div>
            <span className="block text-2xl font-bold mb-8">기기를 선택해 주세요</span>

            <ul className="overflow-y-scroll mx-8 w-auto outline outline-slate-300 rounded-lg" style={{ height: `calc(${Math.min(filtered.length, 6) * 3.5}rem ${filtered.length >= 6 ? "- 1px" : ""})` }}>
                {
                    filtered.map(
                        (model, index) =>
                            <li key={ model[0] }>
                                <button onClick={ () => proceedModel(model[0]) } className={ `${ modelManager.model === model[0] ? "bg-gray-100" : "bg-white" } w-full h-14 outline outline-slate-300 ${index === 0 ? "rounded-t-lg" : ""} ${index === filtered.length - 1 ? "rounded-b-lg" : ""} ease-out duration-300 active:bg-gray-200` }>
                                    <span className="text-xl font-semibold">갤럭시 { model[1].name }</span>
                                </button>
                            </li>
                    )
                }
            </ul>

            <span className="block mx-8 mt-4 text-xs text-left text-gray-500">찾는 기기가 없나요? 삼성전자서비스 챗봇 <span className="text-blue-600 cursor-pointer" onClick={ () => window.open("https://www.samsungsvc.co.kr/new_erms/talk/v2/jsp/view/chatWindow.jsp?channel_id=OCTA") }>써비</span>에게 예상 수리비를 물어보세요!</span>
        </div>
    );
}