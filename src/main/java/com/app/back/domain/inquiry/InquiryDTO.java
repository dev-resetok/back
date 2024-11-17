package com.app.back.domain.inquiry;

import com.app.back.domain.attachment.AttachmentVO;
import com.app.back.domain.post.PostVO;
import com.app.back.domain.member.MemberVO;
import lombok.*;
import org.springframework.stereotype.Component;

@Component
@Getter
@Setter
@ToString
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@NoArgsConstructor
public class InquiryDTO {
    private Long id;
    private String inquiryStatus;
    private String inquiryEmail;
    private String inquiryPhone;
    private String inquiryType;

    private String postTitle;
    private String postContent;
    private String postSummary;
    private String postType;
    private String postStatus = "VISIBLE";
    private Long postViewCount = 0L;
    private Long memberId;
    private String createdDate;
    private String updatedDate;
    private String memberNickName;

    private String attachmentFileName;
    private String attachmentFileRealName;
    private String attachmentFilePath;
    private String attachmentFileSize;
    private String attachmentFileType;
    private Long postId;


    public PostVO toPostVO() {
        return new PostVO(id, postTitle, postContent, postSummary, postType, postStatus, postViewCount, memberId, createdDate, updatedDate);
    }

    public InquiryVO toVO() {
        return new InquiryVO(id, inquiryStatus, inquiryEmail, inquiryPhone,inquiryType);

    }
    public AttachmentVO toAttachmentVO(){
        return new AttachmentVO(id, attachmentFileName, attachmentFileRealName, attachmentFilePath, attachmentFileSize, attachmentFileType, postId,createdDate);
    }
}
