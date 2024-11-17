document.addEventListener("DOMContentLoaded", function () {
    const emailInput = document.getElementById("email");
    const sendButton = document.querySelector(".password-btn-complete");
    const warningMessage = document.querySelector(".waring-msg");

    const emailRegex = /^[^\s@]+@[^\s@]+\.(com|net)$/;
    const registeredEmails = ["test@example.com", "user@domain.com"]; // 등록된 이메일 예시

    // 이메일 입력란 포커스 시 색상 변경
    emailInput.addEventListener("focus", function () {
        emailInput.style.borderColor = "blue"; // 기본 포커스 색상
    });

    // 이메일 입력란에서 포커스가 벗어날 때 색상 초기화
    emailInput.addEventListener("blur", function () {
        emailInput.style.borderColor = "#ccc"; // 기본 색상
    });

    // 전송하기 버튼 클릭 시 유효성 검사
    sendButton.addEventListener("click", function () {
        const emailValue = emailInput.value.trim();

        // 이메일 입력란이 비어있을 때 경고 메시지 출력
        if (emailValue === "") {
            emailInput.style.borderColor = "#f05050"; // 경고 색상
            warningMessage.textContent = "이메일 주소를 입력해 주세요.";
            warningMessage.classList.add("warning-msg");
            warningMessage.style.display = "block";
            return;
        }

        // 이메일 형식이 유효하지 않을 때 경고 메시지 출력
        if (!emailRegex.test(emailValue)) {
            emailInput.style.borderColor = "#f05050"; // 경고 색상
            warningMessage.textContent = "올바른 이메일을 입력해주세요.";
            warningMessage.classList.add("warning-msg");
            warningMessage.style.display = "block";
            return;
        }

        // 등록되지 않은 이메일일 경우 경고 메시지 출력
        // if (!registeredEmails.includes(emailValue)) {
        //     emailInput.style.borderColor = "#f05050"; // 경고 색상
        //     warningMessage.textContent = "가입되지 않은 이메일 입니다.";
        //     warningMessage.classList.add("warning-msg");
        //     warningMessage.style.display = "block";
        //     return;
        // }
        //
        // // 성공 시 메시지 출력 및 경고 숨기기
        // emailInput.style.borderColor = "#189f14"; // 성공 색상
        // warningMessage.style.display = "none";
        // alert("비밀번호 변경 이메일을 전송했습니다.");
    });

    // 입력 중 경고 메시지 숨기기
    emailInput.addEventListener("input", function () {
        if (warningMessage.style.display === "block") {
            warningMessage.style.display = "none"; // 경고 메시지 숨기기
            emailInput.style.borderColor = "blue"; // 입력 중 포커스 색상 유지
        }
    });

    document.getElementById('send-email-btn').addEventListener('click', () => {
        const email = document.getElementById('email').value;

        fetch('/password-reset/send-email', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: email }),
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert('이메일이 발송되었습니다.');
                } else {
                    document.querySelector('.waring-msg').style.display = 'block';
                }
            })
            .catch(error => console.error('Error:', error));
    });
});
