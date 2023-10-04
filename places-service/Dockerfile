# Stage 1: Build
FROM python:3.8-slim AS build

# Set the working directory in the container to /app
WORKDIR /app

# Install PostgreSQL dependencies required by psycopg2
RUN apt-get update && apt-get install -y libpq-dev gcc

# Copy just the requirements.txt first, to leverage Docker cache
COPY requirements.txt ./

# Install any needed packages specified in requirements.txt
RUN pip install --upgrade pip && \
    pip install --user --no-cache-dir -r requirements.txt

# Copy the current directory contents into the container at /app
COPY . .

# Stage 2: Runtime
FROM python:3.8-slim

# Set the working directory in the container to /app
WORKDIR /app

# Install PostgreSQL dependencies required by psycopg2
RUN apt-get update && apt-get install -y libpq-dev gcc

# Copy Python dependencies from build stage
COPY --from=build /root/.local /root/.local

# Copy app from build stage
COPY --from=build /app .

# Make sure scripts in .local are usable:
ENV PATH=/root/.local/bin:$PATH

# Make port 80 available to the world outside this container
EXPOSE 80

# Run gunicorn when the container launches
CMD ["gunicorn", "PlacesService:create_app()", "-b", "0.0.0.0:80"]
