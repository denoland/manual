# Experimental support for the WebGPU API

The WebGPU API gives developers a low level, high performance, cross
architecture way to program GPU hardware from JavaScript. It is the effective
successor to WebGL on the Web. The spec has not yet been finalized, but support
is currently being added to Firefox, Chromium, and Safari; and now also in Deno.

This API gives you access to GPU rendering and general purpose GPU compute right
from within Deno. Once finished, stabilized, and unflagged, this will provide a
portable way to access GPU resources from web, server, and developer machine.

## Examples

Further examples outside of the ones listed below can be found in the
webgpu-examples [repository](https://github.com/denoland/webgpu-examples).

Here is a basic example that demonstrates accessing an attached GPU device, and
reading out the name and supported features:

```typescript
/// Run with `deno run --unstable https://deno.com/v1.8/webgpu_discover.ts`

// Try to get an adapter from the user agent.
const adapter = await navigator.gpu.requestAdapter();
if (adapter) {
  const info = await adapter.requestAdapterInfo();
  // Print out some basic details about the adapter.
  console.log("Found adapter", info);
  const features = [...adapter.features.values()];
  console.log(`Supported features: ${features.join(", ")}`);
} else {
  console.error("No adapter found");
}
```

This [example](https://github.com/denoland/webgpu-examples/tree/main/capture)
shows how to capture an image by rendering it to a texture, copying the texture
to a buffer, and retrieving it from the buffer.

```typescript
import {
  copyToBuffer,
  createCapture,
  createPng,
  Dimensions,
} from "https://raw.githubusercontent.com/denoland/webgpu-examples/6c505182170ba10cc7bfe86203477688b96648bb/utils.ts";

const dimensions: Dimensions = {
  width: 100,
  height: 200,
};

const adapter = await navigator.gpu.requestAdapter();
const device = await adapter?.requestDevice();

if (!device) {
  console.error("no suitable adapter found");
  Deno.exit(0);
}

const { texture, outputBuffer } = createCapture(device, dimensions);

const encoder = device.createCommandEncoder();
encoder.beginRenderPass({
  colorAttachments: [
    {
      view: texture.createView(),
      storeOp: "store",
      loadOp: "clear",
      clearValue: [1, 0, 0, 1],
    },
  ],
}).end();

copyToBuffer(encoder, texture, outputBuffer, dimensions);

device.queue.submit([encoder.finish()]);

await createPng(outputBuffer, dimensions);
```

These examples are a deno port of the
[wgpu-rs examples](https://github.com/gfx-rs/wgpu-rs/tree/master/examples) but
using `utils`'s `createCapture`, `copyToBuffer` & `createPng` instead of a
swapchain as deno's webgpu implementation is headless.

To try out, upgrade deno to at least 1.8.0 and run the commands below.

```shell
$ cd hello-compute
$ deno run --unstable --allow-read --allow-write mod.ts
Uint32Array(4) [ 0, 2, 7, 55 ]
```
