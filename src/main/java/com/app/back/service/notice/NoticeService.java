package com.app.back.service.notice;

import com.app.back.domain.attachment.AttachmentVO;
import com.app.back.domain.notice.NoticeDTO;
import com.app.back.domain.notice.NoticeVO;
import com.app.back.domain.post.Pagination;
import com.app.back.domain.post.Search;
import com.app.back.enums.AdminPostStatus;

import java.util.List;
import java.util.Optional;

public interface NoticeService {
//    작성
    public void write(NoticeDTO noticeDTO);
//    목록
    public List<NoticeDTO> getList(Pagination pagination, Search search);
//    조회
    public Optional<NoticeDTO> getPost(Long id);
//    수정
    public void update(NoticeDTO noticeDTO);
//    삭제
    public void delete(Long id);
//    전체 게시물 수
    public int getTotal();
//    검색 조건에 맞는 게시물 수
    public int getTotalWithSearch(Search search);
    // 상태 업데이트 (논리 삭제)
    public void updateStatus(Long id, AdminPostStatus status);

}
