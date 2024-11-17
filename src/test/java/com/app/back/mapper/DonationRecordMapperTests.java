package com.app.back.mapper;

import com.app.back.domain.donation.DonationDTO;
import com.app.back.domain.donation_record.DonationRecordDTO;
import com.app.back.domain.donation_record.DonationRecordVO;
import com.app.back.mapper.donation.DonationMapper;
import com.app.back.mapper.donation_record.DonationRecordMapper;
import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.time.LocalDateTime;
import java.util.Optional;

@SpringBootTest
@Slf4j
public class DonationRecordMapperTests {
    @Autowired
    private DonationRecordMapper donationRecordMapper;

    @Test
    public void insertDonationRecord() {
        // 1. DonationRecordDTO 생성
        DonationRecordDTO donationRecordDTO = new DonationRecordDTO(
                null, // ID는 자동 생성
                2000, // 기부 금액
                LocalDateTime.now().toString(), // 생성 시간
                23L, // memberId
                1L  // donationId
        );

        // 2. DTO를 VO로 변환 후 삽입
        DonationRecordVO donationRecordVO = donationRecordDTO.toVO();
        donationRecordMapper.insert(donationRecordVO.toDTO());

        log.info("삽입된 기부 기록 VO: {}", donationRecordVO);

    }
}