package com.college.solver_service.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FacultySubjectDto {
    private Long id;
    private FacultyDto faculty;
    private SubjectDto subject;
}
