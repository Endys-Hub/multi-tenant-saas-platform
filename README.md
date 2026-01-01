# Multi-Tenant SaaS Platform

A production-focused, multi-tenant SaaS platform built with **TypeScript, React, Node.js, PostgreSQL, Docker, and AWS**.

This repository contains a real SaaS foundation designed to support multiple organizations in a single system, with proper tenant isolation, authentication, authorization, and deployment considerations.

It is not a demo app or a tutorial walkthrough. It is a practical implementation of patterns used in modern B2B SaaS products.

---

## Why This Project

Many portfolios focus on features in isolation.  
This project focuses on **system design and engineering trade-offs**.

The goal is to demonstrate how a real SaaS platform is structured end to end:

- how tenants are modeled  
- how access is controlled  
- how data isolation is enforced  
- how the system is deployed and operated  

---

## What the Platform Does

The system allows:

- Multiple organizations (tenants) to sign up and use the same application  
- Each organization to manage its own users and roles  
- Access to be controlled via role-based permissions  
- All tenant data to live in a shared database without cross-tenant access  

This architecture is representative of internal tools, CRMs, admin dashboards, and other B2B SaaS products.

---

## High-Level Architecture

- **Frontend**: React + TypeScript, served via S3 and CloudFront  
- **Backend**: Node.js + TypeScript (Fastify), REST API with JWT authentication  
- **Database**: PostgreSQL (RDS)  
- **Infrastructure**: Docker for local development, AWS for production  

The system runs as a single backend application with strict tenant scoping enforced at the API and data layers.

---

## Core Concepts Demonstrated

### Multi-Tenancy
- Single backend and database  
- Every request is scoped to an organization  
- Tenant isolation enforced server-side  

### Authentication & Authorization
- JWT-based authentication  
- Secure password hashing  
- Role-Based Access Control (RBAC)  
- Permission checks at API boundaries  

### Data Modeling
- Users  
- Organizations  
- Memberships  
- Roles and permissions  
- Audit logs  
- Subscriptions and billing logic  

### API Design
- Request validation with Zod  
- Centralized error handling  
- Typed request and response structures  
- Predictable API behavior  

### Development & Deployment
- Fully containerized local setup  
- One-command startup with Docker Compose  
- Production deployment using AWS ECS, RDS, and CloudFront  
- CI/CD via GitHub Actions  

---

## Tech Stack

### Frontend
- React  
- TypeScript  
- Protected routes  
- Role-based UI rendering  

### Backend
- Node.js  
- TypeScript  
- Fastify  
- Prisma ORM  
- JWT authentication  
- Zod validation  

### Database
- PostgreSQL  
- Transaction-safe queries  
- Tenant-scoped access patterns  

### Infrastructure
- Docker & Docker Compose  
- AWS (ECS, RDS, S3, CloudFront)  
- GitHub Actions  

---

## Repository Structure
```
multi-tenant-saas-platform/
├── apps/
│ ├── frontend/ # React + TypeScript frontend
│ └── backend/ # Node.js + TypeScript API
│ ├── prisma/ # Prisma schema & migrations
│ ├── src/ # Application source code
│ ├── Dockerfile
│ ├── package.json
│ └── tsconfig.json
├── infra/ # AWS & infrastructure configuration
├── docker-compose.yml # One-command local setup
└── README.md
```

The repository is structured as a monorepo to keep frontend, backend, and infrastructure concerns aligned.

## Running Locally

```docker compose up --build```
This starts the frontend, backend API, and PostgreSQL database

## Deployment

The application is deployed using AWS:

Backend runs on ECS (Fargate)

Database runs on RDS (PostgreSQL)

Frontend is hosted on S3 and served via CloudFront

Secrets are managed through AWS

CI/CD is handled via GitHub Actions

## Project Status

The platform is built incrementally, with development progress documented through:

GitHub commits and issues

Public posts outlining design decisions and lessons learned

## About

This project reflects how I approach building production systems:

prioritizing correctness over shortcuts

designing for scale from the start

making trade-offs intentionally

If you are reviewing this repository as part of a hiring process, it represents how I think about real-world software engineering problems, not just how I write code.

## Contact

GitHub: https://github.com/endys-hub

LinkedIn: https://linkedin.com/ndudi-okehi-813137390

