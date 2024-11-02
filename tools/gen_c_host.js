// this will generate a stub for C (WAMR/emscripten) host router

import { writeFile, readFile } from 'fs/promises'
import { walkCats, fileExists } from './utils.js'

const { args, returns, ...types } = JSON.parse(await readFile('tools/types.json'))

const out = []

const now = new Date()

out.push(`// Null0 Host API

#pragma once

#include <stdio.h>
#include <stdint.h>
#include <stdbool.h>
#include <string.h>
#include <time.h>
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

#define PNTR_TILED_IMPLEMENTATION
#include "pntr_tiled.h"

#define PNTR_APP_SFX_IMPLEMENTATION
#include "pntr_app_sfx.h"

typedef struct {
  unsigned int size;
  unsigned char data[1024*1024];
} Null0Mem;

// I use a simplifed format for colors
typedef struct {
  unsigned int r;
  unsigned int g;
  unsigned int b;
  unsigned int a;
} Null0Color;

typedef enum SfxPresetType {
  SFX_COIN,
  SFX_LASER,
  SFX_EXPLOSION,
  SFX_POWERUP,
  SFX_HURT,
  SFX_JUMP,
  SFX_SELECT,
  SFX_SYNTH
} SfxPresetType;

static Null0Mem cart_shared;
static pntr_app* null0app;

static pntr_image** images = NULL;
static pntr_font** fonts = NULL;
static pntr_sound** sounds = NULL;
static cute_tiled_map_t** maps = NULL;

unsigned int null0_add_image(pntr_image* val) {
  unsigned int idx = cvector_size(images);
  cvector_push_back(images, val);
  return idx;
}

unsigned int null0_add_font(pntr_font* val) {
  unsigned int idx = cvector_size(fonts);
  cvector_push_back(fonts, val);
  return idx;
}

unsigned int null0_add_sound(pntr_sound* val) {
  unsigned int idx = cvector_size(sounds);
  cvector_push_back(sounds, val);
  return idx;
}

unsigned int null0_add_map(cute_tiled_map_t* val) {
  unsigned int idx = cvector_size(maps);
  cvector_push_back(maps, val);
  return idx;
}

`)

const ops = []
const actions = []
const null0funcs = []

await walkCats(({ catName, apiFilename, api }) => {
  for (const [funcName, func] of Object.entries(api)) {
    const op = `OP_${funcName.toUpperCase()}`
    ops.push(op)
    const call = `null0_${funcName}(${Object.values(func.args).map(a => `cart_arg_get_${types[a].name}(${types[a].name.includes('_array') || types[a].name === 'bytes' ? 'len' : ''})`).join(', ')})`
    actions.push(`case ${op}: ${func.returns === 'void' ? call : ` cart_ret_set_${types[func.returns].name}(${call}${types[func.returns].name === 'bytes' || types[func.returns].name.includes('_array') ? ', len' : ''})`}; break;`)
    // api.push(`${func.returns === 'void' ? '' : `${types[func.returns].host} `} null0_${funcName}(${Object.entries(func.args).map(([name, type]) => `${type} ${name}`).join(', ')});`)
    null0funcs.push(`// ${func.description}\n${types[func.returns].host} null0_${funcName}(${Object.entries(func.args).map(([name, type]) => `${types[type].host} ${name}`).join(', ')}) {
  // TODO: STUB${func.returns === 'void' ? '' : '\n  return {0};'}
}`)
  }
})

out.push(null0funcs.join('\n\n'))

out.push(`
static unsigned int cart_arg_offset = 0;
static unsigned int cart_ret_offset = 0;
`)

for (const k of returns) {
  if (k === 'void') {
    continue
  }
  const { name, host, size } = types[k]
  out.push(`${host} cart_arg_get_${name}(${name.includes('_array') || name === 'bytes' ? 'unsigned int len' : ''}) {
  // TODO: STUB${name === 'string' ? '\nlen=strlen((char*)&cart_shared.data + cart_arg_offset) + 1;' : ''}
  ${host.replace('*', '')} ret = malloc(${size});
  memcpy(&ret, &cart_shared.data + cart_arg_offset, ${size});
  cart_arg_offset += ${name.includes('_array') || name === 'bytes' || name === 'string' ? 'len' : size};
  return ${host.includes('*') ? '&ret' : 'ret'};
}\n`)
}

for (const k of args) {
  if (k === 'void') {
    continue
  }
  const { name, host, size } = types[k]
  out.push(`void cart_ret_set_${name}(${host} value${name.includes('_array') || name === 'bytes' ? ', unsigned int len' : ''}) {
  // TODO: STUB${name === 'string' ? '\nlen=strlen(value) + 1;' : ''}
  memcpy(&cart_shared.data + cart_ret_offset, ${host.includes('*') ? host : `&${host}`}, ${size});
  cart_ret_offset += ${name.includes('_array') || name === 'bytes' || name === 'string' ? 'len' : size};
  cart_shared.size = cart_ret_offset;
}\n`)
}

out.push(`
typedef enum {
  ${ops.join(',\n  ')}
} Null0Op;

// let cart call a function
void null0_call(Null0Op op) {
  cart_arg_offset = 0;
  cart_ret_offset = 0;
  unsigned int len = 0;
  cart_shared.size = 0;

  switch(op) {
    ${actions.join('\n    ')}
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
  // TODO: setup wasm
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
  // TODO: setup filesystem
  unsigned int size = 0;
  unsigned char* cartBytes = pntr_app_load_arg_file(null0app, &size);

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

`)

if (await fileExists('host/null0.h')) {
  console.error('The file host/null0.h exists, so I will just print it:')
  console.log(out.join('\n'))
} else {
  await writeFile('host/null0.h', out.join('\n'))
}
