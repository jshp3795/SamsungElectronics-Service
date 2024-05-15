import BackButton from "@/app/components/BackButton";
import MainButton from "@/app/components/MainButton";
import CollapsibleTable from "@/app/components/CollapsibleTable";
import TopBar from "@/app/components/TopBar";
import getRepairPrices from "./SamsungService";
import models from "@/public/models.json";

interface Parameters {
    searchParams: {
        model?: string;
        careplus?: string;
    };
}

// 삼성케어 가입일
const carePlusDates = [
    "",
    "081420",
    "081421",
    "080123",
    "122923"
];

export default async function PricingResult({ searchParams }: Parameters) {
    if (!searchParams.careplus) searchParams.careplus = ""; // 기본값: 삼성케어 X
    if (searchParams.model) searchParams.model = searchParams.model!.substring(0, 7); // 모델 끝자리 삭제 (SM-F731N -> SM-F731)

    let errorMessage = "";
    if (!searchParams.model) errorMessage = "모델이 입력되지 않았습니다";
    else if (!Object.keys(models).includes(searchParams.model)) errorMessage = `모델 '${searchParams.model}' 을 찾을 수 없습니다`;
    else if (!carePlusDates.includes(searchParams.careplus)) errorMessage = "삼성케어플러스 가입일이 올바르지 않습니다";

    const _repairPrices = errorMessage === "" ? await getRepairPrices(searchParams.model!, searchParams.careplus!) : null;
    if (!_repairPrices && errorMessage === "") {
        errorMessage = `모델 '${searchParams.model}' 에 대한 정보를 찾을 수 없습니다`;
    }

    if (errorMessage !== "") {
        return (
            <main style={{ height: "calc(100dvh - 3rem)" }}>
                <div className="w-auto h-full m-6 bg-gray-100 outline outline-slate-300 rounded-lg">
                    <TopBar path="pricing" />

                    <BackButton onClick="/pricing" />

                    <div id="tab" className="text-center" style={{ viewTransitionName: "tab-forward" }}>
                        <svg className="block mx-auto w-16 h-16 m-8 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                            <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12ZM12 8.25a.75.75 0 0 1 .75.75v3.75a.75.75 0 0 1-1.5 0V9a.75.75 0 0 1 .75-.75Zm0 8.25a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z" clipRule="evenodd" />
                        </svg>

                        <span className="block text-3xl font-bold m-8">{ errorMessage }</span>

                        <MainButton />
                    </div>
                </div>
            </main>
        );
    }

    const repairPrices = _repairPrices as Exclude<Awaited<ReturnType<typeof getRepairPrices>>, false>;
    const hasSubDisplay = Object.values(repairPrices.display.sub).some(price => price > 0);

    return (
        <main style={{ height: "calc(100dvh - 3rem)" }}>
            <div className="flex flex-col w-auto h-full m-6 bg-gray-100 outline outline-slate-300 rounded-lg">
                <TopBar path="pricing" />

                <BackButton onClick="/pricing" />

                <div id="tab" className="text-center" style={{ viewTransitionName: "tab-forward" }}>
                    <svg className="block mx-auto w-16 h-16 m-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                    </svg>

                    <span className="block text-2xl font-bold mt-8 mb-12">갤럭시 { models[searchParams.model as keyof typeof models].name }</span>

                    <div className="overflow-y-scroll" style={{ height: "calc(100dvh - 25.875rem + 2px)" }}>
                        <CollapsibleTable
                            title={ hasSubDisplay ? "디스플레이 (메인)" : "디스플레이" }
                            items={ repairPrices.display.main.panel > 0 ?
                                [
                                    { title: "반납가", price: repairPrices.display.main.return },
                                    { title: "미반납가", price: repairPrices.display.main.nonReturn },
                                    { title: "단품수리", price: repairPrices.display.main.panel }
                                ] :
                                [
                                    { title: "반납가", price: repairPrices.display.main.return },
                                    { title: "미반납가", price: repairPrices.display.main.nonReturn }
                                ]
                            }
                        />

                        {
                            hasSubDisplay ?
                                <CollapsibleTable
                                    title="디스플레이 (서브)"
                                    items={ [
                                        { title: "반납가", price: repairPrices.display.sub.return },
                                        { title: "미반납가", price: repairPrices.display.sub.nonReturn }
                                    ] }
                                /> :
                                null
                        }

                        <CollapsibleTable
                            title="메인보드"
                            items={
                                Object.entries(repairPrices.motherboard)
                                    .map(
                                        motherboard =>
                                            ({
                                                title: motherboard[0],
                                                price: motherboard[1]
                                            })
                                    )
                            }
                        />

                        <CollapsibleTable
                            title="배터리"
                            items={ [ { title: "부자재 미포함", price: repairPrices.battery } ]}
                        />

                        <CollapsibleTable
                            title="카메라"
                            items={
                                Object.entries(repairPrices.camera)
                                    .map(
                                        camera =>
                                            ({
                                                title: camera[0],
                                                price: camera[1]
                                            })
                                    )
                            }
                        />

                        <CollapsibleTable
                            title="후면케이스"
                            items={ [ { title: "부자재 미포함", price: repairPrices.backGlass } ]}
                        />

                        <span className="block mx-8 text-xs text-left text-gray-500">수리 비용은 사전 안내 없이 변경될 수 있으며, 정확한 비용은 엔지니어를 통해 제품 확인 후 안내받아보시기 바랍니다.</span>
                    </div>
                </div>
            </div>
        </main>
    );
}