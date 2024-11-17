package com.app.back.controller.donation_record;

import com.app.back.domain.donation_record.DonationRecordDTO;
import com.app.back.domain.member.MemberDTO;
import com.app.back.service.donation_record.DonationRecordService;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/donation-records")
@RequiredArgsConstructor
@Slf4j
public class DonationRecordController {

    private final DonationRecordService donationRecordService;

    @PostMapping("/write")
    public void createDonationRecord(@RequestBody DonationRecordDTO donationRecordDTO, @RequestParam("donationId") Long donationId, @RequestParam("donationAmount") Integer donationAmount, HttpSession session) {
        MemberDTO loginMember = (MemberDTO) session.getAttribute("loginMember");
        donationRecordDTO.setMemberId(loginMember.getId());
        donationRecordDTO.setDonationId(donationId);
        donationRecordDTO.setDonationAmount(donationAmount);

        donationRecordService.save(donationRecordDTO);
    }

    @GetMapping("/{id}")
    public Optional<DonationRecordDTO> getDonationRecordById(@PathVariable Long id) {
        return donationRecordService.findById(id);
    }

    @GetMapping("/all")
    public List<DonationRecordDTO> getAllDonationRecords() {
        return donationRecordService.findAll();
    }

    @PutMapping("/update")
    public void updateDonationRecord(@RequestBody DonationRecordDTO donationRecordDTO) {
        donationRecordService.update(donationRecordDTO);
    }

    @DeleteMapping("/{id}")
    public void deleteDonationRecord(@PathVariable Long id) {
        donationRecordService.deleteById(id);
    }
    @GetMapping("/total/{memberId}")
    public int getTotalDonationByMemberId(@PathVariable Long memberId) {
        log.info("받은 회원 ID: {}", memberId);
        int total = donationRecordService.getTotalDonationByMemberId(memberId);
        log.info("Total Donation for memberId {}: {}", memberId, total);
        return total;
    }
    @GetMapping("/my-donation/{memberId}")
    public List<DonationRecordDTO> getMyDonationRecords(
            @PathVariable Long memberId,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate) {

        log.info("받은 회원 ID: {}, 시작 날짜: {}, 끝 날짜: {}",
                memberId, startDate, endDate);

        if (startDate != null && endDate != null) {
            return donationRecordService.findByMemberIdAndDateRange(memberId, startDate, endDate);
        } else {
            return donationRecordService.findByMemberId(memberId);
        }
    }
}
