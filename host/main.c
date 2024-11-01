#include "null0.h"

bool Init(pntr_app* app) {
  cart_load(app);
  return true;
}

bool Update(pntr_app* app, pntr_image* screen) {
  cart_update(app);
  return true;
}

void Close(pntr_app* app) {
  cart_unload(app);
}

pntr_app Main(int argc, char* argv[]) {
  #ifdef EMSCRIPTEN
  // pntr_app_log(PNTR_APP_LOG_INFO, "Using emscripten.");
  #else
  // pntr_app_log(PNTR_APP_LOG_INFO, "Using SDL.");
  #endif

  return (pntr_app) {
    .width = 320,
    .height = 240,
    .title = "null0",
    .init = Init,
    .update = Update,
    .close = Close,
    .fps = 60
  };
}