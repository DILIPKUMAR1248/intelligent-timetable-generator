package com.college.solver_service.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FacultyDto {
    private Long id;
    private String name;
    private String email;
    private String department;
    private String designation;
    private Integer maxHoursPerWeek;
}
