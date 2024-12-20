// Null0 Host API

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

pntr_color null0_pntr_color(Null0Color c) {
  return pntr_new_color(c.r, c.g, c.b, c.a);
}

// Log a string
void null0_trace(char* str) {
  printf("%s\n", str);
}

// Get system-time (ms) since unix epoch
uint64_t null0_current_time() {
  struct timespec t;
  clock_gettime(CLOCK_REALTIME, &t);
  return t.tv_sec * 1000 + (t.tv_nsec + 500000) / 1000000;
}

// Get the change in time (seconds) since the last update run
float null0_delta_time() {
  return pntr_app_delta_time(null0_app);
}

// Get a random integer between 2 numbers
int32_t null0_random_int(int32_t min, int32_t max) {
  return pntr_app_random(null0_app, min, max);
}

// Load a Tiled map from a file
unsigned int null0_load_map(char* filename) {
  return null0_add_map(pntr_load_tiled(filename));
}

// Unload a Tiled map
void null0_unload_map(unsigned int map) {
  pntr_unload_tiled(maps[map]);
}

// Draw a tiled map on the screen
void null0_draw_map(unsigned int map, int posX, int posY, Null0Color tint) {
  pntr_draw_tiled(images[0], maps[map], posX, posY, null0_pntr_color(tint));
}

// Draw a tiled map on an image
void null0_draw_map_on_image(unsigned int dst, unsigned int map, int posX, int posY, Null0Color tint) {
  pntr_draw_tiled(images[dst], maps[map], posX, posY, null0_pntr_color(tint));
}

// Draw a single tile on screen, by gid
void null0_draw_tile(unsigned int map, unsigned int gid, int posX, int posY, Null0Color tint) {
  pntr_draw_tiled_tile(images[0], maps[map], gid, posX, posY, null0_pntr_color(tint));
}

// Draw a single tile on an image, by tile-id
void null0_draw_tile_on_image(unsigned int dst, unsigned int map, unsigned int gid, int posX, int posY, Null0Color tint) {
  pntr_draw_tiled_tile(images[dst], maps[map], gid, posX, posY, null0_pntr_color(tint));
}

// Draw a layer on the screen
void null0_draw_layer(unsigned int map, char* layerName, int posX, int posY) {
  cute_tiled_layer_t* layer = pntr_tiled_layer(maps[map], layerName);
  pntr_draw_tiled_layer_tilelayer(images[0], maps[map], layer, posX, posY, null0_pntr_color(tint));
}

// Draw a layer on an image
void null0_draw_layer_on_image(unsigned int dst, unsigned int map, char* layerName, int posX, int posY) {
  cute_tiled_layer_t* layer = pntr_tiled_layer(maps[map], layerName);
  pntr_draw_tiled_layer_tilelayer(images[dst], maps[map], layer, posX, posY, null0_pntr_color(tint));
}

// Update the animations for the map.
void null0_update_map(unsigned int map, float deltaTime) {
  pntr_update_tiled(maps[map], deltaTime);
}

// Get the tile-id for a tile at a coordinate on a layer
unsigned int null0_layer_get_gid(unsigned int map, char* layerName, unsigned int column, unsigned int row) {
  cute_tiled_layer_t* layer = pntr_tiled_layer(maps[map], layerName);
  return pntr_layer_tile(layer, column, row);
}

// Set a tile to a specific tile-id, on a layer
void null0_layer_set_gid(unsigned int map, char* layerName, unsigned int column, unsigned int row, unsigned int gid) {
  cute_tiled_layer_t* layer = pntr_tiled_layer(maps[map], layerName);
  pntr_set_layer_tile(layer, column, row, gid);
}

// Load a sound from a file in cart
unsigned int null0_load_sound(char* filename) {
  return null0_add_sound(pntr_load_sound(filename));
}

// Play a sound
void null0_play_sound(unsigned int sound, bool loop) {
  pntr_play_sound(sounds[sound], loop);
}

// Stop a sound
void null0_stop_sound(unsigned int sound) {
  pntr_stop_sound(sounds[sound]);
}

// Create a new sound-effect from some sfxr params
unsigned int null0_new_sfx(SfxParams params) {
  return null0_add_sound(pntr_app_sfx_sound(null0app, &params));
}

// Generate randomized preset sfxr params
SfxParams null0_preset_sfx(SfxPresetType type) {
  switch (type) {
    case SFX_COIN:
      pntr_app_sfx_gen_pickup_coin(null0_app, params);
      break;
    case SFX_LASER:
      pntr_app_sfx_gen_laser_shoot(null0_app, params);
    case SFX_EXPLOSION:
      pntr_app_sfx_gen_explosion(null0_app, params);
      break;
    case SFX_POWERUP:
      pntr_app_sfx_gen_powerup(null0_app, params);
      break;
    case SFX_HURT:
      pntr_app_sfx_gen_hit_hurt(null0_app, params);
      break;
    case SFX_JUMP:
      pntr_app_sfx_gen_jump(null0_app, params);
      break;
    case SFX_SELECT:
      pntr_app_sfx_gen_blip_select(null0_app, params);
      break;
    case SFX_SYNTH:
      pntr_app_sfx_gen_synth(null0_app, params);
      break;
    default:
      printf("preset_sfx: no type!\n");
  }
}

// Create a new sfxr from a .rfx file
SfxParams null0_load_sfx(char* filename) {
  SfxParams* out = malloc(sizeof(SfxParams));
  pntr_app_sfx_load_params(&out, filename);
  return *out;
}

// Unload a sound
void null0_unload_sound(unsigned int sound) {
  pntr_unload_sound(sounds[sound]);
}

// Has the key been pressed? (tracks unpress/read correctly)
bool null0_key_pressed(pntr_app_key key) {
  return pntr_app_key_pressed(null0_app, key);
}

// Is the key currently down?
bool null0_key_down(pntr_app_key key) {
  return pntr_app_key_down(null0_app, key);
}

// Has the key been released? (tracks press/read correctly)
bool null0_key_released(pntr_app_key key) {
  return pntr_app_key_released(null0_app, key);
}

// Is the key currently up?
bool null0_key_up(pntr_app_key key) {
  return pntr_app_key_up(null0_app, key);
}

// Has the button been pressed? (tracks unpress/read correctly)
bool null0_gamepad_button_pressed(int32_t gamepad, pntr_app_gamepad_button button) {
  return pntr_app_gamepad_button_pressed(null0_app, gamepad, button);
}

// Is the button currently down?
bool null0_gamepad_button_down(int32_t gamepad, pntr_app_gamepad_button button) {
  return pntr_app_gamepad_button_down(null0_app, gamepad, button);
}

// Has the button been released? (tracks press/read correctly)
bool null0_gamepad_button_released(int32_t gamepad, pntr_app_gamepad_button button) {
  return pntr_app_gamepad_button_released(null0_app, gamepad, button);
}

// Get current position of mouse
pntr_vector null0_mouse_position() {
  pntr_vector r = {
      .x = pntr_app_mouse_x(null0_app),
      .y = pntr_app_mouse_y(null0_app)};
  return r;
}

// Has the button been pressed? (tracks unpress/read correctly)
bool null0_mouse_button_pressed(pntr_app_mouse_button button) {
  return pntr_app_mouse_button_pressed(null0_app, button);
}

// Is the button currently down?
bool null0_mouse_button_down(pntr_app_mouse_button button) {
  return pntr_app_mouse_button_down(null0_app, button);
}

// Has the button been released? (tracks press/read correctly)
bool null0_mouse_button_released(pntr_app_mouse_button button) {
  return pntr_app_mouse_button_released(null0_app, button);
}

// Is the button currently up?
bool null0_mouse_button_up(pntr_app_mouse_button button) {
  return pntr_app_mouse_button_up(null0_app, button);
}

// Create a new blank image
unsigned int null0_new_image(int width, int height, Null0Color color) {
  return null0_add_image(pntr_gen_image_color(width, height, null0_pntr_color(color)));
}

// Copy an image to a new image
unsigned int null0_image_copy(unsigned int image) {
  return null0_add_image(pntr_image_copy(images[image]));
}

// Create an image from a region of another image
unsigned int null0_image_subimage(unsigned int image, int x, int y, int width, int height) {
  return null0_add_image(pntr_image_subimage(images[image], x, y, width, height));
}

// Clear the screen
void null0_clear(Null0Color color) {
  pntr_clear_background(images[0], null0_pntr_color(color));
}

// Draw a single pixel on the screen
void null0_draw_point(int x, int y, Null0Color color) {
  pntr_draw_point(images[0], x, y, null0_pntr_color(color));
}

// Draw a line on the screen
void null0_draw_line(int startPosX, int startPosY, int endPosX, int endPosY, Null0Color color) {
  pntr_draw_line(images[0], startPosX, startPosY, endPosX, endPosY, null0_pntr_color(color));
}

// Draw a filled rectangle on the screen
void null0_draw_rectangle(int posX, int posY, int width, int height, Null0Color color) {
  pntr_draw_rectangle_fill(images[0], posX, posY, width, height, null0_pntr_color(color));
}

// Draw a filled triangle on the screen
void null0_draw_triangle(int x1, int y1, int x2, int y2, int x3, int y3, Null0Color color) {
  // TODO: STUB
}

// Draw a filled ellipse on the screen
void null0_draw_ellipse(int centerX, int centerY, int radiusX, int radiusY, Null0Color color) {
  // TODO: STUB
}

// Draw a filled circle on the screen
void null0_draw_circle(int centerX, int centerY, int radius, Null0Color color) {
  // TODO: STUB
}

// Draw a filled polygon on the screen
void null0_draw_polygon(pntr_vector[] points, int numPoints, Null0Color color) {
  // TODO: STUB
}

// Draw several lines on the screen
void null0_draw_polyline(pntr_vector[] points, int numPoints, Null0Color color) {
  // TODO: STUB
}

// Draw a filled arc on the screen
void null0_draw_arc(int centerX, int centerY, float radius, float startAngle, float endAngle, int segments, Null0Color color) {
  // TODO: STUB
}

// Draw a filled round-rectangle on the screen
void null0_draw_rectangle_rounded(int x, int y, int width, int height, int cornerRadius, Null0Color color) {
  // TODO: STUB
}

// Draw an image on the screen
void null0_draw_image(unsigned int src, int posX, int posY) {
  // TODO: STUB
}

// Draw a tinted image on the screen
void null0_draw_image_tint(unsigned int src, int posX, int posY, Null0Color tint) {
  // TODO: STUB
}

// Draw an image, rotated, on the screen
void null0_draw_image_rotated(unsigned int src, int posX, int posY, float degrees, float offsetX, float offsetY, pntr_filter filter) {
  // TODO: STUB
}

// Draw an image, flipped, on the screen
void null0_draw_image_flipped(unsigned int src, int posX, int posY, bool flipHorizontal, bool flipVertical, bool flipDiagonal) {
  // TODO: STUB
}

// Draw an image, scaled, on the screen
void null0_draw_image_scaled(unsigned int src, int posX, int posY, float scaleX, float scaleY, float offsetX, float offsetY, pntr_filter filter) {
  // TODO: STUB
}

// Draw some text on the screen
void null0_draw_text(unsigned int font, char* text, int posX, int posY, Null0Color color) {
  // TODO: STUB
}

// Save an image to persistant storage
void null0_save_image(unsigned int image, char* filename) {
  // TODO: STUB
}

// Load an image from a file in cart
unsigned int null0_load_image(char* filename) {
  // TODO: STUB
  return {0};
}

// Resize an image, in-place
void null0_image_resize(unsigned int image, int newWidth, int newHeight, int offsetX, int offsetY, Null0Color fill) {
  // TODO: STUB
}

// Scale an image, in-place
void null0_image_scale(unsigned int image, float scaleX, float scaleY, pntr_filter filter) {
  // TODO: STUB
}

// Replace a color in an image, in-place
void null0_image_color_replace(unsigned int image, Null0Color color, Null0Color replace) {
  // TODO: STUB
}

// Tint a color in an image, in-place
void null0_image_color_tint(unsigned int image, Null0Color color) {
  // TODO: STUB
}

// Fade a color in an image, in-place
void null0_image_color_fade(unsigned int image, float alpha) {
  // TODO: STUB
}

// Copy a font to a new font
unsigned int null0_font_copy(unsigned int font) {
  // TODO: STUB
  return {0};
}

// Scale a font, return a new font
unsigned int null0_font_scale(unsigned int font, float scaleX, float scaleY, pntr_filter filter) {
  // TODO: STUB
  return {0};
}

// Load a BMF font from a file in cart
unsigned int null0_load_font_bmf(char* filename, char* characters) {
  // TODO: STUB
  return {0};
}

// Load a BMF font from an image
unsigned int null0_load_font_bmf_from_image(unsigned int image, char* characters) {
  // TODO: STUB
  return {0};
}

// Measure the size of some text
pntr_vector null0_measure_text(unsigned int font, char* text) {
  // TODO: STUB
  return {0};
}

// Meaure an image (use 0 for screen)
pntr_vector null0_measure_image(unsigned int image) {
  // TODO: STUB
  return {0};
}

// Load a TTY font from a file in cart
unsigned int null0_load_font_tty(char* filename, int glyphWidth, int glyphHeight, char* characters) {
  // TODO: STUB
  return {0};
}

// Load a TTY font from an image
unsigned int null0_load_font_tty_from_image(unsigned int image, int glyphWidth, int glyphHeight, char* characters) {
  // TODO: STUB
  return {0};
}

// Load a TTF font from a file in cart
unsigned int null0_load_font_ttf(char* filename, int fontSize) {
  // TODO: STUB
  return {0};
}

// Invert the colors in an image, in-place
void null0_image_color_invert(unsigned int image) {
  // TODO: STUB
}

// Calculate a rectangle representing the available alpha border in an image
pntr_rectangle null0_image_alpha_border(unsigned int image, float threshold) {
  // TODO: STUB
  return {0};
}

// Crop an image, in-place
void null0_image_crop(unsigned int image, int x, int y, int width, int height) {
  // TODO: STUB
}

// Crop an image based on the alpha border, in-place
void null0_image_alpha_crop(unsigned int image, float threshold) {
  // TODO: STUB
}

// Adjust the brightness of an image, in-place
void null0_image_color_brightness(unsigned int image, float factor) {
  // TODO: STUB
}

// Flip an image, in-place
void null0_image_flip(unsigned int image, bool horizontal, bool vertical) {
  // TODO: STUB
}

// Change the contrast of an image, in-place
void null0_image_color_contrast(unsigned int image, float contrast) {
  // TODO: STUB
}

// Use an image as an alpha-mask on another image
void null0_image_alpha_mask(unsigned int image, unsigned int alphaMask, int posX, int posY) {
  // TODO: STUB
}

// Create a new image, rotating another image
unsigned int null0_image_rotate(unsigned int image, float degrees, pntr_filter filter) {
  // TODO: STUB
  return {0};
}

// Create a new image of a gradient
unsigned int null0_image_gradient(int width, int height, Null0Color topLeft, Null0Color topRight, Null0Color bottomLeft, Null0Color bottomRight) {
  // TODO: STUB
  return {0};
}

// Unload an image
void null0_unload_image(unsigned int image) {
  // TODO: STUB
}

// Unload a font
void null0_unload_font(unsigned int font) {
  // TODO: STUB
}

// Clear an image
void null0_clear_on_image(unsigned int destination, Null0Color color) {
  // TODO: STUB
}

// Draw a single pixel on an image
void null0_draw_point_on_image(unsigned int destination, int x, int y, Null0Color color) {
  // TODO: STUB
}

// Draw a line on an image
void null0_draw_line_on_image(unsigned int destination, int startPosX, int startPosY, int endPosX, int endPosY, Null0Color color) {
  // TODO: STUB
}

// Draw a filled rectangle on an image
void null0_draw_rectangle_on_image(unsigned int destination, int posX, int posY, int width, int height, Null0Color color) {
  // TODO: STUB
}

// Draw a filled triangle on an image
void null0_draw_triangle_on_image(unsigned int destination, int x1, int y1, int x2, int y2, int x3, int y3, Null0Color color) {
  // TODO: STUB
}

// Draw a filled ellipse on an image
void null0_draw_ellipse_on_image(unsigned int destination, int centerX, int centerY, int radiusX, int radiusY, Null0Color color) {
  // TODO: STUB
}

// Draw a circle on an image
void null0_draw_circle_on_image(unsigned int destination, int centerX, int centerY, int radius, Null0Color color) {
  // TODO: STUB
}

// Draw a filled polygon on an image
void null0_draw_polygon_on_image(unsigned int destination, pntr_vector[] points, int numPoints, Null0Color color) {
  // TODO: STUB
}

// Draw several lines on an image
void null0_draw_polyline_on_image(unsigned int destination, pntr_vector[] points, int numPoints, Null0Color color) {
  // TODO: STUB
}

// Draw a filled round-rectangle on an image
void null0_draw_rectangle_rounded_on_image(unsigned int destination, int x, int y, int width, int height, int cornerRadius, Null0Color color) {
  // TODO: STUB
}

// Draw an image on an image
void null0_draw_image_on_image(unsigned int destination, unsigned int src, int posX, int posY) {
  // TODO: STUB
}

// Draw a tinted image on an image
void null0_draw_image_tint_on_image(unsigned int destination, unsigned int src, int posX, int posY, Null0Color tint) {
  // TODO: STUB
}

// Draw an image, rotated, on an image
void null0_draw_image_rotated_on_image(unsigned int destination, unsigned int src, int posX, int posY, float degrees, float offsetX, float offsetY, pntr_filter filter) {
  // TODO: STUB
}

// Draw an image, flipped, on an image
void null0_draw_image_flipped_on_image(unsigned int destination, unsigned int src, int posX, int posY, bool flipHorizontal, bool flipVertical, bool flipDiagonal) {
  // TODO: STUB
}

// Draw an image, scaled, on an image
void null0_draw_image_scaled_on_image(unsigned int destination, unsigned int src, int posX, int posY, float scaleX, float scaleY, float offsetX, float offsetY, pntr_filter filter) {
  // TODO: STUB
}

// Draw some text on an image
void null0_draw_text_on_image(unsigned int destination, unsigned int font, char* text, int posX, int posY, Null0Color color) {
  // TODO: STUB
}

// Draw a 1px outlined rectangle on the screen
void null0_draw_rectangle_outline(int posX, int posY, int width, int height, Null0Color color) {
  // TODO: STUB
}

// Draw a 1px outlined triangle on the screen
void null0_draw_triangle_outline(int x1, int y1, int x2, int y2, int x3, int y3, Null0Color color) {
  // TODO: STUB
}

// Draw a 1px outlined ellipse on the screen
void null0_draw_ellipse_outline(int centerX, int centerY, int radiusX, int radiusY, Null0Color color) {
  // TODO: STUB
}

// Draw a 1px outlined circle on the screen
void null0_draw_circle_outline(int centerX, int centerY, int radius, Null0Color color) {
  // TODO: STUB
}

// Draw a 1px outlined polygon on the screen
void null0_draw_polygon_outline(pntr_vector[] points, int numPoints, Null0Color color) {
  // TODO: STUB
}

// Draw a 1px outlined arc on the screen
void null0_draw_arc_outline(int centerX, int centerY, float radius, float startAngle, float endAngle, int segments, Null0Color color) {
  // TODO: STUB
}

// Draw a 1px outlined round-rectangle on the screen
void null0_draw_rectangle_rounded_outline(int x, int y, int width, int height, int cornerRadius, Null0Color color) {
  // TODO: STUB
}

// Draw a 1px outlined rectangle on an image
void null0_draw_rectangle_outline_on_image(unsigned int destination, int posX, int posY, int width, int height, Null0Color color) {
  // TODO: STUB
}

// Draw a 1px outlined triangle on an image
void null0_draw_triangle_outline_on_image(unsigned int destination, int x1, int y1, int x2, int y2, int x3, int y3, Null0Color color) {
  // TODO: STUB
}

// Draw a 1px outlined ellipse on an image
void null0_draw_ellipse_outline_on_image(unsigned int destination, int centerX, int centerY, int radiusX, int radiusY, Null0Color color) {
  // TODO: STUB
}

// Draw a 1px outlined circle on an image
void null0_draw_circle_outline_on_image(unsigned int destination, int centerX, int centerY, int radius, Null0Color color) {
  // TODO: STUB
}

// Draw a 1px outlined polygon on an image
void null0_draw_polygon_outline_on_image(unsigned int destination, pntr_vector[] points, int numPoints, Null0Color color) {
  // TODO: STUB
}

// Draw a 1px outlined round-rectangle on an image
void null0_draw_rectangle_rounded_outline_on_image(unsigned int destination, int x, int y, int width, int height, int cornerRadius, Null0Color color) {
  // TODO: STUB
}

// Read a file from cart (or local persistant)
unsigned char* null0_file_read(char* filename, unsigned int* bytesRead) {
  // TODO: STUB
  return {0};
}

// Write a file to persistant storage
bool null0_file_write(char* filename, unsigned char* data, unsigned int byteSize) {
  // TODO: STUB
  return {0};
}

// Write a file to persistant storage, appending to the end
bool null0_file_append(char* filename, unsigned char* data, unsigned int byteSize) {
  // TODO: STUB
  return {0};
}

// Get info about a single file
PHYSFS_Stat null0_file_info(char* filename) {
  // TODO: STUB
  return {0};
}

// Get list of files in a directory
char** null0_file_list(char* dir) {
  // TODO: STUB
  return {0};
}

// Get the user's writable dir (where file writes or appends go)
char* null0_get_write_dir() {
  // TODO: STUB
  return {0};
}

// Tint a color with another color
Null0Color null0_color_tint(Null0Color color, Null0Color tint) {
  // TODO: STUB
  return {0};
}

// Fade a color
Null0Color null0_color_fade(Null0Color color, float alpha) {
  // TODO: STUB
  return {0};
}

// Change the brightness of a color
Null0Color null0_color_brightness(Null0Color color, float factor) {
  // TODO: STUB
  return {0};
}

// Invert a color
Null0Color null0_color_invert(Null0Color color) {
  // TODO: STUB
  return {0};
}

// Blend 2 colors together
Null0Color null0_color_alpha_blend(Null0Color dst, Null0Color src) {
  // TODO: STUB
  return {0};
}

// Change contrast of a color
Null0Color null0_color_contrast(Null0Color color, float contrast) {
  // TODO: STUB
  return {0};
}

// Interpolate colors
Null0Color null0_color_bilinear_interpolate(Null0Color color00, Null0Color color01, Null0Color color10, Null0Color color11, float coordinateX, float coordinateY) {
  // TODO: STUB
  return {0};
}

static unsigned int cart_arg_offset = 0;
static unsigned int cart_ret_offset = 0;

uint64_t cart_arg_get_u64() {
  // TODO: STUB
  uint64_t ret = malloc(8);
  memcpy(&ret, &cart_shared.data + cart_arg_offset, 8);
  cart_arg_offset += 8;
  return ret;
}

float cart_arg_get_f32() {
  // TODO: STUB
  float ret = malloc(4);
  memcpy(&ret, &cart_shared.data + cart_arg_offset, 4);
  cart_arg_offset += 4;
  return ret;
}

int cart_arg_get_i32() {
  // TODO: STUB
  int ret = malloc(4);
  memcpy(&ret, &cart_shared.data + cart_arg_offset, 4);
  cart_arg_offset += 4;
  return ret;
}

unsigned int cart_arg_get_TileMap() {
  // TODO: STUB
  unsigned int ret = malloc(4);
  memcpy(&ret, &cart_shared.data + cart_arg_offset, 4);
  cart_arg_offset += 4;
  return ret;
}

unsigned int cart_arg_get_u32() {
  // TODO: STUB
  unsigned int ret = malloc(4);
  memcpy(&ret, &cart_shared.data + cart_arg_offset, 4);
  cart_arg_offset += 4;
  return ret;
}

unsigned int cart_arg_get_Sound() {
  // TODO: STUB
  unsigned int ret = malloc(4);
  memcpy(&ret, &cart_shared.data + cart_arg_offset, 4);
  cart_arg_offset += 4;
  return ret;
}

SfxParams cart_arg_get_SfxParams() {
  // TODO: STUB
  SfxParams ret = malloc(96);
  memcpy(&ret, &cart_shared.data + cart_arg_offset, 96);
  cart_arg_offset += 96;
  return ret;
}

bool cart_arg_get_bool() {
  // TODO: STUB
  bool ret = malloc(1);
  memcpy(&ret, &cart_shared.data + cart_arg_offset, 1);
  cart_arg_offset += 1;
  return ret;
}

pntr_vector cart_arg_get_Vector() {
  // TODO: STUB
  pntr_vector ret = malloc(8);
  memcpy(&ret, &cart_shared.data + cart_arg_offset, 8);
  cart_arg_offset += 8;
  return ret;
}

unsigned int cart_arg_get_Image() {
  // TODO: STUB
  unsigned int ret = malloc(4);
  memcpy(&ret, &cart_shared.data + cart_arg_offset, 4);
  cart_arg_offset += 4;
  return ret;
}

unsigned int cart_arg_get_Font() {
  // TODO: STUB
  unsigned int ret = malloc(4);
  memcpy(&ret, &cart_shared.data + cart_arg_offset, 4);
  cart_arg_offset += 4;
  return ret;
}

pntr_rectangle cart_arg_get_Rectangle() {
  // TODO: STUB
  pntr_rectangle ret = malloc(16);
  memcpy(&ret, &cart_shared.data + cart_arg_offset, 16);
  cart_arg_offset += 16;
  return ret;
}

unsigned char* cart_arg_get_bytes(unsigned int len) {
  // TODO: STUB
  unsigned char ret = malloc(0);
  memcpy(&ret, &cart_shared.data + cart_arg_offset, 0);
  cart_arg_offset += len;
  return &ret;
}

PHYSFS_Stat cart_arg_get_FileInfo() {
  // TODO: STUB
  PHYSFS_Stat ret = malloc(40);
  memcpy(&ret, &cart_shared.data + cart_arg_offset, 40);
  cart_arg_offset += 40;
  return ret;
}

char** cart_arg_get_string_array(unsigned int len) {
  // TODO: STUB
  char* ret = malloc(0);
  memcpy(&ret, &cart_shared.data + cart_arg_offset, 0);
  cart_arg_offset += len;
  return &ret;
}

char* cart_arg_get_string() {
  // TODO: STUB
len=strlen((char*)&cart_shared.data + cart_arg_offset) + 1;
  char ret = malloc(0);
  memcpy(&ret, &cart_shared.data + cart_arg_offset, 0);
  cart_arg_offset += len;
  return &ret;
}

Null0Color cart_arg_get_Color() {
  // TODO: STUB
  Null0Color ret = malloc(4);
  memcpy(&ret, &cart_shared.data + cart_arg_offset, 4);
  cart_arg_offset += 4;
  return ret;
}

void cart_ret_set_string(char* value) {
  // TODO: STUB
len=strlen(value) + 1;
  memcpy(&cart_shared.data + cart_ret_offset, char*, 0);
  cart_ret_offset += len;
  cart_shared.size = cart_ret_offset;
}

void cart_ret_set_i32(int value) {
  // TODO: STUB
  memcpy(&cart_shared.data + cart_ret_offset, &int, 4);
  cart_ret_offset += 4;
  cart_shared.size = cart_ret_offset;
}

void cart_ret_set_TileMap(unsigned int value) {
  // TODO: STUB
  memcpy(&cart_shared.data + cart_ret_offset, &unsigned int, 4);
  cart_ret_offset += 4;
  cart_shared.size = cart_ret_offset;
}

void cart_ret_set_Color(Null0Color value) {
  // TODO: STUB
  memcpy(&cart_shared.data + cart_ret_offset, &Null0Color, 4);
  cart_ret_offset += 4;
  cart_shared.size = cart_ret_offset;
}

void cart_ret_set_Image(unsigned int value) {
  // TODO: STUB
  memcpy(&cart_shared.data + cart_ret_offset, &unsigned int, 4);
  cart_ret_offset += 4;
  cart_shared.size = cart_ret_offset;
}

void cart_ret_set_u32(unsigned int value) {
  // TODO: STUB
  memcpy(&cart_shared.data + cart_ret_offset, &unsigned int, 4);
  cart_ret_offset += 4;
  cart_shared.size = cart_ret_offset;
}

void cart_ret_set_f32(float value) {
  // TODO: STUB
  memcpy(&cart_shared.data + cart_ret_offset, &float, 4);
  cart_ret_offset += 4;
  cart_shared.size = cart_ret_offset;
}

void cart_ret_set_Sound(unsigned int value) {
  // TODO: STUB
  memcpy(&cart_shared.data + cart_ret_offset, &unsigned int, 4);
  cart_ret_offset += 4;
  cart_shared.size = cart_ret_offset;
}

void cart_ret_set_bool(bool value) {
  // TODO: STUB
  memcpy(&cart_shared.data + cart_ret_offset, &bool, 1);
  cart_ret_offset += 1;
  cart_shared.size = cart_ret_offset;
}

void cart_ret_set_SfxParams(SfxParams value) {
  // TODO: STUB
  memcpy(&cart_shared.data + cart_ret_offset, &SfxParams, 96);
  cart_ret_offset += 96;
  cart_shared.size = cart_ret_offset;
}

void cart_ret_set_SfxPresetType(SfxPresetType value) {
  // TODO: STUB
  memcpy(&cart_shared.data + cart_ret_offset, &SfxPresetType, 4);
  cart_ret_offset += 4;
  cart_shared.size = cart_ret_offset;
}

void cart_ret_set_Key(pntr_app_key value) {
  // TODO: STUB
  memcpy(&cart_shared.data + cart_ret_offset, &pntr_app_key, 4);
  cart_ret_offset += 4;
  cart_shared.size = cart_ret_offset;
}

void cart_ret_set_GamepadButton(pntr_app_gamepad_button value) {
  // TODO: STUB
  memcpy(&cart_shared.data + cart_ret_offset, &pntr_app_gamepad_button, 4);
  cart_ret_offset += 4;
  cart_shared.size = cart_ret_offset;
}

void cart_ret_set_MouseButton(pntr_app_mouse_button value) {
  // TODO: STUB
  memcpy(&cart_shared.data + cart_ret_offset, &pntr_app_mouse_button, 4);
  cart_ret_offset += 4;
  cart_shared.size = cart_ret_offset;
}

void cart_ret_set_Vector_array(pntr_vector[] value, unsigned int len) {
  memcpy(&cart_shared.data + cart_ret_offset, &pntr_vector[], len * sizeof(pntr_vector));
  cart_ret_offset += (len * sizeof(pntr_vector));
  cart_shared.size = cart_ret_offset;
}

void cart_ret_set_ImageFilter(pntr_filter value) {
  memcpy(&cart_shared.data + cart_ret_offset, &pntr_filter, 4);
  cart_ret_offset += 4;
  cart_shared.size = cart_ret_offset;
}

void cart_ret_set_Font(unsigned int value) {
  memcpy(&cart_shared.data + cart_ret_offset, &unsigned int, 4);
  cart_ret_offset += 4;
  cart_shared.size = cart_ret_offset;
}

void cart_ret_set_u32_pointer(unsigned int* value) {
  // TODO: STUB
  memcpy(&cart_shared.data + cart_ret_offset, unsigned int*, 4);
  cart_ret_offset += 4;
  cart_shared.size = cart_ret_offset;
}

void cart_ret_set_bytes(unsigned char* value, unsigned int len) {
  memcpy(&cart_shared.data + cart_ret_offset, unsigned char*, len);
  cart_ret_offset += len;
  cart_shared.size = cart_ret_offset;
}


typedef enum {
  OP_TRACE,
  OP_CURRENT_TIME,
  OP_DELTA_TIME,
  OP_RANDOM_INT,
  OP_LOAD_MAP,
  OP_UNLOAD_MAP,
  OP_DRAW_MAP,
  OP_DRAW_MAP_ON_IMAGE,
  OP_DRAW_TILE,
  OP_DRAW_TILE_ON_IMAGE,
  OP_DRAW_LAYER,
  OP_DRAW_LAYER_ON_IMAGE,
  OP_UPDATE_MAP,
  OP_LAYER_GET_GID,
  OP_LAYER_SET_GID,
  OP_LOAD_SOUND,
  OP_PLAY_SOUND,
  OP_STOP_SOUND,
  OP_NEW_SFX,
  OP_PRESET_SFX,
  OP_LOAD_SFX,
  OP_UNLOAD_SOUND,
  OP_KEY_PRESSED,
  OP_KEY_DOWN,
  OP_KEY_RELEASED,
  OP_KEY_UP,
  OP_GAMEPAD_BUTTON_PRESSED,
  OP_GAMEPAD_BUTTON_DOWN,
  OP_GAMEPAD_BUTTON_RELEASED,
  OP_MOUSE_POSITION,
  OP_MOUSE_BUTTON_PRESSED,
  OP_MOUSE_BUTTON_DOWN,
  OP_MOUSE_BUTTON_RELEASED,
  OP_MOUSE_BUTTON_UP,
  OP_NEW_IMAGE,
  OP_IMAGE_COPY,
  OP_IMAGE_SUBIMAGE,
  OP_CLEAR,
  OP_DRAW_POINT,
  OP_DRAW_LINE,
  OP_DRAW_RECTANGLE,
  OP_DRAW_TRIANGLE,
  OP_DRAW_ELLIPSE,
  OP_DRAW_CIRCLE,
  OP_DRAW_POLYGON,
  OP_DRAW_POLYLINE,
  OP_DRAW_ARC,
  OP_DRAW_RECTANGLE_ROUNDED,
  OP_DRAW_IMAGE,
  OP_DRAW_IMAGE_TINT,
  OP_DRAW_IMAGE_ROTATED,
  OP_DRAW_IMAGE_FLIPPED,
  OP_DRAW_IMAGE_SCALED,
  OP_DRAW_TEXT,
  OP_SAVE_IMAGE,
  OP_LOAD_IMAGE,
  OP_IMAGE_RESIZE,
  OP_IMAGE_SCALE,
  OP_IMAGE_COLOR_REPLACE,
  OP_IMAGE_COLOR_TINT,
  OP_IMAGE_COLOR_FADE,
  OP_FONT_COPY,
  OP_FONT_SCALE,
  OP_LOAD_FONT_BMF,
  OP_LOAD_FONT_BMF_FROM_IMAGE,
  OP_MEASURE_TEXT,
  OP_MEASURE_IMAGE,
  OP_LOAD_FONT_TTY,
  OP_LOAD_FONT_TTY_FROM_IMAGE,
  OP_LOAD_FONT_TTF,
  OP_IMAGE_COLOR_INVERT,
  OP_IMAGE_ALPHA_BORDER,
  OP_IMAGE_CROP,
  OP_IMAGE_ALPHA_CROP,
  OP_IMAGE_COLOR_BRIGHTNESS,
  OP_IMAGE_FLIP,
  OP_IMAGE_COLOR_CONTRAST,
  OP_IMAGE_ALPHA_MASK,
  OP_IMAGE_ROTATE,
  OP_IMAGE_GRADIENT,
  OP_UNLOAD_IMAGE,
  OP_UNLOAD_FONT,
  OP_CLEAR_ON_IMAGE,
  OP_DRAW_POINT_ON_IMAGE,
  OP_DRAW_LINE_ON_IMAGE,
  OP_DRAW_RECTANGLE_ON_IMAGE,
  OP_DRAW_TRIANGLE_ON_IMAGE,
  OP_DRAW_ELLIPSE_ON_IMAGE,
  OP_DRAW_CIRCLE_ON_IMAGE,
  OP_DRAW_POLYGON_ON_IMAGE,
  OP_DRAW_POLYLINE_ON_IMAGE,
  OP_DRAW_RECTANGLE_ROUNDED_ON_IMAGE,
  OP_DRAW_IMAGE_ON_IMAGE,
  OP_DRAW_IMAGE_TINT_ON_IMAGE,
  OP_DRAW_IMAGE_ROTATED_ON_IMAGE,
  OP_DRAW_IMAGE_FLIPPED_ON_IMAGE,
  OP_DRAW_IMAGE_SCALED_ON_IMAGE,
  OP_DRAW_TEXT_ON_IMAGE,
  OP_DRAW_RECTANGLE_OUTLINE,
  OP_DRAW_TRIANGLE_OUTLINE,
  OP_DRAW_ELLIPSE_OUTLINE,
  OP_DRAW_CIRCLE_OUTLINE,
  OP_DRAW_POLYGON_OUTLINE,
  OP_DRAW_ARC_OUTLINE,
  OP_DRAW_RECTANGLE_ROUNDED_OUTLINE,
  OP_DRAW_RECTANGLE_OUTLINE_ON_IMAGE,
  OP_DRAW_TRIANGLE_OUTLINE_ON_IMAGE,
  OP_DRAW_ELLIPSE_OUTLINE_ON_IMAGE,
  OP_DRAW_CIRCLE_OUTLINE_ON_IMAGE,
  OP_DRAW_POLYGON_OUTLINE_ON_IMAGE,
  OP_DRAW_RECTANGLE_ROUNDED_OUTLINE_ON_IMAGE,
  OP_FILE_READ,
  OP_FILE_WRITE,
  OP_FILE_APPEND,
  OP_FILE_INFO,
  OP_FILE_LIST,
  OP_GET_WRITE_DIR,
  OP_COLOR_TINT,
  OP_COLOR_FADE,
  OP_COLOR_BRIGHTNESS,
  OP_COLOR_INVERT,
  OP_COLOR_ALPHA_BLEND,
  OP_COLOR_CONTRAST,
  OP_COLOR_BILINEAR_INTERPOLATE
} Null0Op;

// let cart call a function
void null0_call(Null0Op op) {
  cart_arg_offset = 0;
  cart_ret_offset = 0;
  unsigned int len = 0;
  cart_shared.size = 0;

  switch(op) {
    case OP_TRACE: null0_trace(cart_arg_get_string()); break;
    case OP_CURRENT_TIME:  cart_ret_set_u64(null0_current_time()); break;
    case OP_DELTA_TIME:  cart_ret_set_f32(null0_delta_time()); break;
    case OP_RANDOM_INT:  cart_ret_set_i32(null0_random_int(cart_arg_get_i32(), cart_arg_get_i32())); break;
    case OP_LOAD_MAP:  cart_ret_set_TileMap(null0_load_map(cart_arg_get_string())); break;
    case OP_UNLOAD_MAP: null0_unload_map(cart_arg_get_TileMap()); break;
    case OP_DRAW_MAP: null0_draw_map(cart_arg_get_TileMap(), cart_arg_get_i32(), cart_arg_get_i32(), cart_arg_get_Color()); break;
    case OP_DRAW_MAP_ON_IMAGE: null0_draw_map_on_image(cart_arg_get_Image(), cart_arg_get_TileMap(), cart_arg_get_i32(), cart_arg_get_i32(), cart_arg_get_Color()); break;
    case OP_DRAW_TILE: null0_draw_tile(cart_arg_get_TileMap(), cart_arg_get_u32(), cart_arg_get_i32(), cart_arg_get_i32(), cart_arg_get_Color()); break;
    case OP_DRAW_TILE_ON_IMAGE: null0_draw_tile_on_image(cart_arg_get_Image(), cart_arg_get_TileMap(), cart_arg_get_u32(), cart_arg_get_i32(), cart_arg_get_i32(), cart_arg_get_Color()); break;
    case OP_DRAW_LAYER: null0_draw_layer(cart_arg_get_TileMap(), cart_arg_get_string(), cart_arg_get_i32(), cart_arg_get_i32()); break;
    case OP_DRAW_LAYER_ON_IMAGE: null0_draw_layer_on_image(cart_arg_get_Image(), cart_arg_get_TileMap(), cart_arg_get_string(), cart_arg_get_i32(), cart_arg_get_i32()); break;
    case OP_UPDATE_MAP: null0_update_map(cart_arg_get_TileMap(), cart_arg_get_f32()); break;
    case OP_LAYER_GET_GID:  cart_ret_set_u32(null0_layer_get_gid(cart_arg_get_TileMap(), cart_arg_get_string(), cart_arg_get_u32(), cart_arg_get_u32())); break;
    case OP_LAYER_SET_GID: null0_layer_set_gid(cart_arg_get_TileMap(), cart_arg_get_string(), cart_arg_get_u32(), cart_arg_get_u32(), cart_arg_get_u32()); break;
    case OP_LOAD_SOUND:  cart_ret_set_Sound(null0_load_sound(cart_arg_get_string())); break;
    case OP_PLAY_SOUND: null0_play_sound(cart_arg_get_Sound(), cart_arg_get_bool()); break;
    case OP_STOP_SOUND: null0_stop_sound(cart_arg_get_Sound()); break;
    case OP_NEW_SFX:  cart_ret_set_Sound(null0_new_sfx(cart_arg_get_SfxParams())); break;
    case OP_PRESET_SFX:  cart_ret_set_SfxParams(null0_preset_sfx(cart_arg_get_SfxPresetType())); break;
    case OP_LOAD_SFX:  cart_ret_set_SfxParams(null0_load_sfx(cart_arg_get_string())); break;
    case OP_UNLOAD_SOUND: null0_unload_sound(cart_arg_get_Sound()); break;
    case OP_KEY_PRESSED:  cart_ret_set_bool(null0_key_pressed(cart_arg_get_Key())); break;
    case OP_KEY_DOWN:  cart_ret_set_bool(null0_key_down(cart_arg_get_Key())); break;
    case OP_KEY_RELEASED:  cart_ret_set_bool(null0_key_released(cart_arg_get_Key())); break;
    case OP_KEY_UP:  cart_ret_set_bool(null0_key_up(cart_arg_get_Key())); break;
    case OP_GAMEPAD_BUTTON_PRESSED:  cart_ret_set_bool(null0_gamepad_button_pressed(cart_arg_get_i32(), cart_arg_get_GamepadButton())); break;
    case OP_GAMEPAD_BUTTON_DOWN:  cart_ret_set_bool(null0_gamepad_button_down(cart_arg_get_i32(), cart_arg_get_GamepadButton())); break;
    case OP_GAMEPAD_BUTTON_RELEASED:  cart_ret_set_bool(null0_gamepad_button_released(cart_arg_get_i32(), cart_arg_get_GamepadButton())); break;
    case OP_MOUSE_POSITION:  cart_ret_set_Vector(null0_mouse_position()); break;
    case OP_MOUSE_BUTTON_PRESSED:  cart_ret_set_bool(null0_mouse_button_pressed(cart_arg_get_MouseButton())); break;
    case OP_MOUSE_BUTTON_DOWN:  cart_ret_set_bool(null0_mouse_button_down(cart_arg_get_MouseButton())); break;
    case OP_MOUSE_BUTTON_RELEASED:  cart_ret_set_bool(null0_mouse_button_released(cart_arg_get_MouseButton())); break;
    case OP_MOUSE_BUTTON_UP:  cart_ret_set_bool(null0_mouse_button_up(cart_arg_get_MouseButton())); break;
    case OP_NEW_IMAGE:  cart_ret_set_Image(null0_new_image(cart_arg_get_i32(), cart_arg_get_i32(), cart_arg_get_Color())); break;
    case OP_IMAGE_COPY:  cart_ret_set_Image(null0_image_copy(cart_arg_get_Image())); break;
    case OP_IMAGE_SUBIMAGE:  cart_ret_set_Image(null0_image_subimage(cart_arg_get_Image(), cart_arg_get_i32(), cart_arg_get_i32(), cart_arg_get_i32(), cart_arg_get_i32())); break;
    case OP_CLEAR: null0_clear(cart_arg_get_Color()); break;
    case OP_DRAW_POINT: null0_draw_point(cart_arg_get_i32(), cart_arg_get_i32(), cart_arg_get_Color()); break;
    case OP_DRAW_LINE: null0_draw_line(cart_arg_get_i32(), cart_arg_get_i32(), cart_arg_get_i32(), cart_arg_get_i32(), cart_arg_get_Color()); break;
    case OP_DRAW_RECTANGLE: null0_draw_rectangle(cart_arg_get_i32(), cart_arg_get_i32(), cart_arg_get_i32(), cart_arg_get_i32(), cart_arg_get_Color()); break;
    case OP_DRAW_TRIANGLE: null0_draw_triangle(cart_arg_get_i32(), cart_arg_get_i32(), cart_arg_get_i32(), cart_arg_get_i32(), cart_arg_get_i32(), cart_arg_get_i32(), cart_arg_get_Color()); break;
    case OP_DRAW_ELLIPSE: null0_draw_ellipse(cart_arg_get_i32(), cart_arg_get_i32(), cart_arg_get_i32(), cart_arg_get_i32(), cart_arg_get_Color()); break;
    case OP_DRAW_CIRCLE: null0_draw_circle(cart_arg_get_i32(), cart_arg_get_i32(), cart_arg_get_i32(), cart_arg_get_Color()); break;
    case OP_DRAW_POLYGON: null0_draw_polygon(cart_arg_get_Vector_array(len), cart_arg_get_i32(), cart_arg_get_Color()); break;
    case OP_DRAW_POLYLINE: null0_draw_polyline(cart_arg_get_Vector_array(len), cart_arg_get_i32(), cart_arg_get_Color()); break;
    case OP_DRAW_ARC: null0_draw_arc(cart_arg_get_i32(), cart_arg_get_i32(), cart_arg_get_f32(), cart_arg_get_f32(), cart_arg_get_f32(), cart_arg_get_i32(), cart_arg_get_Color()); break;
    case OP_DRAW_RECTANGLE_ROUNDED: null0_draw_rectangle_rounded(cart_arg_get_i32(), cart_arg_get_i32(), cart_arg_get_i32(), cart_arg_get_i32(), cart_arg_get_i32(), cart_arg_get_Color()); break;
    case OP_DRAW_IMAGE: null0_draw_image(cart_arg_get_Image(), cart_arg_get_i32(), cart_arg_get_i32()); break;
    case OP_DRAW_IMAGE_TINT: null0_draw_image_tint(cart_arg_get_Image(), cart_arg_get_i32(), cart_arg_get_i32(), cart_arg_get_Color()); break;
    case OP_DRAW_IMAGE_ROTATED: null0_draw_image_rotated(cart_arg_get_Image(), cart_arg_get_i32(), cart_arg_get_i32(), cart_arg_get_f32(), cart_arg_get_f32(), cart_arg_get_f32(), cart_arg_get_ImageFilter()); break;
    case OP_DRAW_IMAGE_FLIPPED: null0_draw_image_flipped(cart_arg_get_Image(), cart_arg_get_i32(), cart_arg_get_i32(), cart_arg_get_bool(), cart_arg_get_bool(), cart_arg_get_bool()); break;
    case OP_DRAW_IMAGE_SCALED: null0_draw_image_scaled(cart_arg_get_Image(), cart_arg_get_i32(), cart_arg_get_i32(), cart_arg_get_f32(), cart_arg_get_f32(), cart_arg_get_f32(), cart_arg_get_f32(), cart_arg_get_ImageFilter()); break;
    case OP_DRAW_TEXT: null0_draw_text(cart_arg_get_Font(), cart_arg_get_string(), cart_arg_get_i32(), cart_arg_get_i32(), cart_arg_get_Color()); break;
    case OP_SAVE_IMAGE: null0_save_image(cart_arg_get_Image(), cart_arg_get_string()); break;
    case OP_LOAD_IMAGE:  cart_ret_set_Image(null0_load_image(cart_arg_get_string())); break;
    case OP_IMAGE_RESIZE: null0_image_resize(cart_arg_get_Image(), cart_arg_get_i32(), cart_arg_get_i32(), cart_arg_get_i32(), cart_arg_get_i32(), cart_arg_get_Color()); break;
    case OP_IMAGE_SCALE: null0_image_scale(cart_arg_get_Image(), cart_arg_get_f32(), cart_arg_get_f32(), cart_arg_get_ImageFilter()); break;
    case OP_IMAGE_COLOR_REPLACE: null0_image_color_replace(cart_arg_get_Image(), cart_arg_get_Color(), cart_arg_get_Color()); break;
    case OP_IMAGE_COLOR_TINT: null0_image_color_tint(cart_arg_get_Image(), cart_arg_get_Color()); break;
    case OP_IMAGE_COLOR_FADE: null0_image_color_fade(cart_arg_get_Image(), cart_arg_get_f32()); break;
    case OP_FONT_COPY:  cart_ret_set_Font(null0_font_copy(cart_arg_get_Font())); break;
    case OP_FONT_SCALE:  cart_ret_set_Font(null0_font_scale(cart_arg_get_Font(), cart_arg_get_f32(), cart_arg_get_f32(), cart_arg_get_ImageFilter())); break;
    case OP_LOAD_FONT_BMF:  cart_ret_set_Font(null0_load_font_bmf(cart_arg_get_string(), cart_arg_get_string())); break;
    case OP_LOAD_FONT_BMF_FROM_IMAGE:  cart_ret_set_Font(null0_load_font_bmf_from_image(cart_arg_get_Image(), cart_arg_get_string())); break;
    case OP_MEASURE_TEXT:  cart_ret_set_Vector(null0_measure_text(cart_arg_get_Font(), cart_arg_get_string())); break;
    case OP_MEASURE_IMAGE:  cart_ret_set_Vector(null0_measure_image(cart_arg_get_Image())); break;
    case OP_LOAD_FONT_TTY:  cart_ret_set_Font(null0_load_font_tty(cart_arg_get_string(), cart_arg_get_i32(), cart_arg_get_i32(), cart_arg_get_string())); break;
    case OP_LOAD_FONT_TTY_FROM_IMAGE:  cart_ret_set_Font(null0_load_font_tty_from_image(cart_arg_get_Image(), cart_arg_get_i32(), cart_arg_get_i32(), cart_arg_get_string())); break;
    case OP_LOAD_FONT_TTF:  cart_ret_set_Font(null0_load_font_ttf(cart_arg_get_string(), cart_arg_get_i32())); break;
    case OP_IMAGE_COLOR_INVERT: null0_image_color_invert(cart_arg_get_Image()); break;
    case OP_IMAGE_ALPHA_BORDER:  cart_ret_set_Rectangle(null0_image_alpha_border(cart_arg_get_Image(), cart_arg_get_f32())); break;
    case OP_IMAGE_CROP: null0_image_crop(cart_arg_get_Image(), cart_arg_get_i32(), cart_arg_get_i32(), cart_arg_get_i32(), cart_arg_get_i32()); break;
    case OP_IMAGE_ALPHA_CROP: null0_image_alpha_crop(cart_arg_get_Image(), cart_arg_get_f32()); break;
    case OP_IMAGE_COLOR_BRIGHTNESS: null0_image_color_brightness(cart_arg_get_Image(), cart_arg_get_f32()); break;
    case OP_IMAGE_FLIP: null0_image_flip(cart_arg_get_Image(), cart_arg_get_bool(), cart_arg_get_bool()); break;
    case OP_IMAGE_COLOR_CONTRAST: null0_image_color_contrast(cart_arg_get_Image(), cart_arg_get_f32()); break;
    case OP_IMAGE_ALPHA_MASK: null0_image_alpha_mask(cart_arg_get_Image(), cart_arg_get_Image(), cart_arg_get_i32(), cart_arg_get_i32()); break;
    case OP_IMAGE_ROTATE:  cart_ret_set_Image(null0_image_rotate(cart_arg_get_Image(), cart_arg_get_f32(), cart_arg_get_ImageFilter())); break;
    case OP_IMAGE_GRADIENT:  cart_ret_set_Image(null0_image_gradient(cart_arg_get_i32(), cart_arg_get_i32(), cart_arg_get_Color(), cart_arg_get_Color(), cart_arg_get_Color(), cart_arg_get_Color())); break;
    case OP_UNLOAD_IMAGE: null0_unload_image(cart_arg_get_Image()); break;
    case OP_UNLOAD_FONT: null0_unload_font(cart_arg_get_Font()); break;
    case OP_CLEAR_ON_IMAGE: null0_clear_on_image(cart_arg_get_Image(), cart_arg_get_Color()); break;
    case OP_DRAW_POINT_ON_IMAGE: null0_draw_point_on_image(cart_arg_get_Image(), cart_arg_get_i32(), cart_arg_get_i32(), cart_arg_get_Color()); break;
    case OP_DRAW_LINE_ON_IMAGE: null0_draw_line_on_image(cart_arg_get_Image(), cart_arg_get_i32(), cart_arg_get_i32(), cart_arg_get_i32(), cart_arg_get_i32(), cart_arg_get_Color()); break;
    case OP_DRAW_RECTANGLE_ON_IMAGE: null0_draw_rectangle_on_image(cart_arg_get_Image(), cart_arg_get_i32(), cart_arg_get_i32(), cart_arg_get_i32(), cart_arg_get_i32(), cart_arg_get_Color()); break;
    case OP_DRAW_TRIANGLE_ON_IMAGE: null0_draw_triangle_on_image(cart_arg_get_Image(), cart_arg_get_i32(), cart_arg_get_i32(), cart_arg_get_i32(), cart_arg_get_i32(), cart_arg_get_i32(), cart_arg_get_i32(), cart_arg_get_Color()); break;
    case OP_DRAW_ELLIPSE_ON_IMAGE: null0_draw_ellipse_on_image(cart_arg_get_Image(), cart_arg_get_i32(), cart_arg_get_i32(), cart_arg_get_i32(), cart_arg_get_i32(), cart_arg_get_Color()); break;
    case OP_DRAW_CIRCLE_ON_IMAGE: null0_draw_circle_on_image(cart_arg_get_Image(), cart_arg_get_i32(), cart_arg_get_i32(), cart_arg_get_i32(), cart_arg_get_Color()); break;
    case OP_DRAW_POLYGON_ON_IMAGE: null0_draw_polygon_on_image(cart_arg_get_Image(), cart_arg_get_Vector_array(len), cart_arg_get_i32(), cart_arg_get_Color()); break;
    case OP_DRAW_POLYLINE_ON_IMAGE: null0_draw_polyline_on_image(cart_arg_get_Image(), cart_arg_get_Vector_array(len), cart_arg_get_i32(), cart_arg_get_Color()); break;
    case OP_DRAW_RECTANGLE_ROUNDED_ON_IMAGE: null0_draw_rectangle_rounded_on_image(cart_arg_get_Image(), cart_arg_get_i32(), cart_arg_get_i32(), cart_arg_get_i32(), cart_arg_get_i32(), cart_arg_get_i32(), cart_arg_get_Color()); break;
    case OP_DRAW_IMAGE_ON_IMAGE: null0_draw_image_on_image(cart_arg_get_Image(), cart_arg_get_Image(), cart_arg_get_i32(), cart_arg_get_i32()); break;
    case OP_DRAW_IMAGE_TINT_ON_IMAGE: null0_draw_image_tint_on_image(cart_arg_get_Image(), cart_arg_get_Image(), cart_arg_get_i32(), cart_arg_get_i32(), cart_arg_get_Color()); break;
    case OP_DRAW_IMAGE_ROTATED_ON_IMAGE: null0_draw_image_rotated_on_image(cart_arg_get_Image(), cart_arg_get_Image(), cart_arg_get_i32(), cart_arg_get_i32(), cart_arg_get_f32(), cart_arg_get_f32(), cart_arg_get_f32(), cart_arg_get_ImageFilter()); break;
    case OP_DRAW_IMAGE_FLIPPED_ON_IMAGE: null0_draw_image_flipped_on_image(cart_arg_get_Image(), cart_arg_get_Image(), cart_arg_get_i32(), cart_arg_get_i32(), cart_arg_get_bool(), cart_arg_get_bool(), cart_arg_get_bool()); break;
    case OP_DRAW_IMAGE_SCALED_ON_IMAGE: null0_draw_image_scaled_on_image(cart_arg_get_Image(), cart_arg_get_Image(), cart_arg_get_i32(), cart_arg_get_i32(), cart_arg_get_f32(), cart_arg_get_f32(), cart_arg_get_f32(), cart_arg_get_f32(), cart_arg_get_ImageFilter()); break;
    case OP_DRAW_TEXT_ON_IMAGE: null0_draw_text_on_image(cart_arg_get_Image(), cart_arg_get_Font(), cart_arg_get_string(), cart_arg_get_i32(), cart_arg_get_i32(), cart_arg_get_Color()); break;
    case OP_DRAW_RECTANGLE_OUTLINE: null0_draw_rectangle_outline(cart_arg_get_i32(), cart_arg_get_i32(), cart_arg_get_i32(), cart_arg_get_i32(), cart_arg_get_Color()); break;
    case OP_DRAW_TRIANGLE_OUTLINE: null0_draw_triangle_outline(cart_arg_get_i32(), cart_arg_get_i32(), cart_arg_get_i32(), cart_arg_get_i32(), cart_arg_get_i32(), cart_arg_get_i32(), cart_arg_get_Color()); break;
    case OP_DRAW_ELLIPSE_OUTLINE: null0_draw_ellipse_outline(cart_arg_get_i32(), cart_arg_get_i32(), cart_arg_get_i32(), cart_arg_get_i32(), cart_arg_get_Color()); break;
    case OP_DRAW_CIRCLE_OUTLINE: null0_draw_circle_outline(cart_arg_get_i32(), cart_arg_get_i32(), cart_arg_get_i32(), cart_arg_get_Color()); break;
    case OP_DRAW_POLYGON_OUTLINE: null0_draw_polygon_outline(cart_arg_get_Vector_array(len), cart_arg_get_i32(), cart_arg_get_Color()); break;
    case OP_DRAW_ARC_OUTLINE: null0_draw_arc_outline(cart_arg_get_i32(), cart_arg_get_i32(), cart_arg_get_f32(), cart_arg_get_f32(), cart_arg_get_f32(), cart_arg_get_i32(), cart_arg_get_Color()); break;
    case OP_DRAW_RECTANGLE_ROUNDED_OUTLINE: null0_draw_rectangle_rounded_outline(cart_arg_get_i32(), cart_arg_get_i32(), cart_arg_get_i32(), cart_arg_get_i32(), cart_arg_get_i32(), cart_arg_get_Color()); break;
    case OP_DRAW_RECTANGLE_OUTLINE_ON_IMAGE: null0_draw_rectangle_outline_on_image(cart_arg_get_Image(), cart_arg_get_i32(), cart_arg_get_i32(), cart_arg_get_i32(), cart_arg_get_i32(), cart_arg_get_Color()); break;
    case OP_DRAW_TRIANGLE_OUTLINE_ON_IMAGE: null0_draw_triangle_outline_on_image(cart_arg_get_Image(), cart_arg_get_i32(), cart_arg_get_i32(), cart_arg_get_i32(), cart_arg_get_i32(), cart_arg_get_i32(), cart_arg_get_i32(), cart_arg_get_Color()); break;
    case OP_DRAW_ELLIPSE_OUTLINE_ON_IMAGE: null0_draw_ellipse_outline_on_image(cart_arg_get_Image(), cart_arg_get_i32(), cart_arg_get_i32(), cart_arg_get_i32(), cart_arg_get_i32(), cart_arg_get_Color()); break;
    case OP_DRAW_CIRCLE_OUTLINE_ON_IMAGE: null0_draw_circle_outline_on_image(cart_arg_get_Image(), cart_arg_get_i32(), cart_arg_get_i32(), cart_arg_get_i32(), cart_arg_get_Color()); break;
    case OP_DRAW_POLYGON_OUTLINE_ON_IMAGE: null0_draw_polygon_outline_on_image(cart_arg_get_Image(), cart_arg_get_Vector_array(len), cart_arg_get_i32(), cart_arg_get_Color()); break;
    case OP_DRAW_RECTANGLE_ROUNDED_OUTLINE_ON_IMAGE: null0_draw_rectangle_rounded_outline_on_image(cart_arg_get_Image(), cart_arg_get_i32(), cart_arg_get_i32(), cart_arg_get_i32(), cart_arg_get_i32(), cart_arg_get_i32(), cart_arg_get_Color()); break;
    case OP_FILE_READ:  cart_ret_set_bytes(null0_file_read(cart_arg_get_string(), cart_arg_get_u32_pointer()), len); break;
    case OP_FILE_WRITE:  cart_ret_set_bool(null0_file_write(cart_arg_get_string(), cart_arg_get_bytes(len), cart_arg_get_u32())); break;
    case OP_FILE_APPEND:  cart_ret_set_bool(null0_file_append(cart_arg_get_string(), cart_arg_get_bytes(len), cart_arg_get_u32())); break;
    case OP_FILE_INFO:  cart_ret_set_FileInfo(null0_file_info(cart_arg_get_string())); break;
    case OP_FILE_LIST:  cart_ret_set_string_array(null0_file_list(cart_arg_get_string()), len); break;
    case OP_GET_WRITE_DIR:  cart_ret_set_string(null0_get_write_dir()); break;
    case OP_COLOR_TINT:  cart_ret_set_Color(null0_color_tint(cart_arg_get_Color(), cart_arg_get_Color())); break;
    case OP_COLOR_FADE:  cart_ret_set_Color(null0_color_fade(cart_arg_get_Color(), cart_arg_get_f32())); break;
    case OP_COLOR_BRIGHTNESS:  cart_ret_set_Color(null0_color_brightness(cart_arg_get_Color(), cart_arg_get_f32())); break;
    case OP_COLOR_INVERT:  cart_ret_set_Color(null0_color_invert(cart_arg_get_Color())); break;
    case OP_COLOR_ALPHA_BLEND:  cart_ret_set_Color(null0_color_alpha_blend(cart_arg_get_Color(), cart_arg_get_Color())); break;
    case OP_COLOR_CONTRAST:  cart_ret_set_Color(null0_color_contrast(cart_arg_get_Color(), cart_arg_get_f32())); break;
    case OP_COLOR_BILINEAR_INTERPOLATE:  cart_ret_set_Color(null0_color_bilinear_interpolate(cart_arg_get_Color(), cart_arg_get_Color(), cart_arg_get_Color(), cart_arg_get_Color(), cart_arg_get_f32(), cart_arg_get_f32())); break;
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

