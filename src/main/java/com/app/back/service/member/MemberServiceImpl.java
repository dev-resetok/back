package com.app.back.service.member;

import com.app.back.domain.Util.SmsUtil;
import com.app.back.domain.member.MemberVO;
import com.app.back.repository.member.MemberDAO;
import jakarta.mail.MessagingException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.UnsupportedEncodingException;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;

@Service
@RequiredArgsConstructor
@Primary
@Transactional(rollbackFor = Exception.class)
@Slf4j
public class MemberServiceImpl implements MemberService {
    private final MemberDAO memberDAO;
    private final SmsUtil smsUtil;
    private final com.app.back.domain.Util.EmailUtil emailUtil; // EmailUtil 주입


    // 인증번호 저장소 (메모리에서 관리)
    private final ConcurrentHashMap<String, String> authCodeStorage = new ConcurrentHashMap<>();
    private final ConcurrentHashMap<String, String> emailAuthCodeStorage = new ConcurrentHashMap<>();

    // SMS 인증번호 전송 메서드
    @Override
    public void sendAuthCode(String to) {
        String authCode = smsUtil.sendAuthenticationCode(to);
        if (authCode != null) {
            authCodeStorage.put(to, authCode);
            log.info("인증번호 [{}]가 {}로 전송되었습니다.", authCode, to);
        }
    }

    // 인증번호 검증 메서드
    @Override
    public boolean verifyAuthCode(String phoneNumber, String inputCode) {
        String storedCode = authCodeStorage.get(phoneNumber);
        if (storedCode != null && storedCode.equals(inputCode)) {
            authCodeStorage.remove(phoneNumber); // 인증 후 제거하기
            log.info("인증 성공: {}", phoneNumber);
            return true;
        } else {
            log.warn("인증 실패: {}", phoneNumber);
            return false;
        }
    }
    // 이메일 인증번호 전송 메서드 추가
    @Override
    public void sendEmailAuthCode(String email) {
        String authCode = emailUtil.generateAuthCode();
        try {
            emailUtil.sendAuthEmail(email, authCode);
            emailAuthCodeStorage.put(email, authCode);
            log.info("인증번호 [{}]가 {}로 이메일 전송되었습니다.", authCode, email);
        } catch (MessagingException | UnsupportedEncodingException e) {
            log.error("이메일 전송 실패: {}", e.getMessage());
        }
    }

    @Override
    public boolean verifyEmailAuthCode(String email, String inputCode) {
        String storedCode = emailAuthCodeStorage.get(email);
        if (storedCode != null && storedCode.equals(inputCode)) {
            emailAuthCodeStorage.remove(email);
            log.info("이메일 인증 성공: {}", email);
            return true;
        } else {
            log.warn("이메일 인증 실패: {}", email);
            return false;
        }
    }

    @Override
    public void join(MemberVO memberVO) {
//        log.info("가입할 회원 정보: {}", memberVO);
        Optional<MemberVO> foundKakaoMember =
                memberDAO.findByMemberKakaoEmail(memberVO.getKakaoEmail());

        if (foundKakaoMember.isEmpty()) {
            memberDAO.save(memberVO);
        }
    }

    @Override
    public Optional<MemberVO> login(MemberVO memberVO) {
        return memberDAO.findByMemberEmailAndMemberPassword(memberVO);
    }

    @Override
    public Optional<MemberVO> getMember(Long id) {
        return memberDAO.findById(id);
    }

    @Override
    public void update(MemberVO memberVO) {
        memberDAO.setMember(memberVO);
    }

    @Override
    public void delete(Long id) {
        memberDAO.delete(id);
    }

    @Override
    public Optional<MemberVO> getKakaoMember(String memberKakaoEmail) {
        return memberDAO.findByMemberKakaoEmail(memberKakaoEmail);
    }
    @Override
    public List<MemberVO> getAllMembers() {
        return memberDAO.findAll();
    }

}

