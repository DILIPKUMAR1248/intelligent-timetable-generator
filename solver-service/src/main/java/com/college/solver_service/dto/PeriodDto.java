package com.college.solver_service.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PeriodDto {
    private Long id;
    private String day;
    private String startTime;
    private String endTime;
    private Integer periodNumber;
}
