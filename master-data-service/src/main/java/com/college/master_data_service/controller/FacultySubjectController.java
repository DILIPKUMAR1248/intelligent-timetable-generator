package com.college.master_data_service.controller;

import com.college.master_data_service.entity.FacultySubject;
import com.college.master_data_service.service.FacultySubjectService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/faculty-subjects")
public class FacultySubjectController {

    @Autowired
    private FacultySubjectService facultySubjectService;

    @PostMapping
    public ResponseEntity<FacultySubject> create(@RequestBody FacultySubject fs) {
        return ResponseEntity.ok(facultySubjectService.save(fs));
    }

    @PostMapping("/bulk")
    public ResponseEntity<List<FacultySubject>> createBulk(@RequestBody List<FacultySubject> list) {
        return ResponseEntity.ok(facultySubjectService.saveAll(list));
    }

    @GetMapping
    public ResponseEntity<List<FacultySubject>> getAll() {
        return ResponseEntity.ok(facultySubjectService.getAll());
    }

    @GetMapping("/faculty/{facultyId}")
    public ResponseEntity<List<FacultySubject>> getByFaculty(@PathVariable Long facultyId) {
        return ResponseEntity.ok(facultySubjectService.getByFaculty(facultyId));
    }

    @GetMapping("/subject/{subjectId}")
    public ResponseEntity<List<FacultySubject>> getBySubject(@PathVariable Long subjectId) {
        return ResponseEntity.ok(facultySubjectService.getBySubject(subjectId));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> delete(@PathVariable Long id) {
        facultySubjectService.delete(id);
        return ResponseEntity.ok("Mapping deleted successfully");
    }
}