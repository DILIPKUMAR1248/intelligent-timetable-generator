package com.college.master_data_service.controller;

import com.college.master_data_service.entity.Period;
import com.college.master_data_service.service.PeriodService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/periods")
public class PeriodController {

    @Autowired
    private PeriodService periodService;

    @PostMapping
    public ResponseEntity<Period> create(@RequestBody Period period) {
        return ResponseEntity.ok(periodService.save(period));
    }

    @GetMapping
    public ResponseEntity<List<Period>> getAll() {
        return ResponseEntity.ok(periodService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Period> getById(@PathVariable Long id) {
        return ResponseEntity.ok(periodService.getById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Period> update(@PathVariable Long id, @RequestBody Period period) {
        period.setId(id);
        return ResponseEntity.ok(periodService.save(period));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> delete(@PathVariable Long id) {
        periodService.delete(id);
        return ResponseEntity.ok("Period deleted successfully");
    }
    @PostMapping("/bulk")
    public ResponseEntity<List<Period>> createBulk(@RequestBody List<Period> periods) {
        return ResponseEntity.ok(periodService.saveAll(periods));
    }
}