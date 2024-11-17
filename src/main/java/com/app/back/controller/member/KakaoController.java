package com.app.back.controller.member;

import com.app.back.domain.member.MemberDTO;
import com.app.back.domain.member.MemberVO;
import com.app.back.enums.MemberLoginType;
import com.app.back.service.member.KakaoService;
import com.app.back.service.member.MemberService;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.servlet.view.RedirectView;

import java.util.Optional;

@Controller
@Slf4j
@RequiredArgsConstructor
public class KakaoController {
    private final KakaoService kakaoService;
    private final MemberService memberService;

    @GetMapping("/kakao/login")
    public RedirectView kakaoLogin(String code, HttpSession session) {
        String token = kakaoService.getKakaoAccessToken(code);
        Optional<MemberDTO> kakaoInfoOpt = kakaoService.getKakaoInfo(token);


        if (!kakaoInfoOpt.isPresent()) {
            log.error("카카오 인증 실패");
            return new RedirectView("/error-page");

        }

        MemberDTO kakaoInfo = kakaoInfoOpt.get();
        Optional<MemberVO> kakaoMemberOpt = memberService.getKakaoMember(kakaoInfo.getKakaoEmail());
        log.info("kakaoMemberOpt: {}", kakaoMemberOpt);

        if (kakaoMemberOpt.isPresent()) {
            log.info("기존 카카오 회원입니다: {}", kakaoMemberOpt.get());
            MemberDTO memberDTOFromVO = kakaoMemberOpt.get().toDTO(); // VO를 DTO로 변환
            session.setAttribute("loginMember", memberDTOFromVO); // MemberDTO 저장
            session.setAttribute("loginType", MemberLoginType.KAKAO);
        } else {
            log.info("신규 카카오 회원입니다. 회원가입을 진행합니다.");
            // 신규 회원 가입 처리
            MemberDTO newMemberDTO = new MemberDTO();
            newMemberDTO.setKakaoEmail(kakaoInfo.getKakaoEmail());
            newMemberDTO.setKakaoProfileURL(kakaoInfo.getKakaoProfileURL());
            newMemberDTO.setKakaoNickName(kakaoInfo.getKakaoNickName());
            newMemberDTO.setMemberLoginType(MemberLoginType.KAKAO.name());
            newMemberDTO.setMemberName(kakaoInfo.getKakaoNickName()); // 예시로 닉네임을 이름으로 설정

            MemberVO newMemberVO = newMemberDTO.toVO();
            memberService.join(newMemberVO);
            log.info("신규 카카오 회원 가입 처리 완료: {}", newMemberVO.getKakaoEmail());

            // 저장된 회원 정보 조회 (kakaoEmail을 기준으로 조회)
            Optional<MemberVO> savedMemberOpt = memberService.getKakaoMember(newMemberVO.getKakaoEmail());
            if (savedMemberOpt.isPresent()) {
                MemberDTO savedMemberDTO = savedMemberOpt.get().toDTO(); // VO를 DTO로 변환
                session.setAttribute("loginMember", savedMemberDTO); // MemberDTO 저장
                session.setAttribute("loginType", MemberLoginType.KAKAO);
                log.info("신규 카카오 회원 로그인 처리 완료: {}", savedMemberDTO.getKakaoEmail());
            } else {
                log.error("회원가입 후 회원 정보 조회 실패: {}", newMemberVO.getKakaoEmail());
                return new RedirectView("/error-page");
            }
        }

        return new RedirectView("/main/main");
    }
}
