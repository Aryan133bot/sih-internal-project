# NFC MedCard Admin Dashboard

A comprehensive React-based hospital administration dashboard for managing patient records linked to NFC MedCards.

## Features
- **Authentication**: JWT-based secure login
- **Dashboard Overview**: Metrics, recent scan logs, and visual charts
- **Patient Management**: Full CRUD operations for patient data, medical history, and allergies
- **NFC Integration**: System design optimized for assigning unique UUIDs to medical cards
- **Scan Logs**: Real-time auditing of card scans by hospital staff
- **Staff Management**: Role-based access control (Admin vs Doctor)

## Tech Stack
- React 18
- Vite
- React Router DOM v6
- Tailwind CSS
- Lucide React (Icons)
- Recharts (Data visualization)
- React Hot Toast (Notifications)
- Axios

## Setup & Installation

1. Navigate to the dashboard directory:
   ```bash
   cd dashboard
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. The application will be available at `http://localhost:5173`

*Note: This front-end is configured to connect to an API at `http://localhost:5000/api`. Ensure the backend server is running for full functionality. The application currently uses mock data timeouts to demonstrate UI functionality when the API is unavailable.*
