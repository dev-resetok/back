const sections = document.querySelectorAll("section.admin-page");
const submenus = document.querySelectorAll("a.MenuItems_submenu");
const inquiryButtons = document.querySelectorAll("button.inquiry-button");

// NodeList에 filter 메서드를 추가
NodeList.prototype.filter = Array.prototype.filter;

// 고객센터 문의 목록과 공지사항 목록의 검색어와 페이지를 초기화하는 함수
const resetSearchAndPage = () => {
    inquiryKeyword = ''; // 고객센터 문의 검색어 초기화
    if (inquirySearchInput) inquirySearchInput.value = ''; // 검색 입력 필드 초기화
    // inquiryFilterType = '최신순'; // 또는 기본값으로 설정
    postKeyword='';
    // postFilterType = '작성일 순';
    if(postSearchInput) postSearchInput.value='';
    reportKeyword='';
    // reportFilterType = '신고일 순';
    if(reportSearchInput) reportSearchInput.value='';

};



// 서브메뉴 클릭 시 해당 섹션 표시 및 검색어와 페이지 초기화
submenus.forEach((submenu) => {
    submenu.addEventListener("click", (e) => {
        sections.forEach((section) => {
            section.classList.remove("selected"); // 모든 섹션 선택 해제
        });
        const selectedSection = sections.filter(
            (section) => submenu.textContent === section.dataset.value // 클릭된 서브메뉴와 일치하는 섹션 찾기
        );
        selectedSection[0].classList.add("selected"); // 해당 섹션 선택
        // resetSearchAndPage(); // 검색어와 페이지 초기화


        // 선택된 섹션에 따라 데이터 목록을 처음 페이지로 다시 로드
        if (submenu.textContent === "고객센터 문의 목록") {
            fetchFilteredInquiries(1, inquiryKeyword, inquiryFilterType);
            resetSelectAllInquiriesCheckbox();
        } else if (submenu.textContent === "공지사항 목록") {
            fetchNotices(1,noticeKeyword); // 공지사항 첫 페이지로
        }else if (submenu.textContent === "게시글 목록") {
            resetSelectAllNoticesCheckbox();
            fetchFilteredPosts(1,postKeyword,postFilterType);
            resetSelectAllPostsCheckbox(); // 전체 선택 체크박스 해제
        }else if (submenu.textContent === "신고 목록") {
            fetchFilteredReports(1,reportKeyword,reportFilterType);
            resetSelectAllReportsCheckbox();
        }
    });
});



// DOM이 로드된 후 실행되는 코드
document.addEventListener("DOMContentLoaded", function () {
    const options = document.querySelectorAll(".post-filter-option"); // 게시글 필터 옵션
    const inquiryOptions = document.querySelectorAll(".sort-filter-option.inquiry-list"); // 문의 정렬 옵션
    const postListContainer = document.querySelector(".post-filter-wrapper"); // 게시글 리스트 컨테이너
    const inquiryTableContainer = document.querySelector(".inquiryTable_container"); // 문의 리스트 컨테이너
    const inquiryTableHeader = document.querySelector(".inquiryTable_row.inquiryTable_header"); // 문의 리스트 헤더
    let sortOrder = {}; // 정렬 순서를 저장하는 객체

// 문의 리스트 정렬 함수
function sortHelps(order) {
    const helps = Array.from(inquiryTableContainer.querySelectorAll(".inquiryTable_row.data_row")); // 문의 리스트 데이터 가져오기

    helps.forEach((help) => (help.style.display = "flex")); // 모든 항목을 표시

    // 정렬 기준에 따른 정렬 수행
    if (order === "최신순") {
        // 최신순 정렬 (오름차순 또는 내림차순)
        helps.sort((a, b) => {
            const dateA = new Date(a.querySelector(".inquiryTable_cell.inquiry_date").textContent);
            const dateB = new Date(b.querySelector(".inquiryTable_cell.inquiry_date").textContent);
            return sortOrder[order] === "asc" ? dateA - dateB : dateB - dateA;
        });
    } else if (order === "일반 문의") {
        // '일반 문의' 항목만 표시
        helps.forEach((help) => {
            const type = help.querySelector(".inquiryTable_cell.inquiry_type").textContent;
            if (!type.includes("일반 문의")) help.style.display = "none"; // 조건에 맞지 않는 항목 숨기기
        });
    } else if (order === "봉사단체 가입 문의") {
        // '봉사단체 가입 문의' 항목만 표시
        helps.forEach((help) => {
            const type = help.querySelector(".inquiryTable_cell.inquiry_type").textContent;
            if (!type.includes("봉사단체 가입 문의")) help.style.display = "none";
        });
    }

    // 문의 리스트를 재구성하여 정렬된 항목 표시
    inquiryTableContainer.innerHTML = ``;
    inquiryTableContainer.innerHTML += inquiryTableHeader; // 헤더 다시 추가
    helps.forEach((help) => inquiryTableContainer.appendChild(help)); // 정렬된 항목 추가
}

    sortHelps("최신순"); // 기본 정렬을 최신순으로 설정

// 문의 정렬 옵션 클릭 시 정렬 수행
inquiryOptions.forEach((inquiryOption) => {
    inquiryOption.addEventListener("click", () => {
        const order = inquiryOption.textContent.trim(); // 클릭된 옵션의 텍스트 가져오기

        // 현재 정렬 순서를 토글 (asc <-> desc)
        sortOrder[order] = sortOrder[order] === "asc" ? "desc" : "asc";

        // 모든 정렬 옵션 선택 해제 후 클릭된 옵션만 선택
        inquiryOptions.forEach((inquiryOpt) => inquiryOpt.classList.remove("selected"));
        inquiryOption.classList.add("selected");

        // 선택된 정렬 기준에 따라 정렬 수행
        sortHelps(order);
    });
});

// 게시글 정렬 함수
function sortPosts(order) {
    const posts = Array.from(postListContainer.querySelectorAll(".ServiceTable_row")); // 게시글 데이터 가져오기
    posts.forEach((post) => (post.style.display = "flex")); // 모든 게시글 표시

    // 정렬 기준에 따른 정렬 수행
    if (order === "작성일 순") {
        // 작성일 순 정렬
        posts.sort((a, b) => {
            const dateA = new Date(a.querySelector(".ServiceTable_cell.Join_date").textContent);
            const dateB = new Date(b.querySelector(".ServiceTable_cell.Join_date").textContent);
            return sortOrder[order] === "asc" ? dateA - dateB : dateB - dateA;
        });

    } else if (order === "조회수 순") {
        // 조회수 순 정렬
        posts.sort((a, b) => {
            const countA = (a.querySelector(".ServiceTable_cell.hit_ctn").textContent.trim(), 10);
            const countB = (b.querySelector(".ServiceTable_cell.hit_ctn").textContent.trim(),10);
            return sortOrder[order] === "asc" ? countA - countB : countB - countA;
        });
    } else if (order === "댓글수 순") {
        // 댓글수 순 정렬
        posts.sort((a, b) => {
            const replyA = a.querySelector(".ServiceTable_cell.reply_ctn").textContent.trim();
            const replyB = b.querySelector(".ServiceTable_cell.reply_ctn").textContent.trim();
            return sortOrder[order] === "asc" ? replyA - replyB : replyB - replyA;
        });
    } else if (order === "기부 게시글") {
        // '기부 게시글' 항목만 표시
        posts.forEach((post) => {
            const type = post.querySelector(".ServiceTable_cell.post_kind").textContent;
            if (!type.includes("기부 게시글")) post.style.display = "none";
        });
    } else if (order === "봉사활동 모집글") {
        // '봉사활동 모집글' 항목만 표시
        posts.forEach((post) => {
            const type = post.querySelector(".ServiceTable_cell.post_kind").textContent;
            if (!type.includes("봉사활동 모집글")) post.style.display = "none";
        });
    } else if (order === "후원 게시글") {
        // '후원 게시글' 항목만 표시
        posts.forEach((post) => {
            const type = post.querySelector(".ServiceTable_cell.post_kind").textContent;
            if (!type.includes("후원 게시글")) post.style.display = "none";
        });
    } else if (order === "이용 후기") {
        // '이용 후기' 항목만 표시
        posts.forEach((post) => {
            const type = post.querySelector(".ServiceTable_cell.post_kind").textContent;
            if (!type.includes("이용 후기")) post.style.display = "none";
        });
    }

    postListContainer.innerHTML = "";
    posts.forEach((post) => postListContainer.appendChild(post));
}

    // 게시글 필터 옵션 클릭 시 정렬 수행
    options.forEach((option) => {
        option.addEventListener("click", function () {
            const order = option.textContent.trim(); // 클릭된 옵션의 텍스트 가져오기

            // 정렬 순서를 토글 (asc <-> desc)
            sortOrder[order] = sortOrder[order] === "asc" ? "desc" : "asc";

            // 모든 필터 옵션 선택 해제 후 클릭된 옵션만 선택
            options.forEach((opt) => opt.classList.remove("selected"));
            option.classList.add("selected");

            // 선택된 정렬 기준에 따라 정렬 수행
            sortPosts(order);
        });
    });
});
// ==========================================공지사항 목록 ===========================================================================
// 공지사항 링크 클릭 시 해당 섹션으로 이동
let notificationLinks = document.querySelectorAll("a.notification.notification-table");

notificationLinks.forEach((notificationLink) => {
    notificationLink.addEventListener("click", (e) => {
        sections.forEach((section) => section.classList.remove("selected")); // 모든 섹션 선택 해제
        const notificationInquirySection = sections.filter(
            (section) => section.dataset.value === "공지사항 조회" // '공지사항 조회' 섹션 찾기
        );
        notificationInquirySection[0].classList.add("selected"); // 해당 섹션 선택
    });
});
const noticeSearchInput = document.querySelector(".Filter_searchInput.notice-page-search");
let noticeKeyword = '';

noticeSearchInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        event.preventDefault();
        noticeKeyword = noticeSearchInput.value.trim();
        fetchFilteredNotices(1, noticeKeyword);
    }
});

// 전체 선택 및 개별 선택 체크박스 관리
const selectAllNotices = () => {
    const selectAllCheckbox = document.getElementById("selectAllNotices");
    if (selectAllCheckbox) {
        selectAllCheckbox.addEventListener("change", function () {
            const checkboxes = document.querySelectorAll(".notification-list-checkbox");
            checkboxes.forEach(checkbox => {
                checkbox.checked = this.checked;
            });
        });
    }

    document.querySelectorAll(".notification-list-checkbox").forEach(checkbox => {
        checkbox.addEventListener("change", function () {
            const allChecked = document.querySelectorAll(".notification-list-checkbox:checked").length === document.querySelectorAll(".notification-list-checkbox").length;
            selectAllCheckbox.checked = allChecked;
        });
    });
};
selectAllNotices();

function resetSelectAllNoticesCheckbox() {
    const selectAllCheckbox = document.getElementById("selectAllNotices");
    selectAllCheckbox.checked = false;
}

// ===========================================공지사항 체크박스 삭제 ===============================================================
document.querySelector(".deleteSelectedBtn.notice-delete").addEventListener("click", () => {
    console.log("클릭")
    const selectedCheckboxes = document.querySelectorAll(".notification-list-checkbox:checked");
    const selectedIds = Array.from(selectedCheckboxes).map(
        (checkbox) => checkbox.closest(".notification-container").querySelector(".notification-num").textContent.trim()
    );

    if (selectedIds.length === 0) {
        alert("삭제할 공지사항을 선택하세요.");
        return;
    }

    deleteSelectedNotices(selectedIds); // 공지사항 삭제 함수 호출
});
// =========================================공지사항 작성==============================================================
document.getElementById("notification-write-button").addEventListener("click", () => {
    const sections = document.querySelectorAll("section.admin-page");
    sections.forEach(section => section.classList.remove("selected"));

    const writeSection = Array.from(sections).find(section => section.dataset.value === "공지사항 작성");
    writeSection.classList.add("selected");
});
// ===================================================================================================================================
// 공지사항 조회에서 수정하기 및 삭제하기 버튼 클릭 시 이벤트
const modifyButton = document.querySelector(".go-update.admin-btn");
const deleteButton = document.querySelector(".go-delete.admin-btn");

// 수정하기 버튼 클릭 시 공지사항 수정 페이지로 이동
document.querySelector(".go-update.admin-btn").addEventListener("click", async () => {
    const noticeId = document.querySelector(".notification-header h1").getAttribute("data-id");
    if (noticeId) {
        sections.forEach(section => section.classList.remove("selected"));
        const updateSection = Array.from(sections).find(section => section.dataset.value === "공지사항 수정");
        updateSection.classList.add("selected");
        // 공지사항 정보를 가져와 수정 페이지에 렌더링합니다.
        fetchNoticeDetailForEdit(noticeId);
    } else {
        console.error("공지사항 ID를 찾을 수 없습니다.");
    }
});

// 수정 폼 제출 시 이벤트 리스너 추가
document.querySelector(".notification-update-form form").addEventListener("submit", async (event) => {
    event.preventDefault();
    const updateForm = event.target;
    await submitNoticeUpdate(updateForm);
});



// 삭제하기 버튼 클릭 시 서버로 삭제 요청 보내기
deleteButton.addEventListener("click", async () => {
    const noticeId = document.querySelector(".notification-header h1").getAttribute("data-id");
    if (confirm("정말로 삭제하시겠습니까?")) {
        await submitNoticeDelete(noticeId);
    }
});


//============================================================================고객센터============================
const inquirySearchInput = document.querySelector(".Filter_searchInput.inquiry-page-search");
const inquiryFilters = document.querySelectorAll(".sort-filter-option.inquiry-list");

// 전역 변수로 현재 검색어와 필터를 저장
let inquiryKeyword = '';
let inquiryFilterType = '최신순';

// 고객센터 검색어 입력
inquirySearchInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        event.preventDefault();  // 폼 제출 방지
        inquiryKeyword = inquirySearchInput.value.trim();  // 검색어를 전역 변수에 저장
        fetchFilteredInquiries(1, inquiryKeyword, inquiryFilterType);  // 검색어로 데이터 불러오기
    }
});

// 고객센터 필터 버튼 클릭 시 필터에 맞는 데이터 불러오기
inquiryFilters.forEach((option) => {
    option.addEventListener("click", () => {
        // classList : 동적으로 클래스를 추가하고 제거하여 필터가 선택되었음을 시각적 표시. 다른 필터는 비활성화 상태로 보이게하기위함
        inquiryFilters.forEach((opt) => opt.classList.remove("selected")); // 모든 필터 초기화
        option.classList.add("selected"); // 선택된 필터만 활성화
        inquiryFilterType = option.textContent.trim();
        console.log("inquiryFilterType 타입 : "+ inquiryFilterType );
        fetchFilteredInquiries(1, inquiryKeyword, inquiryFilterType); // 필터 조건으로 데이터 불러오기
    });
});

// 고객센터 문의 조회
document.querySelector(".inquiryTable_container").addEventListener("click", async (event) => {
    if (event.target.classList.contains("editBtn")) { // 버튼의 클래스가 editBtn일 때만 실행
        sections.forEach((section) => section.classList.remove("selected")); // 모든 섹션 선택 해제
        const inquiryAnswerSection = Array.from(sections).find(
            (section) => section.dataset.value === "고객센터 문의 답변"
        );

            inquiryAnswerSection.classList.add("selected");
            // 선택된 문의의 ID 가져오기
            const inquiryId = event.target.closest(".data_row").getAttribute("data-id");
            // 문의 데이터를 서버에서 가져와 화면에 렌더링
            const inquiryData = await fetchInquiryData(inquiryId);
                renderAnswer(inquiryData);
    }
});

document.addEventListener("DOMContentLoaded", () => {
    // submit 버튼 클릭 이벤트 등록
    document.addEventListener("click", async (e) => {
        // "submit-button" ID를 가진 요소가 클릭된 경우
        if (e.target.id === "submit-button") {
            e.preventDefault();
            // 답변 제출 폼의 데이터를 가져옴
            const answerForm = document.getElementById("new-request");
            const inquiryId = answerForm.querySelector('input[name="request-title"]').getAttribute("data-id");
            const answerContent = answerForm.querySelector('textarea[name="answer-content"]').value;
            // 답변을 서버로 전송하고, 성공 시 목록으로 이동
            const success = await submitAnswer(inquiryId, answerContent);
            if (success) {
                sections.forEach((section) => section.classList.remove("selected"));
                // '고객센터 문의 목록' 섹션을 찾아 선택
                const inquiryListSection = Array.from(sections).find(
                    (section) => section.dataset.value === "고객센터 문의 목록"
                );
                if (inquiryListSection) {
                    inquiryListSection.classList.add("selected");
                    fetchFilteredInquiries(1, "", "최신순");
                }
            }
        }
    });
});

function resetSelectAllInquiriesCheckbox() {
    const selectAllCheckbox = document.getElementById("selectAllInquiries");
        selectAllCheckbox.checked = false;
}

selectAllInquiries();

// 삭제 버튼 클릭 시 이벤트
document.querySelector(".deleteSelectedBtn.inquiry-delete").addEventListener("click", () => {
    const selectedCheckboxes = document.querySelectorAll(".inquiryCheckbox:checked");
    // 각 체크박스에서 문의 ID를 가져와 배열로 저장 **
    const selectedIds = Array.from(selectedCheckboxes).map((checkbox) =>
        checkbox.closest(".data_row").getAttribute("data-id")
    );

    if (selectedIds.length === 0) {
        alert("삭제할 게시글을 선택하세요.");
        return;
    }

    deleteSelectedInquirys(selectedIds); // 선택한 게시글의 상태를 0(삭제)로 변경
});
// =====================================게시글 목록============================================
const postSearchInput = document.querySelector(".Filter_searchInput.post-page-search");
const postFilters = document.querySelectorAll(".post-filter-option");


let postKeyword = ''; // 검색어 저장
let postFilterType = '작성일 순';

//  게시글 검색
postSearchInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        event.preventDefault();
        postKeyword = postSearchInput.value.trim();
        fetchFilteredPosts(1, postKeyword, postFilterType); // 검색어를 이용해 첫 페이지 불러오기
    }
});
// 게시글 필터 버튼 클릭 시 필터에 맞는 데이터 불러오기
postFilters.forEach((option) => {
    option.addEventListener("click", () => {
        // classList : 동적으로 클래스를 추가하고 제거하여 필터가 선택되었음을 시각적 표시. 다른 필터는 비활성화 상태로 보이게하기위함
        postFilters.forEach((opt) => opt.classList.remove("selected")); // 모든 필터 초기화
        option.classList.add("selected"); // 선택된 필터만 활성화

        postFilterType = option.textContent.trim();
        fetchFilteredPosts(1, postKeyword, postFilterType); // 필터 조건으로 데이터 불러오기
    });
});

// 게시글 목록의 전체 선택 및 개별 선택 체크박스 관리
const selectAllPosts = () => {
    const selectAllCheckbox = document.getElementById("selectAllPosts");
    if (selectAllCheckbox) {
        selectAllCheckbox.addEventListener("change", function () {
            const checkboxes = document.querySelectorAll(".postCheckbox");
            checkboxes.forEach(checkbox => {
                checkbox.checked = this.checked;
            });
        });
    }

    // 개별 체크박스 클릭 시 전체 선택 체크박스 상태 업데이트
    document.querySelectorAll(".postCheckbox").forEach(checkbox => {
        checkbox.addEventListener("change", function () {
            const allChecked = document.querySelectorAll(".postCheckbox:checked").length === document.querySelectorAll(".postCheckbox").length;
            selectAllCheckbox.checked = allChecked;
        });
    });
};

function resetSelectAllPostsCheckbox() {
    const selectAllCheckbox = document.getElementById("selectAllPosts");
        selectAllCheckbox.checked = false;
}

// 각 목록 초기화 시 호출
selectAllPosts();

// 삭제 버튼 클릭 시 이벤트
document.querySelector(".deleteSelectedBtn.post-page-btn").addEventListener("click", () => {
    const selectedCheckboxes = document.querySelectorAll(".postCheckbox:checked");
    const selectedIds = Array.from(selectedCheckboxes).map(
        (checkbox) => checkbox.closest(".ServiceTable_row").querySelector(".post_ID").textContent.trim()
    );

    if (selectedIds.length === 0) {
        alert("삭제할 게시글을 선택하세요.");
        return;
    }

    deleteSelectedPosts(selectedIds); // 선택한 게시글의 상태를 0(삭제)로 변경
});
// ================================ 게시글 조회 =================================================================================


document.querySelector(".post-filter-wrapper").addEventListener("click", async (event) => {
    if (event.target.classList.contains("inquiry-button")) {
        const postId = event.target.closest(".ServiceTable_row").querySelector(".post_ID").textContent.trim();
        const postType = event.target.closest(".ServiceTable_row").querySelector(".post_kind").textContent.trim();
        console.log(postId,postType)
        await navigateToPostPage(postType, postId);
    }
});

// ============================== 신고 목록 ==================================================================
const reportSearchInput = document.querySelector(".Filter_searchInput.report-page-search");
const reportFilters = document.querySelectorAll(".sort-filter-option.report-list");

// 전역 변수로 현재 검색어와 필터를 저장
let reportKeyword = '';
let reportFilterType = '신고일 순';

// 신고 검색어 입력
reportSearchInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        console.log("클릭")
        event.preventDefault();  // 폼 제출 방지
        reportKeyword = reportSearchInput.value.trim();  // 검색어를 전역 변수에 저장
        fetchFilteredReports(1, reportKeyword, reportFilterType);  // 검색어로 데이터 불러오기
    }
});

// 신고 필터 버튼 클릭 시 필터에 맞는 데이터 불러오기
reportFilters.forEach((option) => {
    option.addEventListener("click", () => {
        console.log("클릭됨")
        // classList : 동적으로 클래스를 추가하고 제거하여 필터가 선택되었음을 시각적 표시. 다른 필터는 비활성화 상태로 보이게하기위함
        reportFilters.forEach((opt) => opt.classList.remove("selected")); // 모든 필터 초기화
        option.classList.add("selected"); // 선택된 필터만 활성화

        // 선택된 필터에 따라 filterType을 설정
        console.log(option.textContent.trim());
        reportFilterType = option.textContent.trim() == "신고일 순" ? '신고일 순' : option.textContent.trim() === '신고 처리 완료' ? 'COMPLETE' : 'WAITING';

        console.log(reportFilterType)
        fetchFilteredReports(1, reportKeyword, reportFilterType); // 필터 조건으로 데이터 불러오기
    });
});

function resetSelectAllReportsCheckbox() {
    const selectAllCheckbox = document.getElementById("selectAllReports");
    selectAllCheckbox.checked = false;
}

selectAllReports();


// 삭제 버튼 클릭 시 이벤트
document.querySelector(".deleteSelectedBtn.report-delete").addEventListener("click", () => {
    const selectedCheckboxes = document.querySelectorAll(".reportCheckbox:checked");
    const selectedIds = Array.from(selectedCheckboxes).map(checkbox => checkbox.closest(".ServiceTable_row").querySelector(".post_ID").textContent.trim());

    if (selectedIds.length === 0) {
        alert("삭제할 게시글을 선택하세요.");
        return;
    }

    deleteSelectedReports(selectedIds); // 삭제 요청 함수 호출
});
// 상태 변경 클릭 시 이벤트
document.querySelector(".addServiceBtn").addEventListener("click", () => {
    const selectedCheckboxes = document.querySelectorAll(".reportCheckbox:checked");
    const selectedIds = Array.from(selectedCheckboxes).map(checkbox => checkbox.closest(".ServiceTable_row").querySelector(".post_ID").textContent.trim());
    console.log(selectedIds)

    // 선택된 체크박스가 없을 경우 경고 메시지 표시 후 종료
    if (selectedIds.length === 0) {
        alert("상태 변경할 신고 항목을 선택하세요.");
        return;
    }

    // 상태 변경 함수 호출
    updateSelectedReportStatus(selectedIds);
});













