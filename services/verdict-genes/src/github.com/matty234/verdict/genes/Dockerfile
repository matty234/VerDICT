

# start from golang image based on alpine-3.8
FROM golang:1.10-alpine3.8 AS dev-build
ENV PORT=8080

RUN apk add --no-cache ca-certificates cmake make g++ openssl-dev git curl pkgconfig
RUN git clone -b 1.7 https://github.com/neo4j-drivers/seabolt.git /seabolt
WORKDIR /seabolt/build
RUN cmake -D CMAKE_BUILD_TYPE=Release -D CMAKE_INSTALL_LIBDIR=lib .. && cmake --build . --target install

RUN curl https://raw.githubusercontent.com/golang/dep/master/install.sh | sh


# Copy the code from the host and compile it -- might need correct DIR for CI
WORKDIR $GOPATH/src/vcomp
COPY Gopkg.toml Gopkg.lock ./
RUN dep ensure --vendor-only
COPY . ./
RUN  GOOS=linux go build  -tags seabolt_static -a -o /app .

FROM  alpine:3.7
COPY --from=dev-build /app ./

ENTRYPOINT ["./app"]

EXPOSE 8080