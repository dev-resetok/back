package com.app.back.controller.inquiry;
import com.app.back.domain.admin.AdminDTO;
import com.app.back.domain.inquiry.InquiryDTO;
import com.app.back.domain.inquiry_answer.InquiryAnswerDTO;
import com.app.back.domain.member.MemberDTO;
import com.app.back.domain.notice.NoticeDTO;
import com.app.back.domain.post.Pagination;
import com.app.back.domain.post.PostDTO;
import com.app.back.domain.post.Search;
import com.app.back.domain.report.ReportDTO;
import com.app.back.domain.review.ReviewDTO;
import com.app.back.enums.AdminPostStatus;
import com.app.back.enums.AdminPostType;
import com.app.back.enums.AdminReportStatus;
import com.app.back.service.inquiry.InquiryService;
import com.app.back.service.inquiryAnswer.InquiryAnswerService;
import com.app.back.service.notice.NoticeService;
import com.app.back.service.post.PostService;
import com.app.back.service.report.ReportService;
import com.app.back.service.review.ReviewService;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;

import org.springframework.web.bind.annotation.*;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;


import java.util.List;
import java.util.Optional;

@Controller
@RequiredArgsConstructor
@Slf4j
public class InquiryController {
    private final InquiryService inquiryService;
    private final InquiryAnswerService inquiryAnswerService;
    private final NoticeService noticeService;
    private final PostService postService;
    private final ReportService reportService;
    private final ReviewService reviewService;

@GetMapping("/admin")   // 관리자 페이지
public List<InquiryDTO> admin(Pagination pagination, Search search, HttpSession session) {
    return inquiryService.getList(pagination, search);
}
//  @RequestBody : HTTP 요청의 본문(body)에 포함된 JSON, XML, 또는 다른 형태의 데이터를 자바 객체로 매핑
//  @RequestParam :  URL의 쿼리 파라미터 또는 폼 데이터에서 특정 키-값 쌍을 메서드 파라미터로 매핑
@GetMapping("/admin/inquiry-page")
@ResponseBody
public AdminDTO getInquiryList(Pagination pagination, Search search, @RequestParam(required = false) String query, @RequestParam(required = false) String filterType) {
    // 검색어 설정
    search.setKeyword(query);

    int total;

    // 필터 타입이 null이거나 기본 "최신순"일 경우
    if (filterType == null || filterType.equals("최신순")) {
        pagination.setOrder("최신순"); // 기본 정렬 순서를 설정
        total = inquiryService.getTotalWithSearch(search); // 검색된 문의의 총 개수 조회
    } else {
        // "일반 문의"와 "봉사단체 가입 문의" 필터를 변환하고 필터된 총 개수 조회
        if ("일반 문의".equals(filterType)) {
            filterType = "NORMAL";
        } else if ("봉사단체 가입 문의".equals(filterType)) {
            filterType = "VOLUNTEER";
        }
        total = inquiryService.getTotalWithFilter(search, filterType);
    }

    // 총 개수를 페이지네이션에 설정하고 페이지 계산을 진행
    pagination.setTotal(total);
    pagination.progress();

    List<InquiryDTO> inquiries;

    // 설정된 정렬 조건에 따라 문의 목록 조회
    if (pagination.getOrder() != null && pagination.getOrder().equals("최신순")) {
        inquiries = inquiryService.getList(pagination, search); // 기본 정렬로 문의 목록 조회
    } else {
        inquiries = inquiryService.getFilterList(pagination, search, filterType); // 필터된 문의 목록 조회
    }

    // 결과 데이터를 AdminDTO에 설정하여 반환
    AdminDTO adminDTO = new AdminDTO();
    adminDTO.setInquiries(inquiries);
    adminDTO.setPagination(pagination);

    return adminDTO;
}

// 문의 목록 삭제 (논리 삭제)
@PatchMapping("/admin/delete-inquirys")
@ResponseBody
public void deleteInquirys(@RequestBody List<Long> inquriyIds) {
    inquriyIds.forEach(inquriyId -> postService.updateStatus(inquriyId, AdminPostStatus.DELETED));
}


//  문의 조회
@GetMapping("/admin/inquiry-answer")
@ResponseBody
public AdminDTO getInquiryAnswer(@RequestParam Long id) {
    Optional<InquiryDTO> inquiry = inquiryService.getPost(id);
    AdminDTO result = new AdminDTO();

    if (inquiry.isPresent()) {
        result.setInquiries(List.of(inquiry.get()));
        result.setPagination(new Pagination());
        result.setSuccess(true);
    } else {
        result.setInquiries(List.of());
        result.setPagination(new Pagination());
        result.setSuccess(false);
        result.setMessage("문의가 없습니다");
    }

    return result;
}

//  문의 조회에서 답변하기
@PostMapping("/admin/inquiry-answer")
@ResponseBody
public AdminDTO submitAnswer(@RequestBody InquiryAnswerDTO inquiryAnswerDTO) {
    AdminDTO result = new AdminDTO();

    inquiryAnswerService.write(inquiryAnswerDTO); // 답변 서비스 호출
    inquiryService.updateInquiryStatus(inquiryAnswerDTO.getInquiryId(), "COMPLETE"); // 문의 상태 변경

    result.setInquiries(List.of());  // 성공 시 빈 리스트 반환
    result.setPagination(new Pagination()); // 기본 Pagination 객체 설정

    return result;
}

//  공지사항 목록
@GetMapping("/admin/notice-list")
@ResponseBody
public AdminDTO getNoticeList(Pagination pagination, Search search, @RequestParam(required = false) String query) {
    // 검색어 설정
    search.setKeyword(query);
    pagination.setOrder("created_date desc"); // 정렬 기준 설정 (최신순)

    // 검색어가 있을 경우 검색된 총 개수 조회
    if (search.getKeyword() != null) {
        pagination.setTotal(noticeService.getTotalWithSearch(search));
    } else {
        // 검색어가 없을 경우 전체 개수 조회
        pagination.setTotal(noticeService.getTotal());
    }

    // 페이징 처리 진행
    pagination.progress();

    // 공지사항 목록 조회
    List<NoticeDTO> notices = noticeService.getList(pagination, search);
    // 결과를 담을 AdminDTO 객체 생성
    AdminDTO result = new AdminDTO();
    result.setNotices(notices); // 조회된 공지사항 목록을 AdminDTO에 담기
    result.setPagination(pagination); // 페이징 정보도 담기

    return result;
}

// 공지사항 삭제 (논리 삭제)
@PatchMapping("/admin/delete-notices")
@ResponseBody
public void deleteNotices(@RequestBody List<Long> noticeIds) {
    log.info("삭제할 아이디: {}", noticeIds);
    noticeIds.forEach(noticeId -> noticeService.updateStatus(noticeId, AdminPostStatus.DELETED));
    log.info("공지사항 ID {} 상태를 DELETED로 설정", noticeIds);
}

@PostMapping("/admin/add-notice")
@ResponseBody
public ResponseEntity<Void> addNotice(@RequestBody NoticeDTO noticeDTO) {
    noticeDTO.setMemberId(2L); // memberId를 임의로 2로 설정
    noticeService.write(noticeDTO);
    return ResponseEntity.status(HttpStatus.CREATED).build();
}

// 공지사항 업데이트
@PatchMapping("/admin/notice-update")
@ResponseBody
public ResponseEntity<Void> updateNotice(@RequestBody NoticeDTO noticeDTO) {
    log.info("수정할 공지사항 ID: {}, 제목: {}, 내용: {}", noticeDTO.getId(), noticeDTO.getPostTitle(), noticeDTO.getPostContent());
    noticeService.update(noticeDTO);  // 공지사항 수정 메서드 호출
    return ResponseEntity.ok().build();  // 상태 코드 200 OK 응답
}



// 공지사항 조회
@GetMapping("/admin/notice-detail")
@ResponseBody
public AdminDTO getNoticeRead(@RequestParam Long id) {
    Optional<NoticeDTO> notice = noticeService.getPost(id);
    AdminDTO result = new AdminDTO();

    if (notice.isPresent()) {
        result.setSuccess(true);
        result.setNotice(notice.get());
    } else {
        result.setSuccess(false);
        result.setMessage("조회를 못 했어요");
    }

    return result;
}

@GetMapping("/admin/post-list")
@ResponseBody
public AdminDTO getPostList(Pagination pagination, Search search, @RequestParam(required = false) String query, @RequestParam(required = false) String filterType) {
    search.setKeyword(query);
    int total;
    log.info("받은 필터 타입: {}", filterType); // 필터 타입 확인 로그

    if (filterType == null || filterType.equals("작성일 순")) { // 필터 타입이 null이거나 기본 "작성일 순"일 경우
        pagination.setOrder("작성일 순"); // 기본 정렬 순서를 설정
        total = postService.getTotalWithSearch(search); // 검색된 게시글의 총 개수 조회
    }
    // 조회수 순 또는 댓글수 순일 경우
    else if (filterType.equals("조회수 순") || filterType.equals("댓글수 순")) {
        pagination.setOrder(filterType); // 조회수 또는 댓글수를 기준으로 정렬 설정
        total = postService.getTotalWithSearch(search); // 검색된 게시글의 총 개수 조회
    }
    // 게시글 유형으로 필터링할 경우
    else {
        AdminPostType postTypeEnum = AdminPostType.fromDisplayName(filterType);
        total = postService.getTotalWithFilter(search, postTypeEnum); // 필터된 게시글의 총 개수 조회
    }

    // 총 개수를 페이지네이션에 설정하고 페이지 계산을 진행
    pagination.setTotal(total);
    pagination.progress();

    List<PostDTO> posts;

    // 설정된 정렬 조건에 따라 게시글 목록 조회
    if (pagination.getOrder() != null && (pagination.getOrder().equals("작성일 순") || pagination.getOrder().equals("조회수 순") || pagination.getOrder().equals("댓글수 순"))) {
        posts = postService.getList(pagination, search); // 기본 또는 조회수, 댓글수 순으로 게시글 목록 조회
    } else {
        AdminPostType postTypeEnum = AdminPostType.fromDisplayName(filterType);
        posts = postService.getFilterList(pagination, search, postTypeEnum);
    }

    // 결과 데이터를 AdminDTO에 설정하여 반환
    AdminDTO result = new AdminDTO();
    result.setPosts(posts);
    result.setPagination(pagination);

    return result;
}

//  게시글 조회
//@GetMapping("/admin/post-detail")
//public AdminDTO getPostDetail(@RequestParam Long id) {
//    Optional<PostDTO> post = postService.getPost(id);
//    AdminDTO result = new AdminDTO();
//
//    if (post.isPresent()) {
//        result.setSuccess(true);
//        result.setPost(post.get());
//    } else {
//        result.setSuccess(false);
//        result.setMessage("Post not found");
//    }
//    return result;
//}

// 게시글 조회 페이지 이동
@GetMapping("admin/post-detail")
@ResponseBody
public String showPostDetail(@RequestParam("postId") Long postId, Model model, HttpSession session) {
    Optional<PostDTO> postDTO = postService.getPost(postId);

    if (postDTO.isPresent()) {
        model.addAttribute("post", postDTO.get());
    } else {
        log.info("포스트 조회 실패: 존재하지 않는 포스트 ID {}", postId);
    }

    return "post/post-detail";
}
// 이용 후기 조회 모달창
@GetMapping("/admin/review-detail")
@ResponseBody
public ResponseEntity<AdminDTO> getReviewDetail(@RequestParam Long reviewId) {
    Optional<ReviewDTO> review = reviewService.getById(reviewId);
    AdminDTO response = new AdminDTO();

    if (review.isPresent()) {
        response.setSuccess(true);
        response.setReview(review.get());
    } else {
        response.setSuccess(false);
        response.setMessage("조회된 아이디가 없습니다.");
    }

    return ResponseEntity.ok(response);
}

// 게시글 삭제 (논리 삭제)
@PatchMapping("/admin/delete-posts")
@ResponseBody
public void deletePosts(@RequestBody List<Long> postIds) {
    postIds.forEach(postId -> postService.updateStatus(postId, AdminPostStatus.DELETED));
}

// 게시글 상태 업데이트
@PatchMapping("/admin/update-post-status")
@ResponseBody
public void updatePostStatus(@RequestParam Long id, @RequestParam AdminPostStatus status) {
    postService.updateStatus(id, status);
}

// 신고 목록
@GetMapping("/admin/report-list")
@ResponseBody
public AdminDTO getReportList(Pagination pagination, Search search, @RequestParam(required = false) String query, @RequestParam(required = false) String filterType) {
    search.setKeyword(query);
    int total;
    log.info("받은 필터 타입: {}", filterType); // 필터 타입 확인 로그
    // 필터 타입이 설정되어 있는 경우에만 필터 적용
    if (filterType == null || filterType.equals("신고일 순")) {
        pagination.setOrder("신고일 순"); // 기본 정렬 순서를 설정
        total = reportService.getTotalReportsWithSearch(search); // 검색된 신고의 총 개수 조회
    } else {
        total = reportService.getTotalReportsWithFilter(search, filterType); // 필터된 신고의 총 개수 조회
        log.info("필터 '{}' 적용된 신고 개수: {}", filterType, total); // 필터 적용 결과 개수 출력
    }

    // 페이지네이션에 총 개수 설정 및 페이지 계산
    pagination.setTotal(total);
    pagination.progress();

    List<ReportDTO> reports;

    // 설정된 정렬 조건에 따라 신고 목록 조회
    if (pagination.getOrder() != null && pagination.getOrder().equals("신고일 순")) {
        reports = reportService.getAllReports(pagination, search); // 신고일 순으로 전체 신고 목록 조회
    } else {
        reports = reportService.getFilteredReports(pagination, search, filterType);
        log.info("필터 '{}' 적용하여 가져온 신고 개수: {}건", filterType, reports.size()); // 필터 적용된 결과 개수 출력
    }

    // 결과 데이터를 AdminDTO에 설정하여 반환
    AdminDTO result = new AdminDTO();
    result.setReports(reports);
    result.setPagination(pagination);

    return result;
}

// 신고 삭제 (softdelete)
// foreach 내부에는 새로운 변수 이름을 사용해야 함
@PatchMapping("/admin/delete-reports")
@ResponseBody
public void deleteReports(@RequestBody List<Long> reportIds) {
    log.info("삭제할 아이디: {}", reportIds);
    reportIds.forEach(reportId -> postService.updateStatus(reportId,AdminPostStatus.DELETED));
    log.info("신고 ID {} 상태를 DELETED로 설정", reportIds);
}

// 신고 목록 상태 업데이트
@PatchMapping("/admin/update-report-status")
@ResponseBody
public void updateReportStatus(@RequestBody AdminDTO adminDTO) {
    List<Long> selectedIds = adminDTO.getSelectedIds();
    selectedIds.forEach(id -> reportService.updateReportStatus(id, AdminReportStatus.COMPLETE));
}

@GetMapping("/my-inquirys/{memberId}")
@ResponseBody
public List<InquiryDTO> getMyInquirys(
        @PathVariable Long memberId,
        @RequestParam(required = false) String startDate,
        @RequestParam(required = false) String endDate){

    log.info("받은 회원 ID: {}, 시작 날짜: {}, 끝 날짜: {}",
            memberId, startDate, endDate);

    if (startDate != null && endDate != null) {
        return inquiryService.findByMemberIdAndDateRange(memberId, startDate, endDate);
    } else {
        return inquiryService.findByMemberId(memberId);
    }
}


}
