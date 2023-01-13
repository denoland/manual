# Deno Manual

This repository is the official documentation for Deno.

Manual is available at: https://deno.land/manual

## Contributing

Clone `dotland` project next to this manual project. The below commands start
the local `deno.land` website with the local manual contents. You can preview
how it's rendered.

```
git clone https://github.com/denoland/dotland.git
cd dotland
MANUAL_PATH=../manual deno task start
```

When opening a PR, make sure the code is formatted correctly. To format the
code:

1. Install Deno (https://deno.land/#installation)
2. Run `deno fmt` at the root of this repository

Before creating new pages, open an issue and discuss the proposed changes.
