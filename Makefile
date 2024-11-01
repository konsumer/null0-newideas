# this records all the tasks you can do

.PHONY: help clean run

help: ## Get help with available make commands
	@echo "Run 'make' then one of these target-names, like 'make help':"
	@echo ""
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'
	@echo ""

docs/host.mjs: host/*
	cd host && make ../docs/host.mjs

docs/cartc.null0: cartc/**/* assets/**/*
	cd cart/c && make && cd ../.. && ./cart/buildcart.sh docs/cartc.null0 cart/c/build/cart.wasm cart/assets/*

docs/cartas.null0: cartas/**/* assets/**/*
	cd cart/as && npm ci && npm run asbuild:release && cd ../.. && ./cart/buildcart.sh docs/cartas.null0 cart/as/build/release.wasm cart/assets/*

cart-as: docs/cartas.null0 ## Build a cart made with AssemblyScript

cart-c: docs/cartc.null0 ## Build a cart made with C

carts: cart-as cart-c ## Build both carts

clean: ## Delete any built files
	rm -f null0 docs/*.mjs docs/*.wasm docs/*.null0 host/build cartc/build cartas/build

native: host/**/* ## Build native null0 runtime
	cd host && make ../null0

run: web ## Run the web host locally
	npx -y live-server docs

web: docs/host.mjs carts ## Build the webhost



