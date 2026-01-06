# Online Course Platform

A comprehensive education management system built with **Clean Architecture**, featuring a robust **ASP.NET Core 8 API**, a modern **React Frontend**, and fully containerized with **Docker**.

## 🚀 Key Features

- **Course Management**: Create, update, and manage educational courses.
- **Lesson Management**: Organize lessons within courses with intuitive reordering.
- **Dashboard Metrics**: Real-time statistics (Total courses, Published vs Drafts, Total lessons).
- **Role-Based Access Control (RBAC)**: Secure access with "Admin" and "User" roles.
- **Hard Delete**: Administrative capability to permanently remove content (cascading delete).
- **Soft Delete**: Safe deletion mechanism for standard users.
- **JWT Authentication**: Secure token-based authentication.
- **Dockerized Environment**: Single-command setup for the entire stack.

## 🛠️ Tech Stack

- **Backend**: ASP.NET Core 8, Entity Framework Core.
- **Database**: PostgreSQL 16.
- **Frontend**: React (Vite), Axios, Vanilla CSS.
- **Containerization**: Docker, Docker Compose.
- **Documentation**: Swagger UI.

## 📦 Getting Started

### Prerequisites
- Docker and Docker Desktop installed.

### Installation & Run
1. Clone the repository.
2. Navigate to the root directory.
3. Run the following command:
   ```bash
   docker compose up --build
   ```

## 🌐 Application Access

Once the containers are running, you can access the services at:

| Service | URL |
| :--- | :--- |
| **Frontend App** | [http://localhost:3000](http://localhost:3000) |
| **API Swagger** | [http://localhost:5239/swagger](http://localhost:5239/swagger) |
| **Database (Host)** | `localhost:5433` |

## 🔑 Default Credentials

Use these credentials to access the administrative features:

- **Email**: `admin@gmail.com`
- **Password**: `Admin123*`

## 🏗️ Project Structure

- `src/API`: Entry point for the ASP.NET Core Web API.
- `src/Application`: Business logic, interfaces, and DTOs.
- `src/Domain`: Core entities and enums.
- `src/Infrastructure`: Data persistence (EF Core), Repositories, and Migrations.
- `src/Frontend`: React application with Vite.
- `tests/UnitTests`: Automated unit tests for services.

## 👤 Author

Developed by **[Santy1924](https://github.com/Santy1924)**.