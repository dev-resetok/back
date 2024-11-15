package com.app.back.service.notice;


import com.app.back.domain.attachment.AttachmentVO;
import com.app.back.domain.notice.NoticeDTO;
import com.app.back.domain.notice.NoticeVO;
import com.app.back.domain.post.Pagination;
import com.app.back.domain.post.Search;
import com.app.back.enums.AdminPostStatus;
import com.app.back.repository.attachment.AttachmentDAO;
import com.app.back.repository.notice.NoticeDAO;
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
public class NoticeServiceImpl implements NoticeService{
    private final NoticeDAO noticeDAO;
    private final PostDAO postDAO;
    private final AttachmentDAO attachmentDAO;
    private final AttachmentService attachmentService;

    @Override
    public void write(NoticeDTO noticeDTO) {
        postDAO.save(noticeDTO.toPostVO());  // 먼저 tbl_post에 데이터 저장
        Long newId = postDAO.selectCurrentId(); // 방금 삽입된 ID 조회
        noticeDTO.setId(newId); // 조회한 ID를 공지사항 ID로 설정
        noticeDAO.save(noticeDTO.toVO()); // tbl_notice에 데이터 저장
    }

    @Override
    public List<NoticeDTO> getList(Pagination pagination, Search search) {
        return noticeDAO.findAll(pagination, search);
    }

    @Override
    public Optional<NoticeDTO> getPost(Long id) {
        return noticeDAO.findById(id);
    }
    @Override
    public void update(NoticeDTO noticeDTO) {
        noticeDAO.update(noticeDTO);
    }

    @Override
    public void delete(Long id) {
        noticeDAO.delete(id);
    }

    @Override
    public int getTotal() {
        return noticeDAO.getTotal();
    }

    @Override
    public int getTotalWithSearch(Search search) {
        return noticeDAO.getTotalWithSearch(search);
    }

    @Override
    public void updateStatus(Long id, AdminPostStatus status) {
        noticeDAO.updateStatus(id, status.name());
    }

}
