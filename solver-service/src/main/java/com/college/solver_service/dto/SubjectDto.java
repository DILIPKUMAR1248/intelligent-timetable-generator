package com.college.solver_service.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SubjectDto {
    private Long id;
    private String code;
    private String name;
    private String department;
    private Integer semester;
    private String type;
    private Integer weeklyHours;
}
