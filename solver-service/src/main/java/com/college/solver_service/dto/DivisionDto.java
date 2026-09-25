package com.college.solver_service.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DivisionDto {
    private Long id;
    private String name;
    private String department;
    private Integer strength;
    private Integer semester;
}
