package com.college.timetable_service.repository;

import com.college.timetable_service.entity.TimetableSlot;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TimetableSlotRepository extends JpaRepository<TimetableSlot, Long> {

    List<TimetableSlot> findByDivisionId(Long divisionId);
    List<TimetableSlot> findByFacultyId(Long facultyId);
    List<TimetableSlot> findByClassroomId(Long classroomId);
    List<TimetableSlot> findByPeriodId(Long periodId);
    void deleteByDivisionId(Long divisionId);
}
