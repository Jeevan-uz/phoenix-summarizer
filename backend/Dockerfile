# Step 1: Define the base image
FROM python:3.11-slim

# Step 2: Set the working directory
WORKDIR /app

# Step 3: Add the Python user's binary directory to the PATH
ENV PATH="/root/.local/bin:${PATH}"

# Step 4: Install all dependencies, including the lxml extra.
# This is the final, complete list required for your application to run.
RUN pip install --no-cache-dir \
    flask \
    flask-cors \
    gunicorn \
    google-generativeai \
    newspaper3k \
    python-dotenv \
    Flask-Limiter \
    "lxml[html_clean]"

# Step 5: Copy the application code into the container
COPY . .

# Step 6: Expose the port the app will run on
EXPOSE 5000

# Step 7: Define the command to run the application
# In backend/Dockerfile
CMD gunicorn --workers 1 --threads 8 --timeout 0 -b 0.0.0.0:8080 app:app