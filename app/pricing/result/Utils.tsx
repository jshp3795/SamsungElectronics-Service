/**
 * 중복되는 모델들은 수리 가격 조회에서 제외시킵니다.
 * 제외시키지 않으면 모든 모델들이 검색되어 답변 시간이 길어집니다.
 * @example
 * const model = "SM-S921NLBEKOO"; // 갤럭시 S24
 * const modelNumber = model.substring(0, 8); // 모델명 (SM-S921N)
 * const color = model.substring(8, 10); // 색상 (LB, Light Blue)
 * const storage = model.charAt(10); // 용량 (E)
 * const csc = model.substring(11, 14); // 지역 코드 (KOO)
 * @param results 모델 검색 결과
 * @returns 중복되는 모델들을 제외한 검색 결과
 */
export function filterResults(results: string[]) {
    let prefix: string | null = null;

    results = results.filter(
        (result, index) => {
            // 접두사가 없다면 가장 첫 번째 모델으로 선정
            if (!prefix) {
                // 색상은 어떤 것을 선택하더라도 상관 없으므로 첫 번째 색상을 조회
                // 색상부분까지만 포함하도록 접두사 설정
                prefix = result.substring(0, 10);
            }
            else if (!result.startsWith(prefix)) {
                // 다른 색상인 경우 제외
                return false;
            }

            // 통신사 전용 모델만 존재하는 경우를 대비해 자급제 조회를 강제하는 대신 마지막 모델을 조회함
            // 검색 결과에서 자급제 모델(KOO)은 보통 가장 마지막에 나옴
            const lastIndex = getLastIndexOfItemStartingWith(results, result.substring(0, 11));
            if (lastIndex !== index) return false; // 마지막이 아니라면 (자급제가 아닐 확률이 높다면) 제외

            return true;
        });

    return results;
}

function getLastIndexOfItemStartingWith(array: string[], prefix: string) {
    return array.reduceRight(
        (lastIndex, item, index) => {
            if (lastIndex === -1 && item.startsWith(prefix)) return index;
            return lastIndex;
    }, -1);
}