package com.app.back.controller.notice;


import com.app.back.domain.attachment.AttachmentVO;
import com.app.back.domain.inquiry.InquiryDTO;
import com.app.back.domain.member.MemberDTO;
import com.app.back.domain.notice.NoticeDTO;
import com.app.back.domain.post.Pagination;
import com.app.back.domain.post.Search;
import com.app.back.enums.InquiryType;
import com.app.back.service.inquiry.InquiryService;
import com.app.back.service.notice.NoticeService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.servlet.view.RedirectView;

import java.io.File;
import java.io.IOException;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;
import java.util.UUID;



@Controller
@RequestMapping("/help/*")
@RequiredArgsConstructor
@Slf4j
public class NoticeController {
    private final NoticeService noticeService;
    private final InquiryService inquiryService;
    private final HttpSession session;

    @GetMapping("help")
    public String showHelpPage() {
        return "help/help";
    }

    @GetMapping("help-write")
    public String goToInquiryWrite(InquiryDTO inquiryDTO) {
        return "help/help-write"; // 문의 작성 페이지로 이동
    }

    @PostMapping("help-write")
    public RedirectView inquiryWrite(@RequestParam("file") List<MultipartFile> files, InquiryDTO inquiryDTO,AttachmentVO attachmentVO, HttpSession session) throws IOException {
        MemberDTO loginMember = (MemberDTO) session.getAttribute("loginMember");
        inquiryDTO.setMemberId(loginMember.getId());
        inquiryDTO.setPostType("INQUIRY");

        // InquiryType 한글명을 코드값으로 변환
        InquiryType inquiryType = InquiryType.NORMAL; // 기본값 설정 (혹은 적절한 기본값)
        if ("일반 문의".equals(inquiryDTO.getInquiryType())) {
            inquiryType = InquiryType.NORMAL;
        } else if ("봉사단체 가입 문의".equals(inquiryDTO.getInquiryType())) {
            inquiryType = InquiryType.VOLUNTEER;
        }
        inquiryDTO.setInquiryType(inquiryType.name());

        String rootPath = "C:/upload" + getPath();
        UUID uuid = UUID.randomUUID();

        File directory = new File(rootPath);
        if(!directory.exists()){
            directory.mkdirs();
        }

        // 데이터베이스에 게시글 저장
        inquiryService.write(inquiryDTO);

        return new RedirectView("/help/help");
    }
    private String getPath() {
        return LocalDate.now().format(DateTimeFormatter.ofPattern("yyyy/MM/dd"));
    }

    @GetMapping("help-notification-list")
    public String getList(Pagination pagination, Search search, Model model) {
        if (search.getKeyword() != null && !search.getKeyword().isEmpty()) {
            pagination.setTotal(noticeService.getTotalWithSearch(search));
        } else {
            pagination.setTotal(noticeService.getTotal());
        }
        pagination.progress();
        model.addAttribute("notices", noticeService.getList(pagination, search));
        model.addAttribute("search", search);
        return "help/help-notification-list";
    }



    @GetMapping("/help/help-notification-inquiry")
    public String getNoticeDetail(@RequestParam("id") Long id, Model model, Pagination pagination, Search search) {
        Optional<NoticeDTO> notice = noticeService.getPost(id);
        if (notice.isPresent()) {
            model.addAttribute("notice", notice.get());

            // 기본 정렬 기준 설정
            if (pagination.getOrder() == null) {
                pagination.setOrder("created_date desc, n.id desc");
            }

            // 검색어에 따라 전체 게시물 수 설정
            if (search.getKeyword() != null || search.getTypes() != null) {
                pagination.setTotal(noticeService.getTotalWithSearch(search));
            } else {
                pagination.setTotal(noticeService.getTotal());
            }

            // 사이드바에 표시할 공지사항 목록 추가
            pagination.progress();
            model.addAttribute("notices", noticeService.getList(pagination, search));

            return "help/help-notification-inquiry"; // 조회 페이지로 이동
        } else {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Notice not found"); // 없는 경우 404 오류 발생
        }
    }



}



