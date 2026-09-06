# NFC MedCard Backend

Complete backend API for an NFC MedCard hospital system built with Node.js, Express, and MongoDB.

## Features
- JWT Authentication (Admin/Doctor roles)
- Patient Management with unique NFC UUID generation
- Core NFC scan endpoint (`/api/patients/nfc/:uuid`) with automatic Scan Log creation
- Medical records and visit history tracking
- Doctor and Hospital management

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Environment Variables:
   Copy `.env.example` to `.env` and update the values:
   ```bash
   cp .env.example .env
   ```
   Ensure you provide a valid `MONGODB_URI` and a secure `JWT_SECRET`.

3. Seed the Database:
   Populate the database with initial data (1 hospital, 1 admin, 1 doctor, 2 patients):
   ```bash
   npm run seed
   ```

   **Default Accounts:**
   - Admin: `admin@hospital.com` / `admin123`
   - Doctor: `doctor@hospital.com` / `doctor123`

4. Run the Server:
   - Development mode: `npm run dev`
   - Production mode: `npm start`

## Core API Endpoints
- `POST /api/auth/login` - Authenticate
- `GET /api/patients/nfc/:uuid` - Scan NFC card (Requires Auth)
- `POST /api/patients/:id/visits` - Add a visit record
- `GET /api/scan-logs` - View NFC scan logs (Admin Only)
