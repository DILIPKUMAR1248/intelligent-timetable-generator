package com.college.master_data_service.controller;

import com.college.master_data_service.entity.Faculty;
import com.college.master_data_service.service.FacultyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/faculty")
public class FacultyController {

    @Autowired
    private FacultyService facultyService;

    @PostMapping
    public ResponseEntity<Faculty> create(@RequestBody Faculty faculty) {
        return ResponseEntity.ok(facultyService.save(faculty));
    }

    @GetMapping
    public ResponseEntity<List<Faculty>> getAll() {
        return ResponseEntity.ok(facultyService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Faculty> getById(@PathVariable Long id) {
        return ResponseEntity.ok(facultyService.getById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Faculty> update(@PathVariable Long id, @RequestBody Faculty faculty) {
        faculty.setId(id);
        return ResponseEntity.ok(facultyService.save(faculty));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> delete(@PathVariable Long id) {
        facultyService.delete(id);
        return ResponseEntity.ok("Faculty deleted successfully");
    }
    @PostMapping("/bulk")
    public ResponseEntity<List<Faculty>> createBulk(@RequestBody List<Faculty> faculty) {
        return ResponseEntity.ok(facultyService.saveAll(faculty));
    }
}