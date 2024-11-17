globalThis.page = 1;

const monthInput = document.querySelector("input#selected-month");
const month = new Date().getMonth()+1;
monthInput.value = month;
console.log(month);

const renderRankings = (rankings, containerClass) => {
    const listContainer = document.querySelector(containerClass);
    let i = 0;

    listContainer.innerHTML = '';

    rankings.forEach((user) => {
        let svgColor = null;
        // if (user.rank === 0) {
        if (i === 0) {
            svgColor = "rgb(255, 225, 133);";
        } else if (i === 1 || i === 2) {
            svgColor = "rgb(219, 222, 226);";
        }

        const listItem = document.createElement("li");
        listItem.classList.add("user-rank-article");

        // SVG 태그 추가 여부 결정
        const svgElement = svgColor
            ? `<svg class="rank-crwon" style="fill: ${svgColor};" viewBox="0 0 52 38">
               <path fill-rule="evenodd" clip-rule="evenodd" d="M10.3699 6.6267C10.3699 6.6267 9.95615 3.37591 15.7487 0C15.7487 0 15.197 4.37609 10.3699 6.6267ZM8.17862 8.76431C8.17862 8.76431 6.09431 6.09256 9.38843 0.610352C9.38843 0.610352 11.2215 4.68935 8.17862 8.76431ZM6.06946 12.9234C6.06946 12.9234 3.50656 10.619 5.70432 4.70264C5.70432 4.70264 8.28851 8.43258 6.06946 12.9234ZM5.10401 16.4241C5.10401 16.4241 1.7907 15.1257 1.45726 8.89014C1.45726 8.89014 5.36389 11.5089 5.10401 16.4241ZM5.92331 21.6789C5.92331 21.6789 2.48251 20.6898 1.45738 14.5166C1.45738 14.5166 5.63524 16.7649 5.92331 21.6789ZM7.02661 25.0546C7.02661 25.0546 3.42442 25.2639 0 19.8477C0 19.8477 4.79283 20.5697 7.02661 25.0546ZM7.52088 11.4869C7.52088 11.4869 7.6348 8.21615 13.9086 5.64258C13.9086 5.64258 12.6585 9.89886 7.52088 11.4869ZM6.07315 19.3112C6.07315 19.3112 4.63901 16.3082 9.10541 11.5566C9.10541 11.5566 9.97476 15.8901 6.07315 19.3112ZM9.24553 26.8128C9.24553 26.8128 6.2252 24.6519 7.7673 18.146C7.7673 18.146 10.9996 21.8143 9.24553 26.8128ZM11.728 30.3132C11.728 30.3132 7.72293 31.0021 3.05384 25.3638C3.05384 25.3638 8.53614 25.5684 11.728 30.3132ZM14.4864 32.5635C14.4864 32.5635 11.0671 34.5758 4.39089 30.9597C4.39089 30.9597 9.55062 29.2675 14.4864 32.5635ZM19.5893 34.6893C19.5893 34.6893 16.7841 37.371 9.36018 35.2708C9.36018 35.2708 13.9401 32.5314 19.5893 34.6893ZM24.4165 35.8147C24.4165 35.8147 22.0824 38.8447 14.3965 37.7693C14.3965 37.7693 18.476 34.4427 24.4165 35.8147ZM16.0035 32.6887C16.0035 32.6887 12.0468 31.7991 10.4 24.9087C10.4 24.9087 15.2876 27.1693 16.0035 32.6887ZM24.4165 35.6895C24.4165 35.6895 20.3545 36.0015 16.3494 29.958C16.3494 29.958 21.7795 30.6725 24.4165 35.6895ZM41.6299 6.6267C41.6299 6.6267 42.0437 3.37591 36.2511 0C36.2511 0 36.8028 4.37609 41.6299 6.6267ZM43.8213 8.76431C43.8213 8.76431 45.9055 6.09256 42.6115 0.610352C42.6115 0.610352 40.7783 4.68935 43.8213 8.76431ZM45.9305 12.9234C45.9305 12.9234 48.4934 10.619 46.2957 4.70264C46.2957 4.70264 43.7113 8.43258 45.9305 12.9234ZM46.8959 16.4241C46.8959 16.4241 50.2092 15.1257 50.5426 8.89014C50.5426 8.89014 46.636 11.5089 46.8959 16.4241ZM46.0766 21.6789C46.0766 21.6789 49.5174 20.6898 50.5427 14.5166C50.5427 14.5166 46.3647 16.7649 46.0766 21.6789ZM44.9732 25.0545C44.9732 25.0545 48.5755 25.2638 52 19.8477C52 19.8477 47.2071 20.5696 44.9732 25.0545ZM44.4791 11.4869C44.4791 11.4869 44.3653 8.21615 38.0914 5.64258C38.0914 5.64258 39.3414 9.89886 44.4791 11.4869ZM45.9268 19.3112C45.9268 19.3112 47.361 16.3082 42.8946 11.5566C42.8946 11.5566 42.0251 15.8901 45.9268 19.3112ZM42.7544 26.8128C42.7544 26.8128 45.7747 24.6519 44.2326 18.146C44.2326 18.146 41.0003 21.8143 42.7544 26.8128ZM40.2718 30.3132C40.2718 30.3132 44.2769 31.0021 48.946 25.3638C48.946 25.3638 43.4636 25.5684 40.2718 30.3132ZM37.5135 32.5635C37.5135 32.5635 40.9328 34.5758 47.609 30.9597C47.609 30.9597 42.4492 29.2675 37.5135 32.5635Z"></path>
           </svg>`
            : ""; // svgColor가 null인 경우 svg

        listItem.innerHTML = `
            <article class="user-rank-article rank-user">
                <div class="avatar-wrap">
                    ${svgElement}

                    <a class="user-img avatar" href="">
                        <img src="${user.profileFileName ? `/profile/display?memberId=${user.id}` : 'default-profile.png'}" alt="프로필">
                    </a>
                </div>
<!--                <p class="user-rank rank-number">${user.rank}</p>-->
                <p class="user-rank rank-number">${i+1}</p>
                <div class="nick-wrap">
                    <div class="user-nick-default user-nick-wrapper">
<!--                        <p title="${user.username}">
                            <a class="nick" href="${user.profileUrl}">${user.username}</a>
                        </p> -->
                        <p title="${user.memberNickName}">
                            <a class="nick" href="/mypage/mypage?id=${user.id}">${user.memberNickName}</a>
                        </p>
                    </div>
                </div>
            </article>
        `;
        listContainer.appendChild(listItem);
        i++;
    });
};

renderRankings(vtRankMembers, ".praise-rank-list");
renderRankings(supportRankMembers, ".contest-rank-list");
renderRankings(donationRankMembers, ".sales-rank-list");

const tooltipTrigger = document.querySelector("#tooltip-trigger");
const tooltipContent = document.querySelector(".tooltip-content");

tooltipTrigger.addEventListener("mouseover", () => {
    tooltipContent.classList.add("show");
});

tooltipTrigger.addEventListener("mouseout", () => {
    tooltipContent.classList.remove("show");
});

// 드롭다운 필터 설정
const filterContainer = document.querySelector(".filter-default");
const headerWrap = filterContainer.querySelector(".header-wrap");
const bottomWrap = filterContainer.querySelector(".bottom-wrap");
const arrow = filterContainer.querySelector(".arrow");
const items = filterContainer.querySelectorAll(".item");
const inputField = headerWrap.querySelector("input");

// 드롭다운 열고 닫기
headerWrap.addEventListener("click", () => {
    const isVisible = bottomWrap.style.visibility === "visible";
    bottomWrap.style.visibility = isVisible ? "hidden" : "visible";
    arrow.style.transform = isVisible ? "rotate(90deg)" : "rotate(-90deg)";
});

// 드롭다운 외부 클릭 시 닫기
document.addEventListener("click", (event) => {
    if (!filterContainer.contains(event.target)) {
        bottomWrap.style.visibility = "hidden";
        arrow.style.transform = "rotate(90deg)";
    }
});

const showVolunteerGroups = (volunteerGroups) => {
    const container = document.querySelector(".expert-list-container");
    container.innerHTML = '';
    volunteerGroups.forEach((volunteerGroup) => {
        let cardHTML = `
    <div class="expert-card-container expert-card">
        <a href="/m/chldbrhks">
            <div class="expert-card-left">
                <div class="expert-card-info-avatar">
                    <span class="profile-img-container avatar">
                        <img src="${volunteerGroup.profileFileName ? `/profile/display?memberId=${volunteerGroup.id}` : 'default-profile.png'}" alt="프로필">
                    </span>
                </div>
                <div class="expert-card-info">
                    <div class="expert-card-info-user-profile">
                        <div class="expert-card-info-user-profile-nick">
                            <div class="user-nick-wrapper">
                                <div class="user-nick-wrapper-labels">
                                    <div class="tooltip user-nick-wrapper-label-tooltip">
                                    <label data-label-type="label-Image" class="product-label user-nick-wrapper-labels-item">

                                    <img
                                    src="https://cdn-dantats.stunning.kr/static/feature/label/label-check.png" 
                                    class="blue-check">
                                    </label>

                                    <div class="tooltip-content ">
                                    인증된 봉사 단체 회원
                                    </div>
                                </div>
                                
                                <p title="CORKSTUDIO">
                                    <span class="nick">${volunteerGroup.memberNickName}</span>
                                </p>
                            
                                    <div></div>
                                    
                                </div>
                                
                            </div>
                            
                        </div>
                        <div class="expert-card-info-user-profile-introduction">
                            <p title="이유있는 디자인으로 성공적인 브랜딩을 실현합니다.">
                                ${volunteerGroup.memberIntroduction}
                            </p>
                        </div>
                        <div class="expert-card-info-user-profile-description">
                            <p title="Brand eXperience Designer Corkstudio">
                                Brand eXperience Designer Corkstudio
                            </p>
                        </div>
                    </div>
                    <div class="expert-card-info-meta">
                       
                       <!-- <div class="info-meta-container expert-card-info-meta-item">
                            <span class="expert-card-info-meta-item-title">봉사활동 모집 수</span>
                            <div class="expert-card-info-meta-item-spacer"></div>
                            <div class="expert-card-info-meta-item-value">
                                <p class="info-meta-default" title="00">
                                    <span class="number-text-number-container">
                                        <span class="number number-text-number">${volunteerGroup.countVt}</span>
                                        
                                    </span>
                                    <span class="number-text-suffix">회+</span>
                                </p>
                            </div>
                        </div> --!>
                     
                     
                        <div class="info-meta-container expert-card-info-meta-item">
                            <span class="expert-card-info-meta-item-title">후기</span>
                            <div class="expert-card-info-meta-item-spacer"></div>
                            <div class="expert-card-info-meta-item-value">
                                <p class="info-meta-default" title="00">
                                    <span class="number-text-number-container">
                                        <span class="number number-text-number">${volunteerGroup.countReview}</span>
                                       
                                    </span>
                                    <span class="number-text-suffix">개+</span>
                                </p>
                                <div class="rate" width="0">
                                    <svg class="icon-default icon" viewBox="0 0 12 12">
                                        <path fill-rule="evenodd" clip-rule="evenodd" d="M10.9643 4.74338C10.8835 4.50089 10.6777 4.32673 10.4285 4.2884L7.79006 3.88509L6.60669 1.35936C6.38168 0.880213 5.61832 0.880213 5.39331 1.35936L4.20994 3.88509L1.57152 4.2884C1.32235 4.32673 1.11651 4.50089 1.03567 4.74338C0.954003 4.99004 1.01484 5.25836 1.19484 5.44252L3.11741 7.41577L2.66156 10.2073C2.61989 10.469 2.72656 10.7256 2.9424 10.8773C3.0574 10.9589 3.19074 10.9998 3.32408 10.9998C3.43492 10.9998 3.54492 10.9723 3.64576 10.9165L6 9.61401L8.35424 10.9165C8.57675 11.0398 8.84759 11.0264 9.0576 10.8773C9.27344 10.7256 9.38011 10.469 9.33761 10.2065L8.88259 7.41577L10.8052 5.44252C10.9852 5.25836 11.046 4.99004 10.9643 4.74338Z"></path>
                                    </svg>
                                    ${volunteerGroup.memberStarRate}
                                </div>
                            </div>
                        </div>
                    </div>
                    <button class="inquiry-button expert-card-inquire">
                        <span class="visual-correction">정보 보기</span>
                    </button>
                </div>
            </div>
            <div class="expert-card-right">
                <div class="expert-card-portfolio-container 0">
                    <div class="card-img-container cover expert-card-portfolio">
                        <div class="card-image-default aspect-ratio-card-wrapper card-image">
                            <div>
                                <div class="observer"></div>
                                <img src="https://cdn-dantats.stunning.kr/prod/portfolios/fa970db0-abdd-4b41-a512-de0e18e3d27c/covers/SETbxtvUCTbJgS5e.%E1%84%85%E1%85%A6%E1%84%86%E1%85%A1%E1%84%8B%E1%85%A5%E1%84%92%E1%85%A1%E1%86%A8%E1%84%8B%E1%85%AF%E1%86%AB-%E1%84%85%E1%85%A9%E1%84%80%E1%85%A9-t.jpg.small?s=1200x1200&amp;e=0x0&amp;t=crop&amp;q=100&amp;f=webp" alt="의 레마어학원 이미지"/>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="expert-card-portfolio-container 1">
                    <div class="card-img-container cover expert-card-portfolio">
                        <div class="card-image-default aspect-ratio-card-wrapper card-image">
                            <div>
                                <div class="observer"></div>
                                <img src="https://cdn-dantats.stunning.kr/prod/portfolios/fa970db0-abdd-4b41-a512-de0e18e3d27c/covers/X8f6VD8EW4NRfBde.%E1%84%86%E1%85%B5%E1%84%83%E1%85%A1%E1%86%B7365%E1%84%92%E1%85%A1%E1%86%AB%E1%84%8B%E1%85%B4%E1%84%8B%E1%85%AF%E1%86%AB-%E1%84%85%E1%85%A9%E1%84%80%E1%85%A9-th.jpg.small?s=1200x1200&amp;e=0x0&amp;t=crop&amp;q=100&amp;f=webp" alt="의 미담365한의원 이미지"/>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="expert-card-portfolio-container 2">
                    <div class="card-img-container cover expert-card-portfolio">
                        <div class="card-image-default aspect-ratio-card-wrapper card-image">
                            <div>
                                <div class="observer"></div>
                                <img src="https://cdn-dantats.stunning.kr/prod/portfolios/fa970db0-abdd-4b41-a512-de0e18e3d27c/covers/DYS9dfLWDvY6N9bS.%E1%84%87%E1%85%A5%E1%86%B7%E1%84%89%E1%85%A5%E1%86%A8%E1%84%8B%E1%85%A7%E1%86%BC%E1%84%8E%E1%85%B5%E1%84%80%E1%85%AA-%E1%84%85%E1%85%A9%E1%84%80%E1%85%A9-th.jpg.small?s=1200x1200&amp;e=0x0&amp;t=crop&amp;q=100&amp;f=webp" alt="의 범석영치과 이미지"/>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="expert-card-portfolio-container 3">
                    <div class="card-img-container cover expert-card-portfolio">
                        <div class="card-image-default aspect-ratio-card-wrapper card-image">
                            <div>
                                <div class="observer"></div>
                                <img src="https://cdn-dantats.stunning.kr/prod/portfolios/fa970db0-abdd-4b41-a512-de0e18e3d27c/covers/PNTd47hANiZx9M3Y.ESPE-Logo-th.jpg.small?s=1200x1200&amp;e=0x0&amp;t=crop&amp;q=100&amp;f=webp" alt="의 Espe 이미지"/>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="expert-card-portfolio-container 4">
                    <div class="card-img-container cover expert-card-portfolio">
                        <div class="card-image-default aspect-ratio-card-wrapper card-image">
                            <div>
                                <div class="observer"></div>
                                <img src="https://cdn-dantats.stunning.kr/prod/portfolios/fa970db0-abdd-4b41-a512-de0e18e3d27c/covers/5VbQaRNneCj4vNbY.%E1%84%8B%E1%85%A9%E1%86%AF%E1%84%87%E1%85%A1%E1%84%85%E1%85%B3%E1%86%AB%E1%84%8F%E1%85%B5%E1%84%8C%E1%85%B3-%E1%84%85%E1%85%A9%E1%84%80%E1%85%A9-th.jpg.small?s=1200x1200&amp;e=0x0&amp;t=crop&amp;q=100&amp;f=webp" alt="의 ALL바른키즈 이미지"/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </a>
    </div>
`;

        container.innerHTML += cardHTML;
    })
};

const inputContainer = document.querySelector(
    ".react-datepicker-input-container"
);
const tabLoop = document.querySelector(".react-datepicker-tab-loop");
const dateDisplay = document.querySelector(
    ".react-datepicker-input-container input"
);
const monthElements = document.querySelectorAll(".react-datepicker-month-text");
const currentYear = 2024;
const today = new Date();

inputContainer.value = today.getFullYear() + "년 " + (today.getMonth() + 1) + "월";
dateDisplay.value = inputContainer.value;

// inputContainer를 클릭했을 때 tabLoop의 가시성을 토글
inputContainer.addEventListener("click", (e) => {
    tabLoop.classList.toggle("active");
});

// 문서의 다른 부분을 클릭했을 때 tabLoop를 숨김
document.addEventListener("click", (e) => {
    if (!inputContainer.contains(e.target) && !tabLoop.contains(e.target)) {
        tabLoop.classList.remove("active"); // 클릭한 요소가 inputContainer와 tabLoop 외부일 때 숨김
    }
});

// 각 월 요소에 클릭 이벤트 추가
monthElements.forEach((monthElement, index) => {
    monthElement.addEventListener("click", () => {
        // 선택한 월로 상단 날짜 업데이트
        const selectedMonth = index + 1;
        dateDisplay.value = `${currentYear}년 ${selectedMonth}월`;


        // 모든 월에서 active 클래스 제거 후, 클릭한 월에 추가
        monthElements.forEach((el) =>
            el.classList.remove("react-datepicker-month-text-keyboard-selected")
        );
        monthElement.classList.add("datepicker-month-text-keyboard-selected");

        tabLoop.classList.remove("active");
        console.log("month hi" + selectedMonth + "월");
        const filterType = document.querySelector('div.item.active').textContent;
        fetchFilteredRanking(globalThis.page, selectedMonth, filterType);
    });
});

// 항목 클릭 시 필터 업데이트 및 드롭다운 닫기
items.forEach((item) => {
    item.addEventListener("click", () => {
        const monthInput = document.querySelector("input#selected-month");
        const month = monthInput.value.length === 8 ? monthInput.value.substring(6, 7) : monthInput.value.substring(6, 8);
        // 모든 항목의 활성화 클래스 제거
        items.forEach((i) => i.classList.remove("active"));
        // 선택된 항목에 활성화 클래스 추가
        item.classList.add("active");
        // 선택된 항목의 텍스트를 input에 반영
        inputField.value = item.textContent;
        // 드롭다운 닫기
        bottomWrap.style.visibility = "hidden";
        arrow.style.transform = "rotate(90deg)";

        fetchFilteredRanking(globalThis.page, month, item.textContent);
        console.log("출력 시작");
        console.log(page);
        console.log(item.textContent);
    });
});

// ================================================================================================================================================================

// 페이지 네비게이션을 표시하는 함수
const showPaging = (pagination) => {
    const pagingDiv = document.querySelector("nav.page-container.paginator");
    let text = ``; // HTML 내용을 저장할 변수 초기화
    console.log(pagination);
    // 이전 페이지 버튼 추가
    if (pagination.page > 1) {
        text += `<a 
                    href="/rank?page=${pagination.page - 1}" 
                    class="page-btn prev"
                    ><svg
                        viewBox="0 0 12 12"
                        class="icon-default"
                    >
                        <path
                            fill-rule="evenodd"
                            clip-rule="evenodd"
                            d="M3.68888 11.0004C3.85188 11.0004 4.01388 10.9424 4.13688 10.8264L8.81688 6.43738C9.06088 6.20738 9.06088 5.83638 8.81588 5.60738L4.07988 1.17438C3.83288 0.942377 3.43288 0.942377 3.18588 1.17138C2.93888 1.40038 2.93788 1.77238 3.18388 2.00338L7.47788 6.02238L3.24088 9.99738C2.99588 10.2294 2.99688 10.6014 3.24488 10.8294C3.36788 10.9434 3.52888 11.0004 3.68888 11.0004Z"
                        ></path>
                        <defs></defs>
                    </svg>
                </a>`;
    }

    // 페이지 번호 생성
    for (let i = pagination.startPage; i <= pagination.endPage; i++) {
        if (pagination.page === i) {
            // 현재 페이지인 경우
            text += `<a class="page-btn active">${i}</a>`;
        } else {
            // 다른 페이지인 경우
            text += `<a href="/rank?page=${i}" class="page-btn">${i}</a>`;
        }
    }

    // 다음 페이지 버튼 추가: endPage가 realEnd보다 작거나, 더 로드할 데이터가 있을 경우
    const shouldShowNext = pagination.endPage < pagination.realEnd || (pagination.endRow < pagination.total);

    // 다음 페이지 버튼 추가: endPage가 realEnd보다 작거나, 더 로드할 데이터가 있을 경우
    if (shouldShowNext) {
        text += `<a 
                    href="/rank?page=${pagination.page + 1}" 
                    class="page-btn next"
                    ><svg
                        viewBox="0 0 12 12"
                        class="icon-default"
                    >
                        <path
                            fill-rule="evenodd"
                            clip-rule="evenodd"
                            d="M3.68888 11.0004C3.85188 11.0004 4.01388 10.9424 4.13688 10.8264L8.81688 6.43738C9.06088 6.20738 9.06088 5.83638 8.81588 5.60738L4.07988 1.17438C3.83288 0.942377 3.43288 0.942377 3.18588 1.17138C2.93888 1.40038 2.93788 1.77238 3.18388 2.00338L7.47788 6.02238L3.24088 9.99738C2.99588 10.2294 2.99688 10.6014 3.24488 10.8294C3.36788 10.9434 3.52888 11.0004 3.68888 11.0004Z"
                        ></path>
                        <defs></defs>
                    </svg>
                </a>`;
    }

    // 페이지 네비게이션을 HTML 요소에 삽입
    pagingDiv.innerHTML = text;

    document.querySelectorAll("a.page-btn").forEach((link) => {
        link.addEventListener("click", (e) => {
            e.preventDefault();
            const page = e.target.textContent;
            const monthInput = document.querySelector("input#selected-month");
            const month = monthInput.value.length === 8 ? monthInput.value.substring(6, 7) : monthInput.value.substring(6, 8);
            const filterType = document.querySelector('div.item.active').textContent;
            fetchFilteredRanking(page, month, filterType); // 해당 페이지의 게시글 데이터를 가져오기
        });
    });
}

// 필터링된 랭킹 목록 가져오는 함수
const fetchFilteredRanking = async (page, month, filterType) => {
    try {
        const response = await fetch(`/rank/rank-list?page=${page}&month=${month}&filterType=${filterType}`);
        const data = await response.json();
        renderRankings(data.vtRankMembers, ".praise-rank-list");
        renderRankings(data.supportRankMembers, ".contest-rank-list");
        renderRankings(data.donationRankMembers, ".sales-rank-list");
        showVolunteerGroups(data.volunteerGroups);
        showPaging(data.pagination);
        globalThis.page = data.pagination.page;

    } catch (error) {
        // 오류 처리
        console.log("필터링된 랭킹 목록 가져오는 중 오류");
    }
};

showVolunteerGroups(volunteerGroups);
showPaging(pagination);
