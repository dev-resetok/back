// 결제 버튼 클릭 이벤트
document.getElementById("paymentButton").addEventListener("click", function () {
    const workId = document.querySelector(".layout").getAttribute("data-work-id");
    const memberProfileId = document.querySelector(".layout").getAttribute("data-member-id");
    const profileName = document.querySelector(".layout").getAttribute("data-profile-name");
    const profilePhone = document.querySelector(".layout").getAttribute("data-profile-phone");
    const profileEmail = document.querySelector(".layout").getAttribute("data-profile-email");
    const workPrice = document.querySelector(".work-price .price-detail").textContent.replace("원", "").trim();
    const workTitle = document.querySelector(".title").textContent;

    console.log("workPrice:", workPrice);
    console.log("workTitle:", workTitle);
    console.log("memberProfileId:", memberProfileId);
    console.log("profileName:", profileName);
    console.log("profilePhone:", profilePhone);
    console.log("profileEmail:", profileEmail);

    Bootpay.requestPayment({
        application_id: "660e7f36943b38693860d7e9",
        price: parseInt(workPrice, 10),
        order_name: workTitle, // 포인트 충전
        order_id: workId, // 결제 내역 id
        pg: "카카오페이",
        method: "간편",
        tax_free: 0,
        user: {
            id: memberProfileId, // 회원 id
            username: profileName, // 이름
            phone: profilePhone, // 전화번호
            email: profileEmail // 이메일
        },
        items: [
            {
                id: workId, // 결제 내역 id
                name: workTitle, // 포인트 충전
                qty: 1,
                price: parseInt(workPrice, 10)
            }
        ],
        extra: {
            open_type: "iframe",
            card_quota: "0,2,3",
            escrow: false
        }
    })
        .then(async (response) => {
            console.log("결제 응답:", response); // 결제 성공 응답 로그 출력
            // 결제 성공 시 서버에 데이터 전송
            await completePayment(workId, memberProfileId);
            alert("결제가 성공적으로 완료되었습니다.");
            window.location.href = `/text/detail/${workId}`;
        })
        .catch((error) => {
            console.error("결제 요청 중 오류 발생:", error.message);
            alert("결제 중 오류가 발생했습니다. 다시 시도해주세요.");
        });
});

// 결제 완료 시 서버로 데이터 전송 함수
async function completePayment(workId, memberProfileId) {
    try {
        const response = await fetch("/text/order", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                workId: workId,
                memberProfileId: memberProfileId
            })
        });

        if (!response.ok) {
            console.error("서버에 결제 정보 전송 실패:", await response.text());
            alert("결제 정보 저장에 실패했습니다.");
        } else {
            console.log("서버에 결제 정보 전송 성공");
        }
    } catch (error) {
        console.error("결제 완료 데이터 전송 중 오류 발생:", error);
    }
}
