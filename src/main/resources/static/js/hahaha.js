// 필터링된 게시글 데이터를 가져오는 함수
const fetchFilteredPosts = async (page = 1, keyword = postKeyword, filterType = postFilterType) => {
    try {
        const response = await fetch(`/admin/post-list?page=${page}&query=${keyword}&filterType=${filterType}`);
        console.log("서버 응답 상태:", response.ok); // 서버 응답 상태를 확인
        if (response.ok) {
            const data = await response.json();
            console.log("서버로부터 받은 데이터:", data); // 받은 데이터 확인
            renderPosts(data.posts); // 필터링된 데이터를 렌더링
            postPagination(data.pagination, keyword, filterType);
            console.log("필터링 조건:", { page, keyword, filterType });
            resetSelectAllPostsCheckbox(); // 전체 선택 체크박스 해제
        } else {
            console.error("서버 응답 실패:", response.status);
        }
    } catch (error) {
        console.error("필터링 오류:", error); // 오류 처리
    }
};