import whisper
import sys
import json

file_path = sys.argv[1]
model = whisper.load_model("tiny.en")
result = model.transcribe(file_path) 
# verbose=True
# result = model.transcribe('/Users/apple/Documents/learning/whisper-project/sample.mp3')

segments = result.get("segments", [])
for segment in segments:
    data = {"id": segment["id"],
        "start": segment["start"],
        "end": segment["end"],
        "text": segment["text"],}
    print(json.dumps(data))