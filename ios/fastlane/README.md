fastlane documentation
----

# Installation

Make sure you have the latest version of the Xcode command line tools installed:

```sh
xcode-select --install
```

For _fastlane_ installation instructions, see [Installing _fastlane_](https://docs.fastlane.tools/#installing-fastlane)

# Available Actions

## iOS

### ios increment_build_version_number

```sh
[bundle exec] fastlane ios increment_build_version_number
```

Increment build number

### ios build_and_distribute_dev_app

```sh
[bundle exec] fastlane ios build_and_distribute_dev_app
```

Distribute dev environment to Firebase App Distribution

### ios build_and_distribute_prod_app

```sh
[bundle exec] fastlane ios build_and_distribute_prod_app
```

Distribute prod environment to Firebase App Distribution

### ios build_and_distribute_release_app

```sh
[bundle exec] fastlane ios build_and_distribute_release_app
```

Distribute latest version to TestFlight

### ios update_all_profiles

```sh
[bundle exec] fastlane ios update_all_profiles
```

Update all provisioning profiles

----

This README.md is auto-generated and will be re-generated every time [_fastlane_](https://fastlane.tools) is run.

More information about _fastlane_ can be found on [fastlane.tools](https://fastlane.tools).

The documentation of _fastlane_ can be found on [docs.fastlane.tools](https://docs.fastlane.tools).
