FROM node:19.2.0 as build

WORKDIR /usr/src/app

RUN apt-get update && \
    apt-get install --no-install-recommends zlib1g-dev -y \
    ca-certificates curl file \
    build-essential \
    autoconf automake autotools-dev libtool xutils-dev && \
    rm -rf /var/lib/apt/lists/*

ENV SSL_VERSION=1.0.2o

RUN wget https://github.com/openssl/openssl/releases/download/OpenSSL_1_0_2o/openssl-$SSL_VERSION.tar.gz && \
    tar -xzf openssl-$SSL_VERSION.tar.gz && \
    cd openssl-$SSL_VERSION && ./config && make depend && make install && \
    cd .. && rm -rf openssl-$SSL_VERSION*

ENV OPENSSL_LIB_DIR=/usr/local/ssl/lib \
    OPENSSL_INCLUDE_DIR=/usr/local/ssl/include \
    OPENSSL_STATIC=1

RUN curl https://sh.rustup.rs -sSf | sh -s -- -y
ENV PATH=/root/.cargo/bin:$PATH
RUN rustup install stable
RUN rustup override set stable
RUN rustup target add wasm32-unknown-emscripten --toolchain stable
RUN cargo install wasm-pack

COPY . .

RUN npm install

RUN npm run build-backend && npm run build-frontend
RUN cp -r dist/apps/singularity-client dist/apps/singularity-api/static

FROM node:20.3.0
COPY --from=build /usr/src/app/dist/apps/singularity-api /usr/src/app
WORKDIR /usr/src/app
RUN npm install
CMD node main.js
