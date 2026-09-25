package com.college.solver_service.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TimetableSlotDto {
    private Long divisionId;
    private Long subjectId;
    private Long facultyId;
    private Long classroomId;
    private Long periodId;
}
