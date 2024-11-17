package com.app.back.repository.notice;

import com.app.back.domain.notice.NoticeDTO;
import com.app.back.domain.notice.NoticeVO;
import com.app.back.domain.post.Pagination;
import com.app.back.domain.post.Search;
import com.app.back.domain.review.ReviewDTO;
import com.app.back.domain.review.ReviewVO;
import com.app.back.mapper.notice.NoticeMapper;
import com.app.back.mapper.post.PostMapper;
import com.app.back.mapper.review.ReviewMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
@RequiredArgsConstructor
public class NoticeDAO {
    private final NoticeMapper noticeMapper;
    private final NoticeDTO noticeDTO;
    private final PostMapper postMapper;

    //    게시글 작성
    public void save(NoticeVO noticeVO) {
        noticeMapper.insert(noticeVO);
    }

    //    게시글 전체 조회
    public List<NoticeDTO> findAll(Pagination pagination, Search search){
        return noticeMapper.selectAll(pagination, search);
    }
    //    게시글 전체 개수 조회
    public int getTotal(){
        return noticeMapper.selectTotal();
    }

    //    검색 결과 개수 조회
    public int getTotalWithSearch(Search search){
        return noticeMapper.selectTotalWithSearch(search);
    }

    //    게시글 조회
    public Optional<NoticeDTO> findById(Long id){
        return noticeMapper.selectById(id);
    }

    //    수정
    public void update(NoticeDTO noticeDTO) {
        noticeMapper.updateById(noticeDTO);
    }

    //    삭제
    public void delete(Long id) {noticeMapper.deleteById(id);}

    // 상태 업데이트 (논리 삭제)
    public void updateStatus(Long id, String status) {
        noticeMapper.updateStatus(id, status);
    }




}
