package com.college.master_data_service.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalTime;

@Entity
@Table(name = "periods")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Period {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Day day;              // MONDAY, TUESDAY, ...

    @Column(nullable = false)
    private LocalTime startTime;  // e.g., 09:00

    @Column(nullable = false)
    private LocalTime endTime;    // e.g., 10:00

    @Column(nullable = false)
    private Integer periodNumber; // 1, 2, 3 ... (slot index)

    // Enum for days
    public enum Day {
        MONDAY,
        TUESDAY,
        WEDNESDAY,
        THURSDAY,
        FRIDAY,
        SATURDAY
    }
}