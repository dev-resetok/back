package com.app.back.mapper;


import com.app.back.domain.notice.NoticeDTO;
import com.app.back.domain.post.Pagination;
import com.app.back.domain.post.Search;
import com.app.back.mapper.notice.NoticeMapper;
import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;
import java.util.Optional;

@SpringBootTest
@Slf4j
public class NoticeMapperTests {
    @Autowired
    private NoticeMapper noticeMapper;

    @Test
    public void testwrite() {
        NoticeDTO noticeDTO = new NoticeDTO();
        noticeDTO.setId(222L);
        noticeDTO.setPostTitle("제목1");
        noticeDTO.setPostContent("내용1");
        noticeDTO.setPostSummary("요약1");
        noticeDTO.setPostType("0");
        noticeDTO.setPostStatus("VISIBLE");
        noticeDTO.setMemberId(2L);
        noticeMapper.insert(noticeDTO.toVO());
    }
    @Test
    public void testWriteMultiple() {
        for (long i = 1; i <= 100; i++) {
            NoticeDTO noticeDTO = new NoticeDTO();
            noticeDTO.setId(i);
            noticeDTO.setPostTitle("제목" + i);
            noticeDTO.setPostContent("내용" + i);
            noticeDTO.setPostSummary("요약" + i);
            noticeDTO.setPostType("SUPPORT");
            noticeDTO.setPostViewCount(i);
            noticeDTO.setPostStatus("VISIBLE");
            noticeDTO.setMemberId(1L);

            noticeMapper.insert(noticeDTO.toVO());
        }
    }

    @Test
    public void testSelectById() {
        Long id = 51L; // 테스트할 ID 설정

        Optional<NoticeDTO> noticeDTO = noticeMapper.selectById(id);
        noticeDTO.ifPresent(dto -> log.info("조회된 notice: " + dto));
    }
//    @Test
//    public void testSelectAll() {
//        Pagination pagination = new Pagination();
//        pagination.setPage(1);
//        pagination.progress();
//        List<NoticeDTO> posts = noticeMapper.selectAll(pagination);
//        log.info("{}", posts.size());
//        posts.stream().map(NoticeDTO::toString).forEach(log::info);
//    }
        @Test
        public void testSelectAll(){
        Pagination pagination = new Pagination();
        pagination.progress();
        log.info("{}, {}", pagination.getStartRow(), pagination.getRowCount());
            noticeMapper.selectAll(pagination, new Search()).stream()
        .map(NoticeDTO::toString).forEach(log::info);
        }

    @Test
    public void testUpdate() {
        NoticeDTO noticeDTO = new NoticeDTO();
        noticeDTO.setId(4L);
        noticeDTO.setPostTitle("제목수정4");
        noticeDTO.setPostContent("내용수정4");
        noticeMapper.updateById(noticeDTO);
        log.info("noice가 수정되었습니다: " + noticeDTO);
    }
    @Test
    public void testDeleteById() {
        Long id = 3L;
        noticeMapper.deleteById(id);
        log.info("notice가 삭제되었습니다. ID: " + id);
    }

}
