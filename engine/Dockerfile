FROM nvidia/cuda:12.8.0-devel-ubuntu24.04

# System dependencies
RUN apt-get update && apt-get install -y \
    python3 python3-pip python3-venv \
    curl build-essential gcc g++ \
    libedit-dev zlib1g-dev \
    && rm -rf /var/lib/apt/lists/*

# Use python3 as python
RUN update-alternatives --install /usr/bin/python python /usr/bin/python3 1

# Install Python packages
RUN pip install --break-system-packages \
    torch==2.9.0 --index-url https://download.pytorch.org/whl/cu128 \
    && pip install --break-system-packages \
    numpy fastapi simplejson triton nvidia-ml-py uvicorn \
    torchao==0.17.0 flashinfer-python==0.6.11.post3

# Create restricted runner user
RUN useradd -m -s /bin/bash runner && \
    mkdir -p /app && chown runner:runner /app

# Copy engine code
COPY --chown=runner:runner runner.py utils.py problem.py gpu_monitor.py tolerance.py /app/
COPY --chown=runner:runner docker_entry.py /app/

WORKDIR /app
USER runner

ENTRYPOINT ["python", "/app/docker_entry.py"]
