package com.app.back.mapper.donation_record;

import com.app.back.domain.donation_record.DonationRecordDTO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface DonationRecordMapper {

    public void insert(DonationRecordDTO donationRecordDTO);
    public DonationRecordDTO selectById(Long id);
    public List<DonationRecordDTO> selectAll();
    public void update(DonationRecordDTO donationRecordDTO);
    public void deleteById(Long id);
    public int selectTotalDonationByMemberId(@Param("memberId") Long memberId);
}
