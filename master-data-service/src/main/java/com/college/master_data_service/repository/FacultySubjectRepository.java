package com.college.master_data_service.repository;

import com.college.master_data_service.entity.FacultySubject;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FacultySubjectRepository extends JpaRepository<FacultySubject, Long> {

    List<FacultySubject> findByFacultyId(Long facultyId);

    List<FacultySubject> findBySubjectId(Long subjectId);
}