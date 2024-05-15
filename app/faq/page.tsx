"use client";

import { useRouter } from "next/navigation";
import TopBar from "@/app/components/TopBar";
import BackButton from "../components/BackButton";
import CollapsibleTextBox from "@/app/components/CollapsibleTextBox";

export default function FAQ() {
    const router = useRouter();

    return (
        <main style={{ height: "calc(100dvh - 3rem)" }}>
            <div className="flex flex-col w-auto h-full m-6 bg-gray-100 outline outline-slate-300 rounded-lg">
                <TopBar path="faq" />

                <BackButton onClick={ () => { history.pushState({ transition: "faq" }, "", "/"); router.push("/"); } } />

                <div className="overflow-y-scroll" style={{ animation: "0.3s ease-in-out both slide-from-right" }} >
                    <CollapsibleTextBox title="디스플레이 교체 반납? 미반납?" description={
                        `
                            통상적으로 서비스센터에서 디스플레이 교체를 요구하면 디스플레이 수리 가격은 '반납가' 가격으로 책정됩니다.
                            하지만 디스플레이가 심하게 파손된 경우 반납이 불가능하여 '미반납가'가 적용될 수 있습니다.
                        `
                    } />

                    <CollapsibleTextBox title="디스플레이 단품 수리란?" description={
                        `
                            단품수리는 디스플레이 패널, 강화유리만 부분 교체하는 수리로 약 5~6일 정도 소요되며, 수리비용이 절감될 수 있습니다.
                            단품수리를 지원하지 않는 기기의 경우 해당 옵션이 표시되지 않습니다.
                        `
                    } />

                    <CollapsibleTextBox title="디스플레이 무상 수리 기준은?" description={
                        `
                            통상적으로 구매 후 1년 이내 & 외관상 흠집/찍힘이 전혀 없는 경우에만 무상 수리가 가능합니다.
                            하지만 엔지니어(수리기사님) 혹은 서비스센터 지점에 따라 무상 수리가 거절될 수 있으므로 정확한 정보는 엔지니어를 통해 제품 확인 후 안내받아보시기 바랍니다.
                        `
                    } />

                    <CollapsibleTextBox title="Z시리즈 힌지도 같이 교체?" description={
                        `
                            폴더블 시리즈의 메인(내부) 디스플레이 교체 시 내부 프레임(베젤), 힌지 및 배터리도 함께 교체됩니다.
                            다만 단품수리를 진행하는 경우 디스플레이 패널만 교체됩니다.
                        `
                    } />

                    <CollapsibleTextBox title="삼케플 한 번에 여러 부분 수리 가능?" description={
                        `
                            삼성케어플러스를 2023년 12월 28일 이전에 가입한 경우 파손 시 부과되는 자기부담금은 '1회' 수리 기준입니다. (그래서 가끔 다른 거도 같이 수리해준다 카더라)
                            따라서 디스플레이와 후면케이스가 모두 파손된 경우 1회 비용만 지불하고 둘 다 교체받을 수 있습니다.
                            배터리 교체 또는 흠집/찍힘으로 인한 교체는 파손으로 간주되지 않아 이때 수리비는 나머지 파손과 별도로 추가로 부과됩니다.
                        `
                    } />

                    <CollapsibleTextBox title="삼케플 양도 가능?" description={
                        `
                            삼성케어플러스는 가입 후 1회에 한해 소유권 양도가 가능합니다.
                            삼성케어플러스 고객센터(1566-4590)에 전화하여 서비스 양도를 요청해보세요.
                        `
                    } />

                    <CollapsibleTextBox title="오래된 폰 수리 가능?" description={
                        `
                            서비스센터에 해당 기기의 부품 재고가 있는 경우에만 수리가 가능합니다.
                            센터 방문 전 전화로 재고 상태를 먼저 확인해보세요.
                        `
                    } />

                    <CollapsibleTextBox title="충전단자 교체 비용?" description={
                        `
                            하단 충전단자 교체시 6만원 내외의 가격이 부과됩니다.
                            하지만 기기에 따라 충전 단자가 메인보드 일체형으로 구성된 경우 비용 차이가 발생할 수 있습니다.
                        `
                    } />

                    <CollapsibleTextBox title="후면케이스 색상 변경 가능?" description={
                        `
                            서비스센터에서 후면케이스 색상을 변경하여 교체받을 수 없습니다.
                            해당 기기의 자가수리 키트가 판매중인 경우 후면케이스 자가수리 키트를 구매해 색상을 변경할 수 있습니다.
                        `
                    } />
                </div>
            </div>
        </main>
    );
}