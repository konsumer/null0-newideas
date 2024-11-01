#include <stdio.h>
#include <stdint.h>
#include <stdbool.h>
#include <string.h>
#include "cvector.h"

#ifdef EMSCRIPTEN
#include <emscripten.h>
#define PNTR_APP_WEB
#else
#define PNTR_APP_SDL
#endif

#include "pntr_cartfs.h"
#define PNTR_PIXELFORMAT_ARGB
#define PNTR_ENABLE_DEFAULT_FONT
#define PNTR_ENABLE_TTF
#define PNTR_ENABLE_MATH
#define PNTR_ENABLE_JPEG
#define PNTR_APP_IMPLEMENTATION
#include "pntr_app.h"

typedef struct {
  unsigned int size;
  unsigned char data[1024*1024];
} Null0Mem;

typedef struct {
  unsigned int src;
  int posX;
  int posY;
} Null0DrawImage;

typedef struct {
  unsigned int font;
  int posX;
  int posY;
  pntr_color color;
  char text[512];
} Null0DrawText;

static Null0Mem cart_shared;
static pntr_app* null0app;

static pntr_image* images = NULL;
static pntr_font* fonts = NULL;

typedef enum {
  OP_CLEAR,
  OP_LOAD_IMAGE,
  OP_DRAW_IMAGE,
  OP_DRAW_TEXT,
  OP_MEASURE_TEXT
} Null0Op;


void null0_clear() {}
void null_load_image() {}
void null0_draw_image() {}
void null0_draw_text() {}
void null0_measure_text() {}

// let cart call a function
void null0_call(Null0Op op) {
  unsigned int s = 0;
  char* filename;
  pntr_color color = {};

  switch(op) {
    case OP_CLEAR: null0_clear(); break;
    case OP_LOAD_IMAGE: null_load_image(); break;
    case OP_DRAW_IMAGE: null0_draw_image(); break;
    case OP_DRAW_TEXT: null0_draw_text(); break;
    case OP_MEASURE_TEXT: null0_measure_text(); break;
  }
}

// return the address of shared mem (for cart to push/pull values)
Null0Mem* null0_get_shared() {
  return &cart_shared;
}

// functions to call user-callbacks in cart
#ifdef EMSCRIPTEN
EM_JS(void, _cart_load, (), {
  if (!Module?.cart) {
    console.log('You should probably set host.cart.');
  }
  if (Module?.cart?._initialize) {
    // console.log('_initialize');
    Module.cart._initialize();
  }
  if (Module?.cart?._start) {
    // console.log('_start');
    Module.cart._start();
  }
  if (Module?.cart?.load) {
    // console.log('load');
    Module.cart.load();
  }
})

void cart_load(pntr_app* app) {
  null0app = app;
  cvector_push_back(images, *app->screen);
  cvector_push_back(fonts, *pntr_load_font_default());
  cart_shared = (Null0Mem) { .size=0, .data={}}; 
  _cart_load();
}

EM_JS(void, _cart_update, (), {
  if (Module?.cart?.update) {
    Module.cart.update();
  }
})

void cart_update(pntr_app* app) {
  _cart_update();
}

EM_JS(void, _cart_unload, (), {
  if (Module?.cart?.unload) {
    Module.cart.unload();
  }
})

void cart_unload(pntr_app* app) {
  free(cart_shared.data);
  _cart_unload();
}


#else
// TODO: implement for WAMR
void cart_load(pntr_app* app) {}
void cart_update(pntr_app* app) {}
void cart_unload(pntr_app* app) {}
#endif