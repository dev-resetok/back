package com.app.back.interceptor;

import com.app.back.domain.member.MemberDTO;
import com.app.back.domain.member.MemberVO;
import com.app.back.service.alarm.AlarmService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.servlet.HandlerInterceptor;

@Slf4j
public class AlarmInterceptor implements HandlerInterceptor {
    private final AlarmService alarmService;

    public AlarmInterceptor(AlarmService alarmService) {
        this.alarmService = alarmService;
    }

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {

        MemberDTO loginMember = (MemberDTO) request.getSession().getAttribute("loginMember");
        if (loginMember != null) {
            Long memberId = loginMember.getId();
            var unreadAlarms = alarmService.getUnreadAlarmsByMemberId(memberId);
            request.setAttribute("latestAlarms", unreadAlarms);

            var allAlarms = alarmService.getAlarmsByMemberId(memberId);
            request.setAttribute("allAlarms", allAlarms);
        } else {
            log.info("로그인되지 않은 사용자입니다. 알람을 가져오지 않습니다.");
        }

        return true;
    }
}
