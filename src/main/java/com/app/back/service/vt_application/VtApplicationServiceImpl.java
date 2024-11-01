package com.app.back.service.vt_application;

import com.app.back.domain.vt_application.VtApplicationDTO;
import com.app.back.repository.vt_application.VtApplicationDAO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(rollbackFor = Exception.class)
public class VtApplicationServiceImpl implements VtApplicationService {
    private final VtApplicationDAO vtApplicationDAO;

    @Override
    public void save(VtApplicationDTO vtApplicationDTO) {
        vtApplicationDAO.save(vtApplicationDTO);
    }

    @Override
    public VtApplicationDTO findById(Long id) {
        return vtApplicationDAO.findById(id);
    }

    @Override
    public List<VtApplicationDTO> findAll() {
        return vtApplicationDAO.findAll();
    }

    @Override
    public void update(VtApplicationDTO vtApplicationDTO) {
        vtApplicationDAO.update(vtApplicationDTO);
    }

    @Override
    public void deleteById(Long id) {
        vtApplicationDAO.deleteById(id);
    }

    @Override
    public List<VtApplicationDTO> getApplicationsByVtId(Long vtId) {
        return vtApplicationDAO.findByVtId(vtId);
    }

    @Override
    public int getApplicationCountByVtId(Long vtId) {
        return vtApplicationDAO.countByVtId(vtId);
    }

    @Override
    public void approveApplication(Long applicationId) {
        vtApplicationDAO.updateApplicationStatus(applicationId,"APPROVED");

    }

    @Override
    public void refuseApplication(Long applicationId) {
        vtApplicationDAO.updateApplicationStatus(applicationId,"REJECTED");
    }
}
