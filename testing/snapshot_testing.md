## Snapshot Testing

The Deno standard library comes with a
[snapshot module](https://deno.land/std@$STD_VERSION/testing/snapshot.ts), which
enables developers to write tests which assert a value against a reference
snapshot. This reference snapshot, is a serialized representation of the
original value and is stored alongside the test file.

Snapshot testing can be useful in many cases, as it enables catching a wide
array of bugs with very little code. It is particularly helpful in situations
where it is difficult to precisely express what should be asserted, without
requiring a prohibitive amount of code, or where the assertions a test makes are
expected to change often. It therefore lends itself especially well to use in
the development of front ends and CLIs.

### Basic usage

The `assertSnapshot` function will create a snapshot of a value and compare it
to a reference snapshot, which is stored alongside the test file in the
`__snapshots__` directory.

```ts, ignore
// example_test.ts
import { assertSnapshot } from "https://deno.land/std@$STD_VERSION/testing/snapshot.ts";

Deno.test("isSnapshotMatch", async function (t): Promise<void> {
  const a = {
    hello: "world!",
    example: 123,
  };
  await assertSnapshot(t, a);
});
```

```js
// __snapshots__/example_test.ts.snap
export const snapshot = {};

snapshot[`isSnapshotMatch 1`] = `
{
  example: 123,
  hello: "world!",
}
`;
```

Calling `assertSnapshot` in a test will throw an `AssertionError`, causing the
test to fail, if the snapshot created during the test does not match the one in
the snapshot file.

### Creating and updating snapshots

When adding new snapshot assertions to your test suite, or when intentionally
making changes which cause your snapshots to fail, you can update your snapshots
by running the snapshot tests in update mode. Tests can be run in update mode by
passing the `--update` or `-u` flag as an argument when running the test. When
this flag is passed, then any snapshots which do not match will be updated.

```sh
deno test --allow-all -- --update
```

Additionally, new snapshots will only be created when this flag is present.

### Permissions

When running snapshot tests, the `--allow-read` permission must be enabled, or
else any calls to `assertSnapshot` will fail due to insufficient permissions.
Additionally, when updating snapshots, the `--allow-write` permission must also
be enabled, as this is required in order to update snapshot files.

The `assertSnapshot` function will only attempt to read from and write to
snapshot files. As such, the allow list for `--allow-read` and `--allow-write`
can be limited to only include existing snapshot files, if so desired.

### Version Control

Snapshot testing works best when changes to snapshot files are comitted
alongside other code changes. This allows for changes to reference snapshots to
be reviewed along side the code changes that caused them, and ensures that when
others pull your changes, their tests will pass without needing to update
snapshots locally.
