package com.app.back.domain.notice;

import com.app.back.domain.post.PostVO;
import lombok.*;
import org.springframework.stereotype.Component;

@Component
@Getter
@Setter
@ToString
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@NoArgsConstructor
public class NoticeDTO {
    private Long id;
    private String postTitle;
    private String postContent;
    private String postSummary;
    private String postType = "NOTICE"; // 공지사항 타입을 기본값으로 설정
    private String postStatus = "VISIBLE"; // 기본 상태 설정
    private Long postViewCount = 0L; // 초기 조회 수 설정
    private Long memberId;
    private String createdDate;
    private String updatedDate;

    private Long postId;


public PostVO toPostVO(){
    return new PostVO(id,postTitle,postContent,postSummary,postType,postStatus,postViewCount,memberId,createdDate,updatedDate);
}
    public NoticeVO toVO() {return new NoticeVO(id);}


}

