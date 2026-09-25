package com.college.master_data_service.service;

import com.college.master_data_service.entity.Faculty;
import com.college.master_data_service.repository.FacultyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FacultyService {

    @Autowired
    private FacultyRepository facultyRepository;

    public Faculty save(Faculty faculty) {
        return facultyRepository.save(faculty);
    }

    public List<Faculty> getAll() {
        return facultyRepository.findAll();
    }

    public Faculty getById(Long id) {
        return facultyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Faculty not found with id: " + id));
    }

    public void delete(Long id) {
        facultyRepository.deleteById(id);
    }
    public List<Faculty> saveAll(List<Faculty> faculty) {
        return facultyRepository.saveAll(faculty);
    }
}