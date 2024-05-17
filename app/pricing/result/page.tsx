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

// 구형 삼성케어 자기부담금 (정액제)
const flatPrices = {
    "081420": {
        S: 80_000,
        Fold: 160_000,
        Flip: 140_000,
        A: 35_000
    },
    "081421": {
        S: 80_000,
        Fold: 160_000,
        Flip: 140_000,
        A: 35_000
    },
    "080123": {
        S: 80_000,
        Fold: 290_000,
        Flip: 190_000,
        A: 35_000
    }
};

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
    const model = models[searchParams.model as keyof typeof models];

    return (
        <main style={{ height: "calc(100dvh - 3rem)" }}>
            <div className="flex flex-col w-auto h-full m-6 bg-gray-100 outline outline-slate-300 rounded-lg">
                <TopBar path="pricing" />

                <BackButton onClick="/pricing" />

                <div id="tab" className="text-center" style={{ viewTransitionName: "tab-forward" }}>
                    <svg className="block mx-auto w-16 h-16 m-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                    </svg>

                    <span className="block text-2xl font-bold mt-8 mb-12">갤럭시 { model.name }</span>

                    <div className="overflow-y-scroll" style={{ height: "calc(100dvh - 25.875rem + 2px)" }}>
                        {
                            [ "081420", "081421", "080123" ].includes(searchParams.careplus) ?
                                <CollapsibleTable
                                    title={ "파손*" }
                                    items={ [ { title: "1회", price: flatPrices[searchParams.careplus as keyof typeof flatPrices][model.category === "Z" ? ( model.name.includes("Fold") ? "Fold" : "Flip" ) : model.category as "S" | "A"] } ] }
                                /> :
                                null
                        }

                        {
                            [ "081420", "081421", "080123" ].includes(searchParams.careplus) ?
                                null :
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
                        }

                        {
                            hasSubDisplay && ![ "081420", "081421", "080123" ].includes(searchParams.careplus) ?
                                <CollapsibleTable
                                    title="디스플레이 (서브)"
                                    items={ [
                                        { title: "반납가", price: repairPrices.display.sub.return },
                                        { title: "미반납가", price: repairPrices.display.sub.nonReturn }
                                    ] }
                                /> :
                                null
                        }

                        {
                            [ "081420", "081421", "080123" ].includes(searchParams.careplus) ?
                                null :
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
                        }

                        <CollapsibleTable
                            title={ model.category === "Z" ? "배터리**" : "배터리" }
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
                            title={ [ "081420", "081421", "080123" ].includes(searchParams.careplus) ? "후면케이스*" : "후면케이스" }
                            items={ [ { title: "부자재 미포함", price: repairPrices.backGlass } ]}
                        />

                        <span className="block mx-8 text-xs text-left text-gray-500">수리 비용은 사전 안내 없이 변경될 수 있으며, 정확한 비용은 엔지니어를 통해 제품 확인 후 안내받아보시기 바랍니다.</span>
                        {
                            [ "081420", "081421", "080123" ].includes(searchParams.careplus) ?
                                <span className="block mx-8 text-xs text-left text-gray-500">
                                    * 기기 파손은 디스플레이, 메인보드, 후면케이스를 포함하며, 모든 부품을 교체하더라도(올갈이) 1회 파손 비용만 청구됩니다.
                                </span> :
                                null
                        }
                        {
                            [ "081420", "081421", "080123" ].includes(searchParams.careplus) ?
                                <span className="block mx-8 text-xs text-left text-gray-500">
                                    * 후면케이스 단독 수리의 경우 파손 비용이 아닌 후면케이스 비용을 확인해 주세요.
                                </span> :
                                null
                        }
                        {
                            model.category === "Z" ?
                                <span className="block mx-8 text-xs text-left text-gray-500">
                                    {
                                        [
                                            "** Z 시리즈(폴드, 플립)는 메인 디스플레이와 배터리가 일체형으로 구성되어 있어 메인 디스플레이를 교체받으면 배터리도 함께 교체됩니다.",
                                            `${searchParams.careplus !== "" ? "삼성케어플러스를 적용한다면 비용 차이가 크지 않으니" : "이 점도 생각하여"} 메인 디스플레이 교체도 고려해 보세요.`
                                        ].join(" ")
                                    }
                                </span> :
                                null
                        }
                    </div>
                </div>
            </div>
        </main>
    );
}

export const runtime = "edge";