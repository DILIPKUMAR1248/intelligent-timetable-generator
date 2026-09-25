package com.college.solver_service.service;

import com.college.solver_service.client.MasterDataClient;
import com.college.solver_service.client.TimetableClient;
import com.college.solver_service.dto.*;
import com.college.solver_service.solver.TimetableSolver;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SolverOrchestrationService {

    private final MasterDataClient masterDataClient;
    private final TimetableClient timetableClient;
    private final TimetableSolver timetableSolver;

    public SolverOrchestrationService(
            MasterDataClient masterDataClient,
            TimetableClient timetableClient,
            TimetableSolver timetableSolver
    ) {
        this.masterDataClient = masterDataClient;
        this.timetableClient = timetableClient;
        this.timetableSolver = timetableSolver;
    }

    public SolverResponseDto generateTimetable(SolverRequestDto request) {
        try {
            // Step 1: Fetch all data from MasterDataClient
            List<DivisionDto> divisions = masterDataClient.getAllDivisions();
            List<SubjectDto> subjects = masterDataClient.getAllSubjects();
            List<FacultyDto> faculty = masterDataClient.getAllFaculty();
            List<ClassroomDto> classrooms = masterDataClient.getAllClassrooms();
            List<PeriodDto> periods = masterDataClient.getAllPeriods();
            List<FacultySubjectDto> facultySubjects = masterDataClient.getAllFacultySubjects();

            // Validate data fetch
            if (divisions == null || subjects == null || faculty == null ||
                classrooms == null || periods == null || facultySubjects == null) {
                SolverResponseDto errorResponse = new SolverResponseDto();
                errorResponse.setStatus("ERROR");
                errorResponse.setMessage("Failed to fetch data from master-data-service");
                errorResponse.setSlots(List.of());
                errorResponse.setConflicts(List.of("Master data service may be down or returning errors"));
                return errorResponse;
            }

            // Step 2: Call TimetableSolver
            SolverResponseDto response = timetableSolver.solve(
                    divisions, subjects, faculty, classrooms, periods, facultySubjects,
                    request.getDivisionIds()
            );

            // Step 3: If successful, save slots to timetable-service
            if ("SUCCESS".equals(response.getStatus()) && response.getSlots() != null) {
                try {
                    timetableClient.saveSlots(response.getSlots());
                    response.setMessage(response.getMessage() + " and saved to timetable-service");
                } catch (Exception e) {
                    response.setStatus("PARTIAL");
                    response.setMessage(response.getMessage() + " but failed to save to timetable-service: " + e.getMessage());
                }
            }

            // Step 4: Return response
            return response;

        } catch (Exception e) {
            SolverResponseDto errorResponse = new SolverResponseDto();
            errorResponse.setStatus("ERROR");
            errorResponse.setMessage("Orchestration error: " + e.getMessage());
            errorResponse.setSlots(List.of());
            errorResponse.setConflicts(List.of(e.getMessage()));
            return errorResponse;
        }
    }
}
