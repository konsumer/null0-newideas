CLANG ?= clang
EMCC ?= emcc

# native target
../null0: **/*
	$(CLANG) main.c -o ../null0

# emscripten target
../docs/host.mjs: **/*
	$(EMCC) main.c -o ../docs/host.mjs -sASYNCIFY -sSINGLE_FILE -sEXPORTED_RUNTIME_METHODS=writeArrayToMemory,UTF8ToString
