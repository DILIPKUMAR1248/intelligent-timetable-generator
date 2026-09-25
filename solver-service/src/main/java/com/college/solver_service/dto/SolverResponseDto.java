package com.college.solver_service.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SolverResponseDto {
    private String status;
    private String message;
    private List<TimetableSlotDto> slots;
    private List<String> conflicts;
}
