# Whisper-Based Project

This repository contains a custom project built on top of OpenAI's [Whisper](https://github.com/openai/whisper) library. Whisper is a state-of-the-art speech recognition and transcription library, designed to provide highly accurate transcription for various languages.

## Project Overview

This project utilizes Whisper to perform speech-to-text transcription with a user-friendly interface. It includes:

- A **React-based frontend** for user interaction.
- An **Express.js backend** for handling API requests.
- Integration with Whisper for accurate transcription of audio inputs.

The application is designed to simplify speech recognition tasks, making it easy to upload audio files, process them, and retrieve transcriptions in a seamless workflow.

## Features

- **Audio Upload**: Users can upload audio files for transcription.
- **Real-time Transcription**: Process audio files and get transcriptions quickly.
- **Multilingual Support**: Leverages Whisper's capability to transcribe multiple languages.
- **Simple Setup**: Easy-to-use backend and frontend integration.

## Prerequisites

Ensure you have the following installed:

- Python 3.8 or later
- Node.js 14 or later
- npm 6 or later
- Git

## Installation

Follow these steps to set up the project locally.

### 1. Clone the Repository
```bash
git clone https://github.com/your-repo-name.git
cd your-repo-name
```

### 2. Set Up the Virtual Environment

Create and activate a Python virtual environment:
```bash
python -m venv .venv
source .venv/bin/activate  # macOS/Linux
.venv\Scripts\activate    # Windows
```

Install Whisper and its dependencies:
```bash
pip install git+https://github.com/openai/whisper.git
```

### 3. Set Up the React Frontend

Navigate to the `frontend` folder and install dependencies:
```bash
cd frontend
npm install
npm run dev
```

### 4. Set Up the Express Backend

Navigate to the `backend` folder and install dependencies:
```bash
cd backend
npm install
npm start
```

## Usage

1. Start the backend server by running:
   ```bash
   cd backend
   npm start
   ```
2. Start the frontend development server:
   ```bash
   cd frontend
   npm run dev
   ```
3. Open the application in your browser (default: `http://localhost:3000`).

Upload an audio file to see Whisper's transcription in action!

## Folder Structure

```
project-root/
├── backend/          # Express.js backend
├── frontend/         # React frontend
├── .venv/            # Python virtual environment
└── README.md         # Project documentation
```

## Troubleshooting

- Ensure that all dependencies are installed correctly.
- Verify that both the frontend and backend servers are running.
- Check the console logs for errors in either server.

## Contributing

Contributions are welcome! Feel free to submit issues or pull requests to improve the project.

## License

This project uses Whisper by OpenAI, which is released under the MIT license. See the [Whisper repository](https://github.com/openai/whisper) for more details.
