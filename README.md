# Welcome to CODEX! 👋

Codex is your coding playground – a place where you can explore, learn, and collaborate with fellow coders. Whether you're new to coding or a pro, codex is here to make your coding journey fun and interactive.

## Features 🌟

- **Easy Sign Up**: Create an account quickly and safely to access your personal coding space.

- **Try Different Languages**: Write code in various programming languages and see the magic happen in real-time.

- **Live Coding Sessions**: Join live coding sessions to work together, learn, and solve challenges with others.

- **Public and Private Code**: Choose whether to share your code with the world 🌍 or keep it just for you 🔒.

## Getting Started 🚀

1. **Installation**: Clone this repository using `git clone https://github.com/yourusername/codex.git`.

2. **Setup**: Go to the project folder and follow the easy steps in `setup.md` to set things up.

3. **Run the App**:

    - Open two separate terminals and navigate to the `client` and `server` directories.
    - In the `client` terminal, run `npm start`.
    - In the `server` terminal, run `npm start`. This command now starts the server.
    - Open your browser and go to `http://localhost:5173` to start using codex!

## Technologies Used 🛠️

- **Client**:
    - React
    - Socker.io client

- **Server**:
    - Node.js
    - Socket.io (for real-time communication)
    - Redis (for scaling Socket.io and storing cursor movements)
    - Kafka (as a queue system for pushing code changes to MongoDB)
    - MongoDB (to store code)
    - Docker (for spinning up redis and kafka)

## Project Structure 🏗️

Here's how the project is organized:

- **Client**
    - **src**
        - **components**: Reusable UI components.
        - **context**: Context providers for state management.
        - **models**: Data models and types used throughout the app.
        - **pages**: Different pages of the app.
        - **utils**: Utility functions.
        - **App.tsx**: Main component that sets up the app.
        - **index.tsx**: Entry point of the app.

- **Server**
    - **src**
        - **controllers**: Logic for handling API requests.
        - **db**: Database connection and setup.
        - **interfaces**: Interfaces for TypeScript types.
        - **middlewares**: Middleware functions for route handling.
        - **models**: Data models for the database.
        - **routes**: API route definitions.
        - **service**: Business logic and services.
        - **utils**: Utility functions.
        - **websocket**: Websocket setup for live coding.
        - **index.ts**: Entry point for the server.
