import requests, base64, time, json, os
from dotenv import load_dotenv

load_dotenv()

with open('../frontend/src/assets/forest_background.jpg', 'rb') as f:
    b64 = base64.b64encode(f.read()).decode('utf-8')

t0 = time.time()
v_payload = {
    'model': 'moondream',
    'prompt': 'Does this image show a Neem Leaf or tree? Answer clearly and describe what you see.',
    'images': [b64],
    'stream': False
}
r1 = requests.post('http://127.0.0.1:11434/api/generate', json=v_payload, timeout=30)
v_text = r1.json().get('response', '')
t1 = time.time()
print(f'Moondream ({t1-t0:.2f}s): {v_text.strip()}')

groq_key = os.getenv('GROQ_API_KEY')
prompt = f'''You are Grimble, a witty goblin naturalist refereeing a nature scavenger hunt in India.
Quest: "Neem Leaf" (Find a jagged, serrated-edged Neem leaf).
Vision Report: "{v_text.strip()}".

Evaluate if it matches. Return ONLY raw JSON with no code fences:
{{
  "passed": true,
  "confidence": 0.88,
  "goblin_critique": "Grimble commentary",
  "woodland_xp": 35,
  "sensory_bonus": "Sensory task"
}}'''

r2 = requests.post(
    'https://api.groq.com/openai/v1/chat/completions',
    headers={'Authorization': f'Bearer {groq_key}', 'Content-Type': 'application/json'},
    json={'model': 'qwen/qwen3.8-27b', 'messages': [{'role': 'user', 'content': prompt}], 'temperature': 0.7},
    timeout=5
)
t2 = time.time()
print(f'Referee ({t2-t1:.2f}s): {r2.json()["choices"][0]["message"]["content"].strip()}')
print(f'Total time: {t2-t0:.2f}s')
