# Notes Application

A simple Notes Application with ReactJS frontend and Java Spring Boot backend.

## Features

- View all notes
- Create new notes
- Edit existing notes
- Delete notes (with confirmation)
- Search notes by title
- Display creation date and time

## Project Structure

```
notesapp/
├── backend/          # Spring Boot backend
│   ├── src/
│   │   └── main/
│   │       ├── java/com/notesapp/
│   │       │   ├── model/
│   │       │   ├── service/
│   │       │   └── controller/
│   │       └── resources/
│   └── pom.xml
└── frontend/         # React frontend
    ├── src/
    │   ├── pages/
    │   └── index.css
    └── package.json
```

## Running the Application

### Backend

1. Navigate to the backend directory:
   ```powershell
   cd backend
   ```

2. Run the Spring Boot application:
   ```powershell
   mvn spring-boot:run
   ```
   The backend will start on port 8080.

### Frontend

1. Navigate to the frontend directory:
   ```powershell
   cd frontend
   ```

2. Install dependencies:
   ```powershell
   npm.cmd install
   ```

3. Start the development server:
   ```powershell
   npm.cmd run dev
   ```
   The frontend will start on port 3000.

## Technologies Used

- **Backend**: Spring Boot, Java
- **Frontend**: React, React Router, Axios, Vite
- **Storage**: In-memory list (no database)
