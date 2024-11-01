#!/bin/bash

# This will build a null0 cart 

LOC_CART="$(realpath .)/$1"
LOC_WASM=$(realpath "${2}")
LOC_ASSETS=${@:3}
LOC_OUT="$(mktemp -d)"

echo "LOC_CART: ${LOC_CART}"
echo "LOC_WASM: ${LOC_WASM}"
echo "LOC_ASSETS: ${LOC_ASSETS}"

cp "${LOC_WASM}" "${LOC_OUT}/main.wasm"
cp -r ${LOC_ASSETS} "${LOC_OUT}"
cd "${LOC_OUT}"
zip -r "${LOC_CART}" .

rm -r "${LOC_OUT}"