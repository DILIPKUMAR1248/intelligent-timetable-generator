package com.college.master_data_service.service;

import com.college.master_data_service.entity.Division;
import com.college.master_data_service.repository.DivisionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DivisionService {

    @Autowired
    private DivisionRepository divisionRepository;

    // Create or Update
    public Division save(Division division) {
        return divisionRepository.save(division);
    }

    // Get all
    public List<Division> getAll() {
        return divisionRepository.findAll();
    }

    // Get by id
    public Division getById(Long id) {
        return divisionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Division not found with id: " + id));
    }

    // Delete
    public void delete(Long id) {
        divisionRepository.deleteById(id);
    }
    //bulk save
    public List<Division> saveAll(List<Division> divisions) {
        return divisionRepository.saveAll(divisions);
    }
}