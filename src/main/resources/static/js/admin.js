const sections = document.querySelectorAll("section.admin-page");
const submenus = document.querySelectorAll("a.MenuItems_submenu");
const inquiryButtons = document.querySelectorAll("button.inquiry-button");

// NodeList에 filter 메서드를 추가
NodeList.prototype.filter = Array.prototype.filter;

// // 고객센터 문의 목록과 공지사항 목록의 검색어와 페이지를 초기화하는 함수
// const resetSearchAndPage = () => {
//     inquiryKeyword = ''; // 고객센터 문의 검색어 초기화
//     if (inquirySearchInput) inquirySearchInput.value = ''; // 검색 입력 필드 초기화
//     // inquiryFilterType = '최신순'; // 또는 기본값으로 설정
//     postKeyword='';
//     // postFilterType = '작성일 순';
//     if(postSearchInput) postSearchInput.value='';
//     reportKeyword='';
//     // reportFilterType = '신고일 순';
//     if(reportSearchInput) reportSearchInput.value='';
//
// };



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
        resetSelectAllPostsCheckbox(); // 전체 선택 체크박스 해제
        resetSelectAllInquiriesCheckbox();
        resetSelectAllReportsCheckbox();

        // 선택된 섹션에 따라 데이터 목록을 처음 페이지로 다시 로드
        if (submenu.textContent === "고객센터 문의 목록") {
            fetchFilteredInquiries(1, inquiryKeyword, inquiryFilterType);
        } else if (submenu.textContent === "공지사항 목록") {
            fetchNotices(1); // 공지사항 첫 페이지로
        }else if (submenu.textContent === "게시글 목록") {
            fetchFilteredPosts(1,postKeyword,postFilterType);
        }else if (submenu.textContent === "신고 목록") {
            fetchFilteredReports(1,reportKeyword,reportFilterType);
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



//============================================================================고객센터============================
const inquirySearchInput = document.querySelector(".Filter_searchInput");
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


// 고객센터 문의 목록의 전체 선택 및 개별 선택 체크박스 관리
const selectAllInquiries = () => {
    const selectAllCheckbox = document.getElementById("selectAllInquiries");
    if (selectAllCheckbox) {
        selectAllCheckbox.addEventListener("change", function () {
            const checkboxes = document.querySelectorAll(".inquiryCheckbox");
            checkboxes.forEach(checkbox => {
                checkbox.checked = this.checked;
            });
        });
    }

    // 개별 체크박스 클릭 시 전체 선택 체크박스 상태 업데이트
    document.querySelectorAll(".inquiryCheckbox").forEach(checkbox => {
        checkbox.addEventListener("change", function () {
            const allChecked = document.querySelectorAll(".inquiryCheckbox:checked").length === document.querySelectorAll(".inquiryCheckbox").length;
            selectAllCheckbox.checked = allChecked;
        });
    });
};

function resetSelectAllInquiriesCheckbox() {
    const selectAllCheckbox = document.getElementById("selectAllInquiries");
        selectAllCheckbox.checked = false;
}

selectAllInquiries();

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
document.getElementById("deleteSelectedBtn").addEventListener("click", () => {
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

// 게시글 조회 버튼 클릭 이벤트 리스너
document.querySelector(".post-filter-wrapper").addEventListener("click", async (event) => {
    if (event.target.classList.contains("inquiry-button")) {
        const postId = event.target.closest(".ServiceTable_row").querySelector(".post_ID").textContent.trim();

        // 모든 섹션 숨기기 및 selected 클래스 제거
        document.querySelectorAll(".admin-page").forEach(section => {
            section.classList.remove("selected");
        });

        // 게시글 조회 섹션만 보이도록 설정하고 selected 클래스 추가
        const postDetailSection = document.querySelector(".admin-page[data-value='게시글 조회']");
        if (postDetailSection) {
            postDetailSection.classList.add("selected");

            // 조회 데이터를 로드하여 화면에 표시
            const postData = await fetchPostDetail(postId);
            if (postData) {
                renderPostDetail(postData);
                renderComments(postData.comments); // 댓글도 함께 렌더링
            } else {
                console.error("게시글 데이터를 가져오지 못했습니다.");
            }
        }
    }
});

// 고쳐야해 ==============================================================
// 댓글 상태 변경 버튼 클릭 이벤트
document.querySelectorAll('.status-change-btn').forEach(button => {
    button.addEventListener('click', (event) => {
        const replyId = event.target.getAttribute('data-reply-id');  // 댓글 ID 가져오기
        const currentStatus = event.target.getAttribute('data-status'); // 현재 상태 가져오기
        const newStatus = (currentStatus === 'VISIBLE') ? 'HIDDEN' : 'VISIBLE'; // 상태 변경 (toggle)

        // 댓글 상태 업데이트 함수 호출
        updateReplyStatus(replyId, newStatus);

        // 버튼 상태와 텍스트 변경
        event.target.setAttribute('data-status', newStatus);
        event.target.textContent = newStatus === 'VISIBLE' ? '숨기기' : '표시하기'; // 버튼 텍스트 변경

        // 댓글 상태 텍스트 업데이트
        const statusElement = document.querySelector(`#reply-${replyId} .reply-status span`);
        statusElement.textContent = newStatus;
    });
});

// ========================================================================

document.querySelector(".tab-style.tabs .tab").addEventListener("click", function () {
    // 댓글 탭 클릭 시 댓글 섹션 표시
    const commentSection = document.querySelector(".content-container.comment");
    commentSection.style.display = "block"; // 댓글 섹션 보이기

    // 댓글 목록 렌더링
    const postId = document.querySelector('.post-detail').getAttribute('data-id'); // 게시글 ID를 가져와서 댓글을 불러옴
    fetchComments(postId); // 댓글을 다시 불러오기
});

// 댓글 작성 버튼 클릭 이벤트 처리
const setupCommentSubmitButton = (postId) => {
    const commentTextarea = document.getElementById("comment-content");
    const submitButton = document.querySelector(".submit-comment-button");

    submitButton.addEventListener("click", async () => {
        const commentText = commentTextarea.value.trim();
        if (commentText) {
            const success = await submitComment(postId, commentText);
            if (success) {
                commentTextarea.value = "";
                submitButton.disabled = true;
                fetchComments(postId); // 댓글을 다시 불러옵니다
            }
        }
    })
};


// =============================== 신고 목록 =====================================
const reportSearchInput = document.querySelector(".Filter_searchInput.report-page-search");
const reportFilters = document.querySelectorAll(".sort-filter-option.report-list");

// 전역 변수로 현재 검색어와 필터를 저장
let reportKeyword = '';
let reportFilterType = '신고일 순';

// 신고 검색어 입력
reportSearchInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
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

// 신고 목록의 전체 선택 및 개별 선택 체크박스 관리
const selectAllReports = () => {
    const selectAllCheckbox = document.getElementById("selectAllReports");
    if (selectAllCheckbox) {
        selectAllCheckbox.addEventListener("change", function () {
            const checkboxes = document.querySelectorAll(".reportCheckbox");
            checkboxes.forEach(checkbox => {
                checkbox.checked = this.checked;
            });
        });
    }

    // 개별 체크박스 클릭 시 전체 선택 체크박스 상태 업데이트
    document.querySelectorAll(".reportCheckbox").forEach(checkbox => {
        checkbox.addEventListener("change", function () {
            const allChecked = document.querySelectorAll(".reportCheckbox:checked").length === document.querySelectorAll(".reportCheckbox").length;
            selectAllCheckbox.checked = allChecked;
        });
    });
};

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













