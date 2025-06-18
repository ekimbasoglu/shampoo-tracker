
# React and Node/Express Boilerplate

    
![react](https://media.giphy.com/media/8HXBCxfowMjt93G58s/giphy.gif)

## Overview

A full-stack app that allows users to create, manage, and rate various types of content, such as games, videos, artwork, and music. The platform supports user authentication, content management, and a rating system, providing a complete CRUD (Create, Read, Update, Delete) functionality with secure access and user interactions.

## Project Setup

This project consists of two main parts: a backend built with Node.js and Express, and a frontend built with React.

### Backend

- **Node.js**: The backend is built using Node.js and Express. The project is set up with the necessary dependencies and follows a standard MVC structure.
- **Database**: A NoSQL database (MongoDB) is used for storing user and content data.
- **Swagger**: API documentation is provided using Swagger.

### Frontend

- **React**: The frontend is built using React. It is a single-page application that interacts with the backend API to display and manage content.
- **Tailwind CSS**: The application uses Tailwind CSS for styling, providing utility-first CSS classes that allow rapid and flexible design development. Tailwind CSS helps in building a responsive and modern UI with minimal custom CSS.

## API Endpoints

![image](https://github.com/user-attachments/assets/a5689ead-0c2f-46ab-946a-62f0b4e607f8)

## Running Tests

To run the tests, use the following command:

```bash
cd backend-app && npm run drop && npm test
```

## Documentation

API documentation is provided using Swagger. To view the documentation, run the project and navigate to `backend-url/api-docs`.

## Running the Project

To run the project locally:

1. **Clone the repository**:
    ```bash
    git clone github.com/ekimbasoglu/back-end-developer-task
    ```

2. **Install dependencies**:

    - Backend:
        ```bash
        cd backend-app && npm install
        ```

    - Frontend:
        ```bash
        cd react-app && npm install
        ```

3. **Setting Up Environment Variables**:

    - Backend:
        ```bash
        cd backend-app && nano .env
        PORT=3000
        NODE_ENV=development
        MONGO_URI=your_mongo_uri_here
        JWT_SECRET=secret

        ```

    - Frontend:
        ```bash
        cd react-app && nano .env
        VITE_APP_BACKEND_URI=http://localhost:3000
        ```
        
4. **Run the project**:

    - Backend:
        ```bash
        cd backend-app && npm run dev
        ```

    - Frontend:
        ```bash
        cd react-app && npm run dev
        ```

5. **Docker**:

    If using Docker, build and run the project with:

    ```bash
      docker build -t app .
      docker run -p 3000:3000 app
    ```

---

### Dropping the Database

      cd backend-app && npm run drop
    
### Seeding the Database

      cd backend-app && npm run seed


### [contact](mailto:ekimbasoglu@hotmail.com)

