# this records all the tasks you can do

# set this to the location of your stuff
WASI_SDK ?= /opt/wasi-sdk
CLANG ?= clang
EMCC ?= emcc

NATIVE_FLAGS ?= $(shell pkg-config --cflags --libs sdl2)
WASM_FLAGS ?= -s STACK_SIZE=1114112 -s ASYNCIFY -s SINGLE_FILE -s EXPORTED_RUNTIME_METHODS=writeArrayToMemory,UTF8ToString -sEXPORTED_FUNCTIONS=_main,_null0_call,_null0_get_shared

.PHONY: help clean run

help: ## Get help with available make commands
	@echo "Run 'make' then one of these target-names, like 'make help':"
	@echo ""
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'
	@echo ""

docs/host.mjs: host/*
	cd host && \
	$(EMCC) -I. -I./external $(WASM_FLAGS) main.c -o ../docs/host.mjs

docs/cartc.null0: cart/c/*.c cart/c/*.h cart/assets/*
	cd cart/c && \
	mkdir -p build && \
	$(WASI_SDK)/bin/clang main.c -o build/cart.wasm && \
	../buildcart.sh ../../docs/cartc.null0 build/cart.wasm ../assets/*

docs/cartas.null0: cart/as/assembly/*.ts cart/assets/*
	cd cart/as \
	&& npm ci && \
	npm run asbuild:release && \
	cd ../.. && \
	./cart/buildcart.sh docs/cartas.null0 cart/as/build/release.wasm cart/assets/*

cart-as: docs/cartas.null0 ## Build an example cart made with AssemblyScript

cart-c: docs/cartc.null0 ## Build an example cart made with C

carts: cart-as cart-c ## Build all carts

clean: ## Delete any built files
	rm -f null0 docs/*.mjs docs/*.wasm docs/*.null0 host/build cartc/build cartas/build

native: null0 ## Build native null0 host

null0: host/*
	cd host && \
	$(CLANG) -I. -I./external $(NATIVE_FLAGS) main.c -o ../null0

run: web ## Run the web host locally
	npx -y live-server docs

web: docs/host.mjs carts ## Build the web host

