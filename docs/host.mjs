
var Module = (() => {
  var _scriptName = import.meta.url;
  
  return (
async function(moduleArg = {}) {
  var moduleRtn;

// include: shell.js
// The Module object: Our interface to the outside world. We import
// and export values on it. There are various ways Module can be used:
// 1. Not defined. We create it here
// 2. A function parameter, function(moduleArg) => Promise<Module>
// 3. pre-run appended it, var Module = {}; ..generated code..
// 4. External script tag defines var Module.
// We need to check if Module already exists (e.g. case 3 above).
// Substitution will be replaced with actual code on later stage of the build,
// this way Closure Compiler will not mangle it (e.g. case 4. above).
// Note that if you want to run closure, and also to use Module
// after the generated code, you will need to define   var Module = {};
// before the code. Then that object will be used in the code, and you
// can continue to use Module afterwards as well.
var Module = moduleArg;

// Set up the promise that indicates the Module is initialized
var readyPromiseResolve, readyPromiseReject;
var readyPromise = new Promise((resolve, reject) => {
  readyPromiseResolve = resolve;
  readyPromiseReject = reject;
});
["_null0_call","_null0_get_shared","_memory","__sargs_add_kvp","___indirect_function_table","_pntr_app_emscripten_file_dropped","_pntr_app_emscripten_load_memory","_pntr_app_emscripten_unload_memory","_cartfs_exists","_cartfs_size","_cartfs_load_file","_cartfs_save_file","___em_lib_deps_sokol_audio","_sargs_js_parse_url","_emscripten_clipboard__register","_emscripten_clipboard__write_text","_pntr_load_sound_from_memory","_pntr_play_sound","_pntr_stop_sound","_pntr_unload_sound","_pntr_app_platform_set_size","_pntr_app_platform_get_width","_pntr_app_platform_get_height","_pntr_app_platform_render_js","_pntr_app_emscripten_init_filedropped","_pntr_app_emscripten_get_time","__cart_load","__cart_update","__cart_unload","_main","onRuntimeInitialized"].forEach((prop) => {
  if (!Object.getOwnPropertyDescriptor(readyPromise, prop)) {
    Object.defineProperty(readyPromise, prop, {
      get: () => abort('You are getting ' + prop + ' on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js'),
      set: () => abort('You are setting ' + prop + ' on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js'),
    });
  }
});

// Determine the runtime environment we are in. You can customize this by
// setting the ENVIRONMENT setting at compile time (see settings.js).

// Attempt to auto-detect the environment
var ENVIRONMENT_IS_WEB = typeof window == 'object';
var ENVIRONMENT_IS_WORKER = typeof importScripts == 'function';
// N.b. Electron.js environment is simultaneously a NODE-environment, but
// also a web environment.
var ENVIRONMENT_IS_NODE = typeof process == 'object' && typeof process.versions == 'object' && typeof process.versions.node == 'string' && process.type != 'renderer';
var ENVIRONMENT_IS_SHELL = !ENVIRONMENT_IS_WEB && !ENVIRONMENT_IS_NODE && !ENVIRONMENT_IS_WORKER;

if (ENVIRONMENT_IS_NODE) {
  // `require()` is no-op in an ESM module, use `createRequire()` to construct
  // the require()` function.  This is only necessary for multi-environment
  // builds, `-sENVIRONMENT=node` emits a static import declaration instead.
  // TODO: Swap all `require()`'s with `import()`'s?
  const { createRequire } = await import('module');
  let dirname = import.meta.url;
  if (dirname.startsWith("data:")) {
    dirname = '/';
  }
  /** @suppress{duplicate} */
  var require = createRequire(dirname);

}

// --pre-jses are emitted after the Module integration code, so that they can
// refer to Module (if they choose; they can also define Module)


// Sometimes an existing Module object exists with properties
// meant to overwrite the default module functionality. Here
// we collect those properties and reapply _after_ we configure
// the current environment's defaults to avoid having to be so
// defensive during initialization.
var moduleOverrides = Object.assign({}, Module);

var arguments_ = [];
var thisProgram = './this.program';
var quit_ = (status, toThrow) => {
  throw toThrow;
};

// `/` should be present at the end if `scriptDirectory` is not empty
var scriptDirectory = '';
function locateFile(path) {
  if (Module['locateFile']) {
    return Module['locateFile'](path, scriptDirectory);
  }
  return scriptDirectory + path;
}

// Hooks that are implemented differently in different runtime environments.
var readAsync, readBinary;

if (ENVIRONMENT_IS_NODE) {
  if (typeof process == 'undefined' || !process.release || process.release.name !== 'node') throw new Error('not compiled for this environment (did you build to HTML and try to run it not on the web, or set ENVIRONMENT to something - like node - and run it someplace else - like on the web?)');

  var nodeVersion = process.versions.node;
  var numericVersion = nodeVersion.split('.').slice(0, 3);
  numericVersion = (numericVersion[0] * 10000) + (numericVersion[1] * 100) + (numericVersion[2].split('-')[0] * 1);
  var minVersion = 160000;
  if (numericVersion < 160000) {
    throw new Error('This emscripten-generated code requires node v16.0.0 (detected v' + nodeVersion + ')');
  }

  // These modules will usually be used on Node.js. Load them eagerly to avoid
  // the complexity of lazy-loading.
  var fs = require('fs');
  var nodePath = require('path');

  // EXPORT_ES6 + ENVIRONMENT_IS_NODE always requires use of import.meta.url,
  // since there's no way getting the current absolute path of the module when
  // support for that is not available.
  if (!import.meta.url.startsWith('data:')) {
    scriptDirectory = nodePath.dirname(require('url').fileURLToPath(import.meta.url)) + '/';
  }

// include: node_shell_read.js
readBinary = (filename) => {
  // We need to re-wrap `file://` strings to URLs. Normalizing isn't
  // necessary in that case, the path should already be absolute.
  filename = isFileURI(filename) ? new URL(filename) : nodePath.normalize(filename);
  var ret = fs.readFileSync(filename);
  assert(ret.buffer);
  return ret;
};

readAsync = (filename, binary = true) => {
  // See the comment in the `readBinary` function.
  filename = isFileURI(filename) ? new URL(filename) : nodePath.normalize(filename);
  return new Promise((resolve, reject) => {
    fs.readFile(filename, binary ? undefined : 'utf8', (err, data) => {
      if (err) reject(err);
      else resolve(binary ? data.buffer : data);
    });
  });
};
// end include: node_shell_read.js
  if (!Module['thisProgram'] && process.argv.length > 1) {
    thisProgram = process.argv[1].replace(/\\/g, '/');
  }

  arguments_ = process.argv.slice(2);

  // MODULARIZE will export the module in the proper place outside, we don't need to export here

  quit_ = (status, toThrow) => {
    process.exitCode = status;
    throw toThrow;
  };

} else
if (ENVIRONMENT_IS_SHELL) {

  if ((typeof process == 'object' && typeof require === 'function') || typeof window == 'object' || typeof importScripts == 'function') throw new Error('not compiled for this environment (did you build to HTML and try to run it not on the web, or set ENVIRONMENT to something - like node - and run it someplace else - like on the web?)');

} else

// Note that this includes Node.js workers when relevant (pthreads is enabled).
// Node.js workers are detected as a combination of ENVIRONMENT_IS_WORKER and
// ENVIRONMENT_IS_NODE.
if (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER) {
  if (ENVIRONMENT_IS_WORKER) { // Check worker, not web, since window could be polyfilled
    scriptDirectory = self.location.href;
  } else if (typeof document != 'undefined' && document.currentScript) { // web
    scriptDirectory = document.currentScript.src;
  }
  // When MODULARIZE, this JS may be executed later, after document.currentScript
  // is gone, so we saved it, and we use it here instead of any other info.
  if (_scriptName) {
    scriptDirectory = _scriptName;
  }
  // blob urls look like blob:http://site.com/etc/etc and we cannot infer anything from them.
  // otherwise, slice off the final part of the url to find the script directory.
  // if scriptDirectory does not contain a slash, lastIndexOf will return -1,
  // and scriptDirectory will correctly be replaced with an empty string.
  // If scriptDirectory contains a query (starting with ?) or a fragment (starting with #),
  // they are removed because they could contain a slash.
  if (scriptDirectory.startsWith('blob:')) {
    scriptDirectory = '';
  } else {
    scriptDirectory = scriptDirectory.substr(0, scriptDirectory.replace(/[?#].*/, '').lastIndexOf('/')+1);
  }

  if (!(typeof window == 'object' || typeof importScripts == 'function')) throw new Error('not compiled for this environment (did you build to HTML and try to run it not on the web, or set ENVIRONMENT to something - like node - and run it someplace else - like on the web?)');

  {
// include: web_or_worker_shell_read.js
if (ENVIRONMENT_IS_WORKER) {
    readBinary = (url) => {
      var xhr = new XMLHttpRequest();
      xhr.open('GET', url, false);
      xhr.responseType = 'arraybuffer';
      xhr.send(null);
      return new Uint8Array(/** @type{!ArrayBuffer} */(xhr.response));
    };
  }

  readAsync = (url) => {
    // Fetch has some additional restrictions over XHR, like it can't be used on a file:// url.
    // See https://github.com/github/fetch/pull/92#issuecomment-140665932
    // Cordova or Electron apps are typically loaded from a file:// url.
    // So use XHR on webview if URL is a file URL.
    if (isFileURI(url)) {
      return new Promise((resolve, reject) => {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.responseType = 'arraybuffer';
        xhr.onload = () => {
          if (xhr.status == 200 || (xhr.status == 0 && xhr.response)) { // file URLs can return 0
            resolve(xhr.response);
            return;
          }
          reject(xhr.status);
        };
        xhr.onerror = reject;
        xhr.send(null);
      });
    }
    return fetch(url, { credentials: 'same-origin' })
      .then((response) => {
        if (response.ok) {
          return response.arrayBuffer();
        }
        return Promise.reject(new Error(response.status + ' : ' + response.url));
      })
  };
// end include: web_or_worker_shell_read.js
  }
} else
{
  throw new Error('environment detection error');
}

var out = Module['print'] || console.log.bind(console);
var err = Module['printErr'] || console.error.bind(console);

// Merge back in the overrides
Object.assign(Module, moduleOverrides);
// Free the object hierarchy contained in the overrides, this lets the GC
// reclaim data used.
moduleOverrides = null;
checkIncomingModuleAPI();

// Emit code to handle expected values on the Module object. This applies Module.x
// to the proper local x. This has two benefits: first, we only emit it if it is
// expected to arrive, and second, by using a local everywhere else that can be
// minified.

if (Module['arguments']) arguments_ = Module['arguments'];legacyModuleProp('arguments', 'arguments_');

if (Module['thisProgram']) thisProgram = Module['thisProgram'];legacyModuleProp('thisProgram', 'thisProgram');

// perform assertions in shell.js after we set up out() and err(), as otherwise if an assertion fails it cannot print the message
// Assertions on removed incoming Module JS APIs.
assert(typeof Module['memoryInitializerPrefixURL'] == 'undefined', 'Module.memoryInitializerPrefixURL option was removed, use Module.locateFile instead');
assert(typeof Module['pthreadMainPrefixURL'] == 'undefined', 'Module.pthreadMainPrefixURL option was removed, use Module.locateFile instead');
assert(typeof Module['cdInitializerPrefixURL'] == 'undefined', 'Module.cdInitializerPrefixURL option was removed, use Module.locateFile instead');
assert(typeof Module['filePackagePrefixURL'] == 'undefined', 'Module.filePackagePrefixURL option was removed, use Module.locateFile instead');
assert(typeof Module['read'] == 'undefined', 'Module.read option was removed');
assert(typeof Module['readAsync'] == 'undefined', 'Module.readAsync option was removed (modify readAsync in JS)');
assert(typeof Module['readBinary'] == 'undefined', 'Module.readBinary option was removed (modify readBinary in JS)');
assert(typeof Module['setWindowTitle'] == 'undefined', 'Module.setWindowTitle option was removed (modify emscripten_set_window_title in JS)');
assert(typeof Module['TOTAL_MEMORY'] == 'undefined', 'Module.TOTAL_MEMORY has been renamed Module.INITIAL_MEMORY');
legacyModuleProp('asm', 'wasmExports');
legacyModuleProp('readAsync', 'readAsync');
legacyModuleProp('readBinary', 'readBinary');
legacyModuleProp('setWindowTitle', 'setWindowTitle');
var IDBFS = 'IDBFS is no longer included by default; build with -lidbfs.js';
var PROXYFS = 'PROXYFS is no longer included by default; build with -lproxyfs.js';
var WORKERFS = 'WORKERFS is no longer included by default; build with -lworkerfs.js';
var FETCHFS = 'FETCHFS is no longer included by default; build with -lfetchfs.js';
var ICASEFS = 'ICASEFS is no longer included by default; build with -licasefs.js';
var JSFILEFS = 'JSFILEFS is no longer included by default; build with -ljsfilefs.js';
var OPFS = 'OPFS is no longer included by default; build with -lopfs.js';

var NODEFS = 'NODEFS is no longer included by default; build with -lnodefs.js';

assert(!ENVIRONMENT_IS_SHELL, 'shell environment detected but not enabled at build time.  Add `shell` to `-sENVIRONMENT` to enable.');

// end include: shell.js

// include: preamble.js
// === Preamble library stuff ===

// Documentation for the public APIs defined in this file must be updated in:
//    site/source/docs/api_reference/preamble.js.rst
// A prebuilt local version of the documentation is available at:
//    site/build/text/docs/api_reference/preamble.js.txt
// You can also build docs locally as HTML or other formats in site/
// An online HTML version (which may be of a different version of Emscripten)
//    is up at http://kripken.github.io/emscripten-site/docs/api_reference/preamble.js.html

var wasmBinary = Module['wasmBinary'];legacyModuleProp('wasmBinary', 'wasmBinary');

if (typeof WebAssembly != 'object') {
  err('no native wasm support detected');
}

// include: base64Utils.js
// Converts a string of base64 into a byte array (Uint8Array).
function intArrayFromBase64(s) {
  if (typeof ENVIRONMENT_IS_NODE != 'undefined' && ENVIRONMENT_IS_NODE) {
    var buf = Buffer.from(s, 'base64');
    return new Uint8Array(buf.buffer, buf.byteOffset, buf.length);
  }

  var decoded = atob(s);
  var bytes = new Uint8Array(decoded.length);
  for (var i = 0 ; i < decoded.length ; ++i) {
    bytes[i] = decoded.charCodeAt(i);
  }
  return bytes;
}

// If filename is a base64 data URI, parses and returns data (Buffer on node,
// Uint8Array otherwise). If filename is not a base64 data URI, returns undefined.
function tryParseAsDataURI(filename) {
  if (!isDataURI(filename)) {
    return;
  }

  return intArrayFromBase64(filename.slice(dataURIPrefix.length));
}
// end include: base64Utils.js
// Wasm globals

var wasmMemory;

//========================================
// Runtime essentials
//========================================

// whether we are quitting the application. no code should run after this.
// set in exit() and abort()
var ABORT = false;

// set by exit() and abort().  Passed to 'onExit' handler.
// NOTE: This is also used as the process return code code in shell environments
// but only when noExitRuntime is false.
var EXITSTATUS;

// In STRICT mode, we only define assert() when ASSERTIONS is set.  i.e. we
// don't define it at all in release modes.  This matches the behaviour of
// MINIMAL_RUNTIME.
// TODO(sbc): Make this the default even without STRICT enabled.
/** @type {function(*, string=)} */
function assert(condition, text) {
  if (!condition) {
    abort('Assertion failed' + (text ? ': ' + text : ''));
  }
}

// We used to include malloc/free by default in the past. Show a helpful error in
// builds with assertions.

// Memory management

var HEAP,
/** @type {!Int8Array} */
  HEAP8,
/** @type {!Uint8Array} */
  HEAPU8,
/** @type {!Int16Array} */
  HEAP16,
/** @type {!Uint16Array} */
  HEAPU16,
/** @type {!Int32Array} */
  HEAP32,
/** @type {!Uint32Array} */
  HEAPU32,
/** @type {!Float32Array} */
  HEAPF32,
/** @type {!Float64Array} */
  HEAPF64;

// include: runtime_shared.js
function updateMemoryViews() {
  var b = wasmMemory.buffer;
  Module['HEAP8'] = HEAP8 = new Int8Array(b);
  Module['HEAP16'] = HEAP16 = new Int16Array(b);
  Module['HEAPU8'] = HEAPU8 = new Uint8Array(b);
  Module['HEAPU16'] = HEAPU16 = new Uint16Array(b);
  Module['HEAP32'] = HEAP32 = new Int32Array(b);
  Module['HEAPU32'] = HEAPU32 = new Uint32Array(b);
  Module['HEAPF32'] = HEAPF32 = new Float32Array(b);
  Module['HEAPF64'] = HEAPF64 = new Float64Array(b);
}

// end include: runtime_shared.js
assert(!Module['STACK_SIZE'], 'STACK_SIZE can no longer be set at runtime.  Use -sSTACK_SIZE at link time')

assert(typeof Int32Array != 'undefined' && typeof Float64Array !== 'undefined' && Int32Array.prototype.subarray != undefined && Int32Array.prototype.set != undefined,
       'JS engine does not provide full typed array support');

// If memory is defined in wasm, the user can't provide it, or set INITIAL_MEMORY
assert(!Module['wasmMemory'], 'Use of `wasmMemory` detected.  Use -sIMPORTED_MEMORY to define wasmMemory externally');
assert(!Module['INITIAL_MEMORY'], 'Detected runtime INITIAL_MEMORY setting.  Use -sIMPORTED_MEMORY to define wasmMemory dynamically');

// include: runtime_stack_check.js
// Initializes the stack cookie. Called at the startup of main and at the startup of each thread in pthreads mode.
function writeStackCookie() {
  var max = _emscripten_stack_get_end();
  assert((max & 3) == 0);
  // If the stack ends at address zero we write our cookies 4 bytes into the
  // stack.  This prevents interference with SAFE_HEAP and ASAN which also
  // monitor writes to address zero.
  if (max == 0) {
    max += 4;
  }
  // The stack grow downwards towards _emscripten_stack_get_end.
  // We write cookies to the final two words in the stack and detect if they are
  // ever overwritten.
  HEAPU32[((max)>>2)] = 0x02135467;
  HEAPU32[(((max)+(4))>>2)] = 0x89BACDFE;
  // Also test the global address 0 for integrity.
  HEAPU32[((0)>>2)] = 1668509029;
}

function checkStackCookie() {
  if (ABORT) return;
  var max = _emscripten_stack_get_end();
  // See writeStackCookie().
  if (max == 0) {
    max += 4;
  }
  var cookie1 = HEAPU32[((max)>>2)];
  var cookie2 = HEAPU32[(((max)+(4))>>2)];
  if (cookie1 != 0x02135467 || cookie2 != 0x89BACDFE) {
    abort(`Stack overflow! Stack cookie has been overwritten at ${ptrToString(max)}, expected hex dwords 0x89BACDFE and 0x2135467, but received ${ptrToString(cookie2)} ${ptrToString(cookie1)}`);
  }
  // Also test the global address 0 for integrity.
  if (HEAPU32[((0)>>2)] != 0x63736d65 /* 'emsc' */) {
    abort('Runtime error: The application has corrupted its heap memory area (address zero)!');
  }
}
// end include: runtime_stack_check.js
var __ATPRERUN__  = []; // functions called before the runtime is initialized
var __ATINIT__    = []; // functions called during startup
var __ATMAIN__    = []; // functions called when main() is to be run
var __ATEXIT__    = []; // functions called during shutdown
var __ATPOSTRUN__ = []; // functions called after the main() is called

var runtimeInitialized = false;

function preRun() {
  var preRuns = Module['preRun'];
  if (preRuns) {
    if (typeof preRuns == 'function') preRuns = [preRuns];
    preRuns.forEach(addOnPreRun);
  }
  callRuntimeCallbacks(__ATPRERUN__);
}

function initRuntime() {
  assert(!runtimeInitialized);
  runtimeInitialized = true;

  checkStackCookie();

  
  callRuntimeCallbacks(__ATINIT__);
}

function preMain() {
  checkStackCookie();
  
  callRuntimeCallbacks(__ATMAIN__);
}

function postRun() {
  checkStackCookie();

  var postRuns = Module['postRun'];
  if (postRuns) {
    if (typeof postRuns == 'function') postRuns = [postRuns];
    postRuns.forEach(addOnPostRun);
  }

  callRuntimeCallbacks(__ATPOSTRUN__);
}

function addOnPreRun(cb) {
  __ATPRERUN__.unshift(cb);
}

function addOnInit(cb) {
  __ATINIT__.unshift(cb);
}

function addOnPreMain(cb) {
  __ATMAIN__.unshift(cb);
}

function addOnExit(cb) {
}

function addOnPostRun(cb) {
  __ATPOSTRUN__.unshift(cb);
}

// include: runtime_math.js
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/imul

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/fround

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/clz32

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/trunc

assert(Math.imul, 'This browser does not support Math.imul(), build with LEGACY_VM_SUPPORT or POLYFILL_OLD_MATH_FUNCTIONS to add in a polyfill');
assert(Math.fround, 'This browser does not support Math.fround(), build with LEGACY_VM_SUPPORT or POLYFILL_OLD_MATH_FUNCTIONS to add in a polyfill');
assert(Math.clz32, 'This browser does not support Math.clz32(), build with LEGACY_VM_SUPPORT or POLYFILL_OLD_MATH_FUNCTIONS to add in a polyfill');
assert(Math.trunc, 'This browser does not support Math.trunc(), build with LEGACY_VM_SUPPORT or POLYFILL_OLD_MATH_FUNCTIONS to add in a polyfill');
// end include: runtime_math.js
// A counter of dependencies for calling run(). If we need to
// do asynchronous work before running, increment this and
// decrement it. Incrementing must happen in a place like
// Module.preRun (used by emcc to add file preloading).
// Note that you can add dependencies in preRun, even though
// it happens right before run - run will be postponed until
// the dependencies are met.
var runDependencies = 0;
var runDependencyWatcher = null;
var dependenciesFulfilled = null; // overridden to take different actions when all run dependencies are fulfilled
var runDependencyTracking = {};

function getUniqueRunDependency(id) {
  var orig = id;
  while (1) {
    if (!runDependencyTracking[id]) return id;
    id = orig + Math.random();
  }
}

function addRunDependency(id) {
  runDependencies++;

  Module['monitorRunDependencies']?.(runDependencies);

  if (id) {
    assert(!runDependencyTracking[id]);
    runDependencyTracking[id] = 1;
    if (runDependencyWatcher === null && typeof setInterval != 'undefined') {
      // Check for missing dependencies every few seconds
      runDependencyWatcher = setInterval(() => {
        if (ABORT) {
          clearInterval(runDependencyWatcher);
          runDependencyWatcher = null;
          return;
        }
        var shown = false;
        for (var dep in runDependencyTracking) {
          if (!shown) {
            shown = true;
            err('still waiting on run dependencies:');
          }
          err(`dependency: ${dep}`);
        }
        if (shown) {
          err('(end of list)');
        }
      }, 10000);
    }
  } else {
    err('warning: run dependency added without ID');
  }
}

function removeRunDependency(id) {
  runDependencies--;

  Module['monitorRunDependencies']?.(runDependencies);

  if (id) {
    assert(runDependencyTracking[id]);
    delete runDependencyTracking[id];
  } else {
    err('warning: run dependency removed without ID');
  }
  if (runDependencies == 0) {
    if (runDependencyWatcher !== null) {
      clearInterval(runDependencyWatcher);
      runDependencyWatcher = null;
    }
    if (dependenciesFulfilled) {
      var callback = dependenciesFulfilled;
      dependenciesFulfilled = null;
      callback(); // can add another dependenciesFulfilled
    }
  }
}

/** @param {string|number=} what */
function abort(what) {
  Module['onAbort']?.(what);

  what = 'Aborted(' + what + ')';
  // TODO(sbc): Should we remove printing and leave it up to whoever
  // catches the exception?
  err(what);

  ABORT = true;

  if (what.indexOf('RuntimeError: unreachable') >= 0) {
    what += '. "unreachable" may be due to ASYNCIFY_STACK_SIZE not being large enough (try increasing it)';
  }

  // Use a wasm runtime error, because a JS error might be seen as a foreign
  // exception, which means we'd run destructors on it. We need the error to
  // simply make the program stop.
  // FIXME This approach does not work in Wasm EH because it currently does not assume
  // all RuntimeErrors are from traps; it decides whether a RuntimeError is from
  // a trap or not based on a hidden field within the object. So at the moment
  // we don't have a way of throwing a wasm trap from JS. TODO Make a JS API that
  // allows this in the wasm spec.

  // Suppress closure compiler warning here. Closure compiler's builtin extern
  // definition for WebAssembly.RuntimeError claims it takes no arguments even
  // though it can.
  // TODO(https://github.com/google/closure-compiler/pull/3913): Remove if/when upstream closure gets fixed.
  /** @suppress {checkTypes} */
  var e = new WebAssembly.RuntimeError(what);

  readyPromiseReject(e);
  // Throw the error whether or not MODULARIZE is set because abort is used
  // in code paths apart from instantiation where an exception is expected
  // to be thrown when abort is called.
  throw e;
}

// include: memoryprofiler.js
// end include: memoryprofiler.js
// show errors on likely calls to FS when it was not included
var FS = {
  error() {
    abort('Filesystem support (FS) was not included. The problem is that you are using files from JS, but files were not used from C/C++, so filesystem support was not auto-included. You can force-include filesystem support with -sFORCE_FILESYSTEM');
  },
  init() { FS.error() },
  createDataFile() { FS.error() },
  createPreloadedFile() { FS.error() },
  createLazyFile() { FS.error() },
  open() { FS.error() },
  mkdev() { FS.error() },
  registerDevice() { FS.error() },
  analyzePath() { FS.error() },

  ErrnoError() { FS.error() },
};
Module['FS_createDataFile'] = FS.createDataFile;
Module['FS_createPreloadedFile'] = FS.createPreloadedFile;

// include: URIUtils.js
// Prefix of data URIs emitted by SINGLE_FILE and related options.
var dataURIPrefix = 'data:application/octet-stream;base64,';

/**
 * Indicates whether filename is a base64 data URI.
 * @noinline
 */
var isDataURI = (filename) => filename.startsWith(dataURIPrefix);

/**
 * Indicates whether filename is delivered via file protocol (as opposed to http/https)
 * @noinline
 */
var isFileURI = (filename) => filename.startsWith('file://');
// end include: URIUtils.js
function createExportWrapper(name, nargs) {
  return (...args) => {
    assert(runtimeInitialized, `native function \`${name}\` called before runtime initialization`);
    var f = wasmExports[name];
    assert(f, `exported native function \`${name}\` not found`);
    // Only assert for too many arguments. Too few can be valid since the missing arguments will be zero filled.
    assert(args.length <= nargs, `native function \`${name}\` called with ${args.length} args but expects ${nargs}`);
    return f(...args);
  };
}

// include: runtime_exceptions.js
// end include: runtime_exceptions.js
function findWasmBinary() {
    var f = 'data:application/octet-stream;base64,AGFzbQEAAAABswEbYAF/AX9gAX8AYAABf2AAAGADf39/AX9gAn9/AX9gAn9/AGAFf39/f38Bf2AEf39/fwBgA39/fwBgA39+fwF+YAR/f39/AX9gBX9/f39/AGAGf3x/f39/AX9gAn9+AGACfn8Bf2AEf35+fwBgAAF9YAF/AX5gAnx/AXxgB39/f39/f38Bf2ADfn9/AX9gAXwBfmACfn4BfGAEf39+fwF+YAd/f3x/f39/AX9gBH9+f38BfwKzCCADZW52DWNhcnRmc19leGlzdHMAAgNlbnYQY2FydGZzX3NhdmVfZmlsZQAEA2Vudg1fX2Fzc2VydF9mYWlsAAgDZW52EnNhcmdzX2pzX3BhcnNlX3VybAADA2Vudh5lbXNjcmlwdGVuX2NsaXBib2FyZF9fcmVnaXN0ZXIACQNlbnYeZW1zY3JpcHRlbl9zYW1wbGVfZ2FtZXBhZF9kYXRhAAIDZW52G2Vtc2NyaXB0ZW5fZ2V0X251bV9nYW1lcGFkcwACA2Vudh1lbXNjcmlwdGVuX2dldF9nYW1lcGFkX3N0YXR1cwAFA2VudhtwbnRyX2FwcF9wbGF0Zm9ybV9yZW5kZXJfanMACANlbnYbcG50cl9hcHBfcGxhdGZvcm1fZ2V0X3dpZHRoAAADZW52HHBudHJfYXBwX3BsYXRmb3JtX2dldF9oZWlnaHQAAANlbnYacG50cl9hcHBfcGxhdGZvcm1fc2V0X3NpemUABANlbnYpZW1zY3JpcHRlbl9zZXRfa2V5ZG93bl9jYWxsYmFja19vbl90aHJlYWQABwNlbnYnZW1zY3JpcHRlbl9zZXRfa2V5dXBfY2FsbGJhY2tfb25fdGhyZWFkAAcDZW52K2Vtc2NyaXB0ZW5fc2V0X21vdXNlZG93bl9jYWxsYmFja19vbl90aHJlYWQABwNlbnYpZW1zY3JpcHRlbl9zZXRfbW91c2V1cF9jYWxsYmFja19vbl90aHJlYWQABwNlbnYrZW1zY3JpcHRlbl9zZXRfbW91c2Vtb3ZlX2NhbGxiYWNrX29uX3RocmVhZAAHA2VudidlbXNjcmlwdGVuX3NldF93aGVlbF9jYWxsYmFja19vbl90aHJlYWQABwNlbnYkcG50cl9hcHBfZW1zY3JpcHRlbl9pbml0X2ZpbGVkcm9wcGVkAAEDZW52HHBudHJfYXBwX2Vtc2NyaXB0ZW5fZ2V0X3RpbWUAAgNlbnYRZW1zY3JpcHRlbl9yYW5kb20AEQNlbnYbZW1zY3JpcHRlbl9zZXRfd2luZG93X3RpdGxlAAEDZW52G2Vtc2NyaXB0ZW5fY2FuY2VsX21haW5fbG9vcAADA2VudhxlbXNjcmlwdGVuX3NldF9tYWluX2xvb3BfYXJnAAgDZW52Cl9jYXJ0X2xvYWQAAwNlbnYMX2NhcnRfdXBkYXRlAAMDZW52DF9jYXJ0X3VubG9hZAADA2VudhVfZW1zY3JpcHRlbl9tZW1jcHlfanMACRZ3YXNpX3NuYXBzaG90X3ByZXZpZXcxCGZkX2Nsb3NlAAAWd2FzaV9zbmFwc2hvdF9wcmV2aWV3MQhmZF93cml0ZQALA2VudhZlbXNjcmlwdGVuX3Jlc2l6ZV9oZWFwAAAWd2FzaV9zbmFwc2hvdF9wcmV2aWV3MQdmZF9zZWVrAAcDuAG2AQMEBgEBBgAFAAMAAwECAAIAAAEACQYBAAAABAAEBAsEBgAAAAEBAAYODgEABQEEBgwMBgEICAQLAhIBAQUJBAEABQEFBgMDAwMDAQIBAQECAAMAAwIAAAMCAwIAAQMCAwMCAgMDBAQEBQAABAoKAAoABAABAQECAwAFAhMEBxQJAAgVDw8MBA0GFgACAgIDBAUCAAAEAQUFBhAQFwECAAEAAgMCAgIFAAsGBQQJGBkHGgEDAQMCBAUBcAEREQUGAQGiAqICBuoBH38BQYCAxAALfwFBAAt/AUEAC38BQQALfwBByKLEAAt/AEGOo8QAC38AQeejxAALfwBB/6TEAAt/AEHbxMQAC38AQeGmxAALfwBBtanEAAt/AEGGrcQAC38AQdOtxAALfwBBprHEAAt/AEHMtMQAC38AQcm1xAALfwBB5rbEAAt/AEH3uMQAC38AQaq5xAALfwBB3rnEAAt/AEGFu8QAC38AQcHBxAALfwBB6cHEAAt/AEHfw8QAC38AQZ3ExAALfwBByKLEAAt/AEHbxMQAC38AQdvExAALfwBB/8TEAAt/AUEAC38BQQALB7ELOgZtZW1vcnkCABFfX3dhc21fY2FsbF9jdG9ycwAgBm1hbGxvYwCzAQ5fc2FyZ3NfYWRkX2t2cAAiGV9faW5kaXJlY3RfZnVuY3Rpb25fdGFibGUBAARmcmVlALUBIHBudHJfYXBwX2Vtc2NyaXB0ZW5fZmlsZV9kcm9wcGVkAD4fcG50cl9hcHBfZW1zY3JpcHRlbl9sb2FkX21lbW9yeQBCIXBudHJfYXBwX2Vtc2NyaXB0ZW5fdW5sb2FkX21lbW9yeQBEEF9fbWFpbl9hcmdjX2FyZ3YAXApudWxsMF9jYWxsAGoQbnVsbDBfZ2V0X3NoYXJlZABrFl9fZW1fanNfX2NhcnRmc19leGlzdHMDBBRfX2VtX2pzX19jYXJ0ZnNfc2l6ZQMFGV9fZW1fanNfX2NhcnRmc19sb2FkX2ZpbGUDBhlfX2VtX2pzX19jYXJ0ZnNfc2F2ZV9maWxlAwcZX19lbV9saWJfZGVwc19zb2tvbF9hdWRpbwMIG19fZW1fanNfX3NhcmdzX2pzX3BhcnNlX3VybAMJJ19fZW1fanNfX2Vtc2NyaXB0ZW5fY2xpcGJvYXJkX19yZWdpc3RlcgMKKV9fZW1fanNfX2Vtc2NyaXB0ZW5fY2xpcGJvYXJkX193cml0ZV90ZXh0AwskX19lbV9qc19fcG50cl9sb2FkX3NvdW5kX2Zyb21fbWVtb3J5AwwYX19lbV9qc19fcG50cl9wbGF5X3NvdW5kAw0YX19lbV9qc19fcG50cl9zdG9wX3NvdW5kAw4aX19lbV9qc19fcG50cl91bmxvYWRfc291bmQDDyNfX2VtX2pzX19wbnRyX2FwcF9wbGF0Zm9ybV9zZXRfc2l6ZQMQJF9fZW1fanNfX3BudHJfYXBwX3BsYXRmb3JtX2dldF93aWR0aAMRJV9fZW1fanNfX3BudHJfYXBwX3BsYXRmb3JtX2dldF9oZWlnaHQDEiRfX2VtX2pzX19wbnRyX2FwcF9wbGF0Zm9ybV9yZW5kZXJfanMDEy1fX2VtX2pzX19wbnRyX2FwcF9lbXNjcmlwdGVuX2luaXRfZmlsZWRyb3BwZWQDFCVfX2VtX2pzX19wbnRyX2FwcF9lbXNjcmlwdGVuX2dldF90aW1lAxUTX19lbV9qc19fX2NhcnRfbG9hZAMWFV9fZW1fanNfX19jYXJ0X3VwZGF0ZQMXFV9fZW1fanNfX19jYXJ0X3VubG9hZAMYBmZmbHVzaAC+AQhzdHJlcnJvcgDHARVlbXNjcmlwdGVuX3N0YWNrX2luaXQAwgEZZW1zY3JpcHRl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AQsCfwJAAkAjHUECRgRAIx4jHigCAEF8ajYCACMeKAIAKAIAIYwBCwJAIx1BAEYEQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQCABIQQgBEF3aiEFIAUOEgABAgUDBAYHCAkKCwwNDg8QERMLIAIhBiACIQcgBygCACEIIAghASABIQkgCUEEaiEKIAYgCjYCACAAIQsgASEMIAwoAgAhDSALIA02AgAPCyACIQ4gAiEPIA8oAgAhECAQIQEgASERIBFBBGohEiAOIBI2AgAgACETIAEhFCAUNAIAIY8BIBMgjwE3AwAPCyACIRUgAiEWIBYoAgAhFyAXIQEgASEYIBhBBGohGSAVIBk2AgAgACEaIAEhGyAbNQIAIZABIBogkAE3AwAPCyACIRwgAiEdIB0oAgAhHiAeIQEgASEfIB9BBGohICAcICA2AgAgACEhIAEhIiAiNAIAIZEBICEgkQE3AwAPCyACISMgAiEkICQoAgAhJSAlIQEgASEmICZBBGohJyAjICc2AgAgACEoIAEhKSApNQIAIZIBICggkgE3AwAPCyACISogAiErICsoAgAhLCAsQQdqIS0gLUF4cSEuIC4hASABIS8gL0EIaiEwICogMDYCACAAITEgASEyIDIpAwAhkwEgMSCTATcDAA8LIAIhMyACITQgNCgCACE1IDUhASABITYgNkEEaiE3IDMgNzYCACAAITggASE5IDkyAQAhlAEgOCCUATcDAA8LIAIhOiACITsgOygCACE8IDwhASABIT0gPUEEaiE+IDogPjYCACAAIT8gASFAIEAzAQAhlQEgPyCVATcDAA8LIAIhQSACIUIgQigCACFDIEMhASABIUQgREEEaiFFIEEgRTYCACAAIUYgASFHIEcwAAAhlgEgRiCWATcDAA8LIAIhSCACIUkgSSgCACFKIEohASABIUsgS0EEaiFMIEggTDYCACAAIU0gASFOIE4xAAAhlwEgTSCXATcDAA8LIAIhTyACIVAgUCgCACFRIFFBB2ohUiBSQXhxIVMgUyEBIAEhVCBUQQhqIVUgTyBVNgIAIAAhViABIVcgVykDACGYASBWIJgBNwMADwsgAiFYIAIhWSBZKAIAIVogWiEBIAEhWyBbQQRqIVwgWCBcNgIAIAAhXSABIV4gXjUCACGZASBdIJkBNwMA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b3J5AFJlc291cmNlIGJ1c3kASW50ZXJydXB0ZWQgc3lzdGVtIGNhbGwAUmVzb3VyY2UgdGVtcG9yYXJpbHkgdW5hdmFpbGFibGUASW52YWxpZCBzZWVrAENyb3NzLWRldmljZSBsaW5rAFJlYWQtb25seSBmaWxlIHN5c3RlbQBEaXJlY3Rvcnkgbm90IGVtcHR5AENvbm5lY3Rpb24gcmVzZXQgYnkgcGVlcgBPcGVyYXRpb24gdGltZWQgb3V0AENvbm5lY3Rpb24gcmVmdXNlZABIb3N0IGlzIGRvd24ASG9zdCBpcyB1bnJlYWNoYWJsZQBBZGRyZXNzIGluIHVzZQBCcm9rZW4gcGlwZQBJL08gZXJyb3IATm8gc3VjaCBkZXZpY2Ugb3IgYWRkcmVzcwBCbG9jayBkZXZpY2UgcmVxdWlyZWQATm8gc3VjaCBkZXZpY2UATm90IGEgZGlyZWN0b3J5AElzIGEgZGlyZWN0b3J5AFRleHQgZmlsZSBidXN5AEV4ZWMgZm9ybWF0IGVycm9yAEludmFsaWQgYXJndW1lbnQAQXJndW1lbnQgbGlzdCB0b28gbG9uZwBTeW1ib2xpYyBsaW5rIGxvb3AARmlsZW5hbWUgdG9vIGxvbmcAVG9vIG1hbnkgb3BlbiBmaWxlcyBpbiBzeXN0ZW0ATm8gZmlsZSBkZXNjcmlwdG9ycyBhdmFpbGFibGUAQmFkIGZpbGUgZGVzY3JpcHRvcgBObyBjaGlsZCBwcm9jZXNzAEJhZCBhZGRyZXNzAEZpbGUgdG9vIGxhcmdlAFRvbyBtYW55IGxpbmtzAE5vIGxvY2tzIGF2YWlsYWJsZQBSZXNvdXJjZSBkZWFkbG9jayB3b3VsZCBvY2N1cgBTdGF0ZSBub3QgcmVjb3ZlcmFibGUAUHJldmlvdXMgb3duZXIgZGllZABPcGVyYXRpb24gY2FuY2VsZWQARnVuY3Rpb24gbm90IGltcGxlbWVudGVkAE5vIG1lc3NhZ2Ugb2YgZGVzaXJlZCB0eXBlAElkZW50aWZpZXIgcmVtb3ZlZABEZXZpY2Ugbm90IGEgc3RyZWFtAE5vIGRhdGEgYXZhaWxhYmxlAERldmljZSB0aW1lb3V0AE91dCBvZiBzdHJlYW1zIHJlc291cmNlcwBMaW5rIGhhcyBiZWVuIHNldmVyZWQAUHJvdG9jb2wgZXJyb3IAQmFkIG1lc3NhZ2UARmlsZSBkZXNjcmlwdG9yIGluIGJhZCBzdGF0ZQBOb3QgYSBzb2NrZXQARGVzdGluYXRpb24gYWRkcmVzcyByZXF1aXJlZABNZXNzYWdlIHRvbyBsYXJnZQBQcm90b2NvbCB3cm9uZyB0eXBlIGZvciBzb2NrZXQAUHJvdG9jb2wgbm90IGF2YWlsYWJsZQBQcm90b2NvbCBub3Qgc3VwcG9ydGVkAFNvY2tldCB0eXBlIG5vdCBzdXBwb3J0ZWQATm90IHN1cHBvcnRlZABQcm90b2NvbCBmYW1pbHkgbm90IHN1cHBvcnRlZABBZGRyZXNzIGZhbWlseSBub3Qgc3VwcG9ydGVkIGJ5IHByb3RvY29sAEFkZHJlc3Mgbm90IGF2YWlsYWJsZQBOZXR3b3JrIGlzIGRvd24ATmV0d29yayB1bnJlYWNoYWJsZQBDb25uZWN0aW9uIHJlc2V0IGJ5IG5ldHdvcmsAQ29ubmVjdGlvbiBhYm9ydGVkAE5vIGJ1ZmZlciBzcGFjZSBhdmFpbGFibGUAU29ja2V0IGlzIGNvbm5lY3RlZABTb2NrZXQgbm90IGNvbm5lY3RlZABDYW5ub3Qgc2VuZCBhZnRlciBzb2NrZXQgc2h1dGRvd24AT3BlcmF0aW9uIGFscmVhZHkgaW4gcHJvZ3Jlc3MAT3BlcmF0aW9uIGluIHByb2dyZXNzAFN0YWxlIGZpbGUgaGFuZGxlAFJlbW90ZSBJL08gZXJyb3IAUXVvdGEgZXhjZWVkZWQATm8gbWVkaXVtIGZvdW5kAFdyb25nIG1lZGl1bSB0eXBlAE11bHRpaG9wIGF0dGVtcHRlZABSZXF1aXJlZCBrZXkgbm90IGF2YWlsYWJsZQBLZXkgaGFzIGV4cGlyZWQAS2V5IGhhcyBiZWVuIHJldm9rZWQAS2V5IHdhcyByZWplY3RlZCBieSBzZXJ2aWNlAAAAAAAAAAAApQJbAPABtQWMBSUBgwYdA5QE/wDHAzEDCwa8AY8BfwPKBCsA2gavAEIDTgPcAQ4EFQChBg0BlAILAjgGZAK8Av8CXQPnBAsHzwLLBe8F2wXhAh4GRQKFAIICbANvBPEA8wMYBdkA2gNMBlQCewGdA70EAABRABUCuwCzA20A/wGFBC8F+QQ4AGUBRgGfALcGqAFzAlMBAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIQQAAAAAAAAAAC8CAAAAAAAAAAAAAAAAAAAAAAAAAAA1BEcEVgQAAAAAAAAAAAAAAAAAAAAAoAQAAAAAAAAAAAAAAAAAAAAAAABGBWAFbgVhBgAAzwEAAAAAAAAAAMkG6Qb5Bh4HOQdJB14HAEGYoMQAC7ACBQAAAAAAAAAAAAAACgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACwAAAAwAAADMIiEAAAAAAAAAAAAAAAAAAgAAAAAAAAAAAAAAAAAAAP//////////AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAGBARAAAAAAAFAAAAAAAAAAAAAAANAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAALAAAADgAAANgiIQAABAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAA/////woAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACwEBEAkCkhAABByKLEAAuTIigpPDo6PnsgcmV0dXJuIHR5cGVvZiBNb2R1bGUuY2FydGZzID09PSAndW5kZWZpbmVkJyA/IGZhbHNlIDogdHJ1ZTsgfQAoY29uc3QgY2hhciogZnB0cik8Ojo+eyByZXR1cm4gTW9kdWxlLmNhcnRmcy5zdGF0U3luYyhNb2R1bGUuVVRGOFRvU3RyaW5nKGZwdHIpKS5zaXplOyB9AChjb25zdCBjaGFyKiBmcHRyLCB1bnNpZ25lZCBjaGFyKiBvdXRwdHIpPDo6PnsgY29uc3QgYiA9IE1vZHVsZS5jYXJ0ZnMucmVhZEZpbGVTeW5jKE1vZHVsZS5VVEY4VG9TdHJpbmcoZnB0cikpOyBNb2R1bGUud3JpdGVBcnJheVRvTWVtb3J5KGIsIG91dHB0cik7IH0AKGNvbnN0IGNoYXIqIGZwdHIsIGNvbnN0IHZvaWQqIGRhdGFwdHIsIHVuc2lnbmVkIGludCBzaXplKTw6Oj57IHRyeXsgY29uc3QgYiA9IE1vZHVsZS5IRUFQVTguc2xpY2UoZGF0YXB0ciwgZGF0YXB0citzaXplKTsgTW9kdWxlLmNhcnRmcy53cml0ZUZpbGVTeW5jKE1vZHVsZS5VVEY4VG9TdHJpbmcoZnB0ciksIGIpOyByZXR1cm4gdHJ1ZTsgfSBjYXRjaChlKSB7IHJldHVybiBmYWxzZTsgfSB9ACh2b2lkKTw6Oj57IGNvbnN0IHBhcmFtcyA9IG5ldyBVUkxTZWFyY2hQYXJhbXMod2luZG93LmxvY2F0aW9uLnNlYXJjaCkuZW50cmllcygpOyBmb3IgKGxldCBwID0gcGFyYW1zLm5leHQoKTsgIXAuZG9uZTsgcCA9IHBhcmFtcy5uZXh0KCkpIHsgY29uc3Qga2V5ID0gcC52YWx1ZVswXTsgY29uc3QgdmFsID0gcC52YWx1ZVsxXTsgd2l0aFN0YWNrU2F2ZSgoKSA9PiB7IGNvbnN0IGtleV9jc3RyID0gc3RyaW5nVG9VVEY4T25TdGFjayhrZXkpOyBjb25zdCB2YWxfY3N0ciA9IHN0cmluZ1RvVVRGOE9uU3RhY2sodmFsKTsgX19zYXJnc19hZGRfa3ZwKGtleV9jc3RyLCB2YWxfY3N0cikgfSk7IH0gfQAodm9pZCogY2xpcGJvYXJkLCBjb25zdCBjaGFyKiB0ZXh0LCBpbnQgdGV4dF9zaXplKTw6Oj57IGZ1bmN0aW9uIGVtc2NyaXB0ZW5fY2xpcGJvYXJkX19jaGFuZ2VfZXZlbnQoZSkgeyBjb25zdCBuZXdUZXh0ID0gZS5jbGlwYm9hcmREYXRhLmdldERhdGEoJ3RleHQvcGxhaW4nKTsgbGV0IGk7IGZvciAoaSA9IDA7IGkgPCBuZXdUZXh0Lmxlbmd0aCAmJiBpIDwgdGV4dF9zaXplIC0gMTsgaSsrKSB7IE1vZHVsZS5IRUFQVThbdGV4dCArIGldID0gbmV3VGV4dC5jaGFyQ29kZUF0KGkpOyB9IE1vZHVsZS5IRUFQVThbdGV4dCArIGldID0gMDsgfSBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdjbGlwYm9hcmRjaGFuZ2UnLCBlbXNjcmlwdGVuX2NsaXBib2FyZF9fY2hhbmdlX2V2ZW50KTsgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigncGFzdGUnLCBlbXNjcmlwdGVuX2NsaXBib2FyZF9fY2hhbmdlX2V2ZW50KTsgfQAoY29uc3QgY2hhciogdGV4dCk8Ojo+eyBuYXZpZ2F0b3IuY2xpcGJvYXJkLndyaXRlVGV4dChVVEY4VG9TdHJpbmcodGV4dCkpOyB9AChwbnRyX2FwcF9zb3VuZF90eXBlIHR5cGUsIHVuc2lnbmVkIGNoYXIqIGRhdGFQdHIsIHVuc2lnbmVkIGludCBkYXRhU2l6ZSk8Ojo+eyBsZXQgbWltZVR5cGU7IHN3aXRjaCAodHlwZSkgeyBjYXNlIDE6IG1pbWVUeXBlID0gJ2F1ZGlvL3dhdic7IGJyZWFrOyBjYXNlIDI6IG1pbWVUeXBlID0gJ2F1ZGlvL29nZyc7IGJyZWFrOyBkZWZhdWx0OiByZXR1cm4gMDsgfSBjb25zdCBkYXRhID0gSEVBUFU4LnNsaWNlKGRhdGFQdHIsIGRhdGFQdHIgKyBkYXRhU2l6ZSk7IGNvbnN0IGF1ZGlvID0gbmV3IEF1ZGlvKCk7IGF1ZGlvLnNyYyA9IFVSTC5jcmVhdGVPYmplY3RVUkwobmV3IEJsb2IoW2RhdGFdLCB7IHR5cGUgfSkpOyBNb2R1bGUucG50cl9zb3VuZHMgPSBNb2R1bGUucG50cl9zb3VuZHMgfHwgW107IE1vZHVsZS5wbnRyX3NvdW5kcy5wdXNoKGF1ZGlvKTsgcmV0dXJuIE1vZHVsZS5wbnRyX3NvdW5kcy5sZW5ndGg7IH0AKHBudHJfc291bmQqIHNvdW5kLCBfQm9vbCBsb29wKTw6Oj57IGNvbnN0IGF1ZGlvID0gTW9kdWxlLnBudHJfc291bmRzW3NvdW5kIC0gMV07IGlmICghYXVkaW8pIHsgY29uc29sZS5sb2coJ3BsYXk6IHNvdW5kIG5vdCBsb2FkZWQnLCB7c291bmQsIHBudHJfc291bmRzOiBNb2R1bGUucG50cl9zb3VuZH0pOyByZXR1cm47IH0gYXVkaW8ubG9vcCA9IGxvb3A7IGF1ZGlvLmN1cnJlbnRUaW1lID0gMDsgbGV0IHJlc3VsdCA9IGF1ZGlvLnBsYXkoKTsgaWYgKHJlc3VsdCAhPT0gdW5kZWZpbmVkKSB7IHJlc3VsdC5jYXRjaCgoZXJyb3IpID0+IHsgaWYgKGVycm9yLm5hbWUgPT09ICJOb3RBbGxvd2VkRXJyb3IiKSB7IHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7IHBudHJfcGxheV9zb3VuZChzb3VuZCwgbG9vcCk7IH0sIDUwMCk7IH0gfSk7IH0gfQAocG50cl9zb3VuZCogc291bmQpPDo6PnsgY29uc3QgYXVkaW8gPSBNb2R1bGUucG50cl9zb3VuZHNbc291bmQgLSAxXTsgaWYgKGF1ZGlvKSB7IGF1ZGlvLnBhdXNlKCk7IGF1ZGlvLmN1cnJlbnRUaW1lID0gMDsgfSB9AChwbnRyX3NvdW5kKiBzb3VuZCk8Ojo+eyBjb25zdCBhdWRpbyA9IE1vZHVsZS5wbnRyX3NvdW5kc1tzb3VuZCAtIDFdOyBpZiAoYXVkaW8pIHsgYXVkaW8ucGF1c2UoKTsgYXVkaW8uY3VycmVudFRpbWUgPSAwOyBVUkwucmV2b2tlT2JqZWN0VVJMKGF1ZGlvLnNyYyk7IH0gfQAocG50cl9hcHAqIGFwcCwgaW50IHdpZHRoLCBpbnQgaGVpZ2h0KTw6Oj57IE1vZHVsZS5jYW52YXMud2lkdGggPSB3aWR0aDsgTW9kdWxlLmNhbnZhcy5oZWlnaHQgPSBoZWlnaHQ7IE1vZHVsZS5jdHggPSBNb2R1bGUuY2FudmFzLmdldENvbnRleHQoJzJkJyk7IE1vZHVsZS5zY3JlZW4gPSBNb2R1bGUuY3R4LmdldEltYWdlRGF0YSgwLCAwLCB3aWR0aCwgaGVpZ2h0KTsgc3BlY2lhbEhUTUxUYXJnZXRzWyIhY2FudmFzIl0gPSBNb2R1bGUuY2FudmFzOyByZXR1cm4gdHJ1ZTsgfQAocG50cl9hcHAqIGFwcCk8Ojo+eyByZXR1cm4gTW9kdWxlLmNhbnZhcy53aWR0aDsgfQAocG50cl9hcHAqIGFwcCk8Ojo+eyByZXR1cm4gTW9kdWxlLmNhbnZhcy5oZWlnaHQ7IH0AKHZvaWQqIGRhdGEsIGludCBkYXRhU2l6ZSwgaW50IHdpZHRoLCBpbnQgaGVpZ2h0KTw6Oj57IE1vZHVsZS5zY3JlZW4uZGF0YS5zZXQoSEVBUFU4LnN1YmFycmF5KGRhdGEsIGRhdGEgKyBkYXRhU2l6ZSkpOyBNb2R1bGUuY3R4LnB1dEltYWdlRGF0YShNb2R1bGUuc2NyZWVuLCAwLCAwKTsgfQAodm9pZCogYXBwKTw6Oj57IGNvbnN0IHN0cmluZ1RvTmV3VVRGOExvY2FsID0gcyA9PiB7IGNvbnN0IGJ1ZmZfcHRyID0gTW9kdWxlLl9wbnRyX2FwcF9lbXNjcmlwdGVuX2xvYWRfbWVtb3J5KHMubGVuZ3RoKzEpOyBNb2R1bGUuSEVBUFU4LnNldCgobmV3IFRleHRFbmNvZGVyKCkpLmVuY29kZShzICsgJ1wwJyksIGJ1ZmZfcHRyKTsgcmV0dXJuIGJ1ZmZfcHRyOyB9OyBNb2R1bGUuY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoJ2RyYWdvdmVyJywgZSA9PiBlLnByZXZlbnREZWZhdWx0KCkpOyBNb2R1bGUuY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoJ2Ryb3AnLCBlID0+IHsgZS5wcmV2ZW50RGVmYXVsdCgpOyBmb3IgKGNvbnN0IGZpbGUgb2YgZS5kYXRhVHJhbnNmZXIuZmlsZXMpIHsgY29uc3QgcmVhZGVyID0gbmV3IEZpbGVSZWFkZXIoKTsgcmVhZGVyLmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCBlID0+IHsgY29uc3QgYnl0ZXMgPSBuZXcgVWludDhBcnJheShldmVudC50YXJnZXQucmVzdWx0KTsgY29uc3QgZGF0YV9wdHIgPSBNb2R1bGUuX3BudHJfYXBwX2Vtc2NyaXB0ZW5fbG9hZF9tZW1vcnkoYnl0ZXMuYnl0ZUxlbmd0aCk7IE1vZHVsZS5IRUFQVTguc2V0KGJ5dGVzLCBkYXRhX3B0cik7IE1vZHVsZS5fcG50cl9hcHBfZW1zY3JpcHRlbl9maWxlX2Ryb3BwZWQoYXBwLCBzdHJpbmdUb05ld1VURjhMb2NhbChmaWxlLm5hbWUpLCBkYXRhX3B0ciwgYnl0ZXMuYnl0ZUxlbmd0aCk7IE1vZHVsZS5fcG50cl9hcHBfZW1zY3JpcHRlbl91bmxvYWRfbWVtb3J5KGRhdGFfcHRyKTsgfSk7IHJlYWRlci5yZWFkQXNBcnJheUJ1ZmZlcihmaWxlKTsgfSB9KTsgfQAodm9pZCk8Ojo+eyByZXR1cm4gcGVyZm9ybWFuY2Uubm93KCk7IH0AKCk8Ojo+eyBpZiAoIU1vZHVsZT8uY2FydCkgeyBjb25zb2xlLmxvZygnWW91IHNob3VsZCBwcm9iYWJseSBzZXQgaG9zdC5jYXJ0LicpOyB9IGlmIChNb2R1bGU/LmNhcnQ/Ll9pbml0aWFsaXplKSB7IE1vZHVsZS5jYXJ0Ll9pbml0aWFsaXplKCk7IH0gaWYgKE1vZHVsZT8uY2FydD8uX3N0YXJ0KSB7IE1vZHVsZS5jYXJ0Ll9zdGFydCgpOyB9IGlmIChNb2R1bGU/LmNhcnQ/LmxvYWQpIHsgTW9kdWxlLmNhcnQubG9hZCgpOyB9IH0AKCk8Ojo+eyBpZiAoTW9kdWxlPy5jYXJ0Py51cGRhdGUpIHsgTW9kdWxlLmNhcnQudXBkYXRlKCk7IH0gfQAoKTw6Oj57IGlmIChNb2R1bGU/LmNhcnQ/LnVubG9hZCkgeyBNb2R1bGUuY2FydC51bmxvYWQoKTsgfSB9AABB28TEAAskJHdpdGhTdGFja1NhdmUsJHN0cmluZ1RvVVRGOE9uU3RhY2sA';
    return f;
}

var wasmBinaryFile;

function getBinarySync(file) {
  if (file == wasmBinaryFile && wasmBinary) {
    return new Uint8Array(wasmBinary);
  }
  var binary = tryParseAsDataURI(file);
  if (binary) {
    return binary;
  }
  if (readBinary) {
    return readBinary(file);
  }
  throw 'both async and sync fetching of the wasm failed';
}

function getBinaryPromise(binaryFile) {

  // Otherwise, getBinarySync should be able to get it synchronously
  return Promise.resolve().then(() => getBinarySync(binaryFile));
}

function instantiateArrayBuffer(binaryFile, imports, receiver) {
  return getBinaryPromise(binaryFile).then((binary) => {
    return WebAssembly.instantiate(binary, imports);
  }).then(receiver, (reason) => {
    err(`failed to asynchronously prepare wasm: ${reason}`);

    // Warn on some common problems.
    if (isFileURI(wasmBinaryFile)) {
      err(`warning: Loading from a file URI (${wasmBinaryFile}) is not supported in most browsers. See https://emscripten.org/docs/getting_started/FAQ.html#how-do-i-run-a-local-webserver-for-testing-why-does-my-program-stall-in-downloading-or-preparing`);
    }
    abort(reason);
  });
}

function instantiateAsync(binary, binaryFile, imports, callback) {
  return instantiateArrayBuffer(binaryFile, imports, callback);
}

function getWasmImports() {
  // instrumenting imports is used in asyncify in two ways: to add assertions
  // that check for proper import use, and for ASYNCIFY=2 we use them to set up
  // the Promise API on the import side.
  Asyncify.instrumentWasmImports(wasmImports);
  // prepare imports
  return {
    'env': wasmImports,
    'wasi_snapshot_preview1': wasmImports,
  }
}

// Create the wasm instance.
// Receives the wasm imports, returns the exports.
function createWasm() {
  var info = getWasmImports();
  // Load the wasm module and create an instance of using native support in the JS engine.
  // handle a generated wasm instance, receiving its exports and
  // performing other necessary setup
  /** @param {WebAssembly.Module=} module*/
  function receiveInstance(instance, module) {
    wasmExports = instance.exports;

    wasmExports = Asyncify.instrumentWasmExports(wasmExports);

    

    wasmMemory = wasmExports['memory'];
    
    assert(wasmMemory, 'memory not found in wasm exports');
    updateMemoryViews();

    addOnInit(wasmExports['__wasm_call_ctors']);

    removeRunDependency('wasm-instantiate');
    return wasmExports;
  }
  // wait for the pthread pool (if any)
  addRunDependency('wasm-instantiate');

  // Prefer streaming instantiation if available.
  // Async compilation can be confusing when an error on the page overwrites Module
  // (for example, if the order of elements is wrong, and the one defining Module is
  // later), so we save Module and check it later.
  var trueModule = Module;
  function receiveInstantiationResult(result) {
    // 'result' is a ResultObject object which has both the module and instance.
    // receiveInstance() will swap in the exports (to Module.asm) so they can be called
    assert(Module === trueModule, 'the Module object should not be replaced during async compilation - perhaps the order of HTML elements is wrong?');
    trueModule = null;
    // TODO: Due to Closure regression https://github.com/google/closure-compiler/issues/3193, the above line no longer optimizes out down to the following line.
    // When the regression is fixed, can restore the above PTHREADS-enabled path.
    receiveInstance(result['instance']);
  }

  // User shell pages can write their own Module.instantiateWasm = function(imports, successCallback) callback
  // to manually instantiate the Wasm module themselves. This allows pages to
  // run the instantiation parallel to any other async startup actions they are
  // performing.
  // Also pthreads and wasm workers initialize the wasm instance through this
  // path.
  if (Module['instantiateWasm']) {
    try {
      return Module['instantiateWasm'](info, receiveInstance);
    } catch(e) {
      err(`Module.instantiateWasm callback failed with error: ${e}`);
        // If instantiation fails, reject the module ready promise.
        readyPromiseReject(e);
    }
  }

  wasmBinaryFile ??= findWasmBinary();

  // If instantiation fails, reject the module ready promise.
  instantiateAsync(wasmBinary, wasmBinaryFile, info, receiveInstantiationResult).catch(readyPromiseReject);
  return {}; // no exports yet; we'll fill them in later
}

// Globals used by JS i64 conversions (see makeSetValue)
var tempDouble;
var tempI64;

// include: runtime_debug.js
// Endianness check
(() => {
  var h16 = new Int16Array(1);
  var h8 = new Int8Array(h16.buffer);
  h16[0] = 0x6373;
  if (h8[0] !== 0x73 || h8[1] !== 0x63) throw 'Runtime error: expected the system to be little-endian! (Run with -sSUPPORT_BIG_ENDIAN to bypass)';
})();

if (Module['ENVIRONMENT']) {
  throw new Error('Module.ENVIRONMENT has been deprecated. To force the environment, use the ENVIRONMENT compile-time option (for example, -sENVIRONMENT=web or -sENVIRONMENT=node)');
}

function legacyModuleProp(prop, newName, incoming=true) {
  if (!Object.getOwnPropertyDescriptor(Module, prop)) {
    Object.defineProperty(Module, prop, {
      configurable: true,
      get() {
        let extra = incoming ? ' (the initial value can be provided on Module, but after startup the value is only looked for on a local variable of that name)' : '';
        abort(`\`Module.${prop}\` has been replaced by \`${newName}\`` + extra);

      }
    });
  }
}

function ignoredModuleProp(prop) {
  if (Object.getOwnPropertyDescriptor(Module, prop)) {
    abort(`\`Module.${prop}\` was supplied but \`${prop}\` not included in INCOMING_MODULE_JS_API`);
  }
}

// forcing the filesystem exports a few things by default
function isExportedByForceFilesystem(name) {
  return name === 'FS_createPath' ||
         name === 'FS_createDataFile' ||
         name === 'FS_createPreloadedFile' ||
         name === 'FS_unlink' ||
         name === 'addRunDependency' ||
         // The old FS has some functionality that WasmFS lacks.
         name === 'FS_createLazyFile' ||
         name === 'FS_createDevice' ||
         name === 'removeRunDependency';
}

/**
 * Intercept access to a global symbol.  This enables us to give informative
 * warnings/errors when folks attempt to use symbols they did not include in
 * their build, or no symbols that no longer exist.
 */
function hookGlobalSymbolAccess(sym, func) {
  if (typeof globalThis != 'undefined' && !Object.getOwnPropertyDescriptor(globalThis, sym)) {
    Object.defineProperty(globalThis, sym, {
      configurable: true,
      get() {
        func();
        return undefined;
      }
    });
  }
}

function missingGlobal(sym, msg) {
  hookGlobalSymbolAccess(sym, () => {
    warnOnce(`\`${sym}\` is not longer defined by emscripten. ${msg}`);
  });
}

missingGlobal('buffer', 'Please use HEAP8.buffer or wasmMemory.buffer');
missingGlobal('asm', 'Please use wasmExports instead');

function missingLibrarySymbol(sym) {
  hookGlobalSymbolAccess(sym, () => {
    // Can't `abort()` here because it would break code that does runtime
    // checks.  e.g. `if (typeof SDL === 'undefined')`.
    var msg = `\`${sym}\` is a library symbol and not included by default; add it to your library.js __deps or to DEFAULT_LIBRARY_FUNCS_TO_INCLUDE on the command line`;
    // DEFAULT_LIBRARY_FUNCS_TO_INCLUDE requires the name as it appears in
    // library.js, which means $name for a JS name with no prefix, or name
    // for a JS name like _name.
    var librarySymbol = sym;
    if (!librarySymbol.startsWith('_')) {
      librarySymbol = '$' + sym;
    }
    msg += ` (e.g. -sDEFAULT_LIBRARY_FUNCS_TO_INCLUDE='${librarySymbol}')`;
    if (isExportedByForceFilesystem(sym)) {
      msg += '. Alternatively, forcing filesystem support (-sFORCE_FILESYSTEM) can export this for you';
    }
    warnOnce(msg);
  });

  // Any symbol that is not included from the JS library is also (by definition)
  // not exported on the Module object.
  unexportedRuntimeSymbol(sym);
}

function unexportedRuntimeSymbol(sym) {
  if (!Object.getOwnPropertyDescriptor(Module, sym)) {
    Object.defineProperty(Module, sym, {
      configurable: true,
      get() {
        var msg = `'${sym}' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the Emscripten FAQ)`;
        if (isExportedByForceFilesystem(sym)) {
          msg += '. Alternatively, forcing filesystem support (-sFORCE_FILESYSTEM) can export this for you';
        }
        abort(msg);
      }
    });
  }
}

// Used by XXXXX_DEBUG settings to output debug messages.
function dbg(...args) {
  // TODO(sbc): Make this configurable somehow.  Its not always convenient for
  // logging to show up as warnings.
  console.warn(...args);
}
// end include: runtime_debug.js
// === Body ===

function cartfs_exists() { return typeof Module.cartfs === 'undefined' ? false : true; }
function cartfs_size(fptr) { return Module.cartfs.statSync(Module.UTF8ToString(fptr)).size; }
function cartfs_load_file(fptr,outptr) { const b = Module.cartfs.readFileSync(Module.UTF8ToString(fptr)); Module.writeArrayToMemory(b, outptr); }
function cartfs_save_file(fptr,dataptr,size) { try{ const b = Module.HEAPU8.slice(dataptr, dataptr+size); Module.cartfs.writeFileSync(Module.UTF8ToString(fptr), b); return true; } catch(e) { return false; } }
function sargs_js_parse_url() { const params = new URLSearchParams(window.location.search).entries(); for (let p = params.next(); !p.done; p = params.next()) { const key = p.value[0]; const val = p.value[1]; withStackSave(() => { const key_cstr = stringToUTF8OnStack(key); const val_cstr = stringToUTF8OnStack(val); __sargs_add_kvp(key_cstr, val_cstr) }); } }
function emscripten_clipboard__register(clipboard,text,text_size) { function emscripten_clipboard__change_event(e) { const newText = e.clipboardData.getData('text/plain'); let i; for (i = 0; i < newText.length && i < text_size - 1; i++) { Module.HEAPU8[text + i] = newText.charCodeAt(i); } Module.HEAPU8[text + i] = 0; } document.addEventListener('clipboardchange', emscripten_clipboard__change_event); document.addEventListener('paste', emscripten_clipboard__change_event); }
function emscripten_clipboard__write_text(text) { navigator.clipboard.writeText(UTF8ToString(text)); }
function pntr_load_sound_from_memory(type,dataPtr,dataSize) { let mimeType; switch (type) { case 1: mimeType = 'audio/wav'; break; case 2: mimeType = 'audio/ogg'; break; default: return 0; } const data = HEAPU8.slice(dataPtr, dataPtr + dataSize); const audio = new Audio(); audio.src = URL.createObjectURL(new Blob([data], { type })); Module.pntr_sounds = Module.pntr_sounds || []; Module.pntr_sounds.push(audio); return Module.pntr_sounds.length; }
function pntr_play_sound(sound,loop) { const audio = Module.pntr_sounds[sound - 1]; if (!audio) { console.log('play: sound not loaded', {sound, pntr_sounds: Module.pntr_sound}); return; } audio.loop = loop; audio.currentTime = 0; let result = audio.play(); if (result !== undefined) { result.catch((error) => { if (error.name === "NotAllowedError") { setTimeout(function() { pntr_play_sound(sound, loop); }, 500); } }); } }
function pntr_stop_sound(sound) { const audio = Module.pntr_sounds[sound - 1]; if (audio) { audio.pause(); audio.currentTime = 0; } }
function pntr_unload_sound(sound) { const audio = Module.pntr_sounds[sound - 1]; if (audio) { audio.pause(); audio.currentTime = 0; URL.revokeObjectURL(audio.src); } }
function pntr_app_platform_set_size(app,width,height) { Module.canvas.width = width; Module.canvas.height = height; Module.ctx = Module.canvas.getContext('2d'); Module.screen = Module.ctx.getImageData(0, 0, width, height); specialHTMLTargets["!canvas"] = Module.canvas; return true; }
function pntr_app_platform_get_width(app) { return Module.canvas.width; }
function pntr_app_platform_get_height(app) { return Module.canvas.height; }
function pntr_app_platform_render_js(data,dataSize,width,height) { Module.screen.data.set(HEAPU8.subarray(data, data + dataSize)); Module.ctx.putImageData(Module.screen, 0, 0); }
function pntr_app_emscripten_init_filedropped(app) { const stringToNewUTF8Local = s => { const buff_ptr = Module._pntr_app_emscripten_load_memory(s.length+1); Module.HEAPU8.set((new TextEncoder()).encode(s + '\0'), buff_ptr); return buff_ptr; }; Module.canvas.addEventListener('dragover', e => e.preventDefault()); Module.canvas.addEventListener('drop', e => { e.preventDefault(); for (const file of e.dataTransfer.files) { const reader = new FileReader(); reader.addEventListener('load', e => { const bytes = new Uint8Array(event.target.result); const data_ptr = Module._pntr_app_emscripten_load_memory(bytes.byteLength); Module.HEAPU8.set(bytes, data_ptr); Module._pntr_app_emscripten_file_dropped(app, stringToNewUTF8Local(file.name), data_ptr, bytes.byteLength); Module._pntr_app_emscripten_unload_memory(data_ptr); }); reader.readAsArrayBuffer(file); } }); }
function pntr_app_emscripten_get_time() { return performance.now(); }
function _cart_load() { if (!Module?.cart) { console.log('You should probably set host.cart.'); } if (Module?.cart?._initialize) { Module.cart._initialize(); } if (Module?.cart?._start) { Module.cart._start(); } if (Module?.cart?.load) { Module.cart.load(); } }
function _cart_update() { if (Module?.cart?.update) { Module.cart.update(); } }
function _cart_unload() { if (Module?.cart?.unload) { Module.cart.unload(); } }

// end include: preamble.js


  /** @constructor */
  function ExitStatus(status) {
      this.name = 'ExitStatus';
      this.message = `Program terminated with exit(${status})`;
      this.status = status;
    }

  var callRuntimeCallbacks = (callbacks) => {
      // Pass the module as the first argument.
      callbacks.forEach((f) => f(Module));
    };

  
    /**
     * @param {number} ptr
     * @param {string} type
     */
  function getValue(ptr, type = 'i8') {
    if (type.endsWith('*')) type = '*';
    switch (type) {
      case 'i1': return HEAP8[ptr];
      case 'i8': return HEAP8[ptr];
      case 'i16': return HEAP16[((ptr)>>1)];
      case 'i32': return HEAP32[((ptr)>>2)];
      case 'i64': abort('to do getValue(i64) use WASM_BIGINT');
      case 'float': return HEAPF32[((ptr)>>2)];
      case 'double': return HEAPF64[((ptr)>>3)];
      case '*': return HEAPU32[((ptr)>>2)];
      default: abort(`invalid type for getValue: ${type}`);
    }
  }

  var noExitRuntime = Module['noExitRuntime'] || true;

  var ptrToString = (ptr) => {
      assert(typeof ptr === 'number');
      // With CAN_ADDRESS_2GB or MEMORY64, pointers are already unsigned.
      ptr >>>= 0;
      return '0x' + ptr.toString(16).padStart(8, '0');
    };

  
    /**
     * @param {number} ptr
     * @param {number} value
     * @param {string} type
     */
  function setValue(ptr, value, type = 'i8') {
    if (type.endsWith('*')) type = '*';
    switch (type) {
      case 'i1': HEAP8[ptr] = value; break;
      case 'i8': HEAP8[ptr] = value; break;
      case 'i16': HEAP16[((ptr)>>1)] = value; break;
      case 'i32': HEAP32[((ptr)>>2)] = value; break;
      case 'i64': abort('to do setValue(i64) use WASM_BIGINT');
      case 'float': HEAPF32[((ptr)>>2)] = value; break;
      case 'double': HEAPF64[((ptr)>>3)] = value; break;
      case '*': HEAPU32[((ptr)>>2)] = value; break;
      default: abort(`invalid type for setValue: ${type}`);
    }
  }

  var stackRestore = (val) => __emscripten_stack_restore(val);

  var stackSave = () => _emscripten_stack_get_current();

  var warnOnce = (text) => {
      warnOnce.shown ||= {};
      if (!warnOnce.shown[text]) {
        warnOnce.shown[text] = 1;
        if (ENVIRONMENT_IS_NODE) text = 'warning: ' + text;
        err(text);
      }
    };

  var UTF8Decoder = typeof TextDecoder != 'undefined' ? new TextDecoder() : undefined;
  
    /**
     * Given a pointer 'idx' to a null-terminated UTF8-encoded string in the given
     * array that contains uint8 values, returns a copy of that string as a
     * Javascript String object.
     * heapOrArray is either a regular array, or a JavaScript typed array view.
     * @param {number=} idx
     * @param {number=} maxBytesToRead
     * @return {string}
     */
  var UTF8ArrayToString = (heapOrArray, idx = 0, maxBytesToRead = NaN) => {
      var endIdx = idx + maxBytesToRead;
      var endPtr = idx;
      // TextDecoder needs to know the byte length in advance, it doesn't stop on
      // null terminator by itself.  Also, use the length info to avoid running tiny
      // strings through TextDecoder, since .subarray() allocates garbage.
      // (As a tiny code save trick, compare endPtr against endIdx using a negation,
      // so that undefined/NaN means Infinity)
      while (heapOrArray[endPtr] && !(endPtr >= endIdx)) ++endPtr;
  
      if (endPtr - idx > 16 && heapOrArray.buffer && UTF8Decoder) {
        return UTF8Decoder.decode(heapOrArray.subarray(idx, endPtr));
      }
      var str = '';
      // If building with TextDecoder, we have already computed the string length
      // above, so test loop end condition against that
      while (idx < endPtr) {
        // For UTF8 byte structure, see:
        // http://en.wikipedia.org/wiki/UTF-8#Description
        // https://www.ietf.org/rfc/rfc2279.txt
        // https://tools.ietf.org/html/rfc3629
        var u0 = heapOrArray[idx++];
        if (!(u0 & 0x80)) { str += String.fromCharCode(u0); continue; }
        var u1 = heapOrArray[idx++] & 63;
        if ((u0 & 0xE0) == 0xC0) { str += String.fromCharCode(((u0 & 31) << 6) | u1); continue; }
        var u2 = heapOrArray[idx++] & 63;
        if ((u0 & 0xF0) == 0xE0) {
          u0 = ((u0 & 15) << 12) | (u1 << 6) | u2;
        } else {
          if ((u0 & 0xF8) != 0xF0) warnOnce('Invalid UTF-8 leading byte ' + ptrToString(u0) + ' encountered when deserializing a UTF-8 string in wasm memory to a JS string!');
          u0 = ((u0 & 7) << 18) | (u1 << 12) | (u2 << 6) | (heapOrArray[idx++] & 63);
        }
  
        if (u0 < 0x10000) {
          str += String.fromCharCode(u0);
        } else {
          var ch = u0 - 0x10000;
          str += String.fromCharCode(0xD800 | (ch >> 10), 0xDC00 | (ch & 0x3FF));
        }
      }
      return str;
    };
  
    /**
     * Given a pointer 'ptr' to a null-terminated UTF8-encoded string in the
     * emscripten HEAP, returns a copy of that string as a Javascript String object.
     *
     * @param {number} ptr
     * @param {number=} maxBytesToRead - An optional length that specifies the
     *   maximum number of bytes to read. You can omit this parameter to scan the
     *   string until the first 0 byte. If maxBytesToRead is passed, and the string
     *   at [ptr, ptr+maxBytesToReadr[ contains a null byte in the middle, then the
     *   string will cut short at that byte index (i.e. maxBytesToRead will not
     *   produce a string of exact length [ptr, ptr+maxBytesToRead[) N.B. mixing
     *   frequent uses of UTF8ToString() with and without maxBytesToRead may throw
     *   JS JIT optimizations off, so it is worth to consider consistently using one
     * @return {string}
     */
  var UTF8ToString = (ptr, maxBytesToRead) => {
      assert(typeof ptr == 'number', `UTF8ToString expects a number (got ${typeof ptr})`);
      return ptr ? UTF8ArrayToString(HEAPU8, ptr, maxBytesToRead) : '';
    };
  var ___assert_fail = (condition, filename, line, func) => {
      abort(`Assertion failed: ${UTF8ToString(condition)}, at: ` + [filename ? UTF8ToString(filename) : 'unknown filename', line, func ? UTF8ToString(func) : 'unknown function']);
    };

  var __emscripten_memcpy_js = (dest, src, num) => HEAPU8.copyWithin(dest, src, src + num);

  
  var _emscripten_set_main_loop_timing = (mode, value) => {
      MainLoop.timingMode = mode;
      MainLoop.timingValue = value;
  
      if (!MainLoop.func) {
        err('emscripten_set_main_loop_timing: Cannot set timing mode for main loop since a main loop does not exist! Call emscripten_set_main_loop first to set one up.');
        return 1; // Return non-zero on failure, can't set timing mode when there is no main loop.
      }
  
      if (!MainLoop.running) {
        
        MainLoop.running = true;
      }
      if (mode == 0) {
        MainLoop.scheduler = function MainLoop_scheduler_setTimeout() {
          var timeUntilNextTick = Math.max(0, MainLoop.tickStartTime + value - _emscripten_get_now())|0;
          setTimeout(MainLoop.runner, timeUntilNextTick); // doing this each time means that on exception, we stop
        };
        MainLoop.method = 'timeout';
      } else if (mode == 1) {
        MainLoop.scheduler = function MainLoop_scheduler_rAF() {
          MainLoop.requestAnimationFrame(MainLoop.runner);
        };
        MainLoop.method = 'rAF';
      } else if (mode == 2) {
        if (typeof MainLoop.setImmediate == 'undefined') {
          if (typeof setImmediate == 'undefined') {
            // Emulate setImmediate. (note: not a complete polyfill, we don't emulate clearImmediate() to keep code size to minimum, since not needed)
            var setImmediates = [];
            var emscriptenMainLoopMessageId = 'setimmediate';
            /** @param {Event} event */
            var MainLoop_setImmediate_messageHandler = (event) => {
              // When called in current thread or Worker, the main loop ID is structured slightly different to accommodate for --proxy-to-worker runtime listening to Worker events,
              // so check for both cases.
              if (event.data === emscriptenMainLoopMessageId || event.data.target === emscriptenMainLoopMessageId) {
                event.stopPropagation();
                setImmediates.shift()();
              }
            };
            addEventListener("message", MainLoop_setImmediate_messageHandler, true);
            MainLoop.setImmediate = /** @type{function(function(): ?, ...?): number} */((func) => {
              setImmediates.push(func);
              if (ENVIRONMENT_IS_WORKER) {
                Module['setImmediates'] ??= [];
                Module['setImmediates'].push(func);
                postMessage({target: emscriptenMainLoopMessageId}); // In --proxy-to-worker, route the message via proxyClient.js
              } else postMessage(emscriptenMainLoopMessageId, "*"); // On the main thread, can just send the message to itself.
            });
          } else {
            MainLoop.setImmediate = setImmediate;
          }
        }
        MainLoop.scheduler = function MainLoop_scheduler_setImmediate() {
          MainLoop.setImmediate(MainLoop.runner);
        };
        MainLoop.method = 'immediate';
      }
      return 0;
    };
  
  var _emscripten_get_now = () => performance.now();
  
  
  var runtimeKeepaliveCounter = 0;
  var keepRuntimeAlive = () => noExitRuntime || runtimeKeepaliveCounter > 0;
  var _proc_exit = (code) => {
      EXITSTATUS = code;
      if (!keepRuntimeAlive()) {
        Module['onExit']?.(code);
        ABORT = true;
      }
      quit_(code, new ExitStatus(code));
    };
  
  /** @suppress {duplicate } */
  /** @param {boolean|number=} implicit */
  var exitJS = (status, implicit) => {
      EXITSTATUS = status;
  
      checkUnflushedContent();
  
      // if exit() was called explicitly, warn the user if the runtime isn't actually being shut down
      if (keepRuntimeAlive() && !implicit) {
        var msg = `program exited (with status: ${status}), but keepRuntimeAlive() is set (counter=${runtimeKeepaliveCounter}) due to an async operation, so halting execution but not exiting the runtime or preventing further async execution (you can use emscripten_force_exit, if you want to force a true shutdown)`;
        readyPromiseReject(msg);
        err(msg);
      }
  
      _proc_exit(status);
    };
  var _exit = exitJS;
  
  var handleException = (e) => {
      // Certain exception types we do not treat as errors since they are used for
      // internal control flow.
      // 1. ExitStatus, which is thrown by exit()
      // 2. "unwind", which is thrown by emscripten_unwind_to_js_event_loop() and others
      //    that wish to return to JS event loop.
      if (e instanceof ExitStatus || e == 'unwind') {
        return EXITSTATUS;
      }
      checkStackCookie();
      if (e instanceof WebAssembly.RuntimeError) {
        if (_emscripten_stack_get_current() <= 0) {
          err('Stack overflow detected.  You can try increasing -sSTACK_SIZE (currently set to 1114112)');
        }
      }
      quit_(1, e);
    };
  
  var maybeExit = () => {
      if (!keepRuntimeAlive()) {
        try {
          _exit(EXITSTATUS);
        } catch (e) {
          handleException(e);
        }
      }
    };
  
    /**
     * @param {number=} arg
     * @param {boolean=} noSetTiming
     */
  var setMainLoop = (iterFunc, fps, simulateInfiniteLoop, arg, noSetTiming) => {
      assert(!MainLoop.func, 'emscripten_set_main_loop: there can only be one main loop function at once: call emscripten_cancel_main_loop to cancel the previous one before setting a new one with different parameters.');
      MainLoop.func = iterFunc;
      MainLoop.arg = arg;
  
      var thisMainLoopId = MainLoop.currentlyRunningMainloop;
      function checkIsRunning() {
        if (thisMainLoopId < MainLoop.currentlyRunningMainloop) {
          
          maybeExit();
          return false;
        }
        return true;
      }
  
      // We create the loop runner here but it is not actually running until
      // _emscripten_set_main_loop_timing is called (which might happen a
      // later time).  This member signifies that the current runner has not
      // yet been started so that we can call runtimeKeepalivePush when it
      // gets it timing set for the first time.
      MainLoop.running = false;
      MainLoop.runner = function MainLoop_runner() {
        if (ABORT) return;
        if (MainLoop.queue.length > 0) {
          var start = Date.now();
          var blocker = MainLoop.queue.shift();
          blocker.func(blocker.arg);
          if (MainLoop.remainingBlockers) {
            var remaining = MainLoop.remainingBlockers;
            var next = remaining%1 == 0 ? remaining-1 : Math.floor(remaining);
            if (blocker.counted) {
              MainLoop.remainingBlockers = next;
            } else {
              // not counted, but move the progress along a tiny bit
              next = next + 0.5; // do not steal all the next one's progress
              MainLoop.remainingBlockers = (8*remaining + next)/9;
            }
          }
          MainLoop.updateStatus();
  
          // catches pause/resume main loop from blocker execution
          if (!checkIsRunning()) return;
  
          setTimeout(MainLoop.runner, 0);
          return;
        }
  
        // catch pauses from non-main loop sources
        if (!checkIsRunning()) return;
  
        // Implement very basic swap interval control
        MainLoop.currentFrameNumber = MainLoop.currentFrameNumber + 1 | 0;
        if (MainLoop.timingMode == 1 && MainLoop.timingValue > 1 && MainLoop.currentFrameNumber % MainLoop.timingValue != 0) {
          // Not the scheduled time to render this frame - skip.
          MainLoop.scheduler();
          return;
        } else if (MainLoop.timingMode == 0) {
          MainLoop.tickStartTime = _emscripten_get_now();
        }
  
        if (MainLoop.method === 'timeout' && Module.ctx) {
          warnOnce('Looks like you are rendering without using requestAnimationFrame for the main loop. You should use 0 for the frame rate in emscripten_set_main_loop in order to use requestAnimationFrame, as that can greatly improve your frame rates!');
          MainLoop.method = ''; // just warn once per call to set main loop
        }
  
        MainLoop.runIter(iterFunc);
  
        // catch pauses from the main loop itself
        if (!checkIsRunning()) return;
  
        MainLoop.scheduler();
      }
  
      if (!noSetTiming) {
        if (fps && fps > 0) {
          _emscripten_set_main_loop_timing(0, 1000.0 / fps);
        } else {
          // Do rAF by rendering each frame (no decimating)
          _emscripten_set_main_loop_timing(1, 1);
        }
  
        MainLoop.scheduler();
      }
  
      if (simulateInfiniteLoop) {
        throw 'unwind';
      }
    };
  
  
  var callUserCallback = (func) => {
      if (ABORT) {
        err('user callback triggered after runtime exited or application aborted.  Ignoring.');
        return;
      }
      try {
        func();
        maybeExit();
      } catch (e) {
        handleException(e);
      }
    };
  
  var MainLoop = {
  running:false,
  scheduler:null,
  method:"",
  currentlyRunningMainloop:0,
  func:null,
  arg:0,
  timingMode:0,
  timingValue:0,
  currentFrameNumber:0,
  queue:[],
  preMainLoop:[],
  postMainLoop:[],
  pause() {
        MainLoop.scheduler = null;
        // Incrementing this signals the previous main loop that it's now become old, and it must return.
        MainLoop.currentlyRunningMainloop++;
      },
  resume() {
        MainLoop.currentlyRunningMainloop++;
        var timingMode = MainLoop.timingMode;
        var timingValue = MainLoop.timingValue;
        var func = MainLoop.func;
        MainLoop.func = null;
        // do not set timing and call scheduler, we will do it on the next lines
        setMainLoop(func, 0, false, MainLoop.arg, true);
        _emscripten_set_main_loop_timing(timingMode, timingValue);
        MainLoop.scheduler();
      },
  updateStatus() {
        if (Module['setStatus']) {
          var message = Module['statusMessage'] || 'Please wait...';
          var remaining = MainLoop.remainingBlockers ?? 0;
          var expected = MainLoop.expectedBlockers ?? 0;
          if (remaining) {
            if (remaining < expected) {
              Module['setStatus'](`{message} ({expected - remaining}/{expected})`);
            } else {
              Module['setStatus'](message);
            }
          } else {
            Module['setStatus']('');
          }
        }
      },
  init() {
        Module['preMainLoop'] && MainLoop.preMainLoop.push(Module['preMainLoop']);
        Module['postMainLoop'] && MainLoop.postMainLoop.push(Module['postMainLoop']);
      },
  runIter(func) {
        if (ABORT) return;
        for (var pre of MainLoop.preMainLoop) {
          if (pre() === false) {
            return; // |return false| skips a frame
          }
        }
        callUserCallback(func);
        for (var post of MainLoop.postMainLoop) {
          post();
        }
        checkStackCookie();
      },
  nextRAF:0,
  fakeRequestAnimationFrame(func) {
        // try to keep 60fps between calls to here
        var now = Date.now();
        if (MainLoop.nextRAF === 0) {
          MainLoop.nextRAF = now + 1000/60;
        } else {
          while (now + 2 >= MainLoop.nextRAF) { // fudge a little, to avoid timer jitter causing us to do lots of delay:0
            MainLoop.nextRAF += 1000/60;
          }
        }
        var delay = Math.max(MainLoop.nextRAF - now, 0);
        setTimeout(func, delay);
      },
  requestAnimationFrame(func) {
        if (typeof requestAnimationFrame == 'function') {
          requestAnimationFrame(func);
          return;
        }
        var RAF = MainLoop.fakeRequestAnimationFrame;
        RAF(func);
      },
  };
  var _emscripten_cancel_main_loop = () => {
      MainLoop.pause();
      MainLoop.func = null;
    };

  var JSEvents = {
  removeAllEventListeners() {
        while (JSEvents.eventHandlers.length) {
          JSEvents._removeHandler(JSEvents.eventHandlers.length - 1);
        }
        JSEvents.deferredCalls = [];
      },
  inEventHandler:0,
  deferredCalls:[],
  deferCall(targetFunction, precedence, argsList) {
        function arraysHaveEqualContent(arrA, arrB) {
          if (arrA.length != arrB.length) return false;
  
          for (var i in arrA) {
            if (arrA[i] != arrB[i]) return false;
          }
          return true;
        }
        // Test if the given call was already queued, and if so, don't add it again.
        for (var call of JSEvents.deferredCalls) {
          if (call.targetFunction == targetFunction && arraysHaveEqualContent(call.argsList, argsList)) {
            return;
          }
        }
        JSEvents.deferredCalls.push({
          targetFunction,
          precedence,
          argsList
        });
  
        JSEvents.deferredCalls.sort((x,y) => x.precedence < y.precedence);
      },
  removeDeferredCalls(targetFunction) {
        JSEvents.deferredCalls = JSEvents.deferredCalls.filter((call) => call.targetFunction != targetFunction);
      },
  canPerformEventHandlerRequests() {
        if (navigator.userActivation) {
          // Verify against transient activation status from UserActivation API
          // whether it is possible to perform a request here without needing to defer. See
          // https://developer.mozilla.org/en-US/docs/Web/Security/User_activation#transient_activation
          // and https://caniuse.com/mdn-api_useractivation
          // At the time of writing, Firefox does not support this API: https://bugzilla.mozilla.org/show_bug.cgi?id=1791079
          return navigator.userActivation.isActive;
        }
  
        return JSEvents.inEventHandler && JSEvents.currentEventHandler.allowsDeferredCalls;
      },
  runDeferredCalls() {
        if (!JSEvents.canPerformEventHandlerRequests()) {
          return;
        }
        var deferredCalls = JSEvents.deferredCalls;
        JSEvents.deferredCalls = [];
        for (var call of deferredCalls) {
          call.targetFunction(...call.argsList);
        }
      },
  eventHandlers:[],
  removeAllHandlersOnTarget:(target, eventTypeString) => {
        for (var i = 0; i < JSEvents.eventHandlers.length; ++i) {
          if (JSEvents.eventHandlers[i].target == target &&
            (!eventTypeString || eventTypeString == JSEvents.eventHandlers[i].eventTypeString)) {
             JSEvents._removeHandler(i--);
           }
        }
      },
  _removeHandler(i) {
        var h = JSEvents.eventHandlers[i];
        h.target.removeEventListener(h.eventTypeString, h.eventListenerFunc, h.useCapture);
        JSEvents.eventHandlers.splice(i, 1);
      },
  registerOrRemoveHandler(eventHandler) {
        if (!eventHandler.target) {
          err('registerOrRemoveHandler: the target element for event handler registration does not exist, when processing the following event handler registration:');
          console.dir(eventHandler);
          return -4;
        }
        if (eventHandler.callbackfunc) {
          eventHandler.eventListenerFunc = function(event) {
            // Increment nesting count for the event handler.
            ++JSEvents.inEventHandler;
            JSEvents.currentEventHandler = eventHandler;
            // Process any old deferred calls the user has placed.
            JSEvents.runDeferredCalls();
            // Process the actual event, calls back to user C code handler.
            eventHandler.handlerFunc(event);
            // Process any new deferred calls that were placed right now from this event handler.
            JSEvents.runDeferredCalls();
            // Out of event handler - restore nesting count.
            --JSEvents.inEventHandler;
          };
  
          eventHandler.target.addEventListener(eventHandler.eventTypeString,
                                               eventHandler.eventListenerFunc,
                                               eventHandler.useCapture);
          JSEvents.eventHandlers.push(eventHandler);
        } else {
          for (var i = 0; i < JSEvents.eventHandlers.length; ++i) {
            if (JSEvents.eventHandlers[i].target == eventHandler.target
             && JSEvents.eventHandlers[i].eventTypeString == eventHandler.eventTypeString) {
               JSEvents._removeHandler(i--);
             }
          }
        }
        return 0;
      },
  getNodeNameForTarget(target) {
        if (!target) return '';
        if (target == window) return '#window';
        if (target == screen) return '#screen';
        return target?.nodeName || '';
      },
  fullscreenEnabled() {
        return document.fullscreenEnabled
        // Safari 13.0.3 on macOS Catalina 10.15.1 still ships with prefixed webkitFullscreenEnabled.
        // TODO: If Safari at some point ships with unprefixed version, update the version check above.
        || document.webkitFullscreenEnabled
         ;
      },
  };
  
  var stringToUTF8Array = (str, heap, outIdx, maxBytesToWrite) => {
      assert(typeof str === 'string', `stringToUTF8Array expects a string (got ${typeof str})`);
      // Parameter maxBytesToWrite is not optional. Negative values, 0, null,
      // undefined and false each don't write out any bytes.
      if (!(maxBytesToWrite > 0))
        return 0;
  
      var startIdx = outIdx;
      var endIdx = outIdx + maxBytesToWrite - 1; // -1 for string null terminator.
      for (var i = 0; i < str.length; ++i) {
        // Gotcha: charCodeAt returns a 16-bit word that is a UTF-16 encoded code
        // unit, not a Unicode code point of the character! So decode
        // UTF16->UTF32->UTF8.
        // See http://unicode.org/faq/utf_bom.html#utf16-3
        // For UTF8 byte structure, see http://en.wikipedia.org/wiki/UTF-8#Description
        // and https://www.ietf.org/rfc/rfc2279.txt
        // and https://tools.ietf.org/html/rfc3629
        var u = str.charCodeAt(i); // possibly a lead surrogate
        if (u >= 0xD800 && u <= 0xDFFF) {
          var u1 = str.charCodeAt(++i);
          u = 0x10000 + ((u & 0x3FF) << 10) | (u1 & 0x3FF);
        }
        if (u <= 0x7F) {
          if (outIdx >= endIdx) break;
          heap[outIdx++] = u;
        } else if (u <= 0x7FF) {
          if (outIdx + 1 >= endIdx) break;
          heap[outIdx++] = 0xC0 | (u >> 6);
          heap[outIdx++] = 0x80 | (u & 63);
        } else if (u <= 0xFFFF) {
          if (outIdx + 2 >= endIdx) break;
          heap[outIdx++] = 0xE0 | (u >> 12);
          heap[outIdx++] = 0x80 | ((u >> 6) & 63);
          heap[outIdx++] = 0x80 | (u & 63);
        } else {
          if (outIdx + 3 >= endIdx) break;
          if (u > 0x10FFFF) warnOnce('Invalid Unicode code point ' + ptrToString(u) + ' encountered when serializing a JS string to a UTF-8 string in wasm memory! (Valid unicode code points should be in range 0-0x10FFFF).');
          heap[outIdx++] = 0xF0 | (u >> 18);
          heap[outIdx++] = 0x80 | ((u >> 12) & 63);
          heap[outIdx++] = 0x80 | ((u >> 6) & 63);
          heap[outIdx++] = 0x80 | (u & 63);
        }
      }
      // Null-terminate the pointer to the buffer.
      heap[outIdx] = 0;
      return outIdx - startIdx;
    };
  var stringToUTF8 = (str, outPtr, maxBytesToWrite) => {
      assert(typeof maxBytesToWrite == 'number', 'stringToUTF8(str, outPtr, maxBytesToWrite) is missing the third parameter that specifies the length of the output buffer!');
      return stringToUTF8Array(str, HEAPU8, outPtr, maxBytesToWrite);
    };
  var fillGamepadEventData = (eventStruct, e) => {
      HEAPF64[((eventStruct)>>3)] = e.timestamp;
      for (var i = 0; i < e.axes.length; ++i) {
        HEAPF64[(((eventStruct+i*8)+(16))>>3)] = e.axes[i];
      }
      for (var i = 0; i < e.buttons.length; ++i) {
        if (typeof e.buttons[i] == 'object') {
          HEAPF64[(((eventStruct+i*8)+(528))>>3)] = e.buttons[i].value;
        } else {
          HEAPF64[(((eventStruct+i*8)+(528))>>3)] = e.buttons[i];
        }
      }
      for (var i = 0; i < e.buttons.length; ++i) {
        if (typeof e.buttons[i] == 'object') {
          HEAP8[(eventStruct+i)+(1040)] = e.buttons[i].pressed;
        } else {
          // Assigning a boolean to HEAP32, that's ok, but Closure would like to warn about it:
          /** @suppress {checkTypes} */
          HEAP8[(eventStruct+i)+(1040)] = e.buttons[i] == 1;
        }
      }
      HEAP8[(eventStruct)+(1104)] = e.connected;
      HEAP32[(((eventStruct)+(1108))>>2)] = e.index;
      HEAP32[(((eventStruct)+(8))>>2)] = e.axes.length;
      HEAP32[(((eventStruct)+(12))>>2)] = e.buttons.length;
      stringToUTF8(e.id, eventStruct + 1112, 64);
      stringToUTF8(e.mapping, eventStruct + 1176, 64);
    };
  var _emscripten_get_gamepad_status = (index, gamepadState) => {
      if (!JSEvents.lastGamepadState) throw 'emscripten_get_gamepad_status() can only be called after having first called emscripten_sample_gamepad_data() and that function has returned EMSCRIPTEN_RESULT_SUCCESS!';
      // INVALID_PARAM is returned on a Gamepad index that never was there.
      if (index < 0 || index >= JSEvents.lastGamepadState.length) return -5;
  
      // NO_DATA is returned on a Gamepad index that was removed.
      // For previously disconnected gamepads there should be an empty slot (null/undefined/false) at the index.
      // This is because gamepads must keep their original position in the array.
      // For example, removing the first of two gamepads produces [null/undefined/false, gamepad].
      if (!JSEvents.lastGamepadState[index]) return -7;
  
      fillGamepadEventData(gamepadState, JSEvents.lastGamepadState[index]);
      return 0;
    };

  var _emscripten_get_num_gamepads = () => {
      if (!JSEvents.lastGamepadState) throw 'emscripten_get_num_gamepads() can only be called after having first called emscripten_sample_gamepad_data() and that function has returned EMSCRIPTEN_RESULT_SUCCESS!';
      // N.B. Do not call emscripten_get_num_gamepads() unless having first called emscripten_sample_gamepad_data(), and that has returned EMSCRIPTEN_RESULT_SUCCESS.
      // Otherwise the following line will throw an exception.
      return JSEvents.lastGamepadState.length;
    };

  var _emscripten_random = () => Math.random();

  var getHeapMax = () =>
      HEAPU8.length;
  
  var alignMemory = (size, alignment) => {
      assert(alignment, "alignment argument is required");
      return Math.ceil(size / alignment) * alignment;
    };
  
  var abortOnCannotGrowMemory = (requestedSize) => {
      abort(`Cannot enlarge memory arrays to size ${requestedSize} bytes (OOM). Either (1) compile with -sINITIAL_MEMORY=X with X higher than the current value ${HEAP8.length}, (2) compile with -sALLOW_MEMORY_GROWTH which allows increasing the size at runtime, or (3) if you want malloc to return NULL (0) instead of this abort, compile with -sABORTING_MALLOC=0`);
    };
  var _emscripten_resize_heap = (requestedSize) => {
      var oldSize = HEAPU8.length;
      // With CAN_ADDRESS_2GB or MEMORY64, pointers are already unsigned.
      requestedSize >>>= 0;
      abortOnCannotGrowMemory(requestedSize);
    };

  /** @suppress {checkTypes} */
  var _emscripten_sample_gamepad_data = () => {
      try {
        if (navigator.getGamepads) return (JSEvents.lastGamepadState = navigator.getGamepads())
          ? 0 : -1;
      } catch(e) {
        err(`navigator.getGamepads() exists, but failed to execute with exception ${e}. Disabling Gamepad access.`);
        navigator.getGamepads = null; // Disable getGamepads() so that it won't be attempted to be used again.
      }
      return -1;
    };

  
  var maybeCStringToJsString = (cString) => {
      // "cString > 2" checks if the input is a number, and isn't of the special
      // values we accept here, EMSCRIPTEN_EVENT_TARGET_* (which map to 0, 1, 2).
      // In other words, if cString > 2 then it's a pointer to a valid place in
      // memory, and points to a C string.
      return cString > 2 ? UTF8ToString(cString) : cString;
    };
  
  /** @type {Object} */
  var specialHTMLTargets = [0, typeof document != 'undefined' ? document : 0, typeof window != 'undefined' ? window : 0];
  var findEventTarget = (target) => {
      target = maybeCStringToJsString(target);
      var domElement = specialHTMLTargets[target] || (typeof document != 'undefined' ? document.querySelector(target) : undefined);
      return domElement;
    };
  
  
  var registerKeyEventCallback = (target, userData, useCapture, callbackfunc, eventTypeId, eventTypeString, targetThread) => {
      JSEvents.keyEvent ||= _malloc(160);
  
      var keyEventHandlerFunc = (e) => {
        assert(e);
  
        var keyEventData = JSEvents.keyEvent;
        HEAPF64[((keyEventData)>>3)] = e.timeStamp;
  
        var idx = ((keyEventData)>>2);
  
        HEAP32[idx + 2] = e.location;
        HEAP8[keyEventData + 12] = e.ctrlKey;
        HEAP8[keyEventData + 13] = e.shiftKey;
        HEAP8[keyEventData + 14] = e.altKey;
        HEAP8[keyEventData + 15] = e.metaKey;
        HEAP8[keyEventData + 16] = e.repeat;
        HEAP32[idx + 5] = e.charCode;
        HEAP32[idx + 6] = e.keyCode;
        HEAP32[idx + 7] = e.which;
        stringToUTF8(e.key || '', keyEventData + 32, 32);
        stringToUTF8(e.code || '', keyEventData + 64, 32);
        stringToUTF8(e.char || '', keyEventData + 96, 32);
        stringToUTF8(e.locale || '', keyEventData + 128, 32);
  
        if (((a1, a2, a3) => dynCall_iiii(callbackfunc, a1, a2, a3))(eventTypeId, keyEventData, userData)) e.preventDefault();
      };
  
      var eventHandler = {
        target: findEventTarget(target),
        eventTypeString,
        callbackfunc,
        handlerFunc: keyEventHandlerFunc,
        useCapture
      };
      return JSEvents.registerOrRemoveHandler(eventHandler);
    };
  var _emscripten_set_keydown_callback_on_thread = (target, userData, useCapture, callbackfunc, targetThread) =>
      registerKeyEventCallback(target, userData, useCapture, callbackfunc, 2, "keydown", targetThread);

  var _emscripten_set_keyup_callback_on_thread = (target, userData, useCapture, callbackfunc, targetThread) =>
      registerKeyEventCallback(target, userData, useCapture, callbackfunc, 3, "keyup", targetThread);

  var _emscripten_set_main_loop_arg = (func, arg, fps, simulateInfiniteLoop) => {
      var iterFunc = () => ((a1) => dynCall_vi(func, a1))(arg);
      setMainLoop(iterFunc, fps, simulateInfiniteLoop, arg);
    };

  
  
  var getBoundingClientRect = (e) => specialHTMLTargets.indexOf(e) < 0 ? e.getBoundingClientRect() : {'left':0,'top':0};
  
  var fillMouseEventData = (eventStruct, e, target) => {
      assert(eventStruct % 4 == 0);
      HEAPF64[((eventStruct)>>3)] = e.timeStamp;
      var idx = ((eventStruct)>>2);
      HEAP32[idx + 2] = e.screenX;
      HEAP32[idx + 3] = e.screenY;
      HEAP32[idx + 4] = e.clientX;
      HEAP32[idx + 5] = e.clientY;
      HEAP8[eventStruct + 24] = e.ctrlKey;
      HEAP8[eventStruct + 25] = e.shiftKey;
      HEAP8[eventStruct + 26] = e.altKey;
      HEAP8[eventStruct + 27] = e.metaKey;
      HEAP16[idx*2 + 14] = e.button;
      HEAP16[idx*2 + 15] = e.buttons;
  
      HEAP32[idx + 8] = e["movementX"]
        ;
  
      HEAP32[idx + 9] = e["movementY"]
        ;
  
      // Note: rect contains doubles (truncated to placate SAFE_HEAP, which is the same behaviour when writing to HEAP32 anyway)
      var rect = getBoundingClientRect(target);
      HEAP32[idx + 10] = e.clientX - (rect.left | 0);
      HEAP32[idx + 11] = e.clientY - (rect.top  | 0);
  
    };
  
  
  var registerMouseEventCallback = (target, userData, useCapture, callbackfunc, eventTypeId, eventTypeString, targetThread) => {
      JSEvents.mouseEvent ||= _malloc(64);
      target = findEventTarget(target);
  
      var mouseEventHandlerFunc = (e = event) => {
        // TODO: Make this access thread safe, or this could update live while app is reading it.
        fillMouseEventData(JSEvents.mouseEvent, e, target);
  
        if (((a1, a2, a3) => dynCall_iiii(callbackfunc, a1, a2, a3))(eventTypeId, JSEvents.mouseEvent, userData)) e.preventDefault();
      };
  
      var eventHandler = {
        target,
        allowsDeferredCalls: eventTypeString != 'mousemove' && eventTypeString != 'mouseenter' && eventTypeString != 'mouseleave', // Mouse move events do not allow fullscreen/pointer lock requests to be handled in them!
        eventTypeString,
        callbackfunc,
        handlerFunc: mouseEventHandlerFunc,
        useCapture
      };
      return JSEvents.registerOrRemoveHandler(eventHandler);
    };
  var _emscripten_set_mousedown_callback_on_thread = (target, userData, useCapture, callbackfunc, targetThread) =>
      registerMouseEventCallback(target, userData, useCapture, callbackfunc, 5, "mousedown", targetThread);

  var _emscripten_set_mousemove_callback_on_thread = (target, userData, useCapture, callbackfunc, targetThread) =>
      registerMouseEventCallback(target, userData, useCapture, callbackfunc, 8, "mousemove", targetThread);

  var _emscripten_set_mouseup_callback_on_thread = (target, userData, useCapture, callbackfunc, targetThread) =>
      registerMouseEventCallback(target, userData, useCapture, callbackfunc, 6, "mouseup", targetThread);

  
  
  
  
  var registerWheelEventCallback = (target, userData, useCapture, callbackfunc, eventTypeId, eventTypeString, targetThread) => {
      JSEvents.wheelEvent ||= _malloc(96);
  
      // The DOM Level 3 events spec event 'wheel'
      var wheelHandlerFunc = (e = event) => {
        var wheelEvent = JSEvents.wheelEvent;
        fillMouseEventData(wheelEvent, e, target);
        HEAPF64[(((wheelEvent)+(64))>>3)] = e["deltaX"];
        HEAPF64[(((wheelEvent)+(72))>>3)] = e["deltaY"];
        HEAPF64[(((wheelEvent)+(80))>>3)] = e["deltaZ"];
        HEAP32[(((wheelEvent)+(88))>>2)] = e["deltaMode"];
        if (((a1, a2, a3) => dynCall_iiii(callbackfunc, a1, a2, a3))(eventTypeId, wheelEvent, userData)) e.preventDefault();
      };
  
      var eventHandler = {
        target,
        allowsDeferredCalls: true,
        eventTypeString,
        callbackfunc,
        handlerFunc: wheelHandlerFunc,
        useCapture
      };
      return JSEvents.registerOrRemoveHandler(eventHandler);
    };
  
  var _emscripten_set_wheel_callback_on_thread = (target, userData, useCapture, callbackfunc, targetThread) => {
      target = findEventTarget(target);
      if (!target) return -4;
      if (typeof target.onwheel != 'undefined') {
        return registerWheelEventCallback(target, userData, useCapture, callbackfunc, 9, "wheel", targetThread);
      } else {
        return -1;
      }
    };

  
  /** @param {number=} timeout */
  var safeSetTimeout = (func, timeout) => {
      
      return setTimeout(() => {
        
        callUserCallback(func);
      }, timeout);
    };
  
  
  var preloadPlugins = Module['preloadPlugins'] || [];
  
  var Browser = {
  useWebGL:false,
  isFullscreen:false,
  pointerLock:false,
  moduleContextCreatedCallbacks:[],
  workers:[],
  init() {
        if (Browser.initted) return;
        Browser.initted = true;
  
        // Support for plugins that can process preloaded files. You can add more of these to
        // your app by creating and appending to preloadPlugins.
        //
        // Each plugin is asked if it can handle a file based on the file's name. If it can,
        // it is given the file's raw data. When it is done, it calls a callback with the file's
        // (possibly modified) data. For example, a plugin might decompress a file, or it
        // might create some side data structure for use later (like an Image element, etc.).
  
        var imagePlugin = {};
        imagePlugin['canHandle'] = function imagePlugin_canHandle(name) {
          return !Module['noImageDecoding'] && /\.(jpg|jpeg|png|bmp|webp)$/i.test(name);
        };
        imagePlugin['handle'] = function imagePlugin_handle(byteArray, name, onload, onerror) {
          var b = new Blob([byteArray], { type: Browser.getMimetype(name) });
          if (b.size !== byteArray.length) { // Safari bug #118630
            // Safari's Blob can only take an ArrayBuffer
            b = new Blob([(new Uint8Array(byteArray)).buffer], { type: Browser.getMimetype(name) });
          }
          var url = URL.createObjectURL(b);
          assert(typeof url == 'string', 'createObjectURL must return a url as a string');
          var img = new Image();
          img.onload = () => {
            assert(img.complete, `Image ${name} could not be decoded`);
            var canvas = /** @type {!HTMLCanvasElement} */ (document.createElement('canvas'));
            canvas.width = img.width;
            canvas.height = img.height;
            var ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);
            preloadedImages[name] = canvas;
            URL.revokeObjectURL(url);
            onload?.(byteArray);
          };
          img.onerror = (event) => {
            err(`Image ${url} could not be decoded`);
            onerror?.();
          };
          img.src = url;
        };
        preloadPlugins.push(imagePlugin);
  
        var audioPlugin = {};
        audioPlugin['canHandle'] = function audioPlugin_canHandle(name) {
          return !Module['noAudioDecoding'] && name.substr(-4) in { '.ogg': 1, '.wav': 1, '.mp3': 1 };
        };
        audioPlugin['handle'] = function audioPlugin_handle(byteArray, name, onload, onerror) {
          var done = false;
          function finish(audio) {
            if (done) return;
            done = true;
            preloadedAudios[name] = audio;
            onload?.(byteArray);
          }
          function fail() {
            if (done) return;
            done = true;
            preloadedAudios[name] = new Audio(); // empty shim
            onerror?.();
          }
          var b = new Blob([byteArray], { type: Browser.getMimetype(name) });
          var url = URL.createObjectURL(b); // XXX we never revoke this!
          assert(typeof url == 'string', 'createObjectURL must return a url as a string');
          var audio = new Audio();
          audio.addEventListener('canplaythrough', () => finish(audio), false); // use addEventListener due to chromium bug 124926
          audio.onerror = function audio_onerror(event) {
            if (done) return;
            err(`warning: browser could not fully decode audio ${name}, trying slower base64 approach`);
            function encode64(data) {
              var BASE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
              var PAD = '=';
              var ret = '';
              var leftchar = 0;
              var leftbits = 0;
              for (var i = 0; i < data.length; i++) {
                leftchar = (leftchar << 8) | data[i];
                leftbits += 8;
                while (leftbits >= 6) {
                  var curr = (leftchar >> (leftbits-6)) & 0x3f;
                  leftbits -= 6;
                  ret += BASE[curr];
                }
              }
              if (leftbits == 2) {
                ret += BASE[(leftchar&3) << 4];
                ret += PAD + PAD;
              } else if (leftbits == 4) {
                ret += BASE[(leftchar&0xf) << 2];
                ret += PAD;
              }
              return ret;
            }
            audio.src = 'data:audio/x-' + name.substr(-3) + ';base64,' + encode64(byteArray);
            finish(audio); // we don't wait for confirmation this worked - but it's worth trying
          };
          audio.src = url;
          // workaround for chrome bug 124926 - we do not always get oncanplaythrough or onerror
          safeSetTimeout(() => {
            finish(audio); // try to use it even though it is not necessarily ready to play
          }, 10000);
        };
        preloadPlugins.push(audioPlugin);
  
        // Canvas event setup
  
        function pointerLockChange() {
          Browser.pointerLock = document['pointerLockElement'] === Module['canvas'] ||
                                document['mozPointerLockElement'] === Module['canvas'] ||
                                document['webkitPointerLockElement'] === Module['canvas'] ||
                                document['msPointerLockElement'] === Module['canvas'];
        }
        var canvas = Module['canvas'];
        if (canvas) {
          // forced aspect ratio can be enabled by defining 'forcedAspectRatio' on Module
          // Module['forcedAspectRatio'] = 4 / 3;
  
          canvas.requestPointerLock = canvas['requestPointerLock'] ||
                                      canvas['mozRequestPointerLock'] ||
                                      canvas['webkitRequestPointerLock'] ||
                                      canvas['msRequestPointerLock'] ||
                                      (() => {});
          canvas.exitPointerLock = document['exitPointerLock'] ||
                                   document['mozExitPointerLock'] ||
                                   document['webkitExitPointerLock'] ||
                                   document['msExitPointerLock'] ||
                                   (() => {}); // no-op if function does not exist
          canvas.exitPointerLock = canvas.exitPointerLock.bind(document);
  
          document.addEventListener('pointerlockchange', pointerLockChange, false);
          document.addEventListener('mozpointerlockchange', pointerLockChange, false);
          document.addEventListener('webkitpointerlockchange', pointerLockChange, false);
          document.addEventListener('mspointerlockchange', pointerLockChange, false);
  
          if (Module['elementPointerLock']) {
            canvas.addEventListener("click", (ev) => {
              if (!Browser.pointerLock && Module['canvas'].requestPointerLock) {
                Module['canvas'].requestPointerLock();
                ev.preventDefault();
              }
            }, false);
          }
        }
      },
  createContext(/** @type {HTMLCanvasElement} */ canvas, useWebGL, setInModule, webGLContextAttributes) {
        if (useWebGL && Module.ctx && canvas == Module.canvas) return Module.ctx; // no need to recreate GL context if it's already been created for this canvas.
  
        var ctx;
        var contextHandle;
        if (useWebGL) {
          // For GLES2/desktop GL compatibility, adjust a few defaults to be different to WebGL defaults, so that they align better with the desktop defaults.
          var contextAttributes = {
            antialias: false,
            alpha: false,
            majorVersion: 1,
          };
  
          if (webGLContextAttributes) {
            for (var attribute in webGLContextAttributes) {
              contextAttributes[attribute] = webGLContextAttributes[attribute];
            }
          }
  
          // This check of existence of GL is here to satisfy Closure compiler, which yells if variable GL is referenced below but GL object is not
          // actually compiled in because application is not doing any GL operations. TODO: Ideally if GL is not being used, this function
          // Browser.createContext() should not even be emitted.
          if (typeof GL != 'undefined') {
            contextHandle = GL.createContext(canvas, contextAttributes);
            if (contextHandle) {
              ctx = GL.getContext(contextHandle).GLctx;
            }
          }
        } else {
          ctx = canvas.getContext('2d');
        }
  
        if (!ctx) return null;
  
        if (setInModule) {
          if (!useWebGL) assert(typeof GLctx == 'undefined', 'cannot set in module if GLctx is used, but we are a non-GL context that would replace it');
          Module.ctx = ctx;
          if (useWebGL) GL.makeContextCurrent(contextHandle);
          Browser.useWebGL = useWebGL;
          Browser.moduleContextCreatedCallbacks.forEach((callback) => callback());
          Browser.init();
        }
        return ctx;
      },
  fullscreenHandlersInstalled:false,
  lockPointer:undefined,
  resizeCanvas:undefined,
  requestFullscreen(lockPointer, resizeCanvas) {
        Browser.lockPointer = lockPointer;
        Browser.resizeCanvas = resizeCanvas;
        if (typeof Browser.lockPointer == 'undefined') Browser.lockPointer = true;
        if (typeof Browser.resizeCanvas == 'undefined') Browser.resizeCanvas = false;
  
        var canvas = Module['canvas'];
        function fullscreenChange() {
          Browser.isFullscreen = false;
          var canvasContainer = canvas.parentNode;
          if ((document['fullscreenElement'] || document['mozFullScreenElement'] ||
               document['msFullscreenElement'] || document['webkitFullscreenElement'] ||
               document['webkitCurrentFullScreenElement']) === canvasContainer) {
            canvas.exitFullscreen = Browser.exitFullscreen;
            if (Browser.lockPointer) canvas.requestPointerLock();
            Browser.isFullscreen = true;
            if (Browser.resizeCanvas) {
              Browser.setFullscreenCanvasSize();
            } else {
              Browser.updateCanvasDimensions(canvas);
            }
          } else {
            // remove the full screen specific parent of the canvas again to restore the HTML structure from before going full screen
            canvasContainer.parentNode.insertBefore(canvas, canvasContainer);
            canvasContainer.parentNode.removeChild(canvasContainer);
  
            if (Browser.resizeCanvas) {
              Browser.setWindowedCanvasSize();
            } else {
              Browser.updateCanvasDimensions(canvas);
            }
          }
          Module['onFullScreen']?.(Browser.isFullscreen);
          Module['onFullscreen']?.(Browser.isFullscreen);
        }
  
        if (!Browser.fullscreenHandlersInstalled) {
          Browser.fullscreenHandlersInstalled = true;
          document.addEventListener('fullscreenchange', fullscreenChange, false);
          document.addEventListener('mozfullscreenchange', fullscreenChange, false);
          document.addEventListener('webkitfullscreenchange', fullscreenChange, false);
          document.addEventListener('MSFullscreenChange', fullscreenChange, false);
        }
  
        // create a new parent to ensure the canvas has no siblings. this allows browsers to optimize full screen performance when its parent is the full screen root
        var canvasContainer = document.createElement("div");
        canvas.parentNode.insertBefore(canvasContainer, canvas);
        canvasContainer.appendChild(canvas);
  
        // use parent of canvas as full screen root to allow aspect ratio correction (Firefox stretches the root to screen size)
        canvasContainer.requestFullscreen = canvasContainer['requestFullscreen'] ||
                                            canvasContainer['mozRequestFullScreen'] ||
                                            canvasContainer['msRequestFullscreen'] ||
                                           (canvasContainer['webkitRequestFullscreen'] ? () => canvasContainer['webkitRequestFullscreen'](Element['ALLOW_KEYBOARD_INPUT']) : null) ||
                                           (canvasContainer['webkitRequestFullScreen'] ? () => canvasContainer['webkitRequestFullScreen'](Element['ALLOW_KEYBOARD_INPUT']) : null);
  
        canvasContainer.requestFullscreen();
      },
  requestFullScreen() {
        abort('Module.requestFullScreen has been replaced by Module.requestFullscreen (without a capital S)');
      },
  exitFullscreen() {
        // This is workaround for chrome. Trying to exit from fullscreen
        // not in fullscreen state will cause "TypeError: Document not active"
        // in chrome. See https://github.com/emscripten-core/emscripten/pull/8236
        if (!Browser.isFullscreen) {
          return false;
        }
  
        var CFS = document['exitFullscreen'] ||
                  document['cancelFullScreen'] ||
                  document['mozCancelFullScreen'] ||
                  document['msExitFullscreen'] ||
                  document['webkitCancelFullScreen'] ||
            (() => {});
        CFS.apply(document, []);
        return true;
      },
  safeSetTimeout(func, timeout) {
        // Legacy function, this is used by the SDL2 port so we need to keep it
        // around at least until that is updated.
        // See https://github.com/libsdl-org/SDL/pull/6304
        return safeSetTimeout(func, timeout);
      },
  getMimetype(name) {
        return {
          'jpg': 'image/jpeg',
          'jpeg': 'image/jpeg',
          'png': 'image/png',
          'bmp': 'image/bmp',
          'ogg': 'audio/ogg',
          'wav': 'audio/wav',
          'mp3': 'audio/mpeg'
        }[name.substr(name.lastIndexOf('.')+1)];
      },
  getUserMedia(func) {
        window.getUserMedia ||= navigator['getUserMedia'] ||
                                navigator['mozGetUserMedia'];
        window.getUserMedia(func);
      },
  getMovementX(event) {
        return event['movementX'] ||
               event['mozMovementX'] ||
               event['webkitMovementX'] ||
               0;
      },
  getMovementY(event) {
        return event['movementY'] ||
               event['mozMovementY'] ||
               event['webkitMovementY'] ||
               0;
      },
  getMouseWheelDelta(event) {
        var delta = 0;
        switch (event.type) {
          case 'DOMMouseScroll':
            // 3 lines make up a step
            delta = event.detail / 3;
            break;
          case 'mousewheel':
            // 120 units make up a step
            delta = event.wheelDelta / 120;
            break;
          case 'wheel':
            delta = event.deltaY
            switch (event.deltaMode) {
              case 0:
                // DOM_DELTA_PIXEL: 100 pixels make up a step
                delta /= 100;
                break;
              case 1:
                // DOM_DELTA_LINE: 3 lines make up a step
                delta /= 3;
                break;
              case 2:
                // DOM_DELTA_PAGE: A page makes up 80 steps
                delta *= 80;
                break;
              default:
                throw 'unrecognized mouse wheel delta mode: ' + event.deltaMode;
            }
            break;
          default:
            throw 'unrecognized mouse wheel event: ' + event.type;
        }
        return delta;
      },
  mouseX:0,
  mouseY:0,
  mouseMovementX:0,
  mouseMovementY:0,
  touches:{
  },
  lastTouches:{
  },
  calculateMouseCoords(pageX, pageY) {
        // Calculate the movement based on the changes
        // in the coordinates.
        var rect = Module["canvas"].getBoundingClientRect();
        var cw = Module["canvas"].width;
        var ch = Module["canvas"].height;
  
        // Neither .scrollX or .pageXOffset are defined in a spec, but
        // we prefer .scrollX because it is currently in a spec draft.
        // (see: http://www.w3.org/TR/2013/WD-cssom-view-20131217/)
        var scrollX = ((typeof window.scrollX != 'undefined') ? window.scrollX : window.pageXOffset);
        var scrollY = ((typeof window.scrollY != 'undefined') ? window.scrollY : window.pageYOffset);
        // If this assert lands, it's likely because the browser doesn't support scrollX or pageXOffset
        // and we have no viable fallback.
        assert((typeof scrollX != 'undefined') && (typeof scrollY != 'undefined'), 'Unable to retrieve scroll position, mouse positions likely broken.');
        var adjustedX = pageX - (scrollX + rect.left);
        var adjustedY = pageY - (scrollY + rect.top);
  
        // the canvas might be CSS-scaled compared to its backbuffer;
        // SDL-using content will want mouse coordinates in terms
        // of backbuffer units.
        adjustedX = adjustedX * (cw / rect.width);
        adjustedY = adjustedY * (ch / rect.height);
  
        return { x: adjustedX, y: adjustedY };
      },
  setMouseCoords(pageX, pageY) {
        const {x, y} = Browser.calculateMouseCoords(pageX, pageY);
        Browser.mouseMovementX = x - Browser.mouseX;
        Browser.mouseMovementY = y - Browser.mouseY;
        Browser.mouseX = x;
        Browser.mouseY = y;
      },
  calculateMouseEvent(event) { // event should be mousemove, mousedown or mouseup
        if (Browser.pointerLock) {
          // When the pointer is locked, calculate the coordinates
          // based on the movement of the mouse.
          // Workaround for Firefox bug 764498
          if (event.type != 'mousemove' &&
              ('mozMovementX' in event)) {
            Browser.mouseMovementX = Browser.mouseMovementY = 0;
          } else {
            Browser.mouseMovementX = Browser.getMovementX(event);
            Browser.mouseMovementY = Browser.getMovementY(event);
          }
  
          // add the mouse delta to the current absolute mouse position
          Browser.mouseX += Browser.mouseMovementX;
          Browser.mouseY += Browser.mouseMovementY;
        } else {
          if (event.type === 'touchstart' || event.type === 'touchend' || event.type === 'touchmove') {
            var touch = event.touch;
            if (touch === undefined) {
              return; // the "touch" property is only defined in SDL
  
            }
            var coords = Browser.calculateMouseCoords(touch.pageX, touch.pageY);
  
            if (event.type === 'touchstart') {
              Browser.lastTouches[touch.identifier] = coords;
              Browser.touches[touch.identifier] = coords;
            } else if (event.type === 'touchend' || event.type === 'touchmove') {
              var last = Browser.touches[touch.identifier];
              last ||= coords;
              Browser.lastTouches[touch.identifier] = last;
              Browser.touches[touch.identifier] = coords;
            }
            return;
          }
  
          Browser.setMouseCoords(event.pageX, event.pageY);
        }
      },
  resizeListeners:[],
  updateResizeListeners() {
        var canvas = Module['canvas'];
        Browser.resizeListeners.forEach((listener) => listener(canvas.width, canvas.height));
      },
  setCanvasSize(width, height, noUpdates) {
        var canvas = Module['canvas'];
        Browser.updateCanvasDimensions(canvas, width, height);
        if (!noUpdates) Browser.updateResizeListeners();
      },
  windowedWidth:0,
  windowedHeight:0,
  setFullscreenCanvasSize() {
        // check if SDL is available
        if (typeof SDL != "undefined") {
          var flags = HEAPU32[((SDL.screen)>>2)];
          flags = flags | 0x00800000; // set SDL_FULLSCREEN flag
          HEAP32[((SDL.screen)>>2)] = flags;
        }
        Browser.updateCanvasDimensions(Module['canvas']);
        Browser.updateResizeListeners();
      },
  setWindowedCanvasSize() {
        // check if SDL is available
        if (typeof SDL != "undefined") {
          var flags = HEAPU32[((SDL.screen)>>2)];
          flags = flags & ~0x00800000; // clear SDL_FULLSCREEN flag
          HEAP32[((SDL.screen)>>2)] = flags;
        }
        Browser.updateCanvasDimensions(Module['canvas']);
        Browser.updateResizeListeners();
      },
  updateCanvasDimensions(canvas, wNative, hNative) {
        if (wNative && hNative) {
          canvas.widthNative = wNative;
          canvas.heightNative = hNative;
        } else {
          wNative = canvas.widthNative;
          hNative = canvas.heightNative;
        }
        var w = wNative;
        var h = hNative;
        if (Module['forcedAspectRatio'] && Module['forcedAspectRatio'] > 0) {
          if (w/h < Module['forcedAspectRatio']) {
            w = Math.round(h * Module['forcedAspectRatio']);
          } else {
            h = Math.round(w / Module['forcedAspectRatio']);
          }
        }
        if (((document['fullscreenElement'] || document['mozFullScreenElement'] ||
             document['msFullscreenElement'] || document['webkitFullscreenElement'] ||
             document['webkitCurrentFullScreenElement']) === canvas.parentNode) && (typeof screen != 'undefined')) {
           var factor = Math.min(screen.width / w, screen.height / h);
           w = Math.round(w * factor);
           h = Math.round(h * factor);
        }
        if (Browser.resizeCanvas) {
          if (canvas.width  != w) canvas.width  = w;
          if (canvas.height != h) canvas.height = h;
          if (typeof canvas.style != 'undefined') {
            canvas.style.removeProperty( "width");
            canvas.style.removeProperty("height");
          }
        } else {
          if (canvas.width  != wNative) canvas.width  = wNative;
          if (canvas.height != hNative) canvas.height = hNative;
          if (typeof canvas.style != 'undefined') {
            if (w != wNative || h != hNative) {
              canvas.style.setProperty( "width", w + "px", "important");
              canvas.style.setProperty("height", h + "px", "important");
            } else {
              canvas.style.removeProperty( "width");
              canvas.style.removeProperty("height");
            }
          }
        }
      },
  };
  
  var _emscripten_set_window_title = (title) => document.title = UTF8ToString(title);

  var SYSCALLS = {
  varargs:undefined,
  getStr(ptr) {
        var ret = UTF8ToString(ptr);
        return ret;
      },
  };
  var _fd_close = (fd) => {
      abort('fd_close called without SYSCALLS_REQUIRE_FILESYSTEM');
    };

  var convertI32PairToI53Checked = (lo, hi) => {
      assert(lo == (lo >>> 0) || lo == (lo|0)); // lo should either be a i32 or a u32
      assert(hi === (hi|0));                    // hi should be a i32
      return ((hi + 0x200000) >>> 0 < 0x400001 - !!lo) ? (lo >>> 0) + hi * 4294967296 : NaN;
    };
  function _fd_seek(fd,offset_low, offset_high,whence,newOffset) {
    var offset = convertI32PairToI53Checked(offset_low, offset_high);
  
    
      return 70;
    ;
  }

  var printCharBuffers = [null,[],[]];
  
  var printChar = (stream, curr) => {
      var buffer = printCharBuffers[stream];
      assert(buffer);
      if (curr === 0 || curr === 10) {
        (stream === 1 ? out : err)(UTF8ArrayToString(buffer));
        buffer.length = 0;
      } else {
        buffer.push(curr);
      }
    };
  
  var flush_NO_FILESYSTEM = () => {
      // flush anything remaining in the buffers during shutdown
      _fflush(0);
      if (printCharBuffers[1].length) printChar(1, 10);
      if (printCharBuffers[2].length) printChar(2, 10);
    };
  
  
  var _fd_write = (fd, iov, iovcnt, pnum) => {
      // hack to support printf in SYSCALLS_REQUIRE_FILESYSTEM=0
      var num = 0;
      for (var i = 0; i < iovcnt; i++) {
        var ptr = HEAPU32[((iov)>>2)];
        var len = HEAPU32[(((iov)+(4))>>2)];
        iov += 8;
        for (var j = 0; j < len; j++) {
          printChar(fd, HEAPU8[ptr+j]);
        }
        num += len;
      }
      HEAPU32[((pnum)>>2)] = num;
      return 0;
    };



  var lengthBytesUTF8 = (str) => {
      var len = 0;
      for (var i = 0; i < str.length; ++i) {
        // Gotcha: charCodeAt returns a 16-bit word that is a UTF-16 encoded code
        // unit, not a Unicode code point of the character! So decode
        // UTF16->UTF32->UTF8.
        // See http://unicode.org/faq/utf_bom.html#utf16-3
        var c = str.charCodeAt(i); // possibly a lead surrogate
        if (c <= 0x7F) {
          len++;
        } else if (c <= 0x7FF) {
          len += 2;
        } else if (c >= 0xD800 && c <= 0xDFFF) {
          len += 4; ++i;
        } else {
          len += 3;
        }
      }
      return len;
    };
  
  
  var stackAlloc = (sz) => __emscripten_stack_alloc(sz);
  var stringToUTF8OnStack = (str) => {
      var size = lengthBytesUTF8(str) + 1;
      var ret = stackAlloc(size);
      stringToUTF8(str, ret, size);
      return ret;
    };

  
  var withStackSave = (f) => {
      var stack = stackSave();
      var ret = f();
      stackRestore(stack);
      return ret;
    };


  var runAndAbortIfError = (func) => {
      try {
        return func();
      } catch (e) {
        abort(e);
      }
    };
  
  
  var sigToWasmTypes = (sig) => {
      assert(!sig.includes('j'), 'i64 not permitted in function signatures when WASM_BIGINT is disabled');
      var typeNames = {
        'i': 'i32',
        'j': 'i64',
        'f': 'f32',
        'd': 'f64',
        'e': 'externref',
        'p': 'i32',
      };
      var type = {
        parameters: [],
        results: sig[0] == 'v' ? [] : [typeNames[sig[0]]]
      };
      for (var i = 1; i < sig.length; ++i) {
        assert(sig[i] in typeNames, 'invalid signature char: ' + sig[i]);
        type.parameters.push(typeNames[sig[i]]);
      }
      return type;
    };
  
  var runtimeKeepalivePush = () => {
      runtimeKeepaliveCounter += 1;
    };
  
  var runtimeKeepalivePop = () => {
      assert(runtimeKeepaliveCounter > 0);
      runtimeKeepaliveCounter -= 1;
    };
  
  
  var Asyncify = {
  instrumentWasmImports(imports) {
        var importPattern = /^(invoke_.*|__asyncjs__.*)$/;
  
        for (let [x, original] of Object.entries(imports)) {
          if (typeof original == 'function') {
            let isAsyncifyImport = original.isAsync || importPattern.test(x);
            imports[x] = (...args) => {
              var originalAsyncifyState = Asyncify.state;
              try {
                return original(...args);
              } finally {
                // Only asyncify-declared imports are allowed to change the
                // state.
                // Changing the state from normal to disabled is allowed (in any
                // function) as that is what shutdown does (and we don't have an
                // explicit list of shutdown imports).
                var changedToDisabled =
                      originalAsyncifyState === Asyncify.State.Normal &&
                      Asyncify.state        === Asyncify.State.Disabled;
                // invoke_* functions are allowed to change the state if we do
                // not ignore indirect calls.
                var ignoredInvoke = x.startsWith('invoke_') &&
                                    true;
                if (Asyncify.state !== originalAsyncifyState &&
                    !isAsyncifyImport &&
                    !changedToDisabled &&
                    !ignoredInvoke) {
                  throw new Error(`import ${x} was not in ASYNCIFY_IMPORTS, but changed the state`);
                }
              }
            };
          }
        }
      },
  instrumentWasmExports(exports) {
        var ret = {};
        for (let [x, original] of Object.entries(exports)) {
          if (typeof original == 'function') {
            ret[x] = (...args) => {
              Asyncify.exportCallStack.push(x);
              try {
                return original(...args);
              } finally {
                if (!ABORT) {
                  var y = Asyncify.exportCallStack.pop();
                  assert(y === x);
                  Asyncify.maybeStopUnwind();
                }
              }
            };
          } else {
            ret[x] = original;
          }
        }
        return ret;
      },
  State:{
  Normal:0,
  Unwinding:1,
  Rewinding:2,
  Disabled:3,
  },
  state:0,
  StackSize:4096,
  currData:null,
  handleSleepReturnValue:0,
  exportCallStack:[],
  callStackNameToId:{
  },
  callStackIdToName:{
  },
  callStackId:0,
  asyncPromiseHandlers:null,
  sleepCallbacks:[],
  getCallStackId(funcName) {
        var id = Asyncify.callStackNameToId[funcName];
        if (id === undefined) {
          id = Asyncify.callStackId++;
          Asyncify.callStackNameToId[funcName] = id;
          Asyncify.callStackIdToName[id] = funcName;
        }
        return id;
      },
  maybeStopUnwind() {
        if (Asyncify.currData &&
            Asyncify.state === Asyncify.State.Unwinding &&
            Asyncify.exportCallStack.length === 0) {
          // We just finished unwinding.
          // Be sure to set the state before calling any other functions to avoid
          // possible infinite recursion here (For example in debug pthread builds
          // the dbg() function itself can call back into WebAssembly to get the
          // current pthread_self() pointer).
          Asyncify.state = Asyncify.State.Normal;
          
          // Keep the runtime alive so that a re-wind can be done later.
          runAndAbortIfError(_asyncify_stop_unwind);
          if (typeof Fibers != 'undefined') {
            Fibers.trampoline();
          }
        }
      },
  whenDone() {
        assert(Asyncify.currData, 'Tried to wait for an async operation when none is in progress.');
        assert(!Asyncify.asyncPromiseHandlers, 'Cannot have multiple async operations in flight at once');
        return new Promise((resolve, reject) => {
          Asyncify.asyncPromiseHandlers = { resolve, reject };
        });
      },
  allocateData() {
        // An asyncify data structure has three fields:
        //  0  current stack pos
        //  4  max stack pos
        //  8  id of function at bottom of the call stack (callStackIdToName[id] == name of js function)
        //
        // The Asyncify ABI only interprets the first two fields, the rest is for the runtime.
        // We also embed a stack in the same memory region here, right next to the structure.
        // This struct is also defined as asyncify_data_t in emscripten/fiber.h
        var ptr = _malloc(12 + Asyncify.StackSize);
        Asyncify.setDataHeader(ptr, ptr + 12, Asyncify.StackSize);
        Asyncify.setDataRewindFunc(ptr);
        return ptr;
      },
  setDataHeader(ptr, stack, stackSize) {
        HEAPU32[((ptr)>>2)] = stack;
        HEAPU32[(((ptr)+(4))>>2)] = stack + stackSize;
      },
  setDataRewindFunc(ptr) {
        var bottomOfCallStack = Asyncify.exportCallStack[0];
        var rewindId = Asyncify.getCallStackId(bottomOfCallStack);
        HEAP32[(((ptr)+(8))>>2)] = rewindId;
      },
  getDataRewindFuncName(ptr) {
        var id = HEAP32[(((ptr)+(8))>>2)];
        var name = Asyncify.callStackIdToName[id];
        return name;
      },
  getDataRewindFunc(name) {
        var func = wasmExports[name];
        return func;
      },
  doRewind(ptr) {
        var name = Asyncify.getDataRewindFuncName(ptr);
        var func = Asyncify.getDataRewindFunc(name);
        // Once we have rewound and the stack we no longer need to artificially
        // keep the runtime alive.
        
        return func();
      },
  handleSleep(startAsync) {
        assert(Asyncify.state !== Asyncify.State.Disabled, 'Asyncify cannot be done during or after the runtime exits');
        if (ABORT) return;
        if (Asyncify.state === Asyncify.State.Normal) {
          // Prepare to sleep. Call startAsync, and see what happens:
          // if the code decided to call our callback synchronously,
          // then no async operation was in fact begun, and we don't
          // need to do anything.
          var reachedCallback = false;
          var reachedAfterCallback = false;
          startAsync((handleSleepReturnValue = 0) => {
            assert(!handleSleepReturnValue || typeof handleSleepReturnValue == 'number' || typeof handleSleepReturnValue == 'boolean'); // old emterpretify API supported other stuff
            if (ABORT) return;
            Asyncify.handleSleepReturnValue = handleSleepReturnValue;
            reachedCallback = true;
            if (!reachedAfterCallback) {
              // We are happening synchronously, so no need for async.
              return;
            }
            // This async operation did not happen synchronously, so we did
            // unwind. In that case there can be no compiled code on the stack,
            // as it might break later operations (we can rewind ok now, but if
            // we unwind again, we would unwind through the extra compiled code
            // too).
            assert(!Asyncify.exportCallStack.length, 'Waking up (starting to rewind) must be done from JS, without compiled code on the stack.');
            Asyncify.state = Asyncify.State.Rewinding;
            runAndAbortIfError(() => _asyncify_start_rewind(Asyncify.currData));
            if (typeof MainLoop != 'undefined' && MainLoop.func) {
              MainLoop.resume();
            }
            var asyncWasmReturnValue, isError = false;
            try {
              asyncWasmReturnValue = Asyncify.doRewind(Asyncify.currData);
            } catch (err) {
              asyncWasmReturnValue = err;
              isError = true;
            }
            // Track whether the return value was handled by any promise handlers.
            var handled = false;
            if (!Asyncify.currData) {
              // All asynchronous execution has finished.
              // `asyncWasmReturnValue` now contains the final
              // return value of the exported async WASM function.
              //
              // Note: `asyncWasmReturnValue` is distinct from
              // `Asyncify.handleSleepReturnValue`.
              // `Asyncify.handleSleepReturnValue` contains the return
              // value of the last C function to have executed
              // `Asyncify.handleSleep()`, where as `asyncWasmReturnValue`
              // contains the return value of the exported WASM function
              // that may have called C functions that
              // call `Asyncify.handleSleep()`.
              var asyncPromiseHandlers = Asyncify.asyncPromiseHandlers;
              if (asyncPromiseHandlers) {
                Asyncify.asyncPromiseHandlers = null;
                (isError ? asyncPromiseHandlers.reject : asyncPromiseHandlers.resolve)(asyncWasmReturnValue);
                handled = true;
              }
            }
            if (isError && !handled) {
              // If there was an error and it was not handled by now, we have no choice but to
              // rethrow that error into the global scope where it can be caught only by
              // `onerror` or `onunhandledpromiserejection`.
              throw asyncWasmReturnValue;
            }
          });
          reachedAfterCallback = true;
          if (!reachedCallback) {
            // A true async operation was begun; start a sleep.
            Asyncify.state = Asyncify.State.Unwinding;
            // TODO: reuse, don't alloc/free every sleep
            Asyncify.currData = Asyncify.allocateData();
            if (typeof MainLoop != 'undefined' && MainLoop.func) {
              MainLoop.pause();
            }
            runAndAbortIfError(() => _asyncify_start_unwind(Asyncify.currData));
          }
        } else if (Asyncify.state === Asyncify.State.Rewinding) {
          // Stop a resume.
          Asyncify.state = Asyncify.State.Normal;
          runAndAbortIfError(_asyncify_stop_rewind);
          _free(Asyncify.currData);
          Asyncify.currData = null;
          // Call all sleep callbacks now that the sleep-resume is all done.
          Asyncify.sleepCallbacks.forEach(callUserCallback);
        } else {
          abort(`invalid state: ${Asyncify.state}`);
        }
        return Asyncify.handleSleepReturnValue;
      },
  handleAsync(startAsync) {
        return Asyncify.handleSleep((wakeUp) => {
          // TODO: add error handling as a second param when handleSleep implements it.
          startAsync().then(wakeUp);
        });
      },
  };

  var writeArrayToMemory = (array, buffer) => {
      assert(array.length >= 0, 'writeArrayToMemory array must have a length (should be an array or typed array)')
      HEAP8.set(array, buffer);
    };


      Module["requestAnimationFrame"] = MainLoop.requestAnimationFrame;
      Module["pauseMainLoop"] = MainLoop.pause;
      Module["resumeMainLoop"] = MainLoop.resume;
      MainLoop.init();;

      // exports
      Module["requestFullscreen"] = Browser.requestFullscreen;
      Module["requestFullScreen"] = Browser.requestFullScreen;
      Module["setCanvasSize"] = Browser.setCanvasSize;
      Module["getUserMedia"] = Browser.getUserMedia;
      Module["createContext"] = Browser.createContext;
      var preloadedImages = {};
      var preloadedAudios = {};;
function checkIncomingModuleAPI() {
  ignoredModuleProp('fetchSettings');
}
var wasmImports = {
  /** @export */
  __assert_fail: ___assert_fail,
  /** @export */
  _cart_load,
  /** @export */
  _cart_unload,
  /** @export */
  _cart_update,
  /** @export */
  _emscripten_memcpy_js: __emscripten_memcpy_js,
  /** @export */
  cartfs_exists,
  /** @export */
  cartfs_save_file,
  /** @export */
  emscripten_cancel_main_loop: _emscripten_cancel_main_loop,
  /** @export */
  emscripten_clipboard__register,
  /** @export */
  emscripten_get_gamepad_status: _emscripten_get_gamepad_status,
  /** @export */
  emscripten_get_num_gamepads: _emscripten_get_num_gamepads,
  /** @export */
  emscripten_random: _emscripten_random,
  /** @export */
  emscripten_resize_heap: _emscripten_resize_heap,
  /** @export */
  emscripten_sample_gamepad_data: _emscripten_sample_gamepad_data,
  /** @export */
  emscripten_set_keydown_callback_on_thread: _emscripten_set_keydown_callback_on_thread,
  /** @export */
  emscripten_set_keyup_callback_on_thread: _emscripten_set_keyup_callback_on_thread,
  /** @export */
  emscripten_set_main_loop_arg: _emscripten_set_main_loop_arg,
  /** @export */
  emscripten_set_mousedown_callback_on_thread: _emscripten_set_mousedown_callback_on_thread,
  /** @export */
  emscripten_set_mousemove_callback_on_thread: _emscripten_set_mousemove_callback_on_thread,
  /** @export */
  emscripten_set_mouseup_callback_on_thread: _emscripten_set_mouseup_callback_on_thread,
  /** @export */
  emscripten_set_wheel_callback_on_thread: _emscripten_set_wheel_callback_on_thread,
  /** @export */
  emscripten_set_window_title: _emscripten_set_window_title,
  /** @export */
  fd_close: _fd_close,
  /** @export */
  fd_seek: _fd_seek,
  /** @export */
  fd_write: _fd_write,
  /** @export */
  pntr_app_emscripten_get_time,
  /** @export */
  pntr_app_emscripten_init_filedropped,
  /** @export */
  pntr_app_platform_get_height,
  /** @export */
  pntr_app_platform_get_width,
  /** @export */
  pntr_app_platform_render_js,
  /** @export */
  pntr_app_platform_set_size,
  /** @export */
  sargs_js_parse_url
};
var wasmExports = createWasm();
var ___wasm_call_ctors = createExportWrapper('__wasm_call_ctors', 0);
var _malloc = createExportWrapper('malloc', 1);
var __sargs_add_kvp = Module['__sargs_add_kvp'] = createExportWrapper('_sargs_add_kvp', 2);
var _free = createExportWrapper('free', 1);
var _pntr_app_emscripten_file_dropped = Module['_pntr_app_emscripten_file_dropped'] = createExportWrapper('pntr_app_emscripten_file_dropped', 4);
var _pntr_app_emscripten_load_memory = Module['_pntr_app_emscripten_load_memory'] = createExportWrapper('pntr_app_emscripten_load_memory', 1);
var _pntr_app_emscripten_unload_memory = Module['_pntr_app_emscripten_unload_memory'] = createExportWrapper('pntr_app_emscripten_unload_memory', 1);
var _main = Module['_main'] = createExportWrapper('__main_argc_argv', 2);
var _null0_call = Module['_null0_call'] = createExportWrapper('null0_call', 1);
var _null0_get_shared = Module['_null0_get_shared'] = createExportWrapper('null0_get_shared', 0);
var _fflush = createExportWrapper('fflush', 1);
var _strerror = createExportWrapper('strerror', 1);
var _emscripten_stack_init = () => (_emscripten_stack_init = wasmExports['emscripten_stack_init'])();
var _emscripten_stack_get_free = () => (_emscripten_stack_get_free = wasmExports['emscripten_stack_get_free'])();
var _emscripten_stack_get_base = () => (_emscripten_stack_get_base = wasmExports['emscripten_stack_get_base'])();
var _emscripten_stack_get_end = () => (_emscripten_stack_get_end = wasmExports['emscripten_stack_get_end'])();
var __emscripten_stack_restore = (a0) => (__emscripten_stack_restore = wasmExports['_emscripten_stack_restore'])(a0);
var __emscripten_stack_alloc = (a0) => (__emscripten_stack_alloc = wasmExports['_emscripten_stack_alloc'])(a0);
var _emscripten_stack_get_current = () => (_emscripten_stack_get_current = wasmExports['emscripten_stack_get_current'])();
var dynCall_iiii = Module['dynCall_iiii'] = createExportWrapper('dynCall_iiii', 4);
var dynCall_vi = Module['dynCall_vi'] = createExportWrapper('dynCall_vi', 2);
var dynCall_ii = Module['dynCall_ii'] = createExportWrapper('dynCall_ii', 2);
var dynCall_iii = Module['dynCall_iii'] = createExportWrapper('dynCall_iii', 3);
var dynCall_vii = Module['dynCall_vii'] = createExportWrapper('dynCall_vii', 3);
var dynCall_jiji = Module['dynCall_jiji'] = createExportWrapper('dynCall_jiji', 5);
var dynCall_iidiiii = Module['dynCall_iidiiii'] = createExportWrapper('dynCall_iidiiii', 7);
var _asyncify_start_unwind = createExportWrapper('asyncify_start_unwind', 1);
var _asyncify_stop_unwind = createExportWrapper('asyncify_stop_unwind', 0);
var _asyncify_start_rewind = createExportWrapper('asyncify_start_rewind', 1);
var _asyncify_stop_rewind = createExportWrapper('asyncify_stop_rewind', 0);


// include: postamble.js
// === Auto-generated postamble setup entry stuff ===

Module['UTF8ToString'] = UTF8ToString;
Module['writeArrayToMemory'] = writeArrayToMemory;
var missingLibrarySymbols = [
  'writeI53ToI64',
  'writeI53ToI64Clamped',
  'writeI53ToI64Signaling',
  'writeI53ToU64Clamped',
  'writeI53ToU64Signaling',
  'readI53FromI64',
  'readI53FromU64',
  'convertI32PairToI53',
  'convertU32PairToI53',
  'getTempRet0',
  'setTempRet0',
  'zeroMemory',
  'growMemory',
  'strError',
  'inetPton4',
  'inetNtop4',
  'inetPton6',
  'inetNtop6',
  'readSockaddr',
  'writeSockaddr',
  'initRandomFill',
  'randomFill',
  'emscriptenLog',
  'readEmAsmArgs',
  'jstoi_q',
  'getExecutableName',
  'listenOnce',
  'autoResumeAudioContext',
  'dynCallLegacy',
  'getDynCaller',
  'dynCall',
  'asmjsMangle',
  'asyncLoad',
  'mmapAlloc',
  'HandleAllocator',
  'getNativeTypeSize',
  'STACK_SIZE',
  'STACK_ALIGN',
  'POINTER_SIZE',
  'ASSERTIONS',
  'getCFunc',
  'ccall',
  'cwrap',
  'uleb128Encode',
  'generateFuncType',
  'convertJsFunctionToWasm',
  'getEmptyTableSlot',
  'updateTableMap',
  'getFunctionAddress',
  'addFunction',
  'removeFunction',
  'reallyNegative',
  'unSign',
  'strLen',
  'reSign',
  'formatString',
  'intArrayFromString',
  'intArrayToString',
  'AsciiToString',
  'stringToAscii',
  'UTF16ToString',
  'stringToUTF16',
  'lengthBytesUTF16',
  'UTF32ToString',
  'stringToUTF32',
  'lengthBytesUTF32',
  'stringToNewUTF8',
  'registerUiEventCallback',
  'registerFocusEventCallback',
  'fillDeviceOrientationEventData',
  'registerDeviceOrientationEventCallback',
  'fillDeviceMotionEventData',
  'registerDeviceMotionEventCallback',
  'screenOrientation',
  'fillOrientationChangeEventData',
  'registerOrientationChangeEventCallback',
  'fillFullscreenChangeEventData',
  'registerFullscreenChangeEventCallback',
  'JSEvents_requestFullscreen',
  'JSEvents_resizeCanvasForFullscreen',
  'registerRestoreOldStyle',
  'hideEverythingExceptGivenElement',
  'restoreHiddenElements',
  'setLetterbox',
  'softFullscreenResizeWebGLRenderTarget',
  'doRequestFullscreen',
  'fillPointerlockChangeEventData',
  'registerPointerlockChangeEventCallback',
  'registerPointerlockErrorEventCallback',
  'requestPointerLock',
  'fillVisibilityChangeEventData',
  'registerVisibilityChangeEventCallback',
  'registerTouchEventCallback',
  'registerGamepadEventCallback',
  'registerBeforeUnloadEventCallback',
  'fillBatteryEventData',
  'battery',
  'registerBatteryEventCallback',
  'setCanvasElementSize',
  'getCanvasElementSize',
  'jsStackTrace',
  'getCallstack',
  'convertPCtoSourceLocation',
  'getEnvStrings',
  'checkWasiClock',
  'wasiRightsToMuslOFlags',
  'wasiOFlagsToMuslOFlags',
  'createDyncallWrapper',
  'setImmediateWrapped',
  'clearImmediateWrapped',
  'polyfillSetImmediate',
  'registerPostMainLoop',
  'registerPreMainLoop',
  'getPromise',
  'makePromise',
  'idsToPromises',
  'makePromiseCallback',
  'ExceptionInfo',
  'findMatchingCatch',
  'Browser_asyncPrepareDataCounter',
  'safeRequestAnimationFrame',
  'isLeapYear',
  'ydayFromDate',
  'arraySum',
  'addDays',
  'getSocketFromFD',
  'getSocketAddress',
  'FS_createPreloadedFile',
  'FS_modeStringToFlags',
  'FS_getMode',
  'FS_stdin_getChar',
  'FS_unlink',
  'FS_createDataFile',
  'FS_mkdirTree',
  '_setNetworkCallback',
  'heapObjectForWebGLType',
  'toTypedArrayIndex',
  'webgl_enable_ANGLE_instanced_arrays',
  'webgl_enable_OES_vertex_array_object',
  'webgl_enable_WEBGL_draw_buffers',
  'webgl_enable_WEBGL_multi_draw',
  'webgl_enable_EXT_polygon_offset_clamp',
  'webgl_enable_EXT_clip_control',
  'webgl_enable_WEBGL_polygon_mode',
  'emscriptenWebGLGet',
  'computeUnpackAlignedImageSize',
  'colorChannelsInGlTextureFormat',
  'emscriptenWebGLGetTexPixelData',
  'emscriptenWebGLGetUniform',
  'webglGetUniformLocation',
  'webglPrepareUniformLocationsBeforeFirstUse',
  'webglGetLeftBracePos',
  'emscriptenWebGLGetVertexAttrib',
  '__glGetActiveAttribOrUniform',
  'writeGLArray',
  'registerWebGlEventCallback',
  'ALLOC_NORMAL',
  'ALLOC_STACK',
  'allocate',
  'writeStringToMemory',
  'writeAsciiToMemory',
  'setErrNo',
  'demangle',
  'stackTrace',
];
missingLibrarySymbols.forEach(missingLibrarySymbol)

var unexportedSymbols = [
  'run',
  'addOnPreRun',
  'addOnInit',
  'addOnPreMain',
  'addOnExit',
  'addOnPostRun',
  'addRunDependency',
  'removeRunDependency',
  'out',
  'err',
  'callMain',
  'abort',
  'wasmMemory',
  'wasmExports',
  'writeStackCookie',
  'checkStackCookie',
  'intArrayFromBase64',
  'tryParseAsDataURI',
  'convertI32PairToI53Checked',
  'stackSave',
  'stackRestore',
  'stackAlloc',
  'ptrToString',
  'exitJS',
  'getHeapMax',
  'abortOnCannotGrowMemory',
  'ENV',
  'ERRNO_CODES',
  'DNS',
  'Protocols',
  'Sockets',
  'timers',
  'warnOnce',
  'readEmAsmArgsArray',
  'jstoi_s',
  'handleException',
  'keepRuntimeAlive',
  'runtimeKeepalivePush',
  'runtimeKeepalivePop',
  'callUserCallback',
  'maybeExit',
  'alignMemory',
  'wasmTable',
  'noExitRuntime',
  'sigToWasmTypes',
  'freeTableIndexes',
  'functionsInTableMap',
  'setValue',
  'getValue',
  'PATH',
  'PATH_FS',
  'UTF8Decoder',
  'UTF8ArrayToString',
  'stringToUTF8Array',
  'stringToUTF8',
  'lengthBytesUTF8',
  'UTF16Decoder',
  'stringToUTF8OnStack',
  'JSEvents',
  'registerKeyEventCallback',
  'specialHTMLTargets',
  'maybeCStringToJsString',
  'findEventTarget',
  'findCanvasEventTarget',
  'getBoundingClientRect',
  'fillMouseEventData',
  'registerMouseEventCallback',
  'registerWheelEventCallback',
  'currentFullscreenStrategy',
  'restoreOldWindowedStyle',
  'fillGamepadEventData',
  'UNWIND_CACHE',
  'ExitStatus',
  'flush_NO_FILESYSTEM',
  'safeSetTimeout',
  'promiseMap',
  'uncaughtExceptionCount',
  'exceptionLast',
  'exceptionCaught',
  'Browser',
  'getPreloadedImageData__data',
  'wget',
  'MONTH_DAYS_REGULAR',
  'MONTH_DAYS_LEAP',
  'MONTH_DAYS_REGULAR_CUMULATIVE',
  'MONTH_DAYS_LEAP_CUMULATIVE',
  'SYSCALLS',
  'preloadPlugins',
  'FS_stdin_getChar_buffer',
  'FS_createPath',
  'FS_createDevice',
  'FS_readFile',
  'FS',
  'FS_createLazyFile',
  'MEMFS',
  'TTY',
  'PIPEFS',
  'SOCKFS',
  'tempFixedLengthArray',
  'miniTempWebGLFloatBuffers',
  'miniTempWebGLIntBuffers',
  'GL',
  'AL',
  'GLUT',
  'EGL',
  'GLEW',
  'IDBStore',
  'runAndAbortIfError',
  'Asyncify',
  'Fibers',
  'SDL',
  'SDL_gfx',
  'allocateUTF8',
  'allocateUTF8OnStack',
  'print',
  'printErr',
];
unexportedSymbols.forEach(unexportedRuntimeSymbol);



var calledRun;
var calledPrerun;

dependenciesFulfilled = function runCaller() {
  // If run has never been called, and we should call run (INVOKE_RUN is true, and Module.noInitialRun is not false)
  if (!calledRun) run();
  if (!calledRun) dependenciesFulfilled = runCaller; // try this again later, after new deps are fulfilled
};

function callMain(args = []) {
  assert(runDependencies == 0, 'cannot call main when async dependencies remain! (listen on Module["onRuntimeInitialized"])');
  assert(calledPrerun, 'cannot call main without calling preRun first');

  var entryFunction = _main;

  args.unshift(thisProgram);

  var argc = args.length;
  var argv = stackAlloc((argc + 1) * 4);
  var argv_ptr = argv;
  args.forEach((arg) => {
    HEAPU32[((argv_ptr)>>2)] = stringToUTF8OnStack(arg);
    argv_ptr += 4;
  });
  HEAPU32[((argv_ptr)>>2)] = 0;

  try {

    var ret = entryFunction(argc, argv);

    // if we're not running an evented main loop, it's time to exit
    exitJS(ret, /* implicit = */ true);
    return ret;
  }
  catch (e) {
    return handleException(e);
  }
}

function stackCheckInit() {
  // This is normally called automatically during __wasm_call_ctors but need to
  // get these values before even running any of the ctors so we call it redundantly
  // here.
  _emscripten_stack_init();
  // TODO(sbc): Move writeStackCookie to native to to avoid this.
  writeStackCookie();
}

function run(args = arguments_) {

  if (runDependencies > 0) {
    return;
  }

  stackCheckInit();

  if (!calledPrerun) {
    calledPrerun = 1;
    preRun();

    // a preRun added a dependency, run will be called later
    if (runDependencies > 0) {
      return;
    }
  }

  function doRun() {
    // run may have just been called through dependencies being fulfilled just in this very frame,
    // or while the async setStatus time below was happening
    if (calledRun) return;
    calledRun = 1;
    Module['calledRun'] = 1;

    if (ABORT) return;

    initRuntime();

    preMain();

    readyPromiseResolve(Module);
    Module['onRuntimeInitialized']?.();

    if (shouldRunNow) callMain(args);

    postRun();
  }

  if (Module['setStatus']) {
    Module['setStatus']('Running...');
    setTimeout(() => {
      setTimeout(() => Module['setStatus'](''), 1);
      doRun();
    }, 1);
  } else
  {
    doRun();
  }
  checkStackCookie();
}

function checkUnflushedContent() {
  // Compiler settings do not allow exiting the runtime, so flushing
  // the streams is not possible. but in ASSERTIONS mode we check
  // if there was something to flush, and if so tell the user they
  // should request that the runtime be exitable.
  // Normally we would not even include flush() at all, but in ASSERTIONS
  // builds we do so just for this check, and here we see if there is any
  // content to flush, that is, we check if there would have been
  // something a non-ASSERTIONS build would have not seen.
  // How we flush the streams depends on whether we are in SYSCALLS_REQUIRE_FILESYSTEM=0
  // mode (which has its own special function for this; otherwise, all
  // the code is inside libc)
  var oldOut = out;
  var oldErr = err;
  var has = false;
  out = err = (x) => {
    has = true;
  }
  try { // it doesn't matter if it fails
    flush_NO_FILESYSTEM();
  } catch(e) {}
  out = oldOut;
  err = oldErr;
  if (has) {
    warnOnce('stdio streams had content in them that was not flushed. you should set EXIT_RUNTIME to 1 (see the Emscripten FAQ), or make sure to emit a newline when you printf etc.');
    warnOnce('(this may also be due to not including full filesystem support - try building with -sFORCE_FILESYSTEM)');
  }
}

if (Module['preInit']) {
  if (typeof Module['preInit'] == 'function') Module['preInit'] = [Module['preInit']];
  while (Module['preInit'].length > 0) {
    Module['preInit'].pop()();
  }
}

// shouldRunNow refers to calling main(), not run().
var shouldRunNow = true;

if (Module['noInitialRun']) shouldRunNow = false;

run();

// end include: postamble.js

// include: postamble_modularize.js
// In MODULARIZE mode we wrap the generated code in a factory function
// and return either the Module itself, or a promise of the module.
//
// We assign to the `moduleRtn` global here and configure closure to see
// this as and extern so it won't get minified.

moduleRtn = readyPromise;

// Assertion for attempting to access module properties on the incoming
// moduleArg.  In the past we used this object as the prototype of the module
// and assigned properties to it, but now we return a distinct object.  This
// keeps the instance private until it is ready (i.e the promise has been
// resolved).
for (const prop of Object.keys(Module)) {
  if (!(prop in moduleArg)) {
    Object.defineProperty(moduleArg, prop, {
      configurable: true,
      get() {
        abort(`Access to module property ('${prop}') is no longer possible via the module constructor argument; Instead, use the result of the module constructor.`)
      }
    });
  }
}
// end include: postamble_modularize.js



  return moduleRtn;
}
);
})();
export default Module;
