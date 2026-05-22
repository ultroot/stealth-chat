# 1. Start with a lightweight Linux computer that already has Python installed
FROM python:3.10-slim

# 2. Create a folder inside the container called /app and move inside it
WORKDIR /app

# 3. Copy our list of tools into the container
COPY requirements.txt .

# 4. Tell the container to install all the tools from the list
RUN pip install --no-cache-dir -r requirements.txt

# 5. Copy our Python server and our HTML file into the container
COPY main.py .
COPY index.html .

# 6. Open port 8000 so internet traffic can reach the chat engine
EXPOSE 8000

# 7. The final command to turn the server on when the container starts
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]