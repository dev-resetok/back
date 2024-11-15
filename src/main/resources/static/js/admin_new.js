const notificationWriteButton = document.querySelector("button#notification-write-button");
const goToUpdateNotificationBtn = document.querySelector("a.go-update.admin-btn");
const adminNickNameWrap = document.querySelector("#admin-id-wrap");

notificationWriteButton.addEventListener("click", (e) => {
    const sections = document.querySelectorAll("section.admin-page");
    sections.forEach((section) => section.classList.remove("selected"));
    const notificationWriteSection = Array.from(sections).find(
        (section) => section.dataset.value === "공지사항 작성"
    );
    notificationWriteSection.classList.add("selected");
});

goToUpdateNotificationBtn.addEventListener("click", (e) => {
    const sections = document.querySelectorAll("section.admin-page");
    sections.forEach((section) => section.classList.remove("selected"));
    const notificationUpdateSection = Array.from(sections).find(
        (section) => section.dataset.value === "공지사항 수정"
    );
    notificationUpdateSection.classList.add("selected");
});

adminNickNameWrap.innerText = member.memberNickName;