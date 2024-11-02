Ideas I am exploring here:

- WASI for zip-file access
- host & cart share access to same filesystem
- very simple make-based build system (might update to cmake/xmake later.) I just included headers & stuff.
- clearer distinct types in api/
- new Tiled map API
- simpler type system (over WASM)
- maybe move to framebuffer/oss/input WASI virtual devices, at some point
- simple `call` router and utils to copy args/returns

### building

Run `make` to see a list of things you can do.

You will need node, emscripten, clang, and wasi-sdk installed for building different parts.

### 
