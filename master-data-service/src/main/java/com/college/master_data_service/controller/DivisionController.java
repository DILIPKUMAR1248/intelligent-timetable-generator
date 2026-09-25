package com.college.master_data_service.controller;

import com.college.master_data_service.entity.Division;
import com.college.master_data_service.service.DivisionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/divisions")
public class DivisionController {

    @Autowired
    private DivisionService divisionService;

    // CREATE / UPDATE
    @PostMapping
    public ResponseEntity<Division> create(@RequestBody Division division) {
        return ResponseEntity.ok(divisionService.save(division));
    }

    // READ ALL
    @GetMapping
    public ResponseEntity<List<Division>> getAll() {
        return ResponseEntity.ok(divisionService.getAll());
    }

    // READ ONE
    @GetMapping("/{id}")
    public ResponseEntity<Division> getById(@PathVariable Long id) {
        return ResponseEntity.ok(divisionService.getById(id));
    }

    // UPDATE
    @PutMapping("/{id}")
    public ResponseEntity<Division> update(@PathVariable Long id, @RequestBody Division division) {
        division.setId(id);
        return ResponseEntity.ok(divisionService.save(division));
    }

    // DELETE
    @DeleteMapping("/{id}")
    public ResponseEntity<String> delete(@PathVariable Long id) {
        divisionService.delete(id);
        return ResponseEntity.ok("Division deleted successfully");
    }
   // Bulk create
    @PostMapping("/bulk")
    public ResponseEntity<List<Division>> createBulk(@RequestBody List<Division> divisions) {
        return ResponseEntity.ok(divisionService.saveAll(divisions));
    }
}