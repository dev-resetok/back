const arrows = document.querySelectorAll(".slick-arrow"); // 좌우 화살표 버튼 선택
const banner = document.querySelector(".slick-track"); // 배너 컨테이너 선택

let autoSlideInterval = null; // 자동 슬라이드 인터벌을 저장할 변수
let count = 1; // 현재 슬라이드 위치를 나타내는 카운터 초기화
let arrowCheck = true; // 화살표 버튼의 중복 클릭 방지 플래그

async function loadBanners() {
    try {
        const response = await fetch('/support/lastest-support');
        const supports = await response.json();

        // 기존 배너 삭제 후 새 배너 추가
        banner.innerHTML = '';

        // 각 지원 데이터를 슬라이드로 변환
        const slides = supports.slice(0, 9).map(support => {
            const bannerSlide = document.createElement("div");
            bannerSlide.classList.add("slick-slide");
            bannerSlide.innerHTML = `
                <div>
                    <a href="/support/support-inquiry/${support.id}" class="lggyey ejtbh banner-link pc" style="width: 1038px; display: inline-block;">
                        <div class="banner-content-wrapper inner1">
                            <div class="banner-content-wrapper inner2">
                                <div class="banner-content-wrapper inner3">
                                    <span class="cotmec banner-web-sub-title">후원 게시판</span>
                                    <span class="cotmec banner-web-title">${support.postTitle}</span>
                                </div>
                                <button class="elrdiz banner-button-primary">
                                    자세히 알아보기
                                    <svg viewBox="0 0 12 12" class="ifpvod banner-button-arrow">
                                        <path fill-rule="evenodd" clip-rule="evenodd" d="M3.68888 11.0004C3.85188 11.0004 4.01388 10.9424 4.13688 10.8264L8.81688 6.43738C9.06088 6.20738 9.06088 5.83638 8.81588 5.60738L4.07988 1.17438C3.83288 0.942377 3.43288 0.942377 3.18588 1.17138C2.93888 1.40038 2.93788 1.77238 3.18388 2.00338L7.47788 6.02238L3.24088 9.99738C2.99588 10.2294 2.99688 10.6014 3.24488 10.8294C3.36788 10.9434 3.52888 11.0004 3.68888 11.0004Z"></path>
                                    </svg>
                                </button>
                            </div>
                            <img class="hkaqym banner-web-image" src="${support.attachmentFileName ? `/attachment/display?attachmentFileName=${support.attachmentFilePath + "/t_" + support.attachmentFileName + support.attachmentFileRealName}` : '/images/default-banner.jpg'}" alt="banner image">
                        </div>
                    </a>
                </div>
            `;
            return bannerSlide;
        });

        // 첫 번째와 마지막 슬라이드를 복제하여 무한 슬라이드 구현
        const firstSlideClone = slides[0].cloneNode(true); // 첫 번째 슬라이드 복제본
        const lastSlideClone = slides[slides.length - 1].cloneNode(true); // 마지막 슬라이드 복제본

        banner.insertBefore(lastSlideClone, banner.firstChild); // 마지막 슬라이드 복제본을 맨 앞에 추가
        slides.forEach(slide => banner.appendChild(slide)); // 실제 슬라이드 추가
        banner.appendChild(firstSlideClone); // 첫 번째 슬라이드 복제본을 맨 끝에 추가

        // 초기 위치는 사용자가 설정한 기본 위치로 유지
        banner.style.transition = 'none';
        banner.style.transform = `translateX(4248px)`; // 사용자 지정 위치
        setTimeout(() => {
            banner.style.transition = ''; // 트랜지션 활성화
        }, 50);

        setupAutoSlide(); // 자동 슬라이드 시작
    } catch (error) {
        console.error("Error loading support banners:", error);
    }
}

document.addEventListener("DOMContentLoaded", loadBanners); // 페이지 로드 시 배너 로드

// 자동 슬라이드 함수
const autoSlide = () => {
    count++;
    banner.style.transition = `transform 0.5s`;
    banner.style.transform = `translateX(${5310 - (1062 * count)}px)`; // 사용자 지정 위치로 이동

    // 마지막 슬라이드에서 첫 번째 슬라이드로 자연스럽게 이동
    if (count === banner.children.length - 1) {
        setTimeout(() => {
            banner.style.transition = 'none';
            banner.style.transform = `translateX(4248px)`;
            count = 1;
        }, 500);
    }
};

// 자동 슬라이드 시작
autoSlideInterval = setInterval(autoSlide, 5000); // 5초 간격으로 자동 슬라이드 실행

arrows.forEach((arrow) => {
    arrow.addEventListener("click", () => {
        if (!arrowCheck) return;
        arrowCheck = false;
        clearInterval(autoSlideInterval);

        const direction = arrow.classList.contains("slick-prev") ? -1 : 1;
        count += direction;
        banner.style.transition = `transform 0.5s`;
        banner.style.transform = `translateX(${5310 - (1062 * count)}px)`; // 사용자 지정 위치 유지

        // 복제된 슬라이드로 이동 시 위치 초기화
        if (count === 0) {
            setTimeout(() => {
                banner.style.transition = 'none';
                banner.style.transform = `translateX(${5310 - (1062 * (banner.children.length - 2))}px)`;
                count = banner.children.length - 2;
            }, 500);
        } else if (count === banner.children.length - 1) {
            setTimeout(() => {
                banner.style.transition = 'none';
                banner.style.transform = `translateX(4248px)`;
                count = 1;
            }, 500);
        }

        // 화살표 클릭 후 자동 슬라이드 재시작
        autoSlideInterval = setInterval(autoSlide, 5000);
        setTimeout(() => (arrowCheck = true), 500);
    });
});

document.addEventListener("DOMContentLoaded", function () {
    // 리뷰 로드 후 롤러 복제 및 애니메이션 초기화
    loadReviews().then(() => {
        initializeMarquee();
    }).catch(error => {
        console.error('리뷰 로딩 또는 롤러 초기화 중 오류 발생:', error);
    });
});

async function loadReviews() {
    try {
        const response = await fetch('/review/lastest-review');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const reviews = await response.json();

        const reviewContainer = document.querySelector('.rfm-initial-child-container');
        reviewContainer.innerHTML = '';

        reviews.forEach((review) => {
            const reviewCard = `
                <div class="rfm-child">
                    <div class="main-home-review-card">
                        <a class="hlisls iookvl">
                            <div class="top-part">
                                <div class="image-outer">
                                    <div class="hnuwji cover">
                                        <div class="jslvlk aspect-ratio-card-wrapper card-image">
                                            <div>
                                                <div class="observer"></div>
                                                <img class="hkaqym" src="${review.attachmentFileName ? `/attachment/display?attachmentFileName=${review.attachmentFilePath}/t_${review.attachmentFileName}${review.attachmentFileRealName}` : 'default-image.jpg'}" alt="review image">
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <div class="bqlqxa user-review">
                                        ${generateStars(review.reviewStarRate)}
                                        <span class="review-count">${review.reviewStarRate}점</span>
                                    </div>
                                    <div class="user-info">
                                        <span class="cwvgid avatar">
                                            <img src="${review.profileFileName ? `/profile/display?memberId=${review.memberId}` : 'default-avatar.jpg'}" alt="프로필">
                                        </span>
                                        <div class="ktmctf user-nick-wrapper">
                                            <p class="jqtfdi">
                                                <span class="hdbjzp nick">${review.memberNickName || '익명'}</span>
                                            </p>
                                        </div>
                                        <div color="#E9EBED" class="diltce"></div>
                                        <p class="date">${review.createdDate}</p>
                                    </div>
                                </div>
                            </div>
                            <div class="content-wrapper">
                                <div>
                                    <div class="info-wrapper">
                                        <p class="ffbtyh" title="${review.postTitle}">
                                            ${review.postContent}
                                        </p>
                                    </div>
                                </div>
                                <div class="bottom-info">
                                    <label class="gqdbhp contest">${review.vtGroupName}</label>
                                    <p>${review.postType || '기타'}</p>
                                    <div color="#E9EBED" class="czkero"></div>
                                    <span class="product-type">봉사 내용 : ${review.postSummary}</span>
                                </div>
                            </div>
                        </a>
                    </div>
                </div>
            `;
            reviewContainer.insertAdjacentHTML('beforeend', reviewCard);
        });
    } catch (error) {
        console.error('후기를 불러오는 중 오류 발생:', error);
        throw error; // 오류를 상위로 전달하여 후속 처리를 가능하게 함
    }
}

function generateStars(rating) {
    return Array(rating).fill().map(() => `
        <svg type="star24" color="#2656F6" viewBox="0 0 24 24" class="cafwxx">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M21.952 9.56083C21.8461 9.24417 21.5795 9.01667 21.2545 8.9675L15.4071 8.07583L12.788 2.505C12.6405 2.19417 12.3397 2 12.0006 2C11.6606 2 11.3597 2.19417 11.2123 2.50583L8.59315 8.07583L2.74498 8.9675C2.42165 9.01667 2.15416 9.24417 2.0475 9.56083C1.93917 9.885 2.01916 10.2375 2.25666 10.4808L6.50821 14.7808L5.49907 20.9592C5.44157 21.3042 5.58157 21.6425 5.86323 21.8408C6.01239 21.9467 6.18655 22 6.35988 22C6.50154 22 6.64487 21.9642 6.7757 21.8917L12.0006 19.0092L17.2246 21.8917C17.5154 22.0517 17.8662 22.0325 18.1371 21.8408C18.4179 21.6425 18.5587 21.3042 18.5004 20.96L17.4654 14.8558L21.7436 10.4808C21.9811 10.2375 22.0611 9.88583 21.952 9.56083Z"></path>
        </svg>
    `).join('');
}

function initializeMarquee() {
    // 롤러 복제본 생성
    const roller = document.querySelector(".rfm-initial-child-container");
    roller.id = "roller1"; // 첫 번째 롤러 아이디 설정
    roller.classList.add("original"); // original 클래스 추가

    const clone = roller.cloneNode(true); // 자식까지 복제하도록 true 설정
    clone.id = "roller2"; // 복제본에 아이디 부여
    clone.classList.remove("original"); // original 클래스 제거
    clone.classList.add("clone"); // clone 클래스 추가
    document.querySelector(".rfm-marquee").appendChild(clone); // rfm-marquee에 복제본 추가
}


document.addEventListener("DOMContentLoaded", () => {
    // 드롭다운 필터 설정
    const filterContainer = document.querySelector(".filter-default");
    const headerWrap = filterContainer?.querySelector(".header-wrap");
    const bottomWrap = filterContainer?.querySelector(".bottom-wrap");
    const arrow = filterContainer?.querySelector(".arrow");
    const items = filterContainer?.querySelectorAll(".item");
    const inputField = headerWrap?.querySelector("input");

    if (headerWrap && bottomWrap && arrow && items && inputField) {
        headerWrap.addEventListener("click", () => {
            const isVisible = bottomWrap.style.display === "block";
            bottomWrap.style.display = isVisible ? "none" : "block";
            arrow.style.transform = isVisible ? "rotate(90deg)" : "rotate(-90deg)";
        });

        items.forEach((item) => {
            item.addEventListener("click", () => {
                items.forEach((i) => i.classList.remove("active"));
                item.classList.add("active");
                inputField.value = item.textContent;
                bottomWrap.style.display = "none";
                arrow.style.transform = "rotate(90deg)";

                const page = new URLSearchParams(window.location.search).get('page') || 1;
                const month = document.querySelector("input#selected-month")?.value.trim().substring(6, 7);

                if (month) fetchFilteredRanking(page, month, item.textContent);
            });
        });

        document.addEventListener("click", (event) => {
            if (!filterContainer.contains(event.target)) {
                bottomWrap.style.display = "none";
                arrow.style.transform = "rotate(90deg)";
            }
        });
    }

    fetchRankData(11);

    function fetchRankData(month) {
        fetch(`/simple-rank?month=${month}`)
            .then(response => response.json())
            .then(data => {
                renderRankList(data.vtRankMembers, '.praise-rank-list');
                renderRankList(data.supportRankMembers, '.contest-rank-list');
                renderRankList(data.donationRankMembers, '.sales-rank-list');
            })
            .catch(error => console.error("Error loading rank data:", error));
    }

    function renderRankList(rankings, containerClass) {
        const listContainer = document.querySelector(containerClass);
        listContainer.innerHTML = ''; // 기존 목록 초기화

        rankings.forEach((user, i) => {
            let svgColor = null;

            if (i === 0) {
                svgColor = "rgb(255, 225, 133)";
            } else if (i === 1 || i === 2) {
                svgColor = "rgb(219, 222, 226)";
            }

            const svgElement = svgColor
                ? `<svg class="rank-crown" style="fill: ${svgColor};" viewBox="0 0 52 38">
               <path fill-rule="evenodd" clip-rule="evenodd" d="M10.3699 6.6267C10.3699 6.6267 9.95615 3.37591 15.7487 0C15.7487 0 15.197 4.37609 10.3699 6.6267ZM8.17862 8.76431C8.17862 8.76431 6.09431 6.09256 9.38843 0.610352C9.38843 0.610352 11.2215 4.68935 8.17862 8.76431ZM6.06946 12.9234C6.06946 12.9234 3.50656 10.619 5.70432 4.70264C5.70432 4.70264 8.28851 8.43258 6.06946 12.9234ZM5.10401 16.4241C5.10401 16.4241 1.7907 15.1257 1.45726 8.89014C1.45726 8.89014 5.36389 11.5089 5.10401 16.4241ZM5.92331 21.6789C5.92331 21.6789 2.48251 20.6898 1.45738 14.5166C1.45738 14.5166 5.63524 16.7649 5.92331 21.6789ZM7.02661 25.0546C7.02661 25.0546 3.42442 25.2639 0 19.8477C0 19.8477 4.79283 20.5697 7.02661 25.0546ZM7.52088 11.4869C7.52088 11.4869 7.6348 8.21615 13.9086 5.64258C13.9086 5.64258 12.6585 9.89886 7.52088 11.4869ZM6.07315 19.3112C6.07315 19.3112 4.63901 16.3082 9.10541 11.5566C9.10541 11.5566 9.97476 15.8901 6.07315 19.3112ZM9.24553 26.8128C9.24553 26.8128 6.2252 24.6519 7.7673 18.146C7.7673 18.146 10.9996 21.8143 9.24553 26.8128ZM11.728 30.3132C11.728 30.3132 7.72293 31.0021 3.05384 25.3638C3.05384 25.3638 8.53614 25.5684 11.728 30.3132ZM14.4864 32.5635C14.4864 32.5635 11.0671 34.5758 4.39089 30.9597C4.39089 30.9597 9.55062 29.2675 14.4864 32.5635ZM19.5893 34.6893C19.5893 34.6893 16.7841 37.371 9.36018 35.2708C9.36018 35.2708 13.9401 32.5314 19.5893 34.6893ZM24.4165 35.8147C24.4165 35.8147 22.0824 38.8447 14.3965 37.7693C14.3965 37.7693 18.476 34.4427 24.4165 35.8147ZM16.0035 32.6887C16.0035 32.6887 12.0468 31.7991 10.4 24.9087C10.4 24.9087 15.2876 27.1693 16.0035 32.6887ZM24.4165 35.6895C24.4165 35.6895 20.3545 36.0015 16.3494 29.958C16.3494 29.958 21.7795 30.6725 24.4165 35.6895ZM41.6299 6.6267C41.6299 6.6267 42.0437 3.37591 36.2511 0C36.2511 0 36.8028 4.37609 41.6299 6.6267ZM43.8213 8.76431C43.8213 8.76431 45.9055 6.09256 42.6115 0.610352C42.6115 0.610352 40.7783 4.68935 43.8213 8.76431ZM45.9305 12.9234C45.9305 12.9234 48.4934 10.619 46.2957 4.70264C46.2957 4.70264 43.7113 8.43258 45.9305 12.9234ZM46.8959 16.4241C46.8959 16.4241 50.2092 15.1257 50.5426 8.89014C50.5426 8.89014 46.636 11.5089 46.8959 16.4241ZM46.0766 21.6789C46.0766 21.6789 49.5174 20.6898 50.5427 14.5166C50.5427 14.5166 46.3647 16.7649 46.0766 21.6789ZM44.9732 25.0545C44.9732 25.0545 48.5755 25.2638 52 19.8477C52 19.8477 47.2071 20.5696 44.9732 25.0545ZM44.4791 11.4869C44.4791 11.4869 44.3653 8.21615 38.0914 5.64258C38.0914 5.64258 39.3414 9.89886 44.4791 11.4869ZM45.9268 19.3112C45.9268 19.3112 47.361 16.3082 42.8946 11.5566C42.8946 11.5566 42.0251 15.8901 45.9268 19.3112ZM42.7544 26.8128C42.7544 26.8128 45.7747 24.6519 44.2326 18.146C44.2326 18.146 41.0003 21.8143 42.7544 26.8128ZM40.2718 30.3132C40.2718 30.3132 44.2769 31.0021 48.946 25.3638C48.946 25.3638 43.4636 25.5684 40.2718 30.3132ZM37.5135 32.5635C37.5135 32.5635 40.9328 34.5758 47.609 30.9597C47.609 30.9597 42.4492 29.2675 37.5135 32.5635Z"></path>
      </svg>`
                : "";


            // 프로필 이미지 URL 설정
            const profileImageSrc = `/profile/display?memberId=${user.id}`;

            const listItem = document.createElement("li");
            listItem.classList.add("user-rank-article");
            listItem.innerHTML = `
            <article class="user-rank-article rank-user">
                <div class="avatar-wrap">
                    ${svgElement}
                    <a class="user-img avatar" href="/mypage/mypage?id=${user.id}">
                        <img class="profile"
                             src="${profileImageSrc}"
                             alt="${user.memberNickName || '익명'}의 프로필 이미지"
                             onerror="this.onerror=null; this.src='/images/default-avatar.jpg';" />
                    </a>
                </div>
                <p class="user-rank rank-number">${i + 1}</p>
                <div class="nick-wrap">
                    <div class="user-nick-default user-nick-wrapper">
                        <p title="${user.memberNickName || '익명'}">
                            <a class="nick" href="/mypage/mypage?id=${user.id}">${user.memberNickName || '익명'}</a>
                        </p>
                    </div>
                </div>
            </article>
        `;
            listContainer.appendChild(listItem);
        });
    }


    document.querySelectorAll(".react-datepicker-month-text").forEach((monthElement, index) => {
        monthElement.addEventListener("click", () => {
            const selectedMonth = index + 1;
            fetchRankData(selectedMonth);
        });
    });
});

const inputContainer = document.querySelector(
    ".react-datepicker-input-container"
);
const tabLoop = document.querySelector(".react-datepicker-tab-loop");
const dateDisplay = document.querySelector(
    ".react-datepicker-input-container input"
);
const monthElements = document.querySelectorAll(".react-datepicker-month-text");
const monthInput = document.querySelector("input#month");
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

        monthInput.value = dateDisplay.value.trim().substring(6,7);

        // 모든 월에서 active 클래스 제거 후, 클릭한 월에 추가
        monthElements.forEach((el) =>
            el.classList.remove("react-datepicker-month-text-keyboard-selected")
        );
        monthElement.classList.add("datepicker-month-text-keyboard-selected");

        tabLoop.classList.remove("active");
        console.log("month hi" + selectedMonth + "월");
        const page = new URLSearchParams(window.location.search).get('page') == null ? 1 : new URLSearchParams(window.location.search).get('page');
        const filterType = document.querySelector('div.item.active').textContent;
        fetchFilteredRanking(page, selectedMonth, filterType);
    });
});
