# Documentation Guidelines

## Overview
This document establishes strict guidelines for maintaining the documentation structure of the Elias Charles Store project.

## Directory Structure
All documentation MUST be organized in the `/docs/` directory with the following categorical structure:

```
/docs/
├── api/              # API documentation and references
├── deployment/       # Deployment guides and checklists
├── development/      # Development guides and best practices
├── guides/           # General guides and tutorials
├── setup/            # Initial setup and configuration
├── troubleshooting/  # Problem solving and FAQ
├── GUIDELINES.md     # This file
└── README.md         # Documentation index
```

## Rules

### 1. Documentation Location
- **ALL** markdown files MUST reside in `/docs/` or its subdirectories
- **ONLY EXCEPTION**: Root `README.md` serves as project overview
- No markdown files allowed in project root (except README.md)
- No markdown files allowed in component directories
- No markdown files allowed in feature directories

### 2. File Naming Convention
- Use UPPERCASE for important documentation (e.g., `API_REFERENCE.md`, `DEPLOYMENT.md`)
- Use descriptive names that clearly indicate content
- Avoid generic names like `docs.md` or `info.md`
- Use underscores for multi-word files (e.g., `GETTING_STARTED.md`)

### 3. Content Organization
- **api/**: API documentation, Shopify integration details, endpoint references
- **deployment/**: Production deployment guides, checklists, environment configs
- **development/**: Development workflows, coding standards, user guides
- **guides/**: Feature guides, integration tutorials, platform strategies
- **setup/**: Initial project setup, environment configuration, getting started
- **troubleshooting/**: FAQ, common issues, debugging guides

### 4. Cross-References
- Use relative paths when linking between docs
- Always verify links work after moving files
- Update all references when reorganizing structure

### 5. Maintenance
- Review documentation structure monthly
- Remove outdated or duplicate files immediately
- Ensure new features include appropriate documentation
- Keep this guidelines file updated with any structural changes

## Enforcement
Violations of these guidelines should be corrected immediately:
1. Misplaced markdown files → Move to appropriate `/docs/` subdirectory
2. Duplicate content → Consolidate or remove redundant files
3. Broken links → Fix or remove invalid references
4. Poor organization → Reorganize according to category structure

## File Migration Protocol
When adding new documentation:
1. Determine appropriate category (api, deployment, development, guides, setup, troubleshooting)
2. Place file in correct subdirectory
3. Update any cross-references
4. Verify build still works
5. Update main README.md if necessary

## Quality Standards
- Use clear, concise language
- Include code examples where appropriate
- Maintain consistent formatting
- Add table of contents for long documents
- Include last updated dates

## Contact
For questions about documentation organization, refer to the project maintainer or create an issue in the repository.
