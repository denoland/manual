# Deno Manual

This repository is the official documentation for Deno, and it's available at:
https://deno.land/manual

## Contributing

1. Clone this project and `dotland` in the same parent folder:

```
git clone https://github.com/denoland/manual.git
git clone https://github.com/denoland/dotland.git
```

2. Move into the `dotland` folder, and run the following command to start the
   local `deno.land` website with the local manual contents:

```
cd dotland
MANUAL_PATH=../manual deno task start
```

When opening a PR, make sure the code is formatted correctly. To format the
code:

1. Install Deno (https://deno.land/#installation)
2. Run `deno fmt` at the root of this repository

Before creating new pages, open an issue and discuss the proposed changes.
