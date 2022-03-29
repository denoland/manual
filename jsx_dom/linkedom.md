## Using LinkeDOM with Deno

[LinkeDOM](https://github.com/WebReflection/linkedom) is a DOM-like namespace to
be used in environments, like Deno, which don't implement the DOM.

While linkeDOM works under Deno, it does not type check. While the provided
types work well when using an editor like VSCode, attempting to strictly type
check them, like Deno does by default, at runtime, it will fail. This is the
same if you were to use `tsc` to type check the code. The maintainer has
indicated they aren't interested in
[fixing this issue](https://github.com/WebReflection/linkedom/issues/87). This
means for Deno, you need to use the `--no-check=remote` to avoid diagnostics
stopping the execution of your programme.
