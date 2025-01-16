# Interview Experience Platform ( Glimpse )

## Overview
This platform is designed for users to share and explore interview experiences from various companies worldwide. Users can register, log in, submit their interview experiences, and view experiences submitted by others.

---

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Backend Setup](#backend-setup)
3. [Frontend Setup](#frontend-setup)
4. [Design Choices](#design-choices)
5. [API Endpoints](#api-endpoints)
6. [Project Structure](#project-structure)

---

## Prerequisites
- **Node.js** (v16 or higher)
- **MongoDB** (local or cloud instance)
- **npm** (comes with Node.js)

---

## Backend Setup

### Steps to Set Up the Server
1. Clone the repository and navigate to the `server` directory.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `server` directory and add the following variables:
   ```env
   PORT=5000
   MONGODB_URI=<Your MongoDB Connection URI>
   JWT_SECRET=<Your JWT Secret Key>
   ```
4. Start the server:
   ```bash
   npm start
   ```
5. The backend server will run at `http://localhost:5000`.

---

## Frontend Setup

### Steps to Set Up the Client
1. Navigate to the `client` directory.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `client` directory and add the following variable:
   ```env
   REACT_APP_BACKEND_API_URL=http://localhost:5000/api
   ```
4. Start the development server:
   ```bash
   npm start
   ```
5. The frontend will run at `http://localhost:3000`.

---

## Design Choices

### Backend
1. **Framework:**
   - **Express.js** was chosen for its simplicity and wide community support.
2. **Database:**
   - **MongoDB** was used for its flexibility in handling dynamic schemas and its suitability for JSON-like data.
3. **Authentication:**
   - **JWT (JSON Web Tokens)** ensures secure, stateless authentication.
4. **Password Security:**
   - **bcrypt** hashes passwords for secure storage.
5. **Pagination:**
   - Implemented for efficient handling of large data sets in the `/api/submissions` endpoint.

### Frontend
1. **React.js:**
   - Chosen for its component-based architecture and efficient UI updates.
2. **React Router:**
   - Simplifies routing for multi-page navigation.
3. **State Management:**
   - Context API manages authentication state across the app.
4. **Styling:**
   - TailwindCSS for responsive and modern UI design.

---

## API Endpoints

### Authentication
- **POST** `/api/register`
  - Registers a new user.
  - Required fields: `name`, `email`, `password`.

- **POST** `/api/login`
  - Authenticates a user and returns a JWT token.
  - Required fields: `email`, `password`.

### Submissions
- **POST** `/api/submissions`
  - Creates a new submission. Requires authentication.

- **GET** `/api/submissions`
  - Retrieves all submissions with pagination.
  - Query parameters: `page`, `limit`.

- **GET** `/api/submissions/my`
  - Retrieves submissions by the logged-in user.

---

## Project Structure

### Backend (`server` Directory)
```
├── backend
│   ├── package.json
│   ├── package-lock.json
│   └── server.js
```

### Frontend (`client` Directory)
```
└── frontend
    ├── package.json
    ├── package-lock.json
    ├── public
    │   ├── favicon.ico
    │   ├── index.html
    │   ├── logo192.png
    │   ├── logo512.png
    │   ├── manifest.json
    │   └── robots.txt
    ├── README.md
    ├── src
    │   ├── App.css
    │   ├── App.js
    │   ├── App.test.js
    │   ├── components
    │   │   └── ui
    │   │       └── alert.js
    │   ├── index.css
    │   ├── index.js
    │   ├── logo.svg
    │   ├── reportWebVitals.js
    │   └── setupTests.js
    └── tailwind.config.js
```

---

## Notes
- Ensure all `.env` files are secure and not exposed publicly.
- Replace placeholders (e.g., `<Your MongoDB Connection URI>`) with actual values.

For questions or issues, feel free to open an issue in the repository.

