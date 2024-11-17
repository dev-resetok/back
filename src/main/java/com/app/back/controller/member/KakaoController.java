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
        Optional<MemberDTO> kakaoInfo = kakaoService.getKakaoInfo(token);

        if (kakaoInfo.isPresent()) {
            Optional<MemberVO> kakaoMemberOpt = memberService.getKakaoMember(kakaoInfo.get().getKakaoEmail());
            if (kakaoMemberOpt.isPresent()) {
                session.setAttribute("loginMember", kakaoMemberOpt.get());
                session.setAttribute("loginType", MemberLoginType.KAKAO);
            } else {
                log.error("카카오 회원 정보가 없습니다.");
                return new RedirectView("/error-page");
            }
        } else {
            log.error("카카오 인증 실패");
            return new RedirectView("/error-page");
        }

        return new RedirectView("/main/main");
    }

}
