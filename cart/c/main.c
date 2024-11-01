#include "null0.h"

unsigned int logo;

int main(int argc, char *argv[]) {
  printf("Hi from C!\n");
  logo = load_image("/mnt/cart/logo.png");
}

NULL0_EXPORT("update")
void update() {
  clear(RAYWHITE);
  draw_image(logo, 0, 0);
}