package com.app.back.controller.review;

import com.app.back.domain.donation_record.DonationRecordDTO;
import com.app.back.domain.post.Pagination;
import com.app.back.domain.review.ReviewDTO;
import com.app.back.service.attachment.AttachmentServiceImpl;
import com.app.back.service.post.PostService;
import com.app.back.service.review.ReviewService;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import net.coobird.thumbnailator.Thumbnailator;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.view.RedirectView;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@Controller
@RequestMapping("/review/*")
@RequiredArgsConstructor
@Slf4j
public class ReviewController {
    private final PostService postService;
    private final ReviewService reviewService;
    private final HttpSession session;
    private final AttachmentServiceImpl attachmentServiceImpl;

    @GetMapping("review-write")
    public String goToWriteForm(ReviewDTO reviewDTO) { return "review/review-write"; }

    @PostMapping("review-write")
    public RedirectView reviewWrite(ReviewDTO reviewDTO, @RequestParam("uuid") List<String> uuids, @RequestParam("realName") List<String> realNames, @RequestParam("path") List<String> paths, @RequestParam("size") List<String>sizes, @RequestParam("file") List<MultipartFile> files) throws IOException {
        reviewDTO.setMemberId(23L);
        reviewDTO.setPostType("REVIEW");
        reviewDTO.setPostTitle(reviewDTO.getVtGroupName());

        if (reviewDTO.getPostTitle() == null || reviewDTO.getPostContent() == null) {
            log.error("필수 데이터가 없습니다.");
            return new RedirectView("/review/review-write");
        }
//        데이터가 문제없으면 세션에 저장
//        session.setAttribute("review", reviewDTO);

        // 데이터베이스에 게시글 저장
        reviewService.write(reviewDTO, uuids, realNames, paths, sizes, files);

        return new RedirectView("/review/review-list");
    }

    private String getPath() {
        return LocalDate.now().format(DateTimeFormatter.ofPattern("yyyy/MM/dd"));
    }

    @GetMapping("review-list")
    public String goToList(Pagination pagination, Model model, @RequestParam(required = false) String filterType) {
        if (pagination.getOrder() == null) {
            pagination.setOrder("created_date desc, n.id desc"); // 기본 정렬 기준
        }
        pagination.setTotal(postService.getTotal("REVIEW"));
        pagination.progressReview();
        model.addAttribute("reviews", reviewService.getList(pagination));
        log.info("{}", reviewService.getList(pagination));
        log.info("{}", reviewService.getList(pagination).size());

        return "review/review-list";
    }

    @GetMapping("review-update")
    public String goToUpdateForm(@RequestParam("postId") Long postId, Model model) {
        Optional<ReviewDTO> reviewDTO =reviewService.getById(postId);

        if (reviewDTO.isPresent()) {
            model.addAttribute("review", reviewDTO.get());
        } else {
//            return "redirect:/review/review-list"; // 마이페이지로 리턴하기
        }

        return "review/review-update";
    }

    @PostMapping("review-update")
    public RedirectView reviewUpdate(ReviewDTO reviewDTO) {
        reviewService.update(reviewDTO);
        return new RedirectView("/review/review-list"); // 마이페이지로 리턴
    }

    @PostMapping("/review-delete")
    public RedirectView reviewDelete(@RequestBody Map<String, Long> payload) {
        Long postId = payload.get("postId");
        reviewService.delete(postId);
        return new RedirectView("/review/review-list");
    }

    @GetMapping("/my-review/{memberId}")
    @ResponseBody
    public List<ReviewDTO> getMyReviews(
            @PathVariable Long memberId,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate) {

        log.info("받은 회원 ID: {}, 시작 날짜: {}, 끝 날짜: {}",
                memberId, startDate, endDate);

        if (startDate != null && endDate != null) {
            return reviewService.findByMemberIdAndDateRange(memberId, startDate, endDate);
        } else {
            return reviewService.findByMemberId(memberId);
        }
    }

    @GetMapping("/lastest-review")
    @ResponseBody
    public List<ReviewDTO> getLatestReviews() {
        log.info("최신 리뷰 10개 조회 요청");
        return reviewService.getLatest10Reviews();
    }

    }
