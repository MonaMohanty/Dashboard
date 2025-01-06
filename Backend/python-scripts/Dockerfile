# Use a lightweight Python base image
FROM python:3.8


# Set the working directory inside the container
WORKDIR /app

# Copy the Python scripts and requirements file into the container
COPY . /app

# Install the Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Set the default command to Python
ENTRYPOINT ["python3"]
