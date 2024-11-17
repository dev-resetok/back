package com.app.back.controller.rank;

import com.app.back.domain.member.MemberDTO;
import com.app.back.domain.post.Pagination;
import com.app.back.domain.rank.RankDTO;
import com.app.back.service.member.MemberService;
import com.app.back.service.rank.RankService;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import net.coobird.thumbnailator.Thumbnailator;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.io.*;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Controller
@RequiredArgsConstructor
@Slf4j
public class RankController {
    private final RankService rankService;

    @GetMapping("/rank")
    public String goToList(HttpSession session, Pagination pagination, Model model) {

        MemberDTO loginMember = (MemberDTO) session.getAttribute("loginMember"); // MemberDTO로 캐스팅
        boolean isLoggedIn = (loginMember != null);

        model.addAttribute("vtRankMembers", rankService.selectTop5ByVt(new Date().getMonth() + 1));
        model.addAttribute("supportRankMembers", rankService.selectTop5BySupport(new Date().getMonth() + 1));
        model.addAttribute("donationRankMembers", rankService.selectTop5ByDonation(new Date().getMonth() + 1));


        log.info("회원 봉사 랭킹 : {}", model.getAttribute("vtRankMembers"));
        log.info("회원 후원 랭킹 : {}", model.getAttribute("supportRankMembers"));
        log.info("회원 기부 랭킹 : {}", model.getAttribute("donationRankMembers"));

        pagination.setOrder("별점순");
        pagination.setTotal(rankService.getAllVolunteerGroup(pagination).size());
        pagination.progressReview();
        model.addAttribute("volunteerGroups", rankService.getTop100VolunteerGroup(pagination));
        model.addAttribute("pagination", pagination);
        log.info("봉사활동 단체 회원 랭킹 목록 : {}", model.getAttribute("volunteerGroups"));
        log.info("봉사활동 단체 회원 명수 : {}", rankService.getTop100VolunteerGroup(pagination).size());
        log.info("페이지 : {}", pagination.getPage().toString());
        log.info("페이지네이션 시작 : {}", pagination.getStartRow());
        log.info("페이지네이션 끝 : {}", pagination.getEndRow());

        model.addAttribute("isLogin", isLoggedIn);
        if (isLoggedIn) {
            model.addAttribute("member", loginMember);
        }
        log.info("Navigating to rank page. isLogin: {}", isLoggedIn);

        return "rank/rank";
    }

    @GetMapping("/rank/rank-list")
    @ResponseBody
    public RankDTO getList(Pagination pagination, @RequestParam("month") String month, @RequestParam("filterType") String filterType) {

        RankDTO rankDTO = new RankDTO();

        if(month == null) {
            log.info("month 미 입력 : 첫 로딩");
            month = new Date().getMonth() + 1 + "";
            log.info("month : " + month);
        }

        if(Integer.parseInt(month) > 0 && Integer.parseInt(month) <= 12) {
            rankDTO.setVtRankMembers(rankService.selectTop5ByVt(Integer.parseInt(month)));
            rankDTO.setSupportRankMembers(rankService.selectTop5BySupport(Integer.parseInt(month)));
            rankDTO.setDonationRankMembers(rankService.selectTop5ByDonation(Integer.parseInt(month)));
            rankDTO.setPagination(pagination);

            log.info("회원 봉사 랭킹 : {}", rankDTO.getVtRankMembers());
            log.info("회원 후원 랭킹 : {}", rankDTO.getSupportRankMembers());
            log.info("회원 기부 랭킹 : {}", rankDTO.getDonationRankMembers());
        } else {
            log.info("오류 : month 범위 오류");
        }

        pagination.setOrder(filterType);
        if (pagination.getOrder() == null || pagination.getOrder().equals("별점순")) {
            pagination.setOrder("별점순"); // 기본 정렬 기준
            log.info("별점순");
        } else if (pagination.getOrder().equals("리뷰순")) {
            pagination.setOrder("리뷰순");
            log.info("리뷰순");
        } else {
            log.info("오류 : filterType 미 입력");
        }
        pagination.setTotal(rankService.getAllVolunteerGroup(pagination).size());
        pagination.progressReview();
        rankDTO.setVolunteerGroups(rankService.getTop100VolunteerGroup(pagination));
        log.info("서비스 출력 : {}", rankService.getTop100VolunteerGroup(pagination));
        log.info("봉사활동 단체 회원 랭킹 목록 : {}", rankDTO.getVolunteerGroups());
        log.info("봉사활동 단체 회원 명수 : {}", rankService.getTop100VolunteerGroup(pagination).size());
        log.info("페이지 : {}", pagination.getPage().toString());
        log.info("페이지네이션 시작 : {}", pagination.getStartRow());
        log.info("페이지네이션 끝 : {}", pagination.getEndRow());
        log.info("토탈 : {}", pagination.getTotal());
        log.info("들어옴dddd");

        return rankDTO;
    }
}
