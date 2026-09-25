package com.college.solver_service.client;

import com.college.solver_service.dto.TimetableSlotDto;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;

@Service
public class TimetableClient {

    private final RestTemplate restTemplate;
    private static final String BASE_URL = "http://localhost:8083/api";

    public TimetableClient(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public void saveSlots(List<TimetableSlotDto> slots) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<List<TimetableSlotDto>> request = new HttpEntity<>(slots, headers);
        restTemplate.postForEntity(BASE_URL + "/timetable-slots/bulk", request, String.class);
    }
}
