package com.app.back.mapper;

import com.app.back.domain.donation.DonationDTO;
import com.app.back.domain.volunteer.Pagination;
import com.app.back.domain.volunteer.VolunteerDTO;
import com.app.back.domain.volunteer.VolunteerVO;
import com.app.back.domain.vt_application.VtApplicationDTO;
import com.app.back.mapper.volunteer.VolunteerMapper;
import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@SpringBootTest
@Slf4j
public class VolunteerMapperTests {

    @Autowired
    private VolunteerMapper volunteerMapper;
    @Autowired
    private VolunteerDTO volunteerDTO;
    @Autowired
    private VolunteerVO volunteerVO;


    //    봉사 모집 게시글 작성
    @Test
    public void testInsert(){
        VolunteerDTO volunteerDTO = new VolunteerDTO();
        volunteerDTO.setId(78L);
        volunteerDTO.setRecruitmentCount(10);
        volunteerDTO.setVtSDate("2024-11-18");
        volunteerDTO.setVtEDate("2024-12-18");

        volunteerMapper.insert(volunteerDTO.toVO());
        log.info("봉사활동 구인글이 작성 되었습니다: {}", volunteerDTO);
    }



//    봉사 모집 게시글 최신순 목록 조회
    @Test
    public void testSelectAll(){
        Pagination pagination = new Pagination();
        pagination.setTotal(volunteerMapper.selectTotal());
        pagination.progress();
        log.info("{}, {}", pagination.getStartRow(), pagination.getRowCount());
        volunteerMapper.selectAll(pagination).stream()
            .map(VolunteerDTO::toString).forEach(log::info);

    }

//    봉사 모집 게시글 조회
    @Test
    public void testSelectById() {
        VolunteerDTO volunteerDTO = new VolunteerDTO();
        volunteerDTO.setId(1L);
        Optional<VolunteerDTO> foundVolunteer = volunteerMapper.selectById(volunteerDTO.getId());

        log.info("{}",foundVolunteer);
    }


//    봉사 승인 인원 증가
//    @Test
//    public void updateNowRecruitment(){
//        volunteerMapper.updateNowRecruitment(1);
//        log.info("승인된 봉사인원이 증가하였습니다" + volunteerVO.getNowRecruitmentCount());
//    }

//    봉사 모집 게시글 수정
//@Test
//@Transactional // 테스트 시 데이터가 자동으로 롤백되도록 합니다.
//public void testUpdatePostAndVtAndAttachment() {
//    // DTO 객체 생성 및 값 설정
//    VtApplicationDTO vtApplicationDTO = new VtApplicationDTO();
//    vtApplicationDTO.setId(1L);  // tbl_post의 ID
//    vtApplicationDTO.setPostTitle("Updated Title");
//    vtApplicationDTO.setPostSummary("Updated Summary");
//    vtApplicationDTO.setPostContent("Updated Content");
//    vtApplicationDTO.setUpdatedDate("2024-10-25");
//    vtApplicationDTO.setVtId(1L);  // tbl_vt의 ID
//    vtApplicationDTO.setVtRecruitmentCount(100L);  // 업데이트할 모집 인원 수
//
//    // Attachment 정보 설정
//    vtApplicationDTO.setAttachmentFileName("Updated File Name");
//    vtApplicationDTO.setAttachmentFilePath("/updated/path/to/file");
//    vtApplicationDTO.setAttachmentFileSize(2048L);
//    vtApplicationDTO.setAttachmentFileType("image/jpeg");
//    vtApplicationDTO.setCreatedDate("2024-10-25");
//    vtApplicationDTO.setPostId(1L);  // 첨부 파일과 연관된 게시물 ID
//
//    // tbl_post 업데이트
//    postMapper.updatePost(vtApplicationDTO);
//
//    // tbl_vt 업데이트
//    postMapper.updateVt(vtApplicationDTO);
//
//    // tbl_attachment 업데이트
//    postMapper.updateAttachment(vtApplicationDTO);
//
//    // 업데이트된 데이터 검증
//    VtApplicationDTO updatedPost = postMapper.selectPostById(1L);
//    assertEquals("Updated Title", updatedPost.getPostTitle());
//    assertEquals("Updated Summary", updatedPost.getPostSummary());
//    assertEquals("Updated Content", updatedPost.getPostContent());
//
//    VtApplicationDTO updatedVt = postMapper.selectVtById(1L);
//    assertEquals(100L, updatedVt.getVtRecruitmentCount());
//
//    VtApplicationDTO updatedAttachment = postMapper.selectAttachmentByPostId(1L);
//    assertEquals("Updated File Name", updatedAttachment.getAttachmentFileName());
//    assertEquals("/updated/path/to/file", updatedAttachment.getAttachmentFilePath());
//    assertEquals(2048L, updatedAttachment.getAttachmentFileSize());
//    assertEquals("image/jpeg", updatedAttachment.getAttachmentFileType());
//}




////  봉사 모집 게시글 조회수 순 조회
//    @Test
//    public void testSelectByViewCount() {
//        Pagination pagination = new Pagination();
//        pagination.setTotal(volunteerMapper.selectTotal());
//        pagination.progress();
//        log.info("{}, {}", pagination.getStartRow(), pagination.getRowCount());
//        volunteerMapper.selectByViewCount(pagination).stream()
//                .map(VolunteerDTO::toString).forEach(log::info);
//    }
//
////    봉사모집 게시글 마감 임박 순 조회
//@Test
//public void testSelectByDeadline() {
//    Pagination pagination = new Pagination();
//    pagination.setTotal(volunteerMapper.selectTotal());
//    pagination.progress();
//    log.info("{}, {}", pagination.getStartRow(), pagination.getRowCount());
//    volunteerMapper.selectByDeadline(pagination).stream()
//            .map(VolunteerDTO::toString).forEach(log::info);
//}


}