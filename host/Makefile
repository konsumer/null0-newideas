CLANG ?= clang
EMCC ?= emcc
NATIVE_FLAGS ?= $(shell pkg-config --cflags --libs sdl2)
WASM_FLAGS ?= -s STACK_SIZE=1114112 -s ASYNCIFY -s SINGLE_FILE -s EXPORTED_RUNTIME_METHODS=writeArrayToMemory,UTF8ToString -sEXPORTED_FUNCTIONS=_main,_null0_call,_null0_get_shared

# native target
../null0: **/*
	$(CLANG) -I. -I./external $(NATIVE_FLAGS) main.c -o ../null0

# emscripten target
../docs/host.mjs: **/*
	$(EMCC) -I. -I./external $(WASM_FLAGS) main.c -o ../docs/host.mjs
