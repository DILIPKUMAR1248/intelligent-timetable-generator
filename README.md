# 🎓 Intelligent Timetable Generator

**An AI-powered, microservices-based college timetable generation system built with Spring Boot, Google OR-Tools, and React.**

---

## 📌 Table of Contents
- [Problem Statement](#-problem-statement)
- [Solution Overview](#-solution-overview)
- [Architecture](#-architecture)
- [Tech Stack](#-tech-stack)
- [Features](#-features)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [API Documentation](#-api-documentation)
- [How the Solver Works](#-how-the-solver-works)
- [Edge Cases Handled](#-edge-cases-handled)
- [AI Usage Report](#-ai-usage-report)
- [Future Enhancements](#-future-enhancements)
- [Author](#-author)

---

## 📌 Problem Statement

A typical college has thousands of students, hundreds of faculty members, multiple departments, divisions, subjects, classrooms, and time periods. Creating a timetable manually that satisfies every constraint is nearly impossible. Conflicts like two lectures scheduled for the same faculty at the same time, or a lab subject assigned to a theory room, or a classroom being double-booked, are common and hard to detect manually.

The challenge is not just generating a timetable — it's generating one that:
- Respects **hard constraints** (never violated)
- Optimizes **soft constraints** (preferred but flexible)
- Handles **impossible scenarios** gracefully with clear explanations
- Provides an intuitive UI for management and review

---

## 💡 Solution Overview

This project delivers a complete **microservices-based solution** that:

1. **Stores master data** — divisions, subjects, faculty, classrooms, periods, and faculty-subject mappings
2. **Generates timetables automatically** using Google's OR-Tools CP-SAT constraint solver
3. **Validates feasibility** — if a timetable is impossible, it explains exactly why
4. **Persists generated timetables** for viewing by division or faculty
5. **Offers a modern, colorful React UI** for management, generation, and visualization

The system is designed to be **production-ready**, with clean separation of concerns, scalability in mind, and a strong emphasis on correctness and user experience.

---

## 🏗️ Architecture

The system uses a **microservices architecture** with three independent backend services and one React frontend:
