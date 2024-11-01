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

static pntr_image** images = NULL;
static pntr_font** fonts = NULL;

typedef enum {
  OP_CLEAR,
  OP_LOAD_IMAGE,
  OP_DRAW_IMAGE,
  OP_DRAW_TEXT,
  OP_MEASURE_TEXT
} Null0Op;

typedef struct {
  unsigned int r;
  unsigned int g;
  unsigned int b;
  unsigned int a;
} Null0Color;

static unsigned int cart_arg_offset = 0;
static unsigned int cart_ret_offset = 0;

pntr_color cart_arg_Color(){
  pntr_color ret = pntr_new_color(cart_shared.data[cart_arg_offset], cart_shared.data[cart_arg_offset + 1], cart_shared.data[cart_arg_offset + 2], cart_shared.data[cart_arg_offset + 3]);
  cart_arg_offset += 4;
  return ret;
}

char* cart_arg_string() {
  char* ret = {};
  strcpy(ret,  (char*)(&cart_shared.data + cart_arg_offset));
  cart_arg_offset += strlen(ret) + 1;
  return ret;
}

int cart_arg_int() {
  int ret = 0;
  memcpy(&ret, &cart_shared.data + cart_arg_offset, sizeof(ret));
  cart_arg_offset += sizeof(ret);
  return ret;
}

pntr_image* cart_arg_Image() {
  return images[cart_arg_int()];
}

pntr_image* cart_arg_Font() {
  return fonts[cart_arg_int()];
}

void cart_ret_Image(pntr_image* val) {
  unsigned int idx = cvector_size(images);
  cvector_push_back(images, val);
  memcpy(&cart_shared.data + cart_ret_offset, &idx, sizeof(idx));
  cart_ret_offset += sizeof(idx);
}

void cart_ret_Vector(pntr_vector val) {

}

// let cart call a function
void null0_call(Null0Op op) {
  cart_arg_offset = 0;
  cart_ret_offset = 0;
  switch(op) {
    case OP_CLEAR: pntr_clear_background(images[0], cart_arg_Color()); break;
    case OP_LOAD_IMAGE: cart_ret_Image(pntr_load_image(cart_arg_string())); break;
    case OP_DRAW_IMAGE: pntr_draw_image(images[0], cart_arg_Image(), cart_arg_int(), cart_arg_int()); break;
    case OP_DRAW_TEXT: pntr_draw_text(images[0], cart_arg_Font(), cart_arg_string(), cart_arg_int(), cart_arg_int(), cart_arg_Color()); break;
    case OP_MEASURE_TEXT: cart_ret_Vector(pntr_measure_text(cart_arg_Font(), cart_arg_string())); break;
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
    Module.cart._initialize();
  }
  if (Module?.cart?._start) {
    Module.cart._start();
  }
  if (Module?.cart?.load) {
    Module.cart.load();
  }
})

EM_JS(void, _cart_update, (), {
  if (Module?.cart?.update) {
    Module.cart.update();
  }
})

EM_JS(void, _cart_unload, (), {
  if (Module?.cart?.unload) {
    Module.cart.unload();
  }
})


#else // not EMSCRIPTEN, setup WAMR

void _cart_load() {
  unsigned int size = 0;
  unsigned char* wasBytes = pntr_app_load_arg_file(null0app, &size);
  
  // TODO: setup wasm
  // TODO: expose: args_to_host, ret_size, ret_from_host, call
  // TODO: call cart load()
}
void _cart_update() {
  // TODO: call cart update()
}
void _cart_unload() {
  // TODO: call cart unload()
}

#endif

void cart_load(pntr_app* app) {
  null0app = app;
  cvector_push_back(images, app->screen);
  cvector_push_back(fonts, pntr_load_font_default());
  cart_shared = (Null0Mem) { .size=0, .data={}};
  _cart_load();
}

void cart_update(pntr_app* app) {
  _cart_update();
}

void cart_unload(pntr_app* app) {
  free(cart_shared.data);
  _cart_unload();
  // TODO: free resources
}


