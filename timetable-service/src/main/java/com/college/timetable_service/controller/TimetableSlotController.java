package com.college.timetable_service.controller;

import com.college.timetable_service.entity.TimetableSlot;
import com.college.timetable_service.service.TimetableSlotService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/timetable-slots")
public class TimetableSlotController {

    @Autowired
    private TimetableSlotService timetableSlotService;

    @PostMapping
    public ResponseEntity<TimetableSlot> createSlot(@RequestBody TimetableSlot slot) {
        TimetableSlot savedSlot = timetableSlotService.save(slot);
        return ResponseEntity.ok(savedSlot);
    }

    @PostMapping("/bulk")
    public ResponseEntity<List<TimetableSlot>> createSlots(@RequestBody List<TimetableSlot> slots) {
        List<TimetableSlot> savedSlots = timetableSlotService.saveAll(slots);
        return ResponseEntity.ok(savedSlots);
    }

    @GetMapping
    public ResponseEntity<List<TimetableSlot>> getAllSlots() {
        List<TimetableSlot> slots = timetableSlotService.getAll();
        return ResponseEntity.ok(slots);
    }

    @GetMapping("/{id}")
    public ResponseEntity<TimetableSlot> getSlotById(@PathVariable Long id) {
        TimetableSlot slot = timetableSlotService.getById(id);
        if (slot == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(slot);
    }

    @GetMapping("/division/{divisionId}")
    public ResponseEntity<List<TimetableSlot>> getSlotsByDivision(@PathVariable Long divisionId) {
        List<TimetableSlot> slots = timetableSlotService.getByDivision(divisionId);
        return ResponseEntity.ok(slots);
    }

    @GetMapping("/faculty/{facultyId}")
    public ResponseEntity<List<TimetableSlot>> getSlotsByFaculty(@PathVariable Long facultyId) {
        List<TimetableSlot> slots = timetableSlotService.getByFaculty(facultyId);
        return ResponseEntity.ok(slots);
    }

    @GetMapping("/classroom/{classroomId}")
    public ResponseEntity<List<TimetableSlot>> getSlotsByClassroom(@PathVariable Long classroomId) {
        List<TimetableSlot> slots = timetableSlotService.getByClassroom(classroomId);
        return ResponseEntity.ok(slots);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSlot(@PathVariable Long id) {
        timetableSlotService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/division/{divisionId}")
    public ResponseEntity<Void> deleteSlotsByDivision(@PathVariable Long divisionId) {
        timetableSlotService.deleteByDivision(divisionId);
        return ResponseEntity.noContent().build();
    }
}
