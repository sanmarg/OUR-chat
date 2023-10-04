# Use an official Python runtime as the base image
FROM python:3.8-slim

# Set the working directory to /app
WORKDIR /app

# Copy the current directory contents into the container at /app
COPY . /app

# Install any needed packages specified in requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Expose port 5000 (or the port your Flask app will run on)
EXPOSE 5000

# Define environment variable
ENV FLASK_APP=app.py

# Run the command to start your Flask app
CMD ["flask", "run"]
