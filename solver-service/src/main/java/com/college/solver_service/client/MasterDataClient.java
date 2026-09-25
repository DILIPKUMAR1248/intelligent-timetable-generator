package com.college.solver_service.client;

import com.college.solver_service.dto.*;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;

@Service
public class MasterDataClient {

    private final RestTemplate restTemplate;
    private static final String BASE_URL = "http://localhost:8082/api";

    public MasterDataClient(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public List<DivisionDto> getAllDivisions() {
        return restTemplate.exchange(
                BASE_URL + "/divisions",
                HttpMethod.GET,
                null,
                new ParameterizedTypeReference<List<DivisionDto>>() {}
        ).getBody();
    }

    public List<SubjectDto> getAllSubjects() {
        return restTemplate.exchange(
                BASE_URL + "/subjects",
                HttpMethod.GET,
                null,
                new ParameterizedTypeReference<List<SubjectDto>>() {}
        ).getBody();
    }

    public List<FacultyDto> getAllFaculty() {
        return restTemplate.exchange(
                BASE_URL + "/faculty",
                HttpMethod.GET,
                null,
                new ParameterizedTypeReference<List<FacultyDto>>() {}
        ).getBody();
    }

    public List<ClassroomDto> getAllClassrooms() {
        return restTemplate.exchange(
                BASE_URL + "/classrooms",
                HttpMethod.GET,
                null,
                new ParameterizedTypeReference<List<ClassroomDto>>() {}
        ).getBody();
    }

    public List<PeriodDto> getAllPeriods() {
        return restTemplate.exchange(
                BASE_URL + "/periods",
                HttpMethod.GET,
                null,
                new ParameterizedTypeReference<List<PeriodDto>>() {}
        ).getBody();
    }

    public List<FacultySubjectDto> getAllFacultySubjects() {
        return restTemplate.exchange(
                BASE_URL + "/faculty-subjects",
                HttpMethod.GET,
                null,
                new ParameterizedTypeReference<List<FacultySubjectDto>>() {}
        ).getBody();
    }
}
