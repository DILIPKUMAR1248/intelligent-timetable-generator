package com.college.solver_service.controller;

import com.college.solver_service.dto.SolverRequestDto;
import com.college.solver_service.dto.SolverResponseDto;
import com.college.solver_service.service.SolverOrchestrationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/solver")
public class SolverController {

    private final SolverOrchestrationService solverOrchestrationService;

    public SolverController(SolverOrchestrationService solverOrchestrationService) {
        this.solverOrchestrationService = solverOrchestrationService;
    }

    @PostMapping("/generate")
    public ResponseEntity<SolverResponseDto> generateTimetable(@RequestBody SolverRequestDto request) {
        SolverResponseDto response = solverOrchestrationService.generateTimetable(request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> health() {
        return ResponseEntity.ok(Map.of("status", "UP"));
    }
}
