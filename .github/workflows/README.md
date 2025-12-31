# GitHub Actions Workflows

This directory contains automated workflows for the Paperballs project.

---

## Workflows

### 1. CI (Continuous Integration)
**File:** `ci.yml`
**Triggers:** Push to main/develop/claude/* branches, Pull Requests

**What it does:**
- Validates JavaScript code
- Checks HTML structure
- Verifies documentation files exist
- Validates web file structure

**Status Badge:**
```markdown
![CI](https://github.com/dhanjit/paperballs/workflows/CI/badge.svg)
```

---

### 2. Release
**File:** `release.yml`
**Triggers:** Push of version tags (e.g., `v1.0.0`)

**What it does:**
- Creates packaged releases for:
  - Web version (zip & tar.gz)
  - Complete source code (zip)
- Generates release notes
- Uploads artifacts to GitHub Releases

**How to create a release:**
```bash
# Tag a version
git tag -a v1.0.0 -m "Release version 1.0.0"

# Push the tag
git push origin v1.0.0

# GitHub Actions will automatically create the release
```

**Status Badge:**
```markdown
![Release](https://github.com/dhanjit/paperballs/workflows/Release/badge.svg)
```

---

### 3. Weekly Health Check
**File:** `health-check.yml`
**Triggers:** Every Sunday at midnight UTC, Manual trigger

**What it does:**
- Verifies all critical files exist
- Counts lines of code
- Monitors documentation completeness
- Creates a health report

**Status Badge:**
```markdown
![Health Check](https://github.com/dhanjit/paperballs/workflows/Weekly%20Health%20Check/badge.svg)
```

---

## Setup Instructions

### Enable Dependabot (Optional)

Create `.github/dependabot.yml`:
```yaml
version: 2
updates:
  - package-ecosystem: "github-actions"
    directory: "/"
    schedule:
      interval: "weekly"
```

---

## Workflow Status

You can view all workflow runs at:
```
https://github.com/dhanjit/paperballs/actions
```

---

## Adding Status Badges to README

Add these to the top of your README.md:

```markdown
![CI](https://github.com/dhanjit/paperballs/workflows/CI/badge.svg)
![Release](https://github.com/dhanjit/paperballs/workflows/Release/badge.svg)
```

---

## Release Process

### Creating a New Release

1. **Update version numbers** (if applicable)

2. **Commit all changes**
   ```bash
   git add .
   git commit -m "Prepare for v1.0.0 release"
   git push
   ```

3. **Create and push a tag**
   ```bash
   git tag -a v1.0.0 -m "Release version 1.0.0 - Initial public release"
   git push origin v1.0.0
   ```

4. **Wait for workflow**
   - GitHub Actions will automatically:
     - Build packages
     - Create release notes
     - Upload artifacts
     - Publish the release

5. **Edit release notes** (optional)
   - Go to Releases on GitHub
   - Edit the auto-generated notes
   - Add changelog, screenshots, etc.

### Version Numbering

Follow [Semantic Versioning](https://semver.org/):
- `v1.0.0` - Major version (breaking changes)
- `v1.1.0` - Minor version (new features)
- `v1.0.1` - Patch version (bug fixes)

---

## Workflow Files Overview

| Workflow | Trigger | Purpose | Artifacts |
|----------|---------|---------|-----------|
| CI | Push, PR | Code validation | None |
| Release | Tag push | Create releases | 5 packages |
| Health Check | Weekly | Monitor project | Health report |

**Note:** The web version is deployed to [dhanjit.me/paperballs](https://dhanjit.me/paperballs) via an automated build script in the blog repository, not through GitHub Actions.

---

## Troubleshooting

### CI Fails

**JavaScript errors:**
```bash
# Install jshint
npm install -g jshint

# Run locally
jshint web/js/*.js --config .jshintrc
```

### Release Workflow Fails

**Check tag format:**
- Must start with `v` (e.g., `v1.0.0`)
- Must be a valid semantic version

**Permissions:**
- Workflow needs `contents: write` permission (already configured)

---

## Continuous Improvement

### Future Enhancements

- [ ] Add automated testing
- [ ] Code coverage reports
- [ ] Performance benchmarks
- [ ] Automated security scanning
- [ ] Dependency updates (Dependabot)
- [ ] Deploy to multiple platforms
- [ ] Generate changelog automatically

---

## Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Workflow Syntax](https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions)
- [Semantic Versioning](https://semver.org/)

---

**Last Updated:** December 2025
