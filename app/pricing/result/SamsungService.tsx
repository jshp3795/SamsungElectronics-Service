import { filterResults } from "./Utils";

export default async function getRepairPrices(query: string, careplus: string) {
    const results = await getSearchResults(query);

    if (results.length === 0) return false;

    const filtered = filterResults(results);

    const prices: {
        display: {
            main: {
                return: number,
                nonReturn: number,
                panel: number
            },
            sub: {
                return: number,
                nonReturn: number
            }
        },
        motherboard: {
            [key: string]: number
        },
        battery: number,
        camera: {
            [key: string]: number
        },
        backGlass: number
    } = {
        display: {
            main: {
                return: 0,
                nonReturn: 0,
                panel: 0
            },
            sub: {
                return: 0,
                nonReturn: 0
            }
        },
        motherboard: { },
        battery: 0,
        camera: { },
        backGlass: 0
    };
    for (const result of filtered) {
        const price = await getRepairPricesByModel(result, careplus);

        if (!price) continue;

        prices.display.main = {
            ...prices.display.main,
            ...price.display.main
        };

        prices.display.sub = {
            ...prices.display.sub,
            ...price.display.sub
        };

        prices.motherboard = {
            ...prices.motherboard,
            ...price.motherboard
        };

        prices.battery = prices.battery || price.battery;

        prices.camera = {
            ...prices.camera,
            ...price.camera
        };

        prices.backGlass = prices.backGlass || price.backGlass;
    }

    return prices;
}

export async function getSearchResults(query: string): Promise<string[]> {
    const payload = new URLSearchParams({
        cmd: JSON.stringify({
            command: "ChatbotAPICall",
            apiUrl: `/api/v1/table/materials?detailed_code=${query}&type=search`,
            callType: "portal"
        })
    });

    const response = await fetch("https://www.samsungsvc.co.kr/proxy", {
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        method: "POST",
        body: payload.toString()
    });

    if (response.status !== 200) return [];

    type DataType = [ string, string, string, string ];

    const body = await response.json();
    const data = body.apiResult.data.filter(
        (data: DataType) =>
            data[0].includes(query) &&
            data[1] === "THS" &&
            data[2] === "스마트폰"
    );

    return data.map((data: DataType) => data[0]);
}

export async function getRepairPricesByModel(model: string, careplus: string) {
    const payload = new URLSearchParams({
        cmd: JSON.stringify({
            command: "ChatbotAPICall",
            apiUrl: `/api/v1/table/materials?detailed_code=${model}`,
            callType: "portal"
        })
    });

    const response = await fetch("https://www.samsungsvc.co.kr/proxy", {
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        method: "POST",
        body: payload.toString()
    });

    if (response.status !== 200) return false;

    type DataType = {
        _id: string,
        agent_id: string,
        type1: "스마트폰",
        type2: "S 시리즈" | "Z 시리즈" | "노트 시리즈" | "기타 시리즈",
        material_keyword_id: string,
        detailed_code: string,
        model_name: string,
        launch_date: string,
        color_code: string,
        parts_name: "액정" | "메인보드" | "배터리" | "카메라" | "후면케이스",
        parts_detail: string,
        parts_no: string,
        etc: null,
        spec: string,
        spec_detail: string,
        standard_name: string,
        customer_price1: number,
        member_price1: number,
        sub_material: string | null,
        customer_price2: number | null,
        member_price2: number | null,
        repair_cost: number,
        kit_info: {
            name: string,
            price: number,
            order: number
        }[],
        agent_code: "THS",
        pet_name: string[]
    };

    const body = await response.json();
    const data: DataType[] = body.apiResult.data;

    /* Display (Main) */
    const mainDisplayMaterial = data.find(material => material.parts_name === "액정" && material.parts_detail === "MAIN");

    let mainDisplayReturnPrice = 0, mainDisplayNonReturnPrice = 0;
    if (mainDisplayMaterial) {
        // 메인 디스플레이 반납가
        mainDisplayReturnPrice += mainDisplayMaterial.member_price2 ?? mainDisplayMaterial.member_price1;

        // 메인 디스플레이 미반납가
        mainDisplayNonReturnPrice += mainDisplayMaterial.customer_price2 ?? mainDisplayMaterial.customer_price1;

        // 수리비 (공임비)
        mainDisplayReturnPrice += mainDisplayMaterial.repair_cost;
        mainDisplayNonReturnPrice += mainDisplayMaterial.repair_cost;

        // 수리 부자재
        const kitPrice = mainDisplayMaterial.kit_info
            .map(kit => kit.price)
            .reduce((prev, curr) => prev + curr, 0);
        mainDisplayReturnPrice += kitPrice;
        mainDisplayNonReturnPrice += kitPrice;

        // 삼성 케어 플러스
        if (careplus === "122923") { // 2023년 12월 29일 ~
            if (data[0].type2 === "S 시리즈" || (data[0].type2 === "기타 시리즈" && data[0].model_name.startsWith("SM-A"))) {
                if (mainDisplayReturnPrice > 30_000) {
                    mainDisplayReturnPrice *= 0.25; // 자기부담금 25%
                    mainDisplayReturnPrice = Math.max(mainDisplayReturnPrice, 30_000); // 자기부담금 최소 3만 원
                }
                if (mainDisplayNonReturnPrice > 30_000) {
                    mainDisplayNonReturnPrice *= 0.25; // 자기부담금 25%
                    mainDisplayNonReturnPrice = Math.max(mainDisplayNonReturnPrice, 30_000); // 자기부담금 최소 3만 원
                }
            }
            else if (data[0].type2 === "Z 시리즈") {
                if (mainDisplayReturnPrice > 30_000) {
                    mainDisplayReturnPrice *= 0.3; // 자기부담금 30%
                    mainDisplayReturnPrice = Math.max(mainDisplayReturnPrice, 30_000); // 자기부담금 최소 3만 원
                }
                if (mainDisplayNonReturnPrice > 30_000) {
                    mainDisplayNonReturnPrice *= 0.3; // 자기부담금 30%
                    mainDisplayNonReturnPrice = Math.max(mainDisplayNonReturnPrice, 30_000); // 자기부담금 최소 3만 원
                }
            }
        }
    }
    /* Display (Main) */

    /* Display (Panel) */
    const panelDisplayMaterial = data.find(material => material.parts_name === "액정" && material.parts_detail === "단품");

    let panelDisplayPrice = 0;
    if (panelDisplayMaterial) {
        // 디스플레이 단품 반납가
        panelDisplayPrice += panelDisplayMaterial.member_price2 ?? panelDisplayMaterial.member_price1;

        // 수리비 (공임비)
        panelDisplayPrice += panelDisplayMaterial.repair_cost;

        // 수리 부자재
        const kitPrice = panelDisplayMaterial.kit_info
            .map(kit => kit.price)
            .reduce((prev, curr) => prev + curr, 0);
        panelDisplayPrice += kitPrice;

        // 삼성 케어 플러스
        if (careplus === "122923") { // 2023년 12월 29일 ~
            if (data[0].type2 === "S 시리즈" || (data[0].type2 === "기타 시리즈" && data[0].model_name.startsWith("SM-A"))) {
                if (panelDisplayPrice > 30_000) {
                    panelDisplayPrice *= 0.25; // 자기부담금 25%
                    panelDisplayPrice = Math.max(panelDisplayPrice, 30_000); // 자기부담금 최소 3만 원
                }
            }
            else if (data[0].type2 === "Z 시리즈") {
                if (panelDisplayPrice > 30_000) {
                    panelDisplayPrice *= 0.3; // 자기부담금 30%
                    panelDisplayPrice = Math.max(panelDisplayPrice, 30_000); // 자기부담금 최소 3만 원
                }
            }
        }
    }
    /* Display (Panel) */

    /* Display (Sub) */
    const subDisplayMaterial = data.find(material => material.parts_name === "액정" && material.parts_detail === "SUB");

    let subDisplayReturnPrice = 0, subDisplayNonReturnPrice = 0;
    if (subDisplayMaterial) {
        // 서브 디스플레이 반납가
        subDisplayReturnPrice += subDisplayMaterial.member_price2 ?? subDisplayMaterial.member_price1;

        // 서브 디스플레이 미반납가
        subDisplayNonReturnPrice += subDisplayMaterial.customer_price2 ?? subDisplayMaterial.customer_price1;

        // 수리비 (공임비)
        subDisplayReturnPrice += subDisplayMaterial.repair_cost;
        subDisplayNonReturnPrice += subDisplayMaterial.repair_cost;

        // 수리 부자재
        const kitPrice = subDisplayMaterial.kit_info
            .map(kit => kit.price)
            .reduce((prev, curr) => prev + curr, 0);
        subDisplayReturnPrice += kitPrice;
        subDisplayNonReturnPrice += kitPrice;

        // 삼성 케어 플러스
        if (careplus === "122923") { // 2023년 12월 29일 ~
            // Z 시리즈 이외에는 서브 디스플레이가 없지만 출시를 대비해 코드 작성
            if (data[0].type2 === "S 시리즈" || (data[0].type2 === "기타 시리즈" && data[0].model_name.startsWith("SM-A"))) {
                if (subDisplayReturnPrice > 30_000) {
                    subDisplayReturnPrice *= 0.25; // 자기부담금 25%
                    subDisplayReturnPrice = Math.max(subDisplayReturnPrice, 30_000); // 자기부담금 최소 3만 원
                }
                if (subDisplayNonReturnPrice > 30_000) {
                    subDisplayNonReturnPrice *= 0.25; // 자기부담금 25%
                    subDisplayNonReturnPrice = Math.max(subDisplayNonReturnPrice, 30_000); // 자기부담금 최소 3만 원
                }
            }
            else if (data[0].type2 === "Z 시리즈") {
                if (subDisplayReturnPrice > 30_000) {
                    subDisplayReturnPrice *= 0.3; // 자기부담금 30%
                    subDisplayReturnPrice = Math.max(subDisplayReturnPrice, 30_000); // 자기부담금 최소 3만 원
                }
                if (subDisplayNonReturnPrice > 30_000) {
                    subDisplayNonReturnPrice *= 0.3; // 자기부담금 30%
                    subDisplayNonReturnPrice = Math.max(subDisplayNonReturnPrice, 30_000); // 자기부담금 최소 3만 원
                }
            }
        }
    }
    /* Display (Sub) */

    /* Motherboard */
    const motherboardMaterials = data.filter(material => material.parts_name === "메인보드");

    const motherboardPrice: {
        [key: string]: number
    } = {};
    for (const material of motherboardMaterials) {
        let partPrice = 0;

        // 메인보드 반납가
        partPrice += material.member_price2 ?? material.member_price1;

        // 수리비 (공임비)
        partPrice += material.repair_cost;

        // 수리 부자재
        partPrice += material.kit_info
            .map(kit => kit.price)
            .reduce((prev, curr) => prev + curr, 0);

        // 삼성 케어 플러스
        if (careplus === "122923") { // 2023년 12월 29일 ~
            if (data[0].type2 === "S 시리즈" || (data[0].type2 === "기타 시리즈" && data[0].model_name.startsWith("SM-A"))) {
                if (partPrice > 30_000) {
                    partPrice *= 0.25; // 자기부담금 25%
                    partPrice = Math.max(partPrice, 30_000); // 자기부담금 최소 3만 원
                }
            }
            else if (data[0].type2 === "Z 시리즈") {
                if (partPrice > 30_000) {
                    partPrice *= 0.3; // 자기부담금 30%
                    partPrice = Math.max(partPrice, 30_000); // 자기부담금 최소 3만 원
                }
            }
        }

        motherboardPrice[material.parts_detail] = partPrice;
    }
    /* Motherboard */

    /* Battery */
    const batteryMaterials = data.filter(material => material.parts_name === "배터리");

    let batteryPrice = 0;
    for (const material of batteryMaterials) {
        // 배터리 반납가
        batteryPrice += material.member_price2 ?? material.member_price1;

        // 수리비 (공임비)
        batteryPrice += material.repair_cost;

        // 수리 부자재
        batteryPrice += material.kit_info
            .map(kit => kit.price)
            .reduce((prev, curr) => prev + curr, 0);

        // 삼성 케어 플러스
        if (careplus === "081420") { // 2020년 8월 14일 ~ 2021년 8월 13일
            batteryPrice = 20_000; // 자기부담금 2만 원
        }
    }
    /* Battery */

    /* Camera */
    const cameraMaterials = data.filter(material => material.parts_name === "카메라");

    // 삼성아 카메라 설명이 왜이렇냐... 망원 카메라도 2개면 몇배인지라도 적어주던지...
    // 관련 정보가 부족해 부품을 판매하는 웹사이트에서 조사하였습니다.
    const partAliases = {
        "GH96-16305A": "망원 (x3)", // S24U
        "GH96-16350A": "망원 (x5)", // S24U
        "GH96-15527A": "초광각", // S23U
        "GH96-15591A": "망원 (x10)", // S23U
        "GH96-15628A": "망원 (x3)", // S23U
        "GH96-14768A": "망원 (x10)", // S22U
        "GH96-14769A": "망원 (x3)", // S22U
        "GH96-13969A": "망원 (x3)", // S21U
        "GH96-13979A": "망원 (x10)", // S21U
        "GH96-13980A": "광각" // S21U
    };
    const cameraPrice: {
        [key: string]: number
    } = {};
    for (const material of cameraMaterials) {
        let partPrice = 0;

        // 카메라 반납가
        partPrice += material.member_price2 ?? material.member_price1;

        // 수리비 (공임비)
        partPrice += material.repair_cost;

        // 수리 부자재
        partPrice += material.kit_info
            .map(kit => kit.price)
            .reduce((prev, curr) => prev + curr, 0);

        // 삼성 케어 플러스
        if (careplus === "122923") { // 2023년 12월 29일 ~
            if (data[0].type2 === "S 시리즈" || (data[0].type2 === "기타 시리즈" && data[0].model_name.startsWith("SM-A"))) {
                if (partPrice > 30_000) {
                    partPrice *= 0.25; // 자기부담금 25%
                    partPrice = Math.max(partPrice, 30_000); // 자기부담금 최소 3만 원
                }
            }
            else if (data[0].type2 === "Z 시리즈") {
                if (partPrice > 30_000) {
                    partPrice *= 0.3; // 자기부담금 30%
                    partPrice = Math.max(partPrice, 30_000); // 자기부담금 최소 3만 원
                }
            }
        }

        if (Object.keys(partAliases).includes(material.parts_no)) {
            cameraPrice[partAliases[material.parts_no as keyof typeof partAliases]] = partPrice;
        }
        else {
            cameraPrice[material.parts_detail] = partPrice;
        }
    }
    /* Camera */

    /* Back Glass */
    const backGlassMaterial = data.find(material => material.parts_name === "후면케이스");

    let backGlassPrice = 0;
    if (backGlassMaterial) {
        // 후면케이스 반납가
        backGlassPrice += backGlassMaterial.member_price2 ?? backGlassMaterial.member_price1;

        // 수리비 (공임비)
        backGlassPrice += backGlassMaterial.repair_cost;

        // 수리 부자재
        const kitPrice = backGlassMaterial.kit_info
            .map(kit => kit.price)
            .reduce((prev, curr) => prev + curr, 0);
        backGlassPrice += kitPrice;

        // 삼성 케어 플러스
        if (careplus === "122923") { // 2023년 12월 29일 ~
            if (data[0].type2 === "S 시리즈" || (data[0].type2 === "기타 시리즈" && data[0].model_name.startsWith("SM-A"))) {
                if (backGlassPrice > 30_000) {
                    backGlassPrice *= 0.25; // 자기부담금 25%
                    backGlassPrice = Math.max(backGlassPrice, 30_000); // 자기부담금 최소 3만 원
                }
            }
            else if (data[0].type2 === "Z 시리즈") {
                if (backGlassPrice > 30_000) {
                    backGlassPrice *= 0.3; // 자기부담금 30%
                    backGlassPrice = Math.max(backGlassPrice, 30_000); // 자기부담금 최소 3만 원
                }
            }
        }
    }
    /* Back Glass */

    return {
        display: {
            main: {
                return: mainDisplayReturnPrice,
                nonReturn: mainDisplayNonReturnPrice,
                panel: panelDisplayPrice
            },
            sub: {
                return: subDisplayReturnPrice,
                nonReturn: subDisplayNonReturnPrice
            }
        },
        motherboard: motherboardPrice,
        battery: batteryPrice,
        camera: cameraPrice,
        backGlass: backGlassPrice
    };
}