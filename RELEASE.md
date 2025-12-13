# Release Process

This document describes how to create and publish releases for Paperballs.

## Overview

Releases are fully automated using GitHub Actions. When you push a version tag, the workflow automatically creates packages and publishes them to GitHub Releases.

## Quick Release

```bash
# 1. Ensure all changes are committed
git add .
git commit -m "Prepare for release v1.0.0"
git push

# 2. Create and push a version tag
git tag -a v1.0.0 -m "Release version 1.0.0 - Initial public release"
git push origin v1.0.0

# 3. Wait ~2 minutes for GitHub Actions to complete
# 4. Check https://github.com/dhanjit/paperballs/releases
```

## What Gets Created

When you push a version tag (e.g., `v1.0.0`), the release workflow automatically:

### 1. Creates 5 Downloadable Packages

- `paperballs-cli-v1.0.0.zip` - Terminal version (zip)
- `paperballs-cli-v1.0.0.tar.gz` - Terminal version (tar.gz)
- `paperballs-web-v1.0.0.zip` - Web version (zip)
- `paperballs-web-v1.0.0.tar.gz` - Web version (tar.gz)
- `paperballs-complete-v1.0.0.zip` - Complete source code

### 2. Generates Release Notes

Automatically includes:
- Download instructions for each package
- Feature highlights
- How to play guide
- Links to documentation

### 3. Publishes to GitHub Releases

The release is published at:
```
https://github.com/dhanjit/paperballs/releases
```

## Version Numbering

Follow [Semantic Versioning](https://semver.org/) (SemVer) guidelines:

- **Major version** (`v2.0.0`): Breaking changes or major new features
- **Minor version** (`v1.1.0`): New features, backward compatible
- **Patch version** (`v1.0.1`): Bug fixes, backward compatible

### Examples

```bash
# Initial release
git tag -a v1.0.0 -m "Initial public release"

# Bug fix
git tag -a v1.0.1 -m "Fix movement validation bug"

# New feature
git tag -a v1.1.0 -m "Add AI opponent feature"

# Breaking change
git tag -a v2.0.0 -m "Redesign game API"
```

## Pre-releases

For beta or alpha versions, append a pre-release identifier:

```bash
# Beta release
git tag -a v1.0.0-beta.1 -m "Beta release for testing"
git push origin v1.0.0-beta.1

# Alpha release
git tag -a v2.0.0-alpha.1 -m "Alpha preview of v2"
git push origin v2.0.0-alpha.1

# Release candidate
git tag -a v1.0.0-rc.1 -m "Release candidate 1"
git push origin v1.0.0-rc.1
```

Pre-releases are marked as "pre-release" on GitHub and won't show as the latest stable version.

## Managing Tags

### List Tags

```bash
# List all tags
git tag

# List tags matching a pattern
git tag -l "v1.*"
```

### Delete Tags

```bash
# Delete a local tag
git tag -d v1.0.0

# Delete a remote tag
git push origin --delete v1.0.0
```

### View Tag Details

```bash
# Show tag information and commit
git show v1.0.0

# Show just the tag message
git tag -n v1.0.0
```

## Workflow Monitoring

Track release progress at:
```
https://github.com/dhanjit/paperballs/actions/workflows/release.yml
```

The workflow typically completes in 1-2 minutes.

### Workflow Steps

The release workflow performs these steps:

1. **Extract version** from tag name
2. **Create CLI package** (copy files, create zip and tar.gz)
3. **Create web package** (copy files, create zip and tar.gz)
4. **Create complete package** (entire source code)
5. **Generate release notes** from template
6. **Create GitHub Release** with all packages
7. **Upload artifacts** (all 5 packages)

## Troubleshooting

### Release Workflow Fails

**Check the Actions log:**
```
https://github.com/dhanjit/paperballs/actions
```

**Common issues:**

1. **Invalid tag format**
   - Tag must start with 'v' (e.g., v1.0.0)
   - Must follow semantic versioning

2. **Permissions error**
   - Ensure repository has write permissions enabled for workflows
   - Check Settings → Actions → General → Workflow permissions

3. **Duplicate release**
   - A release with this tag already exists
   - Delete the old release or tag, or use a new version number

### Deleting a Failed Release

```bash
# Delete the GitHub release (via web UI or gh CLI)
gh release delete v1.0.0

# Delete the tag
git push origin --delete v1.0.0
git tag -d v1.0.0

# Fix issues and try again
git tag -a v1.0.0 -m "Release version 1.0.0"
git push origin v1.0.0
```

## Release Checklist

Before creating a release:

- [ ] All tests pass (check CI workflow)
- [ ] Documentation is up to date
- [ ] CHANGELOG updated (if you maintain one)
- [ ] Version numbers updated in code (if applicable)
- [ ] All changes committed and pushed
- [ ] Choose appropriate version number (major/minor/patch)
- [ ] Write clear, descriptive tag message

## Post-Release

After a release is published:

1. **Verify packages** - Download and test each package
2. **Check release notes** - Ensure auto-generated notes are accurate
3. **Update documentation** - If needed, update links to latest version
4. **Announce** - Share the release (social media, blog, etc.)

## GitHub CLI (Alternative Method)

You can also create releases using the GitHub CLI:

```bash
# Create a release from a tag
gh release create v1.0.0 --generate-notes

# Create a pre-release
gh release create v1.0.0-beta.1 --prerelease --generate-notes

# Create a draft release
gh release create v1.0.0 --draft --generate-notes
```

Note: Using `git tag` + `git push` is the recommended method for this project as it triggers the automated workflow.

## Release Workflow Configuration

The release workflow is defined in:
```
.github/workflows/release.yml
```

For workflow documentation, see:
```
.github/workflows/README.md
```

## Questions?

If you have questions about the release process:
- Open an issue on GitHub
- Check the [Contributing Guide](CONTRIBUTING.md)
- Review the [Workflow Documentation](.github/workflows/README.md)
