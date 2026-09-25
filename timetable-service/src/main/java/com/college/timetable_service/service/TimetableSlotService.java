package com.college.timetable_service.service;

import com.college.timetable_service.entity.TimetableSlot;
import com.college.timetable_service.repository.TimetableSlotRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TimetableSlotService {

    @Autowired
    private TimetableSlotRepository timetableSlotRepository;

    public TimetableSlot save(TimetableSlot slot) {
        return timetableSlotRepository.save(slot);
    }

    public List<TimetableSlot> saveAll(List<TimetableSlot> slots) {
        return timetableSlotRepository.saveAll(slots);
    }

    public List<TimetableSlot> getAll() {
        return timetableSlotRepository.findAll();
    }

    public TimetableSlot getById(Long id) {
        return timetableSlotRepository.findById(id).orElse(null);
    }

    public List<TimetableSlot> getByDivision(Long divisionId) {
        return timetableSlotRepository.findByDivisionId(divisionId);
    }

    public List<TimetableSlot> getByFaculty(Long facultyId) {
        return timetableSlotRepository.findByFacultyId(facultyId);
    }

    public List<TimetableSlot> getByClassroom(Long classroomId) {
        return timetableSlotRepository.findByClassroomId(classroomId);
    }

    public void delete(Long id) {
        timetableSlotRepository.deleteById(id);
    }

    public void deleteByDivision(Long divisionId) {
        timetableSlotRepository.deleteByDivisionId(divisionId);
    }
}
