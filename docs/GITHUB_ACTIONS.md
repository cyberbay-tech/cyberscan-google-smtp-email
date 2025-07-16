# GitHub Actions Guide

This document explains the GitHub Actions workflows used in this project for automated testing, linting, and deployment.

## Overview

The project uses several GitHub Actions workflows to ensure code quality, security, and automated deployment:

## Workflows

### 1. CI/CD Pipeline (`.github/workflows/ci.yml`)

**Triggers**: Push to main/develop, Pull Requests

**Purpose**: Main quality assurance workflow

**Jobs**:

- **Test & Lint**: Runs on Node.js 18, 20, and 21
  - ESLint code quality checks
  - TypeScript type checking
  - Jest test suite with coverage
  - Build verification
  - Coverage report upload to Codecov

- **Security Audit**:
  - npm security audit
  - Outdated package detection

- **Format Check**:
  - Prettier formatting validation

### 2. Pull Request Checks (`.github/workflows/pr.yml`)

**Triggers**: Pull Requests to main/develop

**Purpose**: Enhanced PR experience with detailed feedback

**Features**:

- Merge conflict detection
- Code quality validation
- Automated PR comments with results
- Bundle size checks
- Real-time status updates

### 3. Release Automation (`.github/workflows/release.yml`)

**Triggers**: GitHub releases published

**Purpose**: Automatic npm publishing

**Process**:

1. Runs full test suite
2. Validates code quality
3. Builds the project
4. Publishes to npm registry

### 4. Documentation Validation (`.github/workflows/docs.yml`)

**Triggers**: Changes to docs/, README.md

**Purpose**: Ensures documentation quality

**Checks**:

- Markdown linting
- Broken link detection
- Documentation structure validation
- Internal link verification

### 5. Dependency Updates (`.github/workflows/dependencies.yml`)

**Triggers**: Weekly (Monday 9 AM UTC), Manual dispatch

**Purpose**: Security and dependency monitoring

**Actions**:

- Checks for outdated packages
- Runs security audits
- Creates issues for manual review

### 6. Badge Generation (`.github/workflows/badges.yml`)

**Triggers**: After successful CI/CD pipeline

**Purpose**: Updates README badges automatically

## Local Development

### Running Checks Locally

All CI checks can be run locally using npm scripts:

```bash
# Code quality
npm run lint              # ESLint
npm run lint:fix          # ESLint with auto-fix
npm run type-check        # TypeScript type checking
npm run format:check      # Prettier formatting check
npm run format            # Prettier formatting (auto-fix)

# Testing
npm test                  # Run tests
npm run test:coverage     # Run tests with coverage
npm run test:watch        # Run tests in watch mode

# Build
npm run build             # TypeScript compilation
npm run clean             # Clean build files
```

### Pre-commit Checklist

Before committing, ensure:

1. **Code Quality**:

   ```bash
   npm run lint
   npm run type-check
   npm run format:check
   ```

2. **Tests Pass**:

   ```bash
   npm test
   ```

3. **Builds Successfully**:
   ```bash
   npm run build
   ```

## Configuration

### Required Secrets

For the release workflow to work, you need to set up:

1. **NPM_TOKEN**: Your npm authentication token
   - Go to npmjs.com → Account → Access Tokens
   - Create a new token with publish permissions
   - Add to GitHub repository secrets

### Environment Variables

The workflows use the following environment variables:

- `NODE_VERSION`: Node.js version (default: 20.x)
- `NPM_TOKEN`: For npm publishing (in secrets)

## Troubleshooting

### Common Issues

1. **Workflow Fails on ESLint**:

   ```bash
   npm run lint:fix  # Auto-fix issues
   ```

2. **TypeScript Errors**:

   ```bash
   npm run type-check  # Check for type errors
   ```

3. **Formatting Issues**:

   ```bash
   npm run format  # Auto-format code
   ```

4. **Test Failures**:
   ```bash
   npm test  # Run tests locally first
   ```

### Debugging Workflows

1. **Check Workflow Logs**: Go to Actions tab in GitHub
2. **Run Locally**: Use the local commands above
3. **Check Dependencies**: Ensure all dependencies are installed

## Best Practices

### For Contributors

1. **Always run checks locally** before pushing
2. **Use meaningful commit messages**
3. **Keep PRs focused and small**
4. **Respond to CI feedback quickly**

### For Maintainers

1. **Monitor workflow failures**
2. **Review security alerts**
3. **Update dependencies regularly**
4. **Maintain documentation**

## Workflow Customization

### Adding New Checks

To add new quality checks:

1. **Add to CI workflow** (`.github/workflows/ci.yml`)
2. **Add local script** to `package.json`
3. **Update documentation**

### Modifying Triggers

Edit the `on` section in workflow files:

```yaml
on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]
  schedule:
    - cron: '0 9 * * 1' # Weekly
```

### Adding New Environments

To test on different Node.js versions:

```yaml
strategy:
  matrix:
    node-version: [16.x, 18.x, 20.x, 21.x]
```

## Support

If you encounter issues with the workflows:

1. Check the [GitHub Actions documentation](https://docs.github.com/en/actions)
2. Review workflow logs in the Actions tab
3. Open an issue with detailed error information
4. Test locally first to isolate the problem
