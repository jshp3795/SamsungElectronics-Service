export default function CarePlus(
    navigateTab: (i: number, carePlus: number) => void
) {
    function proceed(index: number) {
        navigateTab(3, index);
    }

    const dates = [
        "2021년 8월 13일 이전",
        "2023년 7월 31일 이전",
        "2023년 12월 28일 이전",
        "2023년 12월 29일 이후"
    ];

    return (
        <div>
            <span className="block text-2xl font-bold mb-8">
                <span className="text-blue-500">삼성 케어 플러스</span>의<br/>
                가입일자를 선택해 주세요
            </span>

            <div className="w-auto mx-8">
                <button onClick={ () => proceed(0) } className="bg-white w-full h-14 mb-8 outline outline-slate-300 rounded-lg ease-out duration-300 active:bg-gray-200">
                    <span className="text-xl font-semibold">가입하지 않음</span>
                </button>
            </div>

            <ul className="overflow-y-scroll mx-8 w-auto outline outline-slate-300 rounded-lg" style={{ height: `calc(${Math.min(dates.length, 6) * 3.5}rem ${dates.length >= 6 ? "- 1px" : ""})` }}>
                {
                    dates.map(
                        (date, index) =>
                            <li key={ index }>
                                <button onClick={ () => proceed(index + 1) } className={ `bg-white w-full h-14 outline outline-slate-300 ${index === 0 ? "rounded-t-lg" : ""} ${index === dates.length - 1 ? "rounded-b-lg" : ""} ease-out duration-300 active:bg-gray-200` }>
                                    <span className="text-xl font-semibold">{ date }</span>
                                </button>
                            </li>
                    )
                }
            </ul>

            <span className="block mx-8 mt-4 text-xs text-left text-gray-500">Samsung Care+는 가입일을 기준으로 <span className="text-blue-600 cursor-pointer" onClick={ () => window.open("https://www.samsungcareplus.co.kr/info/productInfo") }>월 이용 요금과 보장 기간, 보장 금액</span>이 달라집니다. <span className="text-blue-600 cursor-pointer" onClick={ () => window.open("https://r1.community.samsung.com/") }>Members 앱</span>의 &#39;내 페이지&#39; 탭에서 가입일자를 확인해 주세요.</span>
        </div>
    );
}