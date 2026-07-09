# MongoDB Atlas — Complete Reference Guide

A comprehensive reference covering everything you need to know about setting up,
configuring, securing, and managing MongoDB Atlas for any project or team.

---

## Table of Contents

| # | Guide | What it covers |
|---|-------|---------------|
| 01 | [Overview & Core Concepts](./01-overview.md) | What Atlas is, structure, terminology |
| 02 | [Tiers & Pricing](./02-tiers-and-pricing.md) | M0, FLEX, M10+, cost comparison, when to upgrade |
| 03 | [Organizations, Projects & Clusters](./03-organizations-projects-clusters.md) | How to structure your Atlas account |
| 04 | [Network Access & Security](./04-network-access-security.md) | IP whitelisting, database users, VPC peering |
| 05 | [Connection Strings](./05-connection-strings.md) | URIs, env variables, connecting from Node.js / Python |
| 06 | [Team Access & Roles](./06-team-access-roles.md) | Inviting members, org/project roles, least privilege |
| 07 | [Backups & Point-in-Time Restore](./07-backups.md) | Backup types, schedules, restore procedures |
| 08 | [Monitoring & Alerts](./08-monitoring-alerts.md) | Metrics, alert setup, Performance Advisor |
| 09 | [Indexes & Query Optimization](./09-indexes-query-optimization.md) | Index types, compound indexes, Performance Advisor |
| 10 | [Scaling](./10-scaling.md) | Vertical, horizontal, auto-scaling, when to upgrade |
| 11 | [Environments: Dev, Staging, Production](./11-environments.md) | Multi-environment setup and best practices |
| 12 | [Troubleshooting](./12-troubleshooting.md) | Common errors and how to fix every one of them |
| 13 | [Production Checklist & Best Practices](./13-production-checklist.md) | Pre-launch checklist, security hardening |

---

## Quick Reference

### Atlas Account Structure
```
Organization
└── Project
    ├── Cluster (database server)
    ├── Database Users (app credentials)
    ├── Network Access (IP whitelist)
    └── Backups / Monitoring / Alerts
```

### Tier Overview
| Tier | Cost | Best for |
|------|------|---------|
| M0 | Free | Dev / testing |
| FLEX | Pay per use | Early-stage production |
| M10 | ~$57/mo | Small production |
| M20+ | $114+/mo | Growing production |

### 5 Rules You Must Always Follow
1. Never use `0.0.0.0/0` on a production cluster
2. Never hardcode credentials — always use environment variables
3. Never use the admin DB user in your app
4. Never give developers direct access to production
5. Always test your backups before you need them
