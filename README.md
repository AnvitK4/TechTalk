# TechTalk

TechTalk is a community-driven question and answer platform for programmers, similar to StackOverflow/Reddit. It is built using a Flask backend with SQLAlchemy for database interactions and a React frontend for user interaction.

## Features

- User registration and authentication
- Create, view, and answer questions
- Comment on answers
- User profiles with editable information
- JWT-based authentication
- MongoDB for storing user profile information

## Technology Stack

- **Frontend**: React.js
- **Backend**: Flask (Python)
- **Database**: SQLAlchemy (for main data), MongoDB (for profile data)
- **Authentication**: JWT
- **HTTP Client**: Axios

## Prerequisites

- Python 3.x
- Node.js
- npm (Node Package Manager)
- MongoDB

## Running the Application

- The Flask backend will run on `http://127.0.0.1:5000`.
- The React frontend will run on `http://127.0.0.1:3000`.

## Usage

- Register a new account or log in with existing credentials.
- Post questions, provide answers, and comment on both questions and answers.
- Manage your profile information.
