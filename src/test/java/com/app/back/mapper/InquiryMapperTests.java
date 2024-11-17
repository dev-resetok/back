package com.app.back.mapper;

import com.app.back.domain.inquiry.InquiryDTO;
import com.app.back.domain.post.Pagination;
import com.app.back.domain.post.Search;
import com.app.back.mapper.inquiry.InquiryMapper;
import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;
import java.util.Optional;

@SpringBootTest
@Slf4j
public class InquiryMapperTests {
    @Autowired
    private InquiryMapper inquiryMapper;

    @Test
    public void testwrite() {
        InquiryDTO inquiryDTO = new InquiryDTO();
        inquiryDTO.setId(232L);
        inquiryDTO.setPostStatus("");
        inquiryDTO.setInquiryEmail("152@gmail.com");
        inquiryDTO.setInquiryPhone("2222222222");
        inquiryDTO.setInquiryType("VOLUNTEER");
        inquiryDTO.setPostTitle("152번제목");
        inquiryDTO.setPostContent("152번내용");
        inquiryMapper.insert(inquiryDTO.toVO());
    }
    @Test
    public void testWriteMultiple() {
        for (long i =1; i <= 150; i++) {
            InquiryDTO inquiryDTO = new InquiryDTO();
            inquiryDTO.setId(i);
            inquiryDTO.setPostStatus("");
            inquiryDTO.setInquiryEmail(i+ "@gmail.com");
            inquiryDTO.setInquiryPhone("i");
            if (i % 2 == 0) {
                inquiryDTO.setInquiryType("NORMAL");
            } else {
                inquiryDTO.setInquiryType("VOLUNTEER");
            }
            inquiryDTO.setPostTitle(i + "번 제목");
            inquiryDTO.setPostContent(i + "번 내용");
            inquiryMapper.insert(inquiryDTO.toVO());
        }
    }

//    @Test
//    public void testSelectAll() {
//        Pagination pagination = new Pagination();
//        pagination.setPage(1);
//        pagination.progress();
//        List<InquiryDTO> posts = inquiryMapper.selectAll(pagination);
//        log.info("{}", posts.size());
//        posts.stream().map(InquiryDTO::toString).forEach(log::info);
//    }

@Test
public void testSelectAll(){
    Pagination pagination = new Pagination();
    pagination.progress();
    log.info("{}, {}", pagination.getStartRow(), pagination.getRowCount());
    inquiryMapper.selectAll(pagination, new Search()).stream()
            .map(InquiryDTO::toString).forEach(log::info);
}
    @Test
    public void testSelectById() {
        Long id = 1L;
        Optional<InquiryDTO> noticeDTO = inquiryMapper.selectById(id);
        noticeDTO.ifPresent(dto -> log.info("조회된 inquiry: " + dto));
    }

    @Test
    public void testUpdate() {
        InquiryDTO inquiryDTO = new InquiryDTO();
        inquiryDTO.setId(2L);
        inquiryDTO.setPostTitle("제목수정2");
        inquiryDTO.setPostContent("내용수정2");
        inquiryMapper.updateById(inquiryDTO);
        log.info("inquiry가 수정되었습니다: " + inquiryDTO);
    }
    @Test
    public void testDeleteById() {
        Long id = 109L;
        inquiryMapper.deleteById(id);
        log.info("inquiry가 삭제되었습니다. ID: " + id);
    }


}
