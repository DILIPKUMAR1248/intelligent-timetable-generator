package com.college.solver_service.solver;

import com.college.solver_service.dto.*;
import com.google.ortools.sat.CpModel;
import com.google.ortools.sat.CpSolver;
import com.google.ortools.sat.CpSolverStatus;
import com.google.ortools.sat.IntVar;
import com.google.ortools.sat.LinearExpr;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class TimetableSolver {

    public SolverResponseDto solve(
            List<DivisionDto> allDivisions,
            List<SubjectDto> allSubjects,
            List<FacultyDto> allFaculty,
            List<ClassroomDto> allClassrooms,
            List<PeriodDto> allPeriods,
            List<FacultySubjectDto> allFacultySubjects,
            List<Long> divisionIds
    ) {
        SolverResponseDto response = new SolverResponseDto();
        response.setSlots(new ArrayList<>());
        response.setConflicts(new ArrayList<>());

        try {
            // Filter divisions based on request
            List<DivisionDto> divisions = allDivisions.stream()
                    .filter(d -> divisionIds.contains(d.getId()))
                    .collect(Collectors.toList());

            if (divisions.isEmpty()) {
                response.setStatus("ERROR");
                response.setMessage("No valid divisions found");
                return response;
            }

            // Build maps for quick lookup
            Map<Long, SubjectDto> subjectMap = allSubjects.stream()
                    .collect(Collectors.toMap(SubjectDto::getId, s -> s));
            Map<Long, FacultyDto> facultyMap = allFaculty.stream()
                    .collect(Collectors.toMap(FacultyDto::getId, f -> f));
            Map<Long, ClassroomDto> classroomMap = allClassrooms.stream()
                    .collect(Collectors.toMap(ClassroomDto::getId, c -> c));

            // Build faculty-subject mapping
            Map<Long, Set<Long>> facultyToSubjects = new HashMap<>();
            Map<Long, Set<Long>> subjectToFaculty = new HashMap<>();
            for (FacultySubjectDto fs : allFacultySubjects) {
                facultyToSubjects.computeIfAbsent(fs.getFaculty().getId(), k -> new HashSet<>())
                        .add(fs.getSubject().getId());
                subjectToFaculty.computeIfAbsent(fs.getSubject().getId(), k -> new HashSet<>())
                        .add(fs.getFaculty().getId());
            }

            // Validate prerequisites
            List<String> validationErrors = validatePrerequisites(
                    divisions, subjectMap, facultyMap, subjectToFaculty, classroomMap, allPeriods
            );

            if (!validationErrors.isEmpty()) {
                response.setStatus("IMPOSSIBLE");
                response.setMessage("Validation failed: " + String.join(", ", validationErrors));
                response.setConflicts(validationErrors);
                return response;
            }

            // Create CP-SAT model
            CpModel model = new CpModel();

            // Create decision variables
            // X[divisionIndex][subjectIndex][facultyIndex][classroomIndex][periodIndex]
            Map<String, IntVar> variables = new HashMap<>();
            List<DivisionDto> divisionList = new ArrayList<>(divisions);
            List<SubjectDto> subjectList = new ArrayList<>(allSubjects);
            List<FacultyDto> facultyList = new ArrayList<>(allFaculty);
            List<ClassroomDto> classroomList = new ArrayList<>(allClassrooms);
            List<PeriodDto> periodList = new ArrayList<>(allPeriods);

            for (int d = 0; d < divisionList.size(); d++) {
                DivisionDto division = divisionList.get(d);
                for (int s = 0; s < subjectList.size(); s++) {
                    SubjectDto subject = subjectList.get(s);
                    // Only create variables for subjects that match division's semester and department
                    if (!subject.getDepartment().equals(division.getDepartment()) ||
                        !subject.getSemester().equals(division.getSemester())) {
                        continue;
                    }

                    for (int f = 0; f < facultyList.size(); f++) {
                        FacultyDto faculty = facultyList.get(f);
                        // Faculty must be assigned to this subject
                        if (!facultyToSubjects.getOrDefault(faculty.getId(), Collections.emptySet())
                                .contains(subject.getId())) {
                            continue;
                        }

                        for (int c = 0; c < classroomList.size(); c++) {
                            ClassroomDto classroom = classroomList.get(c);
                            // Room type constraint
                            if (subject.getType().equalsIgnoreCase("LAB") &&
                                !classroom.getType().equalsIgnoreCase("LAB")) {
                                continue;
                            }
                            if (subject.getType().equalsIgnoreCase("THEORY") &&
                                !(classroom.getType().equalsIgnoreCase("LECTURE") ||
                                  classroom.getType().equalsIgnoreCase("SEMINAR"))) {
                                continue;
                            }
                            // Capacity constraint
                            if (classroom.getCapacity() < division.getStrength()) {
                                continue;
                            }

                            for (int p = 0; p < periodList.size(); p++) {
                                String varName = String.format("x_%d_%d_%d_%d_%d", d, s, f, c, p);
                                IntVar var = model.newBoolVar(varName);
                                variables.put(varName, var);
                            }
                        }
                    }
                }
            }

            System.out.println("Created " + variables.size() + " decision variables");

            // Constraint 1: Each division-subject must have exactly weeklyHours assignments
            for (int d = 0; d < divisionList.size(); d++) {
                DivisionDto division = divisionList.get(d);
                for (int s = 0; s < subjectList.size(); s++) {
                    SubjectDto subject = subjectList.get(s);
                    if (!subject.getDepartment().equals(division.getDepartment()) ||
                        !subject.getSemester().equals(division.getSemester())) {
                        continue;
                    }

                    List<IntVar> subjectVars = new ArrayList<>();
                    for (int f = 0; f < facultyList.size(); f++) {
                        for (int c = 0; c < classroomList.size(); c++) {
                            for (int p = 0; p < periodList.size(); p++) {
                                String varName = String.format("x_%d_%d_%d_%d_%d", d, s, f, c, p);
                                if (variables.containsKey(varName)) {
                                    subjectVars.add(variables.get(varName));
                                }
                            }
                        }
                    }

                    if (!subjectVars.isEmpty()) {
                        model.addEquality(LinearExpr.sum(subjectVars.toArray(new IntVar[0])), (long) subject.getWeeklyHours());
                    }
                }
            }

            // Constraint 2: Each division can have at most 1 lecture per period
            for (int d = 0; d < divisionList.size(); d++) {
                for (int p = 0; p < periodList.size(); p++) {
                    List<IntVar> periodVars = new ArrayList<>();
                    for (int s = 0; s < subjectList.size(); s++) {
                        for (int f = 0; f < facultyList.size(); f++) {
                            for (int c = 0; c < classroomList.size(); c++) {
                                String varName = String.format("x_%d_%d_%d_%d_%d", d, s, f, c, p);
                                if (variables.containsKey(varName)) {
                                    periodVars.add(variables.get(varName));
                                }
                            }
                        }
                    }
                    if (!periodVars.isEmpty()) {
                        model.addLessOrEqual(LinearExpr.sum(periodVars.toArray(new IntVar[0])), 1L);
                    }
                }
            }

            // Constraint 3: Each faculty can teach at most 1 lecture per period
            for (int f = 0; f < facultyList.size(); f++) {
                for (int p = 0; p < periodList.size(); p++) {
                    List<IntVar> facultyPeriodVars = new ArrayList<>();
                    for (int d = 0; d < divisionList.size(); d++) {
                        for (int s = 0; s < subjectList.size(); s++) {
                            for (int c = 0; c < classroomList.size(); c++) {
                                String varName = String.format("x_%d_%d_%d_%d_%d", d, s, f, c, p);
                                if (variables.containsKey(varName)) {
                                    facultyPeriodVars.add(variables.get(varName));
                                }
                            }
                        }
                    }
                    if (!facultyPeriodVars.isEmpty()) {
                        model.addLessOrEqual(LinearExpr.sum(facultyPeriodVars.toArray(new IntVar[0])), 1L);
                    }
                }
            }

            // Constraint 4: Each classroom can host at most 1 lecture per period
            for (int c = 0; c < classroomList.size(); c++) {
                for (int p = 0; p < periodList.size(); p++) {
                    List<IntVar> classroomPeriodVars = new ArrayList<>();
                    for (int d = 0; d < divisionList.size(); d++) {
                        for (int s = 0; s < subjectList.size(); s++) {
                            for (int f = 0; f < facultyList.size(); f++) {
                                String varName = String.format("x_%d_%d_%d_%d_%d", d, s, f, c, p);
                                if (variables.containsKey(varName)) {
                                    classroomPeriodVars.add(variables.get(varName));
                                }
                            }
                        }
                    }
                    if (!classroomPeriodVars.isEmpty()) {
                        model.addLessOrEqual(LinearExpr.sum(classroomPeriodVars.toArray(new IntVar[0])), 1L);
                    }
                }
            }

            // Constraint 8: Faculty max hours per week
            for (int f = 0; f < facultyList.size(); f++) {
                FacultyDto faculty = facultyList.get(f);
                List<IntVar> facultyVars = new ArrayList<>();
                for (int d = 0; d < divisionList.size(); d++) {
                    for (int s = 0; s < subjectList.size(); s++) {
                        for (int c = 0; c < classroomList.size(); c++) {
                            for (int p = 0; p < periodList.size(); p++) {
                                String varName = String.format("x_%d_%d_%d_%d_%d", d, s, f, c, p);
                                if (variables.containsKey(varName)) {
                                    facultyVars.add(variables.get(varName));
                                }
                            }
                        }
                    }
                }
                if (!facultyVars.isEmpty()) {
                    model.addLessOrEqual(LinearExpr.sum(facultyVars.toArray(new IntVar[0])), (long) faculty.getMaxHoursPerWeek());
                }
            }

            // Solve
            CpSolver solver = new CpSolver();
            solver.getParameters().setMaxTimeInSeconds(30);

            CpSolverStatus status = solver.solve(model);
            System.out.println("Solver status: " + status);

            if (status == CpSolverStatus.OPTIMAL || status == CpSolverStatus.FEASIBLE) {
                // Extract solution
                List<TimetableSlotDto> slots = new ArrayList<>();
                for (Map.Entry<String, IntVar> entry : variables.entrySet()) {
                    if (solver.value(entry.getValue()) == 1) {
                        String[] parts = entry.getKey().split("_");
                        int d = Integer.parseInt(parts[1]);
                        int s = Integer.parseInt(parts[2]);
                        int f = Integer.parseInt(parts[3]);
                        int c = Integer.parseInt(parts[4]);
                        int p = Integer.parseInt(parts[5]);

                        TimetableSlotDto slot = new TimetableSlotDto();
                        slot.setDivisionId(divisionList.get(d).getId());
                        slot.setSubjectId(subjectList.get(s).getId());
                        slot.setFacultyId(facultyList.get(f).getId());
                        slot.setClassroomId(classroomList.get(c).getId());
                        slot.setPeriodId(periodList.get(p).getId());
                        slots.add(slot);
                    }
                }

                response.setStatus("SUCCESS");
                response.setMessage("Timetable generated successfully with " + slots.size() + " slots");
                response.setSlots(slots);
            } else {
                response.setStatus("IMPOSSIBLE");
                response.setMessage("No feasible solution found. Status: " + status);
                response.setConflicts(Arrays.asList(
                        "Total required lectures may exceed available periods",
                        "Faculty availability constraints may be too restrictive",
                        "Classroom capacity or type constraints may be unsatisfiable"
                ));
            }

        } catch (Exception e) {
            response.setStatus("ERROR");
            response.setMessage("Solver error: " + e.getMessage());
            e.printStackTrace();
        }

        return response;
    }

    private List<String> validatePrerequisites(
            List<DivisionDto> divisions,
            Map<Long, SubjectDto> subjectMap,
            Map<Long, FacultyDto> facultyMap,
            Map<Long, Set<Long>> subjectToFaculty,
            Map<Long, ClassroomDto> classroomMap,
            List<PeriodDto> periods
    ) {
        List<String> errors = new ArrayList<>();

        // Check if all divisions have subjects
        for (DivisionDto division : divisions) {
            boolean hasSubject = subjectMap.values().stream()
                    .anyMatch(s -> s.getDepartment().equals(division.getDepartment()) &&
                                   s.getSemester().equals(division.getSemester()));
            if (!hasSubject) {
                errors.add("No subjects found for division " + division.getName());
            }
        }

        // Check if all subjects have faculty assigned
        for (Map.Entry<Long, SubjectDto> entry : subjectMap.entrySet()) {
            if (!subjectToFaculty.containsKey(entry.getKey()) || subjectToFaculty.get(entry.getKey()).isEmpty()) {
                errors.add("No faculty assigned to subject: " + entry.getValue().getName());
            }
        }

        // Check if there are enough periods
        if (periods.isEmpty()) {
            errors.add("No periods defined");
        }

        // Check if there are classrooms
        if (classroomMap.isEmpty()) {
            errors.add("No classrooms defined");
        }

        return errors;
    }
}
