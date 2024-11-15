package com.app.back.mapper.notice;

import com.app.back.domain.notice.NoticeDTO;
import com.app.back.domain.notice.NoticeVO;
import com.app.back.domain.post.Pagination;
import com.app.back.domain.post.Search;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Optional;

@Mapper
public interface NoticeMapper {
//    추가
    public void insert(NoticeVO noticeVO);
//    조회
//    public NoticeDTO selectById(Long id);
    public Optional<NoticeDTO> selectById(Long id);
//  전체조회
//    public List<NoticeDTO> selectAll(Pagination pagination);
    public List<NoticeDTO> selectAll(@Param("pagination") Pagination pagination, @Param("search")Search search);

//    수정
    public void updateById(NoticeDTO noticeDTO);

//    삭제
    public void deleteById(Long id);

//    게시글 전체 개수 조회
    public int selectTotal();

//    검색 결과 개수 조회
    public int selectTotalWithSearch(@Param("search") Search search);

// 공지사항 상태 업데이트 (논리 삭제)
    public void updateStatus(@Param("id") Long id, @Param("status") String status);
}
