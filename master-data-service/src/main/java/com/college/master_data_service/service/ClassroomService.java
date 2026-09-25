package com.college.master_data_service.service;

import com.college.master_data_service.entity.Classroom;
import com.college.master_data_service.repository.ClassroomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ClassroomService {

    @Autowired
    private ClassroomRepository classroomRepository;

    public Classroom save(Classroom classroom) {
        return classroomRepository.save(classroom);
    }

    public List<Classroom> getAll() {
        return classroomRepository.findAll();
    }

    public Classroom getById(Long id) {
        return classroomRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Classroom not found with id: " + id));
    }

    public void delete(Long id) {
        classroomRepository.deleteById(id);
    }
    public List<Classroom> saveAll(List<Classroom> classrooms) {
        return classroomRepository.saveAll(classrooms);
    }
}