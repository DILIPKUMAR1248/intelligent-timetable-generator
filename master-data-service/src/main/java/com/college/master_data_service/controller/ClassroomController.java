package com.college.master_data_service.controller;

import com.college.master_data_service.entity.Classroom;
import com.college.master_data_service.service.ClassroomService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/classrooms")
public class ClassroomController {

    @Autowired
    private ClassroomService classroomService;

    @PostMapping
    public ResponseEntity<Classroom> create(@RequestBody Classroom classroom) {
        return ResponseEntity.ok(classroomService.save(classroom));
    }

    @GetMapping
    public ResponseEntity<List<Classroom>> getAll() {
        return ResponseEntity.ok(classroomService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Classroom> getById(@PathVariable Long id) {
        return ResponseEntity.ok(classroomService.getById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Classroom> update(@PathVariable Long id, @RequestBody Classroom classroom) {
        classroom.setId(id);
        return ResponseEntity.ok(classroomService.save(classroom));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> delete(@PathVariable Long id) {
        classroomService.delete(id);
        return ResponseEntity.ok("Classroom deleted successfully");
    }
    @PostMapping("/bulk")
    public ResponseEntity<List<Classroom>> createBulk(@RequestBody List<Classroom> classrooms) {
        return ResponseEntity.ok(classroomService.saveAll(classrooms));
    }
}