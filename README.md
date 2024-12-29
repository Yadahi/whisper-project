# Set Up the Virtual Environment:

python -m venv .venv
source .venv/bin/activate # macOS/Linux
.venv\Scripts\activate # Windows

pip install git+https://github.com/openai/whisper.git

# Setup React frontend

cd frontend
npm i
npm run dev

# Setup Express backend

cd backend
npm i
npm start
