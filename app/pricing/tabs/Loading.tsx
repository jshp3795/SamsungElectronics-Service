export default function Loading() {
    return (
        <div>
            <svg className="mx-auto animate-spin w-16 h-16 text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>

            <span className="block text-2xl font-bold m-8">
                <span className="text-blue-500">삼성전자서비스</span>에서<br/>
                기기 정보를 가져오고<br/>
                있습니다...
            </span>
        </div>
    );
}