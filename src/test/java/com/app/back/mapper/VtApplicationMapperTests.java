package com.app.back.mapper;


import com.app.back.domain.vt_application.VtApplicationDTO;
import com.app.back.mapper.vt_application.VtApplicationMapper;
import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import java.time.LocalDateTime;

import static com.app.back.enums.vtApplicationStatus.WAITING;

@SpringBootTest
@Slf4j
public class VtApplicationMapperTests {
@Autowired
private VtApplicationMapper vtApplicationMapper;


//    지원하기 버튼시 insert문
@Test
public void testInsertSelective() {
    VtApplicationDTO vtApplicationDTO  = new VtApplicationDTO();
    // 설정할 필드 값들 설정
    vtApplicationDTO.setId(79L);  // 신청 ID
    vtApplicationDTO.setApplicationDate(LocalDateTime.now().toString());  // LocalDateTime을 String으로 변환
    vtApplicationDTO.setApplicationStatus(String.valueOf(WAITING));
    vtApplicationDTO.setVtId(78L);  // 봉사활동 ID
    vtApplicationDTO.setMemberId(23L);  // 신청자 ID (Long 타입으로 설정)

    vtApplicationMapper.insert(vtApplicationDTO);

    log.info("회원 정보 삽입 성공: {}",vtApplicationDTO.toVO().toString());
    }

}