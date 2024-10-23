// 모든 메뉴 아이템과 서브메뉴 컨테이너를 선택합니다.
const menuItems = document.querySelectorAll(
    ".MenuItems_menu-QgJck.MenuItems_hasSubmenu-1EhTS"
);

menuItems.forEach((menuToggle) => {
    menuToggle.addEventListener("click", function () {
        const submenuContainer = menuToggle.nextElementSibling;
        const downIcon = menuToggle.querySelector(
            ".withIcon_icon-2IQiS.MenuItems_downIcon-2GVY9"
        );

        // 서브메뉴의 표시/숨김을 토글합니다.
        submenuContainer.classList.toggle("MenuItems_show-1ldUA");
        downIcon.classList.toggle("MenuItems_open-2VtAS");
    });
});

// 정보 버튼 클릭 시 정보 박스 표시/숨김
const infoButton = document.querySelector(".ProjectInfo_infoButton-2bg95");

infoButton.addEventListener("click", function () {
    const isExpanded = infoButton.getAttribute("aria-expanded") === "true";
    infoButton.setAttribute("aria-expanded", !isExpanded);

    const container = document.querySelector(".ProjectInfo_container-3jAST");
    const existingInfoBox = document.querySelector(
        ".ProjectInfo_infoBox-2x8RL"
    );

    if (isExpanded && existingInfoBox) {
        container.removeChild(existingInfoBox);
    } else if (!isExpanded) {
        const infoBox = document.createElement("div");
        infoBox.className = "ProjectInfo_infoBox-2x8RL";
        infoBox.setAttribute("role", "region");
        infoBox.setAttribute("aria-labelledby", "project-info");

        infoBox.innerHTML = `
            <dl>
                <dt class="BlindText_textHidden-1W0aB">메이커 명</dt>
                <dd class="ProjectInfo_content-1VmXE">
                    <span class="Avatar_avatar-1mOG5 Avatar_sm-V_6km ProjectInfo_profileImage-1PLV0">
                        <span class="Avatar_inner-hN779">
                            <img src="https://static.wadiz.kr/studio/funding/static/media/default-zingugi.de76a099.svg" />
                        </span>
                    </span>
                    <span class="ProjectInfo_makerName-KIDrd">석상훈</span>
                </dd>
                <dt class="BlindText_textHidden-1W0aB">상태</dt>
                <dd class="ProjectInfo_content-1VmXE ProjectInfo_stateBox-705_4">
                    <span class="ProjectInfo_state-1Aqkt">작성 중</span>
                </dd>
            </dl>
            <button class="Button_button-35X6_ Button_primary-1vdas Button_contained-1XlJQ Button_sm-3vobZ Button_startIcon-7ZEht Button_block-3y0pW" type="button">
                <span>
                    <svg viewBox="0 0 40 40" focusable="false" role="presentation" class="withIcon_icon-2IQiS Button_icon-2I54k" aria-hidden="true">
                        <path d="M33.6 5.2a9 9 0 0 1 0 12.7L29 22.5l-.6.5a11 11 0 0 0-.4-2.4l4.1-4.1a7 7 0 0 0-9.9-9.9l-4.6 4.6a7 7 0 0 0 4.7 11.9 5 5 0 0 1-.2 2 8.9 8.9 0 0 1-7.8-5.4 9.1 9.1 0 0 1-.3-6.5 8.9 8.9 0 0 1 2.1-3.4l4.6-4.6a9 9 0 0 1 12.9 0zm-15.7 9.5a5 5 0 0 0-.2 2 6.9 6.9 0 0 1 6.3 4.2 7 7 0 0 1-1.5 7.7l-5.7 5.7a7 7 0 0 1-9.9-9.9l5.2-5.2a11 11 0 0 1-.4-2.4l-.6.5-5.6 5.6a9 9 0 1 0 12.7 12.8l5.7-5.7a8.9 8.9 0 0 0 2.1-3.4 9.1 9.1 0 0 0-.3-6.5 8.9 8.9 0 0 0-7.8-5.4z"></path>
                    </svg>
                    <span class="Button_children-1TD4r">URL 복사</span>
                </span>
            </button>
        `;
        container.appendChild(infoBox);
    }
});

// 사이드바 사라짐
document.addEventListener("DOMContentLoaded", function () {
    const button = document.querySelector(
        "button.AppLayout_expandNavButton-2AQMd"
    );
    const nav = document.getElementById("AppNavbarLayout_Nav");
    const mainDiv = document.querySelector("div.AppLayout_main-3h4EB");
    let dividerAdded = false;

    button.addEventListener("click", function () {
        button.classList.toggle("AppLayout_expand-3TNUI");
        nav.classList.toggle("AppNavbarLayout_expand-12bTj");

        if (!dividerAdded) {
            const newDivider = document.createElement("div");
            newDivider.className = "AppNavbarLayout_divider-KAkAr";
            mainDiv.insertBefore(newDivider, nav);
            dividerAdded = true;
        } else {
            const existingDivider = mainDiv.querySelector(
                ".AppNavbarLayout_divider-KAkAr"
            );
            if (existingDivider) {
                mainDiv.removeChild(existingDivider);
                dividerAdded = false;
            }
        }
    });
});

// 체크박스 전체 선택/해제 기능
function updateCheckboxes() {
    const checkboxes = document.querySelectorAll(".userCheckbox");
    const selectAll = document.getElementById("selectAll");

    selectAll.addEventListener("change", function (e) {
        checkboxes.forEach((checkbox) => {
            checkbox.checked = e.target.checked;
        });
    });

    checkboxes.forEach((checkbox) => {
        checkbox.addEventListener("change", function () {
            const checkedCount = Array.from(checkboxes).filter(
                (checkbox) => checkbox.checked
            ).length;
            selectAll.checked = checkedCount === checkboxes.length;
        });
    });
}

// 페이지 로드 시 초기화 및 이벤트 리스너 추가
document.addEventListener("DOMContentLoaded", () => {
    updateCheckboxes();
    const addServiceBtn = document.getElementById("addServiceBtn"); //결제 취소 버튼
    const editButtons = document.querySelectorAll(".editBtn"); //수정 버튼
    const authModal = document.getElementById("authModal"); // 확인용 모달
    const editModal = document.getElementById("editModal"); // 수정하기 모달
    const modalWraps = document.querySelectorAll(".modal-wrap");
    const verifyBtn = document.getElementById("verifyBtn"); //모달 확인 버튼
    const cancelBtns = document.querySelectorAll(".cancel-btn"); //모달 취소 버튼
    const deleteSelectedBtn = document.getElementById("deleteSelectedBtn"); // 내역 삭제 버튼
    const saveBtn = document.querySelector(".verify-btn.save"); //수정하기 저장 버튼
    const sortFilterOptions = document.querySelectorAll(".sort-filter-option"); //결제일 순/ 결제 수단 선택

    let actionToPerform = null; // 전역 변수로 초기화

    // 완료, 실패 글자 색
    document.querySelectorAll(".UserTable_row-1Qg9b").forEach((row) => {
        const statusCell = row.querySelector(
            ".UserTable_cell-3kj0K:nth-child(8)"
        );
        if (statusCell) {
            const statusText = statusCell.textContent.trim();

            switch (statusText) {
                case "완료":
                    statusCell.style.color = "green";
                    break;
                case "실패":
                    statusCell.style.color = "red";
                    break;
                default:
                    statusCell.style.color = "black"; // 기본 색상
                    break;
            }
        }
    });

    // 페이지네이션 기능
    document.querySelectorAll(".pagination-page-link").forEach(function (link) {
        link.addEventListener("click", function (event) {
            event.preventDefault(); // 기본 링크 동작을 막기

            // 모든 페이지에서 active 클래스를 제거
            document
                .querySelectorAll(".pagination-page")
                .forEach(function (page) {
                    page.classList.remove("active");
                });

            // 클릭한 페이지에 active 클래스를 추가
            this.parentElement.classList.add("active");
        });
    });

    // 클릭 시 색상 변경 기능
    function addTemporaryClass(element) {
        element.classList.add("clicked");
        setTimeout(function () {
            element.classList.remove("clicked");
        }, 300); // 0.3초 후에 원래 색으로 돌아옴
    }

    // 모달을 여는 함수
    const openModal = (type) => {
        modalWraps.forEach((wrap) => {
            const modal = wrap.closest(".modal");
            if (type === "auth" && authModal === modal) {
                modal.style.display = "flex";
                wrap.style.animation = "popUp 0.5s";
            } else if (type === "edit" && editModal === modal) {
                modal.style.display = "flex";
                wrap.style.animation = "popUp 0.5s";
            }
        });
    };

    // 모달을 닫는 함수
    const closeModal = (type) => {
        console.log(type);
        modalWraps.forEach((wrap) => {
            wrap.style.animation = "popDown 0.5s";
            setTimeout(() => {
                if (type === "auth" && authModal.style.display === "flex") {
                    authModal.style.display = "none";
                } else if (
                    type === "edit" &&
                    editModal.style.display === "flex"
                ) {
                    editModal.style.display = "none";
                }
            }, 450); // 애니메이션 시간과 맞추기
        });
    };

    addServiceBtn.addEventListener("click", function () {
        addTemporaryClass(addServiceBtn);
        modalMessage.textContent = "결제 취소하시겠습니까?";
        openModal("auth");
    });

    // 편집 버튼 클릭 시 모달창 열기 및 상태 변경
    editButtons.forEach((button) => {
        button.addEventListener("click", () => {
            openModal("edit");
        });
    });

    // 삭제 버튼 클릭 시 모달창 열기
    deleteSelectedBtn.addEventListener("click", () => {
        addTemporaryClass(deleteSelectedBtn);
        modalMessage.textContent = "삭제하시겠습니까?";
        actionToPerform = () => {
            const selectedCheckboxes = document.querySelectorAll(
                ".userCheckbox:checked"
            );
            selectedCheckboxes.forEach((checkbox) => {
                const row = checkbox.closest(".UserTable_row-1Qg9b");
                row.parentNode.removeChild(row);
            });
        };

        openModal("auth");
    });

    // 확인 버튼 클릭 시 모달 닫기
    verifyBtn.addEventListener("click", () => {
        closeModal("auth");
    });

    // 닫기 버튼 클릭 시 모달 닫기
    cancelBtns.forEach((btn) => {
        btn.addEventListener("click", (event) => {
            event.preventDefault();
            const modalType =
                btn.closest(".modal").id === "editModal" ? "edit" : "auth";
            closeModal(modalType);
        });
    });

    // 수정-저장버튼 클릭시 모달 닫기
    saveBtn.addEventListener("click", () => {
        closeModal("edit");
    });

    // 결제일 수, 결제 수단, 결제 상태 눌렀을 때
    sortFilterOptions.forEach((option) => {
        option.addEventListener("click", () => {
            // selected 클래스 추가/제거
            document
                .querySelector(".sort-filter-option.selected")
                .classList.remove("selected");
            option.classList.add("selected");
        });
    });
});