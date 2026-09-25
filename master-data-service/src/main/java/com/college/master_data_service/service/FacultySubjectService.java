package com.college.master_data_service.service;

import com.college.master_data_service.entity.FacultySubject;
import com.college.master_data_service.repository.FacultySubjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FacultySubjectService {

    @Autowired
    private FacultySubjectRepository facultySubjectRepository;

    public FacultySubject save(FacultySubject facultySubject) {
        return facultySubjectRepository.save(facultySubject);
    }

    public List<FacultySubject> saveAll(List<FacultySubject> list) {
        return facultySubjectRepository.saveAll(list);
    }

    public List<FacultySubject> getAll() {
        return facultySubjectRepository.findAll();
    }

    public List<FacultySubject> getByFaculty(Long facultyId) {
        return facultySubjectRepository.findByFacultyId(facultyId);
    }

    public List<FacultySubject> getBySubject(Long subjectId) {
        return facultySubjectRepository.findBySubjectId(subjectId);
    }

    public void delete(Long id) {
        facultySubjectRepository.deleteById(id);
    }
}