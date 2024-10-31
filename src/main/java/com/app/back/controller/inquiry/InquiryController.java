package com.app.back.controller.inquiry;


import com.app.back.domain.inquiry.InquiryDTO;
import com.app.back.domain.post.Pagination;
import com.app.back.domain.post.Search;
import com.app.back.service.inquiry.InquiryService;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Controller
@RequiredArgsConstructor
@Slf4j
public class InquiryController {
    private final InquiryService inquiryService;
    private final InquiryDTO inquiryDTO;
    private final HttpSession session;

    @GetMapping("/admin")
    public List<InquiryDTO> admin(Pagination pagination, Search search) {
        return inquiryService.getList(pagination,search);
    }

    @GetMapping("/admin/inquiry-page")
    @ResponseBody
//    public List<InquiryDTO> getList(Pagination pagination, Search search, Model model, HttpServletRequest request)
     public Map<String, Object> getList(Pagination pagination, Search search, @RequestParam(required = false) String query, @RequestParam(required = false) String filterType){
        log.info("Controller - getList() 호출됨");
        log.info("검색어: {}", query);
        search.setKeyword(query);
        log.info("검색 키워드: {}", search.getKeyword());
        pagination.setOrder(filterType); // 기본 정렬 기준
        if (search.getKeyword() != null) {
            pagination.setTotal(inquiryService.getTotalWithSearch(search));
        } else {
            pagination.setTotal(inquiryService.getTotal());
        }
        pagination.progress();

//        List<InquiryDTO> inquiries = filterType == null ?
//                inquiryService.getList(pagination, search) : filterType == "최신순" ? inquiryService.getList(pagination, search) : inquiryService.getFilterList(pagination, search);

        List<InquiryDTO> inquiries = null;
        if(filterType == null) {
            inquiries = inquiryService.getList(pagination, search);
        } else if(filterType.equals("최신순")) {

            inquiries = inquiryService.getList(pagination, search);
        } else {
            inquiries = inquiryService.getFilterList(pagination, search);
        }

        Map<String, Object> result = new HashMap<>();
        result.put("inquiries", inquiries);
        result.put("pagination", pagination);
        return result;

//        model.addAttribute("inquiries", inquiries);
//        model.addAttribute("pagination", pagination);
//        model.addAttribute("search", search);
//
//
//        return inquiryService.getList(pagination, search);
    }


}

