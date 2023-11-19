FROM node:20-bookworm

WORKDIR /usr/src/app

COPY package*.json yarn.lock patches/* ./

RUN apt-get update && \
    apt-get install -y git-core build-essential && \
    apt-get clean autoclean && \
    rm -rf /var/lib/{apt,dpkg,cache,log}/

RUN git clone https://github.com/earlephilhower/mklittlefs.git /usr/src/mklittlefs && \
    cd /usr/src/mklittlefs && \
    git submodule update --init && \
    make dist && cp /usr/src/mklittlefs/mklittlefs /usr/local/bin
