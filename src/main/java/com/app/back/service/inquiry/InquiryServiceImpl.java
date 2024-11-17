package com.app.back.service.inquiry;

import com.app.back.domain.attachment.AttachmentVO;
import com.app.back.domain.inquiry.InquiryDTO;
import com.app.back.domain.post.Pagination;
import com.app.back.domain.post.Search;
import com.app.back.enums.InquiryType;
import com.app.back.repository.attachment.AttachmentDAO;
import com.app.back.repository.inquiry.InquiryDAO;
import com.app.back.repository.post.PostDAO;
import com.app.back.service.attachment.AttachmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional(rollbackFor = Exception.class)
public class InquiryServiceImpl implements InquiryService {
    private final InquiryDAO inquiryDAO;
    private final AttachmentDAO attachmentDAO;
    private final PostDAO postDAO; // 게시글 DAO
    private final AttachmentService attachmentService;

    // 문의 작성 메소드
    @Override
    public void write(InquiryDTO inquiryDTO) {
        // 먼저 tbl_post에 데이터 저장
        postDAO.save(inquiryDTO.toPostVO());

        // 방금 삽입된 ID 조회 (가장 최근 생성된 ID)
        Long newId = postDAO.selectCurrentId();

        // 조회한 ID를 문의 ID로 설정
        inquiryDTO.setId(newId);

        // 첨부파일이 있을 경우 tbl_attachment에 저장
        if (inquiryDTO.getAttachmentFileName() != null && inquiryDTO.getAttachmentFilePath() != null && inquiryDTO.getAttachmentFileType() != null && inquiryDTO.getAttachmentFileSize() != null) {
            attachmentDAO.save(inquiryDTO.toAttachmentVO());
        }

        // 새로운 아이디로 tbl_inquiry에 데이터 저장
        inquiryDAO.save(inquiryDTO.toVO());
    }


    @Override
    public List<InquiryDTO> getList(Pagination pagination, Search search) {
        List<InquiryDTO> inquiries = inquiryDAO.findAll(pagination, search);

        // 조회된 inquiryType을 displayName으로 변환
        inquiries.forEach(inquiry -> {
            inquiry.setInquiryType(InquiryType.valueOf(inquiry.getInquiryType()).getDisplayName());
        });

        return inquiries;
    }
    @Override
    public List<InquiryDTO> getFilterList(Pagination pagination, Search search, String filterType) {
        if ("일반 문의".equals(filterType)) {
            filterType = "NORMAL";
        } else if ("봉사단체 가입 문의".equals(filterType)) {
            filterType = "VOLUNTEER";
        }

        List<InquiryDTO> inquiries = inquiryDAO.findFilterAll(pagination, search, filterType);

        // 조회된 inquiryType을 displayName으로 변환
        inquiries.forEach(inquiry -> {
            inquiry.setInquiryType(InquiryType.valueOf(inquiry.getInquiryType()).getDisplayName());
        });

        return inquiries;
    }

    @Override
    public Optional<InquiryDTO> getPost(Long id) {
        return inquiryDAO.findById(id);
    }
    @Override
    public void update(InquiryDTO inquiryDTO) {
        inquiryDAO.update(inquiryDTO.toVO());
    }

    @Override
    public void updateInquiryStatus(Long id, String status) {
        inquiryDAO.updateStatus(id, status);
    }

    @Override
    public void delete(Long id) {
        inquiryDAO.delete(id);
    }

    @Override
    public int getTotal() {
        return inquiryDAO.getTotal();
    }

    @Override
    public int getTotalWithFilter(Search search, String filterType) {
        // filterType 값이 "일반 문의"인 경우
        if ("일반 문의".equals(filterType)) {
            filterType = "NORMAL"; // 이를 "NORMAL"로 변환
        }
        // filterType 값이 "봉사단체 가입 문의"인 경우
        else if ("봉사단체 가입 문의".equals(filterType)) {
            filterType = "VOLUNTEER"; // 이를 "VOLUNTEER"로 변환
        }
        // 변환된 filterType을 사용하여 데이터베이스에서 필터된 데이터의 총 개수 조회
        return inquiryDAO.getTotalWithFilter(search, filterType);
    }



    @Override
    public int getTotalWithSearch(Search search) {
        return inquiryDAO.getTotalWithSearch(search);
    }

    @Override
    public List<InquiryDTO> findByMemberId(Long memberId) {
        return inquiryDAO.findByMemberId(memberId);
    }

    @Override
    public List<InquiryDTO> findByMemberIdAndDateRange(Long memberId, String startDate, String endDate) {
        return inquiryDAO.findByMemberIdAndDateRange(memberId, startDate, endDate);
    }

}
