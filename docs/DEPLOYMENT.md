# Deployment Guide

This guide describes the production path for ST6 as a Vite Module Federation remote plus a Spring Boot API.

## Runtime Targets

- Frontend remote assets: S3 bucket fronted by CloudFront.
- API: containerized Spring Boot service on EKS.
- Database: PostgreSQL 16.4, preferably Amazon RDS.
- Auth: Auth0 OAuth2 JWT issuer.
- Optional reminders: Microsoft Graph application credentials.

## Required Environment

Use `.env.production.example` as the deployment checklist. Production secrets should come from AWS Secrets Manager, Kubernetes secrets, or the platform secret store; do not commit real values.

Required API values:

- `DATABASE_URL`
- `DATABASE_USERNAME`
- `DATABASE_PASSWORD`
- `AUTH0_ISSUER_URI`
- `ST6_CORS_ALLOWED_ORIGINS`
- `SPRING_PROFILES_ACTIVE=prod`

Required web build values:

- `VITE_API_MODE=api`
- `VITE_API_BASE_URL`

## Container Images

The release workflow publishes images to GitHub Container Registry when a tag like `v1.0.0` is pushed:

```bash
git tag v1.0.0
git push origin v1.0.0
```

Published images:

- `ghcr.io/tylerxia8/st6-api:v1.0.0`
- `ghcr.io/tylerxia8/st6-web:v1.0.0`

## EKS Deployment

Template manifests live in `infra/k8s`. Replace placeholder hosts, image tags, and secret values before applying them.

```bash
kubectl create namespace st6
kubectl apply -f infra/k8s/
```

Recommended production changes before go-live:

- Use External Secrets Operator or AWS Secrets Manager CSI driver instead of literal Kubernetes secrets.
- Put the API behind AWS Load Balancer Controller or a private service exposed through the PA platform ingress.
- Add horizontal pod autoscaling after baseline load testing.
- Configure structured log collection into Loki.

## CloudFront Remote

For PA host integration, publish `apps/web/dist` to S3 and serve it through CloudFront. The Module Federation entrypoint is:

```text
https://st6-assets.example.com/assets/remoteEntry.js
```

Build and upload:

```bash
npm ci
VITE_API_MODE=api VITE_API_BASE_URL=https://api.example.com/api npm run build
aws s3 sync apps/web/dist s3://$ST6_WEB_BUCKET --delete
aws cloudfront create-invalidation --distribution-id $ST6_CLOUDFRONT_DISTRIBUTION_ID --paths "/*"
```

The PA host should register `st6_weekly_commitments` and load `./WeeklyCommitments`.

## Auth0

Configure the API as an Auth0 resource server and issue access tokens with these scopes:

- `st6:read`
- `st6:write`
- `st6:manager`
- `st6:admin`

The `local` Spring profile installs demo authentication for local and CI API-mode tests only. Production must run with `SPRING_PROFILES_ACTIVE=prod` or another non-local profile.

## Microsoft Graph

The repository includes `OutlookPlanningReminderService` as the integration boundary. Production implementation should use Microsoft Graph calendar or mail endpoints with tenant-approved app credentials. Until those credentials are available, the app uses `NoopOutlookPlanningReminderService`.

## Release Checklist

- CI is green on `main`.
- A semver tag has published API and web images.
- `AUTH0_ISSUER_URI` points at the real tenant.
- CORS includes the PA host and remote asset domain only.
- RDS backups and retention are configured.
- Flyway migrations have run successfully.
- CloudFront invalidation completed after asset upload.
- Demo video is recorded from the release candidate.
