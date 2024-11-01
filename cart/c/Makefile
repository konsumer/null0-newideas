# set this to the location of your wasi-sdk
WASI_SDK ?= /opt/wasi-sdk

build/cart.wasm: main.c
	mkdir -p build
	$(WASI_SDK)/bin/clang main.c -o build/cart.wasm