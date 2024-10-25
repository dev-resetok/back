//package com.app.back.service.volunteer;
//
//import com.app.back.domain.attachment.AttachmentVO;
//import com.app.back.domain.member.MemberDTO;
//import com.app.back.domain.member.MemberVO;
//import com.app.back.domain.post.PostVO;
//import com.app.back.domain.volunteer.VolunteerDTO;
//import com.app.back.mapper.attachment.AttachmentMapper;
//import com.app.back.mapper.member.MemberMapper;
//import com.app.back.mapper.post.PostMapper;
//import com.app.back.mapper.volunteer.VolunteerMapper;
//import com.app.back.repository.volunteer.VolunteerDAO;
//import lombok.RequiredArgsConstructor;
//import org.springframework.stereotype.Service;
//import org.springframework.transaction.annotation.Transactional;
//
//@Service
//@RequiredArgsConstructor
//@Transactional(rollbackFor = Exception.class)
//public class VolunteerServiceImpl implements VolunteerService {
//    private final PostMapper postMapper;
//    private final VolunteerMapper volunteerMapper;
//    private final AttachmentMapper attachmentMapper;
//
//
//    @Override
//    public void write(VolunteerDTO volunteerDTO) {
//        PostVO postVO = volunteerDTO.toPostVO();
//        AttachmentVO attachmentVO = volunteerDTO.toAttachmentVO();
//
//        // 2. PostVO 객체 삽입 (게시물 정보 저장)
//        postMapper.insert(postVO);
//
//        // 3. AttachmentVO가 null이 아닐 때만 삽입
//        if (attachmentVO != null) {
//            attachmentMapper.insert(attachmentVO);
//        }
//
//        // 4. 삽입 후 생성된 postVO의 ID를 VolunteerDTO에 설정
//        volunteerDTO.setId(postVO.getId());
//
//        // 5. VolunteerVO 객체로 변환 후 삽입
//        volunteerMapper.insert(volunteerDTO.toVO());
//    }
//}
//
//
//
