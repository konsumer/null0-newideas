// import this before pntr.h to setup cartfs

#ifdef EMSCRIPTEN
#include <emscripten.h>

// determine if user has setup host.cartfs
EM_JS(bool, cartfs_exists, (), {
  return typeof Module.cartfs === 'undefined' ? false : true;
});

// get size of file (in bytes)
EM_JS(unsigned int, cartfs_size, (const char* fptr), {
  return Module.cartfs.statSync(Module.UTF8ToString(fptr)).size;
});

// load a file from cartfs into host memory
EM_JS(void, cartfs_load_file, (const char* fptr, unsigned char* outptr), {
  const b = Module.cartfs.readFileSync(Module.UTF8ToString(fptr));
  Module.writeArrayToMemory(b, outptr);
});

EM_JS(bool, cartfs_save_file, (const char* fptr, const void* dataptr, unsigned int size), {
  try{
    const b = Module.HEAPU8.slice(dataptr, dataptr+size);
    Module.cartfs.writeFileSync(Module.UTF8ToString(fptr), b);
    return true;
  } catch(e) {
    return false;
  }
});

unsigned char* emscripten_load_file(const char* fileName, unsigned int* bytesRead) {
  bool fsExists = cartfs_exists();
  if (!fsExists) {
    fprintf(stderr, "load_file (%s): Please set host.cartfs.\n", fileName);
    return NULL;
  }
  *bytesRead = cartfs_size(fileName);
  if (*bytesRead == 0) {
    fprintf(stderr, "load_file (%s): File not found.\n", fileName);
    return NULL;
  }
  unsigned char* out = malloc(*bytesRead);
  cartfs_load_file(fileName, out);
  return out;
}
bool emscripten_save_file(const char* fileName, const void* data, unsigned int bytesToWrite) {
  bool fsExists = cartfs_exists();
  if (!fsExists) {
    fprintf(stderr, "save_file (%s): Please set host.cartfs.\n", fileName);
    return false;
  }
  return cartfs_save_file(fileName, data, bytesToWrite);
}

#define PNTR_LOAD_FILE emscripten_load_file
#define PNTR_SAVE_FILE emscripten_save_file

#else
/*
// TODO: set these up for wamr/physfs
unsigned char* wamr_load_file(const char* fileName, unsigned int* bytesRead);
bool wamr_save_file(const char* fileName, const void* data, unsigned int bytesToWrite);
#define PNTR_LOAD_FILE wamr_load_file
#define PNTR_SAVE_FILE wamr_save_file
*/
#endif