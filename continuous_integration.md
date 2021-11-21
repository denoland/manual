## Continuous Integration

Deno's built-in tools make it easy to set up Continuous Integration (CI)
pipelines for your projects. Testing, linting and formatting of code can all be
done with the corresponding commands `deno test`, `deno lint` and `deno fmt`. In
addition, you can generate code coverage reports from test results with
`deno coverage` in pipelines.

The example below shows how to set up a basic pipeline for Deno projects in
GitHub Actions:

```yaml
name: Build

on: [ push, pull_request ]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Set up Actions
        uses: actions/checkout@v2

      - name: Set up Deno
        uses: denoland/setup-deno@v1.0.0
        with:
          deno-version: v1.x
```

All this pipeline does at the moment is set up GitHub Actions and Deno, and it
is configured to trigger a workflow run on push and pull request events. Note
that in the example the `latest` version of `ubuntu` image is used, but you
could specify an exact version for added stability in a production pipeline,
such as `ubuntu-20.04`.

To expand the workflow you can add any of the `deno` CLI commands that you might
need. The code below shows how to check the formatting, lint the code, run the
tests and generate a test coverage report, all as part of a `build` job:

```yaml
jobs:
  build:
    runs-on: ubuntu-20.04
    steps:
      - name: Set up Actions
        uses: actions/checkout@v2

      - name: Set up Deno
        uses: denoland/setup-deno@v1.0.0
        with:
          deno-version: v1.x

      - name: Check formatting
        run: deno fmt --check

      - name: Analyze code
        run: deno lint

      - name: Run unit and integration tests
        run: deno test -A --coverage=cov --doc

      - name: Generate coverage report
        run: deno coverage --lcov cov > cov.lcov
```

Let's go over the steps one by one.

```yaml
- name: Check formatting
  run: deno fmt --check
```

This simply checks if the project code is formatted according to Deno's default
formatting conventions.

```yaml
- name: Analyze code
  run: deno lint
```

In this step the `deno lint` command checks for syntax and style errors. If
necessary, you can pass a `deno.json` configuration file with custom linter
rules.

```yaml
- name: Run unit and integration tests
  run: deno test -A --coverage=cov --doc
```

Here, Deno runs some tests with a lot of options being passed along! This
example runs with all permissions (`-A`) but in reality you may only need a
subset of permissions to run your tests, such as `--allow-read` or
`--allow-env`. Test coverage is generated with `--coverage` into an output
directory `cov` and finally, `--doc` is provided to typecheck any code blocks in
the project's documentation.

The final step creates a coverage report from the results of `deno test` in
`.lcov` format, which you could then upload to one of the various code coverage
platforms available on the Web:

```yaml
- name: Generate coverage report
  run: deno coverage --lcov cov > cov.lcov
```

### Cross-platform workflows

As a Deno module maintainer, you probably want to know that your code works on
all of the major operating systems in use today: Linux, MacOS and Windows. A
Cross-platform workflow can be achieved by running a matrix of parallel jobs in
GitHub Actions, each one running your build on a different operating system:

```yaml
jobs:
  build:
    runs-on: ${{ matrix.os }}
    strategy:
      matrix:
        os: [ ubuntu-latest, macos-latest, windows-latest ]
    steps:
      # build goes here
```

> Note: GitHub Actions has a known issue with handling Windows-style line
> endings (CRLF). This may cause issues when running `deno fmt` in a pipeline
> with jobs that run on `windows`. To solve this, configure the Actions runner
> to use Linux-style line-endings with `git config --system core.autocrlf false`
> and `git config --system core.eol lf` before running
> `uses: actions/checkout@v2` in the pipeline.

There can be parts of the pipeline that don't make sense to run for every OS.
For example, generating the same coverage report on Linux, MacOS and Windows is
a bit redundant. You can use the conditional `if` keyword in these cases to
reduce repetition:

```yaml
- name: Generate coverage report
  if: ${{ matrix.os == 'ubuntu-latest' }}
  run: deno coverage --lcov cov > cov.lcov
```

The same applies to uploading coverage to a reporter like Coveralls, for
example:

```yaml
- name: Upload coverage report
  if: ${{ matrix.os == 'ubuntu-latest' }}
  uses: coverallsapp/github-action@master
  with:
    github-token: ${{ secrets.GITHUB_TOKEN }}
    path-to-lcov: cov.lcov
```
