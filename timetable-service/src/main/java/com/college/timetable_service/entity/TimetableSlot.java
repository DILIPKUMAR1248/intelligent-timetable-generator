package com.college.timetable_service.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "timetable_slots")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TimetableSlot {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "division_id")
    private Long divisionId;

    @Column(name = "subject_id")
    private Long subjectId;

    @Column(name = "faculty_id")
    private Long facultyId;

    @Column(name = "classroom_id")
    private Long classroomId;

    @Column(name = "period_id")
    private Long periodId;

    @Column(name = "generated_at")
    private LocalDateTime generatedAt;
}
