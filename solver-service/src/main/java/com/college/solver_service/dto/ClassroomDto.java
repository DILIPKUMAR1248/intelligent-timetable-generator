package com.college.solver_service.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ClassroomDto {
    private Long id;
    private String roomNumber;
    private Integer capacity;
    private String type;
    private String building;
}
