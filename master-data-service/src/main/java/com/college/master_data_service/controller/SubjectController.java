package com.college.master_data_service.controller;

import com.college.master_data_service.entity.Subject;
import com.college.master_data_service.service.SubjectService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/subjects")
public class SubjectController {

    @Autowired
    private SubjectService subjectService;

    @PostMapping
    public ResponseEntity<Subject> create(@RequestBody Subject subject) {
        return ResponseEntity.ok(subjectService.save(subject));
    }

    @GetMapping
    public ResponseEntity<List<Subject>> getAll() {
        return ResponseEntity.ok(subjectService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Subject> getById(@PathVariable Long id) {
        return ResponseEntity.ok(subjectService.getById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Subject> update(@PathVariable Long id, @RequestBody Subject subject) {
        subject.setId(id);
        return ResponseEntity.ok(subjectService.save(subject));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> delete(@PathVariable Long id) {
        subjectService.delete(id);
        return ResponseEntity.ok("Subject deleted successfully");
    }
    @PostMapping("/bulk")
    public ResponseEntity<List<Subject>> createBulk(@RequestBody List<Subject> list) {
        return ResponseEntity.ok(subjectService.saveAll(list));
    }
}