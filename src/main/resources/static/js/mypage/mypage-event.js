// 회원 정보 가져오기
const getMemberInfo = async () => {
    try {
        const response = await fetch("/member/info");
        if (!response.ok) throw new Error("로그인 상태를 확인할 수 없습니다.");

        const data = await response.json();
        console.log("받은 회원 데이터:", data);

        return data.id;
    } catch (error) {
        console.error("회원 정보 조회 실패:", error);
        return null;
    }
};

/*********************후기 섹션**********************/
/********************* 후기 섹션 **********************/

// 상태 변수 선언
let reviews = []; // 모든 리뷰 데이터를 저장할 배열
const reviewItemsPerLoad = 10; // 한 번에 렌더링할 아이템 수
let currentReviewIndex = 0; // 현재까지 렌더링된 아이템의 인덱스

// 다음 리뷰 아이템 렌더링
const renderNextReviews = () => {
    const reviewList = document.querySelector(".postscript-list");
    const emptyComponent = document.querySelector("#postscript .empty-component");

    if (reviews.length === 0) {
        reviewList.style.display = "none";
        emptyComponent.style.display = "block";
        return;
    } else {
        reviewList.style.display = "block";
        emptyComponent.style.display = "none";
    }

    // 처음 렌더링 시 테이블 구조 생성
    if (currentReviewIndex === 0) {
        reviewList.innerHTML = `
            <table class="news-center-table" style="margin-top: 0; margin-bottom: 20px;">
                <colgroup>
                    <col style="width: 57px;">
                    <col style="width: 132px;">
                    <col style="width: 150px;">
                    <col style="width: 104px;">
                    <col style="width: 80px;">
                    <col style="width: 80px;">
                </colgroup>
                <thead class="news-center-table-head">
                    <tr>
                        <th>후기 번호</th>
                        <th>단체명</th>
                        <th>내 별점</th>
                        <th>작성일</th>
                        <th>수정</th>
                        <th>삭제</th>
                    </tr>
                </thead>
                <tbody class="news-center-table-body">
                </tbody>
            </table>
        `;
    }

    const tbody = reviewList.querySelector(".news-center-table-body");

    // 다음 아이템들 가져오기
    const nextItems = reviews.slice(currentReviewIndex, currentReviewIndex + reviewItemsPerLoad);

    // 리뷰 아이템을 HTML 문자열로 생성
    const reviewRows = nextItems
        .map(
            (review) => `
                <tr class="news-data-rows" data-forloop="${review.id}">
                    <td class="news-center-table-body-number">${review.id}</td>
                    <td class="news-center-table-body-category">${review.vtGroupName}</td>
                    <td class="news-center-table-body-title">
                        <span>${review.reviewStarRate}</span>
                    </td>
                    <td class="news-center-table-body-date">
                        ${new Date(review.createdDate).toLocaleDateString('ko-KR')}
                    </td>
                    <td>
                        <button class="edit-button" data-id="${review.id}">수정</button>
                    </td>
                    <td>
                        <button class="delete-button" data-id="${review.id}">삭제</button>
                    </td>
                </tr>
            `
        )
        .join("");

    // 생성된 HTML을 tbody에 추가
    tbody.innerHTML += reviewRows;

    currentReviewIndex += reviewItemsPerLoad;

    // 총 개수 업데이트
    document.getElementById("postscript-totalCount").textContent = reviews.length;

    // 버튼 이벤트 리스너 추가
    attachReviewButtonEvents();
};

// 후기 섹션 초기화 및 이벤트 리스너 설정
const initializeReviewsSection = (memberId) => {
    fetchReviews(memberId);

    // 후기 섹션의 컨테이너 선택
    const reviewContainer = document.querySelector(".postscript-list");

    // 스크롤 이벤트 리스너 추가
    reviewContainer.addEventListener("scroll", () => {
        const { scrollTop, scrollHeight, clientHeight } = reviewContainer;
        if (scrollTop + clientHeight >= scrollHeight - 5) {
            if (currentReviewIndex < reviews.length) {
                renderNextReviews();
            }
        }
    });

    // 후기 섹션의 toggle 요소 선택
    const reviewToggleElements = document.querySelectorAll("#postscript .fItXBi.toggle");

    // 각 toggle 요소에 이벤트 리스너 추가
    reviewToggleElements.forEach(function (element) {
        element.addEventListener("click", function () {
            // 모든 요소에서 active 클래스 제거
            reviewToggleElements.forEach(function (el) {
                el.classList.remove("active");
            });

            // 클릭된 요소에만 active 클래스 추가
            this.classList.add("active");
        });
    });

    // 필터 이벤트 설정
    document.getElementById("filter-1year-review").addEventListener("change", () => applyFilterReviews(memberId, 12));
    document.getElementById("filter-1month-review").addEventListener("change", () => applyFilterReviews(memberId, 1));
    document.getElementById("filter-3months-review").addEventListener("change", () => applyFilterReviews(memberId, 3));
    document.getElementById("filter-6months-review").addEventListener("change", () => applyFilterReviews(memberId, 6));

    // 초기화 버튼 이벤트 설정
    document.getElementById("Initialization-review").addEventListener("click", () => {
        // 모든 필터 체크박스 해제
        document.querySelectorAll("#postscript .fItXBi.toggle input[type='checkbox']").forEach((checkbox) => {
            checkbox.checked = false;
        });

        // active 클래스 제거
        reviewToggleElements.forEach((el) => el.classList.remove("active"));

        // 상태 변수 초기화
        currentReviewIndex = 0;
        reviews = [];
        document.querySelector(".postscript-list").innerHTML = '';

        // 후기 데이터 다시 가져오기
        fetchReviews(memberId);
    });
};

// 후기 내역 가져오기
const fetchReviews = async (memberId) => {
    try {
        const response = await fetch(`/review/my-review/${memberId}`);
        if (!response.ok) throw new Error("서버로부터 데이터를 가져오는 데 실패했습니다.");

        reviews = await response.json();
        console.log("후기 데이터:", reviews);

        // 상태 변수 초기화
        currentReviewIndex = 0;
        document.querySelector(".postscript-list").innerHTML = '';

        // 초기 렌더링
        renderNextReviews();
    } catch (error) {
        console.error("Error fetching review records:", error);
        alert("후기 내역을 불러오는 데 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.");
    }
};

// 후기 수정 및 삭제 버튼 이벤트 리스너 설정
const attachReviewButtonEvents = () => {
    const reviewList = document.querySelector(".postscript-list");

    // 이벤트 위임 사용
    reviewList.addEventListener("click", async (event) => {
        const target = event.target;

        if (target.classList.contains("edit-button")) {
            const reviewId = target.dataset.id;
            window.location.href = `/review/review-update?postId=${reviewId}`;
        }

        if (target.classList.contains("delete-button")) {
            const reviewId = target.dataset.id;
            if (confirm("정말 이 후기를 삭제하시겠습니까?")) {
                try {
                    const response = await fetch('/review/review-delete', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ postId: reviewId }),
                    });


                    if (response.ok) {
                        alert("후기가 성공적으로 삭제되었습니다.");
                        reviews = reviews.filter((review) => review.id !== parseInt(reviewId));
                        currentReviewIndex = 0;
                        document.querySelector(".postscript-list").innerHTML = '';
                        renderNextReviews();
                    } else {
                        throw new Error("후기 삭제에 실패했습니다.");
                    }
                } catch (error) {
                    console.error("후기 삭제 중 오류 발생:", error);
                    alert("후기 삭제에 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.");
                }
            }
        }
    });
};

// 특정 기간의 후기 내역 가져오기 (필터 적용)
const applyFilterReviews = async (memberId, months) => {
    const today = new Date();
    const startDate = new Date();
    startDate.setMonth(today.getMonth() - months);
    const formattedStartDate = startDate.toISOString().split("T")[0];
    const formattedEndDate = today.toISOString().split("T")[0];

    console.log(`applyFilterReviews 호출됨. memberId: ${memberId}, startDate: ${formattedStartDate}, endDate: ${formattedEndDate}`);

    try {
        const response = await fetch(
            `/review/my-review/${memberId}?startDate=${formattedStartDate}&endDate=${formattedEndDate}`
        );
        if (!response.ok) throw new Error("서버로부터 데이터를 가져오는 데 실패했습니다.");

        reviews = await response.json();
        console.log("필터된 후기 데이터:", reviews);

        // 상태 변수 초기화
        currentReviewIndex = 0;
        document.querySelector(".postscript-list").innerHTML = '';

        // 초기 렌더링
        renderNextReviews();
    } catch (error) {
        console.error("Error fetching filtered review records:", error);
        alert("후기 내역을 불러오는 데 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.");
    }
};

// 날짜 지정 시 후기 내역 조회
const updateDateRangeReviews = async () => {
    const startDate = document.getElementById("start-date-review").value;
    const endDate = document.getElementById("end-date-review").value;
    const memberId = await getMemberInfo();

    console.log(`updateDateRangeReviews 호출됨. startDate: ${startDate}, endDate: ${endDate}, memberId: ${memberId}`);

    if (startDate && endDate) {
        try {
            const response = await fetch(
                `/review/my-review/${memberId}?startDate=${startDate}&endDate=${endDate}`
            );
            if (!response.ok) throw new Error("서버로부터 데이터를 가져오는 데 실패했습니다.");

            reviews = await response.json();
            console.log("날짜로 필터된 후기 데이터:", reviews);

            // 상태 변수 초기화
            currentReviewIndex = 0;
            document.querySelector(".postscript-list").innerHTML = '';

            // 초기 렌더링
            renderNextReviews();
        } catch (error) {
            console.error("Error fetching date-filtered review records:", error);
            alert("후기 내역을 불러오는 데 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.");
        }
    }
};
/*********************기부 섹션**********************/
// 기부 내역 렌더링
const renderDonations = (donations) => {
    const donationList = document.querySelector(".donation-list");
    const emptyComponent = document.querySelector("#donation .empty-component");

    if (donations.length === 0) {
        donationList.style.display = "none";
        emptyComponent.style.display = "block";
    } else {
        donationList.style.display = "block";
        emptyComponent.style.display = "none";
        donationList.innerHTML = `
            <table class="news-center-table" style="margin-top: 0; margin-bottom: 20px;">
                <colgroup>
                    <col style="width: 57px;">
                    <col style="width: 132px;">
                    <col style="width: 150px;">
                    <col style="width: 104px;">
                </colgroup>
                <thead class="news-center-table-head">
                    <tr>
                        <th>기부 번호</th>
                        <th>구분</th>
                        <th>금액</th>
                        <th>기부일</th>
                    </tr>
                </thead>
                <tbody class="news-center-table-body">
                    ${donations
            .map(
                (donation) => `
                        <tr class="news-data-rows" data-forloop="${donation.id}">
                            <td class="news-center-table-body-number">${donation.id}</td>
                            <td class="news-center-table-body-category">기부 완료</td>
                            <td class="news-center-table-body-title">
                                <span>${parseInt(donation.donationAmount).toLocaleString()} 원</span>
                            </td>
                            <td class="news-center-table-body-date">
                                ${new Date(donation.createdDate).toLocaleDateString('ko-KR')}
                            </td>
                        </tr>
                    `
            )
            .join("")}
                </tbody>
            </table>
        `;
    }

    document.getElementById("donation-totalCount").textContent = donations.length;
};

// 기부 섹션 초기화 및 이벤트 리스너 설정
const initializeDonationSection = (memberId) => {
    fetchDonations(memberId);

    // 기부 섹션의 toggle 요소 선택
    const donationToggleElements = document.querySelectorAll("#donation .fItXBi.toggle");

    // 각 toggle 요소에 이벤트 리스너 추가
    donationToggleElements.forEach(function (element) {
        element.addEventListener("click", function () {
            // 모든 요소에서 active 클래스 제거
            donationToggleElements.forEach(function (el) {
                el.classList.remove("active");
            });

            // 클릭된 요소에만 active 클래스 추가
            this.classList.add("active");
        });
    });

    // 필터 이벤트 설정
    document.getElementById("filter-1year-donation").addEventListener("change", () => applyFilterDonations(memberId, 12));
    document.getElementById("filter-1months-donation").addEventListener("change", () => applyFilterDonations(memberId, 1));
    document.getElementById("filter-3months-donation").addEventListener("change", () => applyFilterDonations(memberId, 3));
    document.getElementById("filter-6months-donation").addEventListener("change", () => applyFilterDonations(memberId, 6));

    // 초기화 버튼 이벤트 설정
    document.getElementById("Initialization-donation").addEventListener("click", () => {
        // 모든 필터 체크박스 해제
        document.querySelectorAll("#donation .fItXBi.toggle input[type='checkbox']").forEach((checkbox) => {
            checkbox.checked = false;
        });

        // active 클래스 제거
        donationToggleElements.forEach((el) => el.classList.remove("active"));

        // 초기 상태로 기부 내역 다시 가져오기
        fetchDonations(memberId);
    });
};

// 특정 기간의 기부 내역 가져오기
const applyFilterDonations = async (memberId, months) => {
    const today = new Date();
    const startDate = new Date(today.setMonth(today.getMonth() - months)).toISOString().split("T")[0];
    const endDate = new Date().toISOString().split("T")[0];

    console.log(`applyFilterDonations 호출됨. memberId: ${memberId}, startDate: ${startDate}, endDate: ${endDate}`);
    await fetchFilteredDonations(memberId, startDate, endDate);
};

// 날짜 지정 시 기부 내역 조회
const updateDateRangeDonations = async () => {
    const startDate = document.getElementById("start-date-donation").value;
    const endDate = document.getElementById("end-date-donation").value;
    const memberId = await getMemberInfo();

    console.log(`updateDateRangeDonations 호출됨. startDate: ${startDate}, endDate: ${endDate}, memberId: ${memberId}`);

    if (startDate && endDate) {
        await fetchFilteredDonations(memberId, startDate, endDate);
    }
};

// 필터된 기부 내역 가져오기
const fetchFilteredDonations = async (memberId, startDate, endDate) => {
    try {
        const response = await fetch(
            `/donation-records/my-donation/${memberId}?startDate=${startDate}&endDate=${endDate}`
        );
        console.log("응답 상태:", response.status);
        if (!response.ok) throw new Error("서버로부터 데이터를 가져오는 데 실패했습니다.");

        const data = await response.json();
        console.log("필터된 기부 데이터:", data);
        renderDonations(data);
    } catch (error) {
        console.error("Error fetching filtered donation records:", error);
        alert("기부 내역을 불러오는 데 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.");
    }
};

// 기부 내역 가져오기
const fetchDonations = async (memberId) => {
    try {
        const response = await fetch(`/donation-records/my-donation/${memberId}`);
        console.log("응답 상태:", response.status);
        if (!response.ok) throw new Error("서버로부터 데이터를 가져오는 데 실패했습니다.");

        const data = await response.json();
        console.log("기부 데이터:", data);
        renderDonations(data);
    } catch (error) {
        console.error("Error fetching donation records:", error);
        alert("기부 내역을 불러오는 데 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.");
    }
};

/********************* 기부 감사 인사 *********************/

// 기부 감사 인사 내역 렌더링
const renderDonationPosts = (posts) => {
    const gratitudeList = document.querySelector(".gratitude-list");
    const emptyComponent = document.querySelector("#gratitude .empty-component");

    if (posts.length === 0) {
        gratitudeList.style.display = "none";
        emptyComponent.style.display = "block";
    } else {
        gratitudeList.style.display = "block";
        emptyComponent.style.display = "none";
        gratitudeList.innerHTML = `
            <table class="news-center-table" style="margin-top: 0; margin-bottom: 20px;">
                <colgroup>
                    <col style="width: 57px;">
                    <col style="width: 132px;">
                    <col style="width: 150px;">
                    <col style="width: 104px;">
                </colgroup>
                <thead class="news-center-table-head">
                    <tr>
                        <th>게시글 번호</th>
                        <th>제목</th>
                        <th>기부내용</th>
                        <th>작성일</th>
                    </tr>
                </thead>
                <tbody class="news-center-table-body">
                    ${posts
            .map(
                (post) => `
                            <tr class="news-data-rows" data-forloop="${post.id}">
                                <td class="news-center-table-body-number">${post.id}</td>
                                <td class="news-center-table-body-category">${post.postTitle}</td>
                                <td class="news-center-table-body-title">${post.postContent}</td>
                                <td class="news-center-table-body-date">${new Date(post.createdDate).toLocaleDateString('ko-KR')}</td>
                            </tr>
                        `
            )
            .join("")}
                </tbody>
            </table>
        `;
    }

    document.getElementById("gratitude-totalCount").textContent = posts.length;
};

// 특정 기간의 기부 감사 인사 내역 가져오기
const applyFilterDonationPosts = async (memberId, months) => {
    const today = new Date();
    const startDate = new Date(today.setMonth(today.getMonth() - months)).toISOString().split("T")[0];
    const endDate = new Date().toISOString().split("T")[0];

    console.log(`applyFilterDonationPosts 호출됨. memberId: ${memberId}, startDate: ${startDate}, endDate: ${endDate}`);
    await fetchFilteredDonationPosts(memberId, startDate, endDate);
};

// 날짜 지정 시 기부 감사 인사 내역 조회
const updateDateRangeDonationPosts = async () => {
    const startDate = document.getElementById("start-date-gratitude").value;
    const endDate = document.getElementById("end-date-gratitude").value;
    const memberId = await getMemberInfo();

    console.log(`updateDateRangeDonationPosts 호출됨. startDate: ${startDate}, endDate: ${endDate}, memberId: ${memberId}`);

    if (startDate && endDate) {
        await fetchFilteredDonationPosts(memberId, startDate, endDate);
    }
};

// 필터된 기부 감사 인사 내역 가져오기
const fetchFilteredDonationPosts = async (memberId, startDate, endDate) => {
    try {
        const response = await fetch(
            `/donation/my-posts/${memberId}?startDate=${startDate}&endDate=${endDate}`
        );
        console.log("응답 상태:", response.status);
        if (!response.ok) throw new Error("서버로부터 데이터를 가져오는 데 실패했습니다.");

        const data = await response.json();
        console.log("필터된 기부 감사 인사 데이터:", data);
        renderDonationPosts(data);
    } catch (error) {
        console.error("Error fetching filtered donation posts:", error);
        alert("기부 감사 인사 내역을 불러오는 데 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.");
    }
};

// 기부 감사 인사 내역 가져오기
const fetchDonationPosts = async (memberId) => {
    try {
        const response = await fetch(`/donation/my-posts/${memberId}`);
        console.log("응답 상태:", response.status);
        if (!response.ok) throw new Error("서버로부터 데이터를 가져오는 데 실패했습니다.");

        const data = await response.json();
        console.log("기부 감사 인사 데이터:", data);
        renderDonationPosts(data);
    } catch (error) {
        console.error("Error fetching donation posts:", error);
        alert("기부 감사 인사 내역을 불러오는 데 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.");
    }
};

// 기부 감사 인사 섹션 초기화 및 이벤트 리스너 설정
const initializeDonationPostSection = (memberId) => {
    fetchDonationPosts(memberId);

    const gratitudeToggleElements = document.querySelectorAll("#gratitude .fItXBi.toggle");

    gratitudeToggleElements.forEach((element) => {
        element.addEventListener("click", function () {
            gratitudeToggleElements.forEach((el) => el.classList.remove("active"));
            this.classList.add("active");
        });
    });

    document.getElementById("filter-1year-gratitude").addEventListener("change", () => applyFilterDonationPosts(memberId, 12));
    document.getElementById("filter-1month-gratitude").addEventListener("change", () => applyFilterDonationPosts(memberId, 1));
    document.getElementById("filter-3months-gratitude").addEventListener("change", () => applyFilterDonationPosts(memberId, 3));
    document.getElementById("filter-6months-gratitude").addEventListener("change", () => applyFilterDonationPosts(memberId, 6));

    document.getElementById("Initialization-gratitude").addEventListener("click", () => {
        document.querySelectorAll("#gratitude .fItXBi.toggle input[type='checkbox']").forEach((checkbox) => {
            checkbox.checked = false;
        });

        gratitudeToggleElements.forEach((el) => el.classList.remove("active"));
        fetchDonationPosts(memberId);
    });
};
/********************* 내 문의 *********************/
// 문의 내역 렌더링
const renderInquiries = (inquiries) => {
    const inquiryList = document.querySelector(".inquiry-list");
    const emptyComponent = document.querySelector("#inquiry .empty-component");

    if (inquiries.length === 0) {
        inquiryList.style.display = "none";
        emptyComponent.style.display = "block";
    } else {
        inquiryList.style.display = "block";
        emptyComponent.style.display = "none";
        inquiryList.innerHTML = `
            <table class="news-center-table" style="margin-top: 0; margin-bottom: 20px;">
                <colgroup>
                    <col style="width: 57px;">
                    <col style="width: 150px;">
                    <col style="width: 104px;">
                    <col style="width: 80px;">
                </colgroup>
                <thead class="news-center-table-head">
                    <tr>
                        <th>문의 번호</th>
                        <th>제목</th>
                        <th>작성일</th>
                        <th>상태</th>
                    </tr>
                </thead>
                <tbody class="news-center-table-body">
                    ${inquiries
            .map(
                (inquiry) => `
                                <tr class="news-data-rows" data-forloop="${inquiry.id}">
                                    <td class="news-center-table-body-number">${inquiry.id}</td>
                                    <td class="news-center-table-body-title">${inquiry.postTitle}</td>
                                    <td class="news-center-table-body-date">
                                        ${new Date(inquiry.createdDate).toLocaleDateString('ko-KR')}
                                    </td>
                                    <td class="news-center-table-body-status">${inquiry.inquiryStatus}</td>
                                </tr>
                            `
            )
            .join("")}
                </tbody>
            </table>
        `;
    }

    document.getElementById("inquiry-totalCount").textContent = inquiries.length;
};

// 문의 섹션 초기화 및 이벤트 리스너 설정
const initializeInquirySection = (memberId) => {
    fetchInquiries(memberId);

    // 문의 섹션의 toggle 요소 선택
    const inquiryToggleElements = document.querySelectorAll("#inquiry .fItXBi.toggle");

    // 각 toggle 요소에 이벤트 리스너 추가
    inquiryToggleElements.forEach(function (element) {
        element.addEventListener("click", function () {
            // 모든 요소에서 active 클래스 제거
            inquiryToggleElements.forEach(function (el) {
                el.classList.remove("active");
            });

            // 클릭된 요소에만 active 클래스 추가
            this.classList.add("active");
        });
    });

    // 필터 이벤트 설정
    document.getElementById("filter-1year-inquiry").addEventListener("change", () => applyFilterInquiries(memberId, 12));
    document.getElementById("filter-1month-inquiry").addEventListener("change", () => applyFilterInquiries(memberId, 1));
    document.getElementById("filter-3months-inquiry").addEventListener("change", () => applyFilterInquiries(memberId, 3));
    document.getElementById("filter-6months-inquiry").addEventListener("change", () => applyFilterInquiries(memberId, 6));

    // 초기화 버튼 이벤트 설정
    document.getElementById("Initialization-inquiry").addEventListener("click", () => {
        // 모든 필터 체크박스 해제
        document.querySelectorAll("#inquiry .fItXBi.toggle input[type='checkbox']").forEach((checkbox) => {
            checkbox.checked = false;
        });

        // active 클래스 제거
        inquiryToggleElements.forEach((el) => el.classList.remove("active"));

        // 초기 상태로 문의 내역 다시 가져오기
        fetchInquiries(memberId);
    });
};
// 문의 내역 가져오기
const fetchInquiries = async (memberId) => {
    try {
        const response = await fetch(`/my-inquirys/${memberId}`);
        console.log("응답 상태:", response.status);
        if (!response.ok) throw new Error("서버로부터 데이터를 가져오는 데 실패했습니다.");

        const data = await response.json();
        console.log("문의 데이터:", data);
        renderInquiries(data);
    } catch (error) {
        console.error("Error fetching inquiries:", error);
        alert("문의 내역을 불러오는 데 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.");
    }
};

// 필터된 문의 내역 가져오기
const fetchFilteredInquiries = async (memberId, startDate, endDate) => {
    try {
        const response = await fetch(
            `/inquiry/my-inquirys/${memberId}?startDate=${startDate}&endDate=${endDate}`
        );
        console.log("응답 상태:", response.status);
        if (!response.ok) throw new Error("서버로부터 데이터를 가져오는 데 실패했습니다.");

        const data = await response.json();
        console.log("필터된 문의 데이터:", data);
        renderInquiries(data);
    } catch (error) {
        console.error("Error fetching filtered inquiries:", error);
        alert("문의 내역을 불러오는 데 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.");
    }
};
// 특정 기간의 문의 내역 가져오기
const applyFilterInquiries = async (memberId, months) => {
    const today = new Date();
    const startDate = new Date(today.setMonth(today.getMonth() - months)).toISOString().split("T")[0];
    const endDate = new Date().toISOString().split("T")[0];

    console.log(`applyFilterInquiries 호출됨. memberId: ${memberId}, startDate: ${startDate}, endDate: ${endDate}`);
    await fetchFilteredInquiries(memberId, startDate, endDate);
};
// 날짜 지정 시 문의 내역 조회
const updateDateRangeInquiries = async () => {
    const startDate = document.getElementById("start-date-inquiry").value;
    const endDate = document.getElementById("end-date-inquiry").value;
    const memberId = await getMemberInfo();

    console.log(`updateDateRangeInquiries 호출됨. startDate: ${startDate}, endDate: ${endDate}, memberId: ${memberId}`);

    if (startDate && endDate) {
        await fetchFilteredInquiries(memberId, startDate, endDate);
    }
};

/*********************후원 내역*********************/
const renderBoostRecords = (boostRecords) => {
    const boostRecordList = document.querySelector(".boost-list");
    const emptyComponent = document.querySelector("#boost .empty-component");

    if (boostRecords.length === 0) {
        boostRecordList.style.display = "none";
        emptyComponent.style.display = "block";
    } else {
        boostRecordList.style.display = "block";
        emptyComponent.style.display = "none";
        boostRecordList.innerHTML = `
            <table class="news-center-table" style="margin-top: 0; margin-bottom: 20px;">
                <colgroup>
                    <col style="width: 57px;">
                    <col style="width: 132px;">
                    <col style="width: 150px;">
                    <col style="width: 104px;">
                </colgroup>
                <thead class="news-center-table-head">
                    <tr>
                        <th>후원 번호</th>
                        <th>구분</th>
                        <th>금액</th>
                        <th>기부일</th>
                    </tr>
                </thead>
                <tbody class="news-center-table-body">
                    ${boostRecords.map(record => `
                        <tr class="news-data-rows" data-forloop="${record.id}">
                            <td class="news-center-table-body-number">${record.id}</td>
                            <td class="news-center-table-body-title">후원 완료</td>
                            <td class="news-center-table-body-status">${record.supportAmount.toLocaleString()} 정</td>
                            <td class="news-center-table-body-date">${new Date(record.createdDate).toLocaleDateString('ko-KR')}</td>
                        </tr>`).join('')}
                </tbody>
            </table>
        `;
    }

    document.getElementById("boost-totalCount").textContent = boostRecords.length;
};

/********************* 후원 내역 초기화 및 이벤트 리스너 설정 *********************/
const initializeBoostRecordSection = (memberId) => {
    fetchBoostRecords(memberId);

    const boostToggleElements = document.querySelectorAll("#boost .fItXBi.toggle");

    boostToggleElements.forEach(element => {
        element.addEventListener("click", () => {
            boostToggleElements.forEach(el => el.classList.remove("active"));
            element.classList.add("active");
        });
    });

    document.getElementById("filter-1year-boost").addEventListener("change", () => applyFilterBoostRecords(memberId, 12));
    document.getElementById("filter-1month-boost").addEventListener("change", () => applyFilterBoostRecords(memberId, 1));
    document.getElementById("filter-3months-boost").addEventListener("change", () => applyFilterBoostRecords(memberId, 3));
    document.getElementById("filter-6months-boost").addEventListener("change", () => applyFilterBoostRecords(memberId, 6));

    document.getElementById("Initialization-boost").addEventListener("click", () => {
        boostToggleElements.forEach(el => el.classList.remove("active"));
        fetchBoostRecords(memberId);
    });
};

/********************* 필터된 후원 내역 가져오기 *********************/
const applyFilterBoostRecords = async (memberId, months) => {
    const today = new Date();
    const startDate = new Date(today.setMonth(today.getMonth() - months)).toISOString().split("T")[0];
    const endDate = new Date().toISOString().split("T")[0];

    console.log(`applyFilterBoostRecords 호출됨. memberId: ${memberId}, startDate: ${startDate}, endDate: ${endDate}`);
    await fetchFilteredBoostRecords(memberId, startDate, endDate);
};

/********************* 날짜 지정 후 후원 내역 조회 *********************/
const updateDateRangeBoostRecords = async () => {
    const startDate = document.getElementById("start-date-boost").value;
    const endDate = document.getElementById("end-date-boost").value;
    const memberId = await getMemberInfo();

    console.log(`updateDateRangeBoostRecords 호출됨. startDate: ${startDate}, endDate: ${endDate}, memberId: ${memberId}`);

    if (startDate && endDate) {
        await fetchFilteredBoostRecords(memberId, startDate, endDate);
    }
};

/********************* 후원 내역 데이터 가져오기 함수들 *********************/
// 전체 후원 내역 가져오기
const fetchBoostRecords = async (memberId) => {
    try {
        const response = await fetch(`/support-records/my-support/${memberId}`);
        if (!response.ok) throw new Error("서버에서 데이터를 가져오는 데 실패했습니다.");

        const data = await response.json();
        console.log("후원 내역 데이터:", data);
        renderBoostRecords(data);
    } catch (error) {
        console.error("후원 내역 불러오기 오류:", error);
        alert("후원 내역을 불러오는 중 문제가 발생했습니다.");
    }
};

// 필터된 후원 내역 가져오기
const fetchFilteredBoostRecords = async (memberId, startDate, endDate) => {
    try {
        const response = await fetch(`/support-records/my-support/${memberId}?startDate=${startDate}&endDate=${endDate}`);
        if (!response.ok) throw new Error("서버에서 데이터를 가져오는 데 실패했습니다.");

        const data = await response.json();
        console.log("필터된 후원 내역 데이터:", data);
        renderBoostRecords(data);
    } catch (error) {
        console.error("후원 내역 필터 조회 오류:", error);
        alert("후원 내역을 불러오는 중 문제가 발생했습니다.");
    }
};

/*********************봉사 활동 내역 섹션*********************/

// 봉사 활동 내역 렌더링
const renderVolunteers = (volunteers) => {
    const volunteerList = document.querySelector("#volunteer-record .volunteer-list");
    const emptyComponent = document.querySelector("#volunteer-record .empty-component");

    if (volunteers.length === 0) {
        volunteerList.style.display = "none";
        emptyComponent.style.display = "block";
    } else {
        volunteerList.style.display = "block";
        emptyComponent.style.display = "none";
        volunteerList.innerHTML = `
            <table class="news-center-table" style="margin-top: 0; margin-bottom: 20px;">
                <colgroup>
                    <col style="width: 57px;">
                    <col style="width: 132px;">
                    <col style="width: 150px;">
                    <col style="width: 150px;"> <!-- postTitle 컬럼 추가 -->
                </colgroup>
                <thead class="news-center-table-head">
                    <tr>
                        <th>활동 번호</th>
                        <th>게시글 제목</th> 
                        <th>봉사 시간</th>
                        <th>신청일</th>
                    </tr>
                </thead>
                <tbody class="news-center-table-body">
                    ${volunteers.map(volunteer => `
                        <tr class="news-data-rows" data-forloop="${volunteer.id}">
                            <td class="news-center-table-body-number">${volunteer.id}</td>
                            <td class="news-center-table-body-postTitle">
                                ${volunteer.postTitle ? volunteer.postTitle : "제목 없음"}
                            </td>
                            <td class="news-center-table-body-title">
                                <span>${volunteer.vtTime} 시간</span>
                            </td>
                            <td class="news-center-table-body-date">
                                ${new Date(volunteer.createdDate).toLocaleDateString('ko-KR')}
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    }

    document.getElementById("volunteer-totalCount").textContent = volunteers.length;
};


// 봉사 활동 내역 초기화 및 이벤트 리스너 설정
const initializeVolunteerSection = (memberId) => {
    fetchVolunteerRecords(memberId);

    // 봉사 활동 섹션의 toggle 요소 선택
    const volunteerToggleElements = document.querySelectorAll("#volunteer-record .fItXBi.toggle");

    // 각 toggle 요소에 이벤트 리스너 추가
    volunteerToggleElements.forEach(function (element) {
        element.addEventListener("click", function () {
            // 모든 요소에서 active 클래스 제거
            volunteerToggleElements.forEach(function (el) {
                el.classList.remove("active");
            });

            // 클릭된 요소에만 active 클래스 추가
            this.classList.add("active");
        });
    });

    // 필터 이벤트 설정
    document.getElementById("filter-1year-volunteer").addEventListener("change", () => applyFilterVolunteerRecords(memberId, 12));
    document.getElementById("filter-1month-volunteer").addEventListener("change", () => applyFilterVolunteerRecords(memberId, 1));
    document.getElementById("filter-3months-volunteer").addEventListener("change", () => applyFilterVolunteerRecords(memberId, 3));
    document.getElementById("filter-6months-volunteer").addEventListener("change", () => applyFilterVolunteerRecords(memberId, 6));

    // 초기화 버튼 이벤트 설정
    document.getElementById("Initialization-volunteer").addEventListener("click", () => {
        // 모든 필터 체크박스 해제
        document.querySelectorAll("#volunteer-record .fItXBi.toggle input[type='checkbox']").forEach((checkbox) => {
            checkbox.checked = false;
        });

        // active 클래스 제거
        volunteerToggleElements.forEach((el) => el.classList.remove("active"));

        // 초기 상태로 봉사 활동 내역 다시 가져오기
        fetchVolunteerRecords(memberId);
    });
};

// 특정 기간의 봉사 활동 내역 가져오기
const applyFilterVolunteerRecords = async (memberId, months) => {
    const today = new Date();
    const startDate = new Date(today.setMonth(today.getMonth() - months)).toISOString().split("T")[0];
    const endDate = new Date().toISOString().split("T")[0];

    console.log(`applyFilterVolunteerRecords 호출됨. memberId: ${memberId}, startDate: ${startDate}, endDate: ${endDate}`);
    await fetchFilteredVolunteerRecords(memberId, startDate, endDate);
};

// 날짜 지정 시 봉사 활동 내역 조회
const updateDateRangeVolunteers = async () => {
    const startDate = document.getElementById("start-date-volunteer").value;
    const endDate = document.getElementById("end-date-volunteer").value;
    const memberId = await getMemberInfo();

    console.log(`updateDateRangeVolunteers 호출됨. startDate: ${startDate}, endDate: ${endDate}, memberId: ${memberId}`);

    if (startDate && endDate) {
        await fetchFilteredVolunteerRecords(memberId, startDate, endDate);
    }
};

// 전체 봉사 활동 내역 가져오기
const fetchVolunteerRecords = async (memberId) => {
    try {
        const response = await fetch(`/vt-records/my-vt-record/${memberId}`);
        console.log("응답 상태:", response.status);
        if (!response.ok) throw new Error("서버로부터 데이터를 가져오는 데 실패했습니다.");

        const data = await response.json();
        console.log("봉사 활동 내역 데이터:", data);
        renderVolunteers(data);
    } catch (error) {
        console.error("봉사 활동 내역 불러오기 오류:", error);
        alert("봉사 활동 내역을 불러오는 중 문제가 발생했습니다.");
    }
};

// 필터된 봉사 활동 내역 가져오기
const fetchFilteredVolunteerRecords = async (memberId, startDate, endDate) => {
    try {
        const response = await fetch(`/vt-records/my-vt-record/${memberId}?startDate=${startDate}&endDate=${endDate}`);
        console.log("응답 상태:", response.status);
        if (!response.ok) throw new Error("서버로부터 데이터를 가져오는 데 실패했습니다.");

        const data = await response.json();
        console.log("필터된 봉사 활동 내역 데이터:", data);
        renderVolunteers(data);
    } catch (error) {
        console.error("봉사 활동 내역 필터 조회 오류:", error);
        alert("봉사 활동 내역을 불러오는 중 문제가 발생했습니다.");
    }
};
//*********************봉사 활동 신청 현황 섹연*********************
let currentApplicationId = null;

// 승인 및 거절 모달 이벤트 설정
const setupModalEvents = () => {
    console.log("Setting up modal events...");

    // 승인 모달 닫기 버튼 이벤트
    const approveCloseModal = document.getElementById("approvecloseModal");
    if (approveCloseModal && !approveCloseModal.dataset.listener) {
        approveCloseModal.addEventListener("click", () => {
            console.log("Approve modal closed");
            document.querySelector(".approvemodal").style.display = "none";
            currentApplicationId = null;
        });
        approveCloseModal.dataset.listener = "true"; // 중복 설정 방지
    }

    // 거절 모달 닫기 버튼 이벤트
    const refuseCloseModal = document.getElementById("refusecloseModal");
    if (refuseCloseModal && !refuseCloseModal.dataset.listener) {
        refuseCloseModal.addEventListener("click", () => {
            console.log("Refuse modal closed");
            document.querySelector(".refusemodal").style.display = "none";
            currentApplicationId = null;
        });
        refuseCloseModal.dataset.listener = "true"; // 중복 설정 방지
    }

    // 승인 확인 버튼 이벤트
    const confirmApprove = document.getElementById("confirmApprove");
    if (confirmApprove && !confirmApprove.dataset.listener) {
        confirmApprove.addEventListener("click", async () => {
            if (currentApplicationId) {
                console.log(`Attempting to approve application ID: ${currentApplicationId}`);
                await approveApplication(currentApplicationId);
                document.querySelector(".approvemodal").style.display = "none";
                currentApplicationId = null;
            } else {
                console.warn("No currentApplicationId set");
            }
        });
        confirmApprove.dataset.listener = "true";
    }

    // 거절 확인 버튼 이벤트
    const confirmRefuse = document.getElementById("confirmRefuse");
    if (confirmRefuse && !confirmRefuse.dataset.listener) {
        confirmRefuse.addEventListener("click", async () => {
            if (currentApplicationId) {
                console.log(`Attempting to refuse application ID: ${currentApplicationId}`);
                await refuseApplication(currentApplicationId);
                document.querySelector(".refusemodal").style.display = "none";
                currentApplicationId = null;
            } else {
                console.warn("No currentApplicationId set");
            }
        });
        confirmRefuse.dataset.listener = "true";
    }
};

// 승인 요청 함수
const approveApplication = async (applicationId) => {
    console.log(`Sending approve request for applicationId: ${applicationId}`);
    try {
        const response = await fetch(`/vt-applications/approve/${applicationId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include', // 필요한 경우 활성화
        });

        console.log(`Response status: ${response.status}`);
        if (!response.ok) {
            const errorText = await response.text();
            console.error(`Error response: ${errorText}`);
            throw new Error(`상태 업데이트 실패: ${response.status} - ${errorText}`);
        }

        const result = await response.text();
        console.log(`Update result: ${result}`);
        const memberId = await getMemberInfo(); // 회원 ID를 다시 가져옴
        if (memberId) {
            fetchApplications(memberId);
        }
    } catch (error) {
        console.error("상태 업데이트 중 오류:", error);
        alert(`지원서 승인 중 오류가 발생했습니다. ${error.message}`);
    }
};

// 거절 요청 함수
const refuseApplication = async (applicationId) => {
    console.log(`Sending refuse request for applicationId: ${applicationId}`);
    try {
        const response = await fetch(`/vt-applications/refuse/${applicationId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include', // 필요한 경우 활성화
        });

        console.log(`Response status: ${response.status}`);
        if (!response.ok) {
            const errorText = await response.text();
            console.error(`Error response: ${errorText}`);
            throw new Error(`상태 업데이트 실패: ${response.status} - ${errorText}`);
        }

        const result = await response.text();
        console.log(`Update result: ${result}`);

        const memberId = await getMemberInfo(); // 회원 ID를 다시 가져옴
        if (memberId) {
            fetchApplications(memberId);
        }
    } catch (error) {
        console.error("상태 업데이트 중 오류:", error);
        alert(`지원서 거절 중 오류가 발생했습니다. ${error.message}`);
    }
};

// 신청 내역을 화면에 렌더링하는 함수
const renderApplications = (applications) => {
    const applicationList = document.querySelector("#application-list");
    const emptyComponent = document.querySelector("#application .empty-component");

    if (applications.length === 0) {
        applicationList.style.display = "none";
        emptyComponent.style.display = "block";
    } else {
        applicationList.style.display = "block";
        emptyComponent.style.display = "none";
        applicationList.innerHTML = `
            <table class="news-center-table" style="margin-top: 0; margin-bottom: 20px;">
                <colgroup>
                    <col style="width: 57px;">
                    <col style="width: 132px;">
                    <col style="width: 150px;">
                    <col style="width: 150px;">
                    <col style="width: 100px;">
                    <col style="width: 100px;">
                    <col style="width: 100px;">
                </colgroup>
                <thead class="news-center-table-head">
                    <tr>
                        <th>신청 번호</th>
                        <th>활동 제목</th>
                        <th>신청 상태</th>
                        <th>회원명</th>
                        <th>신청일</th>
                        <th>승인</th>
                        <th>거절</th>
                    </tr>
                </thead>
                <tbody class="news-center-table-body">
                    ${applications.map((application) => `
                        <tr class="news-data-rows" data-id="${application.id}">
                            <td>${application.id}</td>
                            <td>${application.postTitle}</td>
                            <td>${application.applicationStatus}</td>
                            <td>${application.memberName}</td>
                            <td>${new Date(application.applicationDate).toLocaleDateString('ko-KR')}</td>
                            <td>
                                <a href="#" class="jBsNEF btn-request btn-request-case-2 approve-btn" data-id="${application.id}" style="margin-left: 10px;">
                                    <span class="visual-correction">
                                        승인하기
                                        <div class="request-description-tooltip"></div>
                                    </span>
                                </a>
                            </td>
                            <td>
                                <a href="#" class="jBsNEF btn-request btn-request-case-2 refuse-btn" data-id="${application.id}" style="margin-left: 10px;">
                                    <span class="visual-correction">
                                        거절하기
                                        <div class="request-description-tooltip"></div>
                                    </span>
                                </a>
                            </td>
                        </tr>`).join("")}
                </tbody>
            </table>
        `;
    }

    document.getElementById("application-totalCount").textContent = applications.length;

    // 승인 버튼에 이벤트 추가
    document.querySelectorAll(".approve-btn").forEach(button => {
        button.addEventListener("click", (e) => {
            e.preventDefault();
            const applicationId = button.getAttribute("data-id");
            console.log(`Approve button clicked for application ID: ${applicationId}`);
            currentApplicationId = applicationId;
            document.querySelector(".approvemodal").style.display = "flex";
        });
    });

    // 거절 버튼에 이벤트 추가
    document.querySelectorAll(".refuse-btn").forEach(button => {
        button.addEventListener("click", (e) => {
            e.preventDefault();
            const applicationId = button.getAttribute("data-id");
            console.log(`Refuse button clicked for application ID: ${applicationId}`);
            currentApplicationId = applicationId;
            document.querySelector(".refusemodal").style.display = "flex";
        });
    });
};

// 봉사 신청 내역 가져오기 함수
const fetchApplications = async (memberId) => {
    try {
        const response = await fetch(`/vt-applications/application-list/${memberId}`);
        if (!response.ok) throw new Error(`서버로부터 데이터를 가져오는 데 실패했습니다. 상태 코드: ${response.status}`);

        const data = await response.json();
        console.log("봉사 신청 내역 데이터:", data);
        renderApplications(data);
    } catch (error) {
        console.error("봉사 신청 내역을 불러오는 중 오류:", error);
        alert("봉사 신청 내역을 불러오는 데 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.");
    }
};

// 필터된 봉사 신청 내역 가져오기 함수
const applyFilterApplications = async (memberId, startDate, endDate) => {
    try {
        const response = await fetch(`/vt-applications/application-list/${memberId}?startDate=${startDate}&endDate=${endDate}`);
        if (!response.ok) throw new Error("서버로부터 데이터를 가져오는 데 실패했습니다.");

        const applications = await response.json();
        renderApplications(applications);
    } catch (error) {
        console.error("필터된 봉사 신청 내역을 불러오는 중 오류:", error);
        alert("필터된 봉사 신청 내역을 불러오는 중 문제가 발생했습니다.");
    }
};

// 날짜 범위 지정 시 봉사 신청 내역 조회
const updateDateRangeApplications = async () => {
    const startDate = document.getElementById("start-date-application").value;
    const endDate = document.getElementById("end-date-application").value;
    const memberId = await getMemberInfo(); // memberId를 동적으로 가져오도록 수정

    if (startDate && endDate) {
        await applyFilterApplications(memberId, startDate, endDate);
    }
};

// 봉사 신청 내역 초기화 및 이벤트 리스너 설정
const initializeApplicationSection = (memberId) => {
    fetchApplications(memberId);
    setupModalEvents(); // 모달 이벤트 설정

    // 필터 이벤트 설정
    document.getElementById("filter-1year-application").addEventListener("change", () => applyFilterApplications(memberId, getDateMonthsAgo(12), getToday()));
    document.getElementById("filter-1month-application").addEventListener("change", () => applyFilterApplications(memberId, getDateMonthsAgo(1), getToday()));
    document.getElementById("filter-3months-application").addEventListener("change", () => applyFilterApplications(memberId, getDateMonthsAgo(3), getToday()));
    document.getElementById("filter-6months-application").addEventListener("change", () => applyFilterApplications(memberId, getDateMonthsAgo(6), getToday()));

    // 초기화 버튼 이벤트 설정
    document.getElementById("Initialization-application").addEventListener("click", () => {
        document.querySelectorAll("#application .fItXBi.toggle input[type='checkbox']").forEach((checkbox) => {
            checkbox.checked = false;
        });

        fetchApplications(memberId);
    });
};

// 오늘 날짜 반환 함수
const getToday = () => {
    return new Date().toISOString().split("T")[0];
};

// 지정한 개월 수 전의 날짜 반환 함수
const getDateMonthsAgo = (months) => {
    const date = new Date();
    date.setMonth(date.getMonth() - months);
    return date.toISOString().split("T")[0];
};
/*********************결제 내역*********************/
// 결제 내역 렌더링 함수
const renderPayments = (payments) => {
    const paymentList = document.querySelector("#payment-list");
    const emptyComponent = document.querySelector("#payment .empty-component");

    if (payments.length === 0) {
        paymentList.style.display = "none";
        emptyComponent.style.display = "block";
    } else {
        paymentList.style.display = "block";
        emptyComponent.style.display = "none";
        paymentList.innerHTML = `
            <table class="news-center-table" style="margin-top: 0; margin-bottom: 20px;">
                <colgroup>
                    <col style="width: 57px;">
                    <col style="width: 150px;">
                    <col style="width: 104px;">
                    <col style="width: 150px;">
                </colgroup>
                <thead class="news-center-table-head">
                    <tr>
                        <th>결제 번호</th>
                        <th>결제 상태</th>
                        <th>결제 금액</th>
                        <th>결제 일시</th>
                    </tr>
                </thead>
                <tbody class="news-center-table-body">
                </tbody>
            </table>
        `;
        payments.forEach((payment) => {
            let paymentContent = ``;
            if(payment.paymentStatus === ("COMPLETED")) {

                paymentContent = `
                            <tr class="news-data-rows" data-id="${payment.id}">
                                <td>${payment.id}</td>
                                <td>결제 완료</td>
                                <td>${payment.paymentAmount.toLocaleString()} 원</td>
                                <td>${new Date(payment.createdDate).toLocaleDateString('ko-KR')}</td>
                            </tr>`;
            } else {
                paymentContent = `
                            <tr class="news-data-rows" data-id="${payment.id}">
                                <td>${payment.id}</td>
                                <td>결제 취소</td>
                                <td>${payment.paymentAmount.toLocaleString()} 원</td>
                                <td>${new Date(payment.createdDate).toLocaleDateString('ko-KR')}</td>
                            </tr>`;
            }
            paymentList.querySelector("tbody.news-center-table-body").innerHTML += paymentContent;
        })

    }

    document.getElementById("payment-totalCount").textContent = payments.length;
};

// 결제 데이터 가져오기 함수
const fetchPayments = async (memberId) => {
    try {
        const response = await fetch(`/payments/my-payments/${memberId}`);
        if (!response.ok) throw new Error("서버에서 결제 데이터를 가져오는 데 실패했습니다.");

        const data = await response.json();
        console.log("결제 데이터:", data);
        renderPayments(data);
        console.log("ffetch들ㅇ어옴");
    } catch (error) {
        console.error("결제 데이터 불러오기 오류:", error);
        alert("결제 데이터를 불러오는 데 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.");
    }
};

// 가상계좌 잔액 가져오기 함수
const fetchAccountBalance = async (memberId) => {
    try {
        const response = await fetch(`/mypage/account-balance/${memberId}`);
        if (!response.ok) throw new Error("서버에서 가상계좌 데이터를 가져오는데 실패했습니다.");

        const data = await response.json();
        console.log("가상계좌 데이터: ", data);
        accountBalanceWrap.innerText = data + "원";
    } catch (error) {
        console.error("가상계좌 데이터 불러오기 오류: ", error) ;
        alert("가상계좌 데이터를 불러오는데 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.");
    }
}

const initializePaymentSection = (memberId) => {
    fetchPayments(memberId);
    console.log("이니셜들어옴");

    const paymentToggleElements = document.querySelectorAll("#payment .fItXBi.toggle");

    paymentToggleElements.forEach((element) => {
        element.addEventListener("click", function () {
            paymentToggleElements.forEach((el) => el.classList.remove("active"));
            this.classList.add("active");
        });
    });

    // 필터 버튼 이벤트 설정
    document.getElementById("filter-1year-payment").addEventListener("change", () => applyFilterPayments(memberId, 12));
    document.getElementById("filter-1month-payment").addEventListener("change", () => applyFilterPayments(memberId, 1));
    document.getElementById("filter-3months-payment").addEventListener("change", () => applyFilterPayments(memberId, 3));
    document.getElementById("filter-6months-payment").addEventListener("change", () => applyFilterPayments(memberId, 6));

    // 초기화 버튼 이벤트 설정
    document.getElementById("Initialization-payment").addEventListener("click", () => {
        paymentToggleElements.forEach((el) => el.classList.remove("active"));
        fetchPayments(memberId);
    });
};

// 날짜 범위 필터 적용
const updateDateRangePayments = async () => {
    const startDate = document.getElementById("start-date-payments").value;
    const endDate = document.getElementById("end-date-payments").value;
    const memberId = await getMemberInfo();

    console.log(`결제 내역 날짜 범위: 시작일 ${startDate}, 종료일 ${endDate}, 회원 ID: ${memberId}`);

    if (startDate && endDate) {
        await fetchFilteredPayments(memberId, startDate, endDate);
    }
};

const applyFilterPayments = async (memberId, months) => {
    const today = new Date();
    const startDate = new Date(today.setMonth(today.getMonth() - months)).toISOString().split("T")[0];
    const endDate = new Date().toISOString().split("T")[0];

    console.log(`applyFilterPayments 호출됨. memberId: ${memberId}, startDate: ${startDate}, endDate: ${endDate}`);
    await fetchFilteredPayments(memberId, startDate, endDate);
};


// 필터된 결제 데이터 가져오기
const fetchFilteredPayments = async (memberId, startDate, endDate) => {
    try {
        const response = await fetch(`/payments/my-payments/${memberId}?startDate=${startDate}&endDate=${endDate}`);
        if (!response.ok) throw new Error("서버에서 필터된 결제 데이터를 가져오는 데 실패했습니다.");

        const data = await response.json();
        console.log("필터된 결제 데이터:", data);
        renderPayments(data);
    } catch (error) {
        console.error("필터된 결제 데이터 불러오기 오류:", error);
        alert("필터된 결제 데이터를 불러오는 중 문제가 발생했습니다.");
    }
};
/********************* 알림 섹션 **********************/
// 알림 렌더링 함수
// 상태 변수 선언
let alarms = []; // 모든 알림 데이터를 저장할 배열
const alarmItemsPerLoad = 10; // 한 번에 렌더링할 아이템 수
let currentAlarmIndex = 0; // 현재까지 렌더링된 아이템의 인덱스

// 알림 섹션 초기화 및 이벤트 리스너 설정
const initializeAlarmsSection = (memberId) => {
    fetchAllAlarms(memberId);

    // 알림 섹션의 컨테이너 선택
    const alarmContainer = document.querySelector("#notice-list");

    // 스크롤 이벤트 리스너 추가
    alarmContainer.addEventListener("scroll", () => {
        if (alarmContainer.scrollTop + alarmContainer.clientHeight >= alarmContainer.scrollHeight - 10) {
            if (currentAlarmIndex < alarms.length) {
                renderNextAlarms();
            }
        }
    });

    // 필터 이벤트 설정 (필요에 따라 추가)
    // 예: 1년, 6개월, 3개월, 1개월 필터 버튼에 이벤트 리스너 추가

    // 초기화 버튼 이벤트 설정 (필요에 따라 추가)
    // 예: document.getElementById("Initialization-alarm").addEventListener("click", () => { ... });
};

// 전체 알림 데이터 가져오기
const fetchAllAlarms = async (memberId) => {
    try {
        const response = await fetch(`/alarm/mypage-member/${memberId}`);
        if (!response.ok) throw new Error('서버로부터 알림 데이터를 가져오는 데 실패했습니다.');

        alarms = await response.json();
        console.log("알림 데이터:", alarms);

        // 초기 렌더링
        renderNextAlarms();
    } catch (error) {
        console.error("알림 데이터 불러오기 오류:", error);
        alert("알림을 불러오는 중 문제가 발생했습니다.");
    }
};

// 다음 알림 아이템 렌더링
const renderNextAlarms = () => {
    const alarmsList = document.getElementById("notice-list");
    const alarmsEmpty = document.getElementById("alarms-empty");
    const totalCountLabel = document.getElementById("notice-totalCount");

    // 총 개수 업데이트
    totalCountLabel.textContent = alarms.length;

    // 알림이 없을 경우 처리
    if (alarms.length === 0) {
        alarmsEmpty.style.display = 'block';
        alarmsList.style.display = 'none';
        return;
    } else {
        alarmsEmpty.style.display = 'none';
        alarmsList.style.display = 'block';
    }

    // 현재까지의 알림을 렌더링
    const nextItems = alarms.slice(currentAlarmIndex, currentAlarmIndex + alarmItemsPerLoad);

    nextItems.forEach(alarm => {
        const alarmCard = document.createElement('div');
        alarmCard.classList.add('alarm-card');
        alarmCard.style.cursor = 'pointer';

        const notiContentDiv = document.createElement('div');
        notiContentDiv.classList.add('noti-content');

        const kzXcJaDiv = document.createElement('div');
        kzXcJaDiv.classList.add('kzXcJa');

        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttribute("color", "#101C33");
        svg.setAttribute("viewBox", "0 0 24 24");
        svg.setAttribute("class", "cAfwXx");
        svg.innerHTML = `
            <path fill-rule="evenodd" clip-rule="evenodd" d="M15.0389 18.359H17.3334L18.8572 18.359C19.4884 18.359 20 17.8793 20 17.2876C20 16.6958 19.4884 16.2157 18.8572 16.2157H18.4762V9.42955C18.4762 6.00442 15.4496 3 11.9999 3C8.5502 3 5.52366 6.00442 5.52366 9.42955V16.2157H5.14276C4.51119 16.2157 4 16.6958 4 17.2876C4 17.8793 4.51119 18.359 5.14276 18.359L6.66642 18.359H8.96114C9.07945 19.8339 10.3972 21 12 21C13.6028 21 14.9205 19.8339 15.0389 18.359ZM12.7263 18.359H11.2737C11.3718 18.6474 11.6604 18.8571 12 18.8571C12.3396 18.8571 12.6282 18.6474 12.7263 18.359ZM16.1906 16.2157H7.80964V9.42955C7.80964 7.14599 9.76774 5.1429 11.9999 5.1429C14.2321 5.1429 16.1906 7.14599 16.1906 9.42955V16.2157Z"></path>
        `;
        kzXcJaDiv.appendChild(svg);

        const dataDiv = document.createElement('div');
        dataDiv.setAttribute('data-forloop', alarm.id);

        const innerDiv = document.createElement('div');
        const contentDiv = document.createElement('div');
        contentDiv.classList.add('noti-card-desc');
        contentDiv.textContent = alarm.alarmContent;

        let starDiv = null;
        if (!alarm.read) {
            starDiv = document.createElement('div');
            starDiv.classList.add('star');
            starDiv.textContent = '*';
            contentDiv.appendChild(starDiv);
        }

        const dateDiv = document.createElement('div');
        dateDiv.classList.add('noti-card-desc');
        dateDiv.textContent = new Date(alarm.createdDate).toLocaleDateString('ko-KR');

        innerDiv.appendChild(contentDiv);
        innerDiv.appendChild(dateDiv);
        dataDiv.appendChild(innerDiv);
        kzXcJaDiv.appendChild(dataDiv);
        notiContentDiv.appendChild(kzXcJaDiv);
        alarmCard.appendChild(notiContentDiv);

        // 클릭 이벤트
        const postId = typeof alarm.postId === 'number' ? alarm.postId : null;
        alarmCard.addEventListener('click', async () => {
            if (postId) {
                navigateToAlarmPage(alarm.alarmType, postId); // 페이지 이동
            }
            if (!alarm.read && starDiv) {
                await markAlarmAsRead(alarm.id, alarm.alarmType, postId, starDiv); // 읽음 처리
            }
        });

        alarmsList.appendChild(alarmCard);
    });

    currentAlarmIndex += alarmItemsPerLoad;
};

// 알림을 읽음으로 표시하는 함수
const markAlarmAsRead = async (alarmId, alarmType, postId, starDiv) => {
    try {
        const response = await fetch(`/alarm/${alarmId}/read`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ alarmType, postId })
        });

        if (response.ok && starDiv) {
            starDiv.remove();
        }
    } catch (error) {
        console.error('Error marking alarm as read:', error);
    }
};

// 알림 클릭 시 해당 페이지로 이동하는 함수
const navigateToAlarmPage = (alarmType, postId) => {
    let url = '';
    switch (alarmType) {
        case 'vt':
            url = `/volunteer/volunteer-inquiry/${postId}`;
            break;
        case 'donation':
            url = `/donation/donation-inquiry/${postId}`;
            break;
        case 'support':
            url = `/support/support-inquiry/${postId}`;
            break;
        case 'reply':
            url = `/reply/reply-inquiry/${postId}`;
            break;
        default:
            console.warn(`알 수 없는 alarmType: ${alarmType}`);
            return;
    }
    if (url) {
        window.location.href = url;
    }
};
/*********************공통*********************/

// 모든 .fItXBi.toggle 요소를 선택
const toggleElements = document.querySelectorAll(".fItXBi.toggle");

// 각 요소에 대해 클릭 이벤트 추가
toggleElements.forEach(function (element) {
    element.addEventListener("click", function () {
        // 모든 요소에서 active 클래스 제거
        toggleElements.forEach(function (el) {
            el.classList.remove("active");
        });

        // 클릭된 요소에만 active 클래스 추가
        this.classList.add("active");
    });
});

// 모든 탭 요소를 선택합니다.
const tabs = document.querySelectorAll(".tab");

// 각 탭에 클릭 이벤트를 추가합니다.
tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
        // 모든 탭에서 active 클래스를 제거합니다.
        tabs.forEach((t) => t.classList.remove("active"));

        // 클릭된 탭에 active 클래스를 추가합니다.
        tab.classList.add("active");
    });
});

// 사이드 배너 랩 요소 및 lnb-items 선택
const sideBanerWrapElement = document.querySelector(".side-baner-wrap");
const dateButtons = document.querySelectorAll(".date-button .fItXBi.toggle");
const lnbItems = sideBanerWrapElement
    ? sideBanerWrapElement.querySelectorAll(".lnb-item")
    : [];
const tabsContainers = document.querySelectorAll(".bqkLME.tabs");

// 초기화 버튼에 이벤트 리스너 등록
document.body.addEventListener("click", function (event) {
    if (event.target && event.target.id === "Initialization-review") {
        // 후기 섹션 초기화 버튼 클릭 시
        const reviewToggleElements = document.querySelectorAll("#postscript .fItXBi.toggle");
        reviewToggleElements.forEach((el) => el.classList.remove("active"));
    }

    if (event.target && event.target.id === "Initialization-donation") {
        // 기부 섹션 초기화 버튼 클릭 시
        const donationToggleElements = document.querySelectorAll("#donation .fItXBi.toggle");
        donationToggleElements.forEach((el) => el.classList.remove("active"));
    }
    if (event.target && event.target.id === "Initialization-gratitude") {
        // 기부 섹션 초기화 버튼 클릭 시
        const donationToggleElements = document.querySelectorAll("#gratitude .fItXBi.toggle");
        donationToggleElements.forEach((el) => el.classList.remove("active"));
    }
});

// 초기화 버튼 클릭 시 모든 .toggle의 active 클래스만 제거 (lnb-item의 active와 탭의 active는 유지)
dateButtons.forEach((toggleElement) => {
    toggleElement.classList.remove("active");
});

// lnb-item과 관련된 tabsContainer의 첫 번째 탭에 active 추가
if (tabsContainers.length > 0) {
    tabsContainers.forEach((tabsContainer) => {
        const activeLnbItem = Array.from(lnbItems).find((lnbItem) =>
            lnbItem.classList.contains("active")
        );
        if (activeLnbItem) {
            const tabs = tabsContainer.querySelectorAll(".tab");
            tabs.forEach((tab) => tab.classList.remove("active"));
            const firstTab = tabs[0];
            if (firstTab) {
                firstTab.classList.add("active");
            }
        }
    });
}

lnbItems.forEach((lnbItem) => {
    lnbItem.addEventListener("click", () => {
        activateFirstTab(lnbItem);
    });

    const observer = new MutationObserver((mutationsList) => {
        mutationsList.forEach((mutation) => {
            if (
                mutation.type === "attributes" &&
                mutation.attributeName === "class"
            ) {
                // lnb-item이 active 상태로 변경되었을 때 실행
                if (lnbItem.classList.contains("active")) {
                    activateFirstTab(lnbItem);
                }
            }
        });
    });

    // 모든 lnb-item의 class 속성을 감시하도록 설정합니다.
    observer.observe(lnbItem, {
        attributes: true,
        attributeFilter: ["class"],
    });
});

// 활성화된 lnbItem에 대해 첫 번째 탭을 활성화하는 함수
const activateFirstTab = (lnbItem) => {
    const tabsContainer = lnbItem.closest(".side-baner-wrap").querySelector(".bqkLME.tabs");
    if (tabsContainer) {
        const tabs = tabsContainer.querySelectorAll(".tab");
        tabs.forEach((tab) => tab.classList.remove("active"));
        const firstTab = tabs[0];
        if (firstTab) {
            firstTab.classList.add("active");
        }
    }
};

/*********************후기 작성 버튼 이벤트*********************/

// 후기 작성하기 버튼 클릭 시 후기 작성 페이지로 이동
document.addEventListener("click", function (event) {
    if (event.target.closest(".btn-gowrite")) {
        event.preventDefault();
        // 후기 작성 페이지로 이동
        window.location.href = "/donation/donation-write";
    }
});

/*********************페이지 초기화*********************/

document.addEventListener("DOMContentLoaded", async () => {
    try {
        const memberId = await getMemberInfo();

        if (!memberId) {
            alert("로그인이 필요합니다.");
            window.location.href = "/member/login";
            return;
        }

        console.log("사용되는 memberId:", memberId);

        // 후기 섹션 초기화
        initializeReviewsSection(memberId);
        // 기부 섹션 초기화
        initializeDonationSection(memberId);
        //기부 감사 인사 섹션 초기화
        initializeDonationPostSection(memberId);
        //내 문의 섹션 초기화
        initializeInquirySection(memberId);
        //후원 내역 섹션 초기화
        initializeBoostRecordSection(memberId);
        //봉사 활동 내역 섹션 초기화
        initializeVolunteerSection(memberId);
        // 봉사 신청 현황 섹션 초기화
        initializeApplicationSection(memberId);
        // 결제하기 섹션 초기화
        initializePaymentSection(memberId);
        // 내 알림 섹션 초기화
        initializeAlarmsSection(memberId);

    } catch (error) {
        console.error("초기화 중 오류:", error);
        alert("페이지를 불러오는 중 오류가 발생했습니다.");
    }
});
