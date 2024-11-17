package com.app.back.service.post;

import com.app.back.domain.post.Pagination;
import com.app.back.domain.post.PostDTO;
import com.app.back.domain.post.Search;
import com.app.back.enums.AdminPostStatus;
import com.app.back.enums.AdminPostType;
import com.app.back.repository.post.PostDAO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Slf4j
@Service
@Primary
@RequiredArgsConstructor
@Transactional(rollbackFor = Exception.class)
public class PostServiceImpl implements PostService {
    private final PostDAO postDAO;

    @Override
    public int getTotal(String postType) {
        return postDAO.getTotal(postType);
    }

    public int getPostTotal() {
        return postDAO.getPostTotal();
    }

    @Override
    public int getTotalWithSearch(Search search) {
        return postDAO.getTotalWithSearch(search);
    }

    @Override
    public List<PostDTO> getList(Pagination pagination, Search search) {
        List<PostDTO> posts = postDAO.findAll(pagination, search);

        // 각 PostDTO의 postType을 한글명으로 설정
        posts.forEach(post -> {
            AdminPostType postTypeEnum = AdminPostType.valueOf(post.getPostType());
            post.setPostType(postTypeEnum.getDisplayName());
        });

        return posts;
    }

    @Override
    public List<PostDTO> getFilterList(Pagination pagination, Search search, AdminPostType filterType) {
        List<PostDTO> posts = postDAO.findFilterAll(pagination, search, filterType.name());

        // 각 PostDTO의 postType을 한글명으로 설정
        posts.forEach(post -> {
            AdminPostType postTypeEnum = AdminPostType.valueOf(post.getPostType());
            post.setPostType(postTypeEnum.getDisplayName());
        });

        return posts;
    }

    @Override
    public Optional<PostDTO> getPost(Long id) {
        return postDAO.findById(id);
    }

    @Override
    public void delete(Long id) {
        updateStatus(id, AdminPostStatus.DELETED);
    }

    @Override
    public int getTotalWithFilter(Search search, AdminPostType filterType) {
        return postDAO.getTotalWithFilter(search, filterType.name()); // Enum 이름을 직접 사용
    }

    @Override
    public void updateStatus(Long id, AdminPostStatus postStatus) {

        postDAO.updateStatus(id, postStatus);
    }

    @Override
    public List<PostDTO> getListWithoutDeleted(Pagination pagination, Search search) {
        // 작성일 순, 조회수 순, 댓글수 순은 일반 정렬로 처리
        if (pagination.getOrder().equals("작성일 순") || pagination.getOrder().equals("조회수 순") || pagination.getOrder().equals("댓글수 순")) {
            return postDAO.findAllWithNoDeleted(pagination, search);
        } else {
            // "작성일 순" 외의 값에 대해서는 AdminPostType의 displayName에 맞는 값을 찾고, 그 값에 맞는 데이터를 필터링
            AdminPostType postTypeEnum = AdminPostType.fromDisplayName(pagination.getOrder());
            return postDAO.findFilterAllWithNoDeleted(pagination, search, postTypeEnum.name());
        }
    }

    @Override
    public List<PostDTO> getFilterListWithoutDeleted(Pagination pagination, Search search, AdminPostType filterType) {
        pagination.setOrder(filterType.name());
        // 삭제되지 않은 게시물 중 특정 필터 조건과 검색어가 적용된 결과를 가져옴
        return postDAO.findFilterAllWithNoDeleted(pagination, search, filterType.name());
    }
}
