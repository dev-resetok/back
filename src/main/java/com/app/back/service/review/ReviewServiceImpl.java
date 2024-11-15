package com.app.back.service.review;
import com.app.back.domain.post.Pagination;
import com.app.back.domain.post.PostVO;
import com.app.back.domain.review.ReviewDTO;
import com.app.back.domain.review.ReviewVO;
import com.app.back.mapper.post.PostMapper;
import com.app.back.mapper.review.ReviewMapper;
import com.app.back.repository.attachment.AttachmentDAO;
import com.app.back.repository.post.PostDAO;
import com.app.back.repository.review.ReviewDAO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Primary;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

@Slf4j
@Service // 이 클래스가 서비스임을 나타냄
@Primary // 우선 순위가 높은 서비스
@RequiredArgsConstructor // 생성자 자동 생성
@Transactional(rollbackFor = Exception.class) // 예외 발생 시 롤백 처리
public class ReviewServiceImpl implements ReviewService {
    private final ReviewDAO reviewDAO;
    private final PostDAO postDAO; // 게시글 DAO
    private final AttachmentDAO attachmentDAO;

    @Override
    public void write(ReviewDTO reviewDTO, List<String> uuids, List<String> realNames, List<String> paths, List<String> sizes, List<MultipartFile> files) throws IOException {
        postDAO.save(reviewDTO.toPostVO());
        Long id = postDAO.selectCurrentId();
        reviewDTO.setId(id);
        reviewDTO.setPostId(id);
        reviewDAO.save(reviewDTO.toVO());
        if(files != null) {
            for(int i=0; i<files.size(); i++){
                reviewDTO.setAttachmentFileName(uuids.get(i) + "_" + files.get(i).getOriginalFilename());
                reviewDTO.setAttachmentFileRealName(realNames.get(i));
                reviewDTO.setAttachmentFilePath(paths.get(i));
                reviewDTO.setAttachmentFileSize(sizes.get(i));
                reviewDTO.setAttachmentFileType(files.get(i).getContentType());
                attachmentDAO.save(reviewDTO.toAttachmentVO());
            }
        }
//        if(reviewDTO.getAttachmentFileName() != null && reviewDTO.getAttachmentFilePath() != null && reviewDTO.getAttachmentFileType() != null && reviewDTO.getAttachmentFileSize() != null) {
//            attachmentDAO.save(reviewDTO.toAttachmentVO());
//        }
    }

    @Override
    public Optional<ReviewDTO> getById(Long id) {
        return reviewDAO.findById(id);
    }

    @Override
    public List<ReviewDTO> getList(Pagination pagination) {
        return reviewDAO.findAll(pagination); // 페이징된 Q&A 게시글 목록 조회
    }

    @Override
    public int getTotal() {
        return reviewDAO.findCount(); // 총 Q&A 게시글 수 조회
    }

    @Override
    public void update(ReviewDTO reviewDTO) {
        reviewDAO.update(reviewDTO); // Q&A 게시글 수정
    }

    @Override
    @Transactional
    public void delete(Long id) {
        attachmentDAO.deleteByPostId(id);
        reviewDAO.delete(id);
        postDAO.delete(id);
        // ID로 Q&A 게시글 삭제 (필요하다면 추가)
    }

    @Override
    public List<ReviewDTO> findByMemberId(Long memberId) {
        return reviewDAO.findByMemberId(memberId);
    }

    @Override
    public List<ReviewDTO> findByMemberIdAndDateRange(Long memberId, String startDate, String endDate) {
        return reviewDAO.findByMemberIdAndDateRange(memberId, startDate, endDate);
    }

    @Override
    public List<ReviewDTO> getLatest10Reviews() {
        return reviewDAO.findTop10();
    }
}