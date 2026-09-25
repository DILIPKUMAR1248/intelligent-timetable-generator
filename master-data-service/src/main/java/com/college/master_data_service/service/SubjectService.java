package com.college.master_data_service.service;

import com.college.master_data_service.entity.Subject;
import com.college.master_data_service.repository.SubjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SubjectService {

    @Autowired
    private SubjectRepository subjectRepository;

    public Subject save(Subject subject) {
        return subjectRepository.save(subject);
    }

    public List<Subject> getAll() {
        return subjectRepository.findAll();
    }

    public Subject getById(Long id) {
        return subjectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Subject not found with id: " + id));
    }

    public void delete(Long id) {
        subjectRepository.deleteById(id);
    }
    public List<Subject> saveAll(List<Subject> list) {
        return subjectRepository.saveAll(list);
    }
}