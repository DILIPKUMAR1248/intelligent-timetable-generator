package com.college.master_data_service.service;

import com.college.master_data_service.entity.Period;
import com.college.master_data_service.repository.PeriodRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PeriodService {

    @Autowired
    private PeriodRepository periodRepository;

    public Period save(Period period) {
        return periodRepository.save(period);
    }

    public List<Period> getAll() {
        return periodRepository.findAll();
    }

    public Period getById(Long id) {
        return periodRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Period not found with id: " + id));
    }

    public void delete(Long id) {
        periodRepository.deleteById(id);
    }
    public List<Period> saveAll(List<Period> periods) {
        return periodRepository.saveAll(periods);
    }
}