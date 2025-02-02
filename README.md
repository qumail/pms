Patient Management System for Orthodontists

Overview:
The Patient Management System is a backend service designed to help orthodontists efficiently manage patient records, appointments, and consultations. It ensures secure handling of sensitive medical information and enables role-based access control for different users (patients, doctors, and admin staff).

Features:
-User authentication with JWT-based security.
-CRUD operations for managing patient records.
-Appointment scheduling and management.
-Role-based access control (RBAC) for patients, doctors, and administrative staff.
-Secure storage and retrieval of patient medical history.
-Logging and error handling for monitoring system performance.

Tech Stack:
Backend: Node.js, Express.js
Database: MongoDB
Authentication: JWT & Bcrypt

API Endpoints:
Authentication
1. Register User
POST /node/pms/authentication/register

Request Body:
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123",
  "role": "patient"
}

Response:
{
  "message": "User registered successfully",
  "userId": "60d5b2b8e6f7a45f6c8b4567"
}

2. Login User
POST /node/pms/authentication/register

Request Body:
{
  "email": "john@example.com",
  "password": "SecurePass123"
}

Response:
{
  "token": "eyJhbGciOiJIUzI1...",
  "role": "patient"
}

Patients
3. Get Patient Record (Patient Only)
GET /node/pms/patient
Authorization: JWT <token>

Response:
[
  {
    "_id": "60d5b2b8e6f7a45f6c8b4567",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "medicalHistory": []
  }
]

4. Add a New Patient Record (Doctor/Admin)
POST /node/pms/patient/:pateintId
Authorization: Bearer <token>

Request Body:
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "phone": "+1987654321",
  "medicalHistory": []
}

Response:
{
  "message": "Patient record added successfully",
  "patientId": "60d5b2b8e6f7a45f6c8b4568"
}

Appointments
5. Schedule an Appointment (Patient/Doctor)
POST /node/pms/appointment
Authorization: Bearer <token>

Request Body:
{
  "patientId": "60d5b2b8e6f7a45f6c8b4567",
  "doctorId": "60d5b2b8e6f7a45f6c8b4570",
  "date": "2025-02-10T10:00:00Z"
}

Response:
{
  "message": "Appointment scheduled successfully",
  "appointmentId": "60d5b2b8e6f7a45f6c8b4571"
}

6. Get Appointments (Doctor/Admin Only)
GET /node/pms/appointment/get-apppointments
Authorization: Bearer <token>

Response:
[
  {
    "_id": "60d5b2b8e6f7a45f6c8b4571",
    "patient": "John Doe",
    "doctor": "Dr. Smith",
    "date": "2025-02-10T10:00:00Z"
  }
]

Role-Based Access Control (RBAC)
Role
Access Privileges
Patient
View & book appointments
Doctor
Manage patient records & appointments
Admin
Full system access

Installation:

Prerequisites
Node.js & npm
MongoDB

Steps to Run Locally

Clone the repository:
 -git clone https://github.com/your-repo/patient-management-system.git

 -cd patient-management-system

Install dependencies:
 -npm install


Set up environment variables in a .env file:
 PORT=5000
 MONGO_URI=mongodb://localhost:27017/pms
 JWT_SECRET=your_secret_key

Start the server:
 - npm run dev

Contributing
Fork the repository.
Create a new branch (feature-branch).
Commit your changes.
Push to your fork and submit a pull request.
License
This project is licensed under the MIT License.
