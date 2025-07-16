# 🚀 Forklane

**API Router-Style Distributed Task Queue**

_Write task queues like API routes, call them like API endpoints_

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Deno](https://img.shields.io/badge/Deno-000000?style=flat&logo=deno&logoColor=white)](https://deno.land/)
[![Bun](https://img.shields.io/badge/Bun-000000?style=flat&logo=bun&logoColor=white)](https://bun.sh/)

Forklane brings the familiar API router pattern to distributed task queues. Define tasks like Express routes, call them like API endpoints. Supports Node.js, Deno, Bun, and Web Workers with Memory, Redis, and Postgres backends.

> **⚠️ Note:** This project is currently in early development. APIs are subject to change and not yet finalized.

## ✨ Key Features

- **🎯 API Router-Style Task Definition** - Define tasks using familiar Express/tRPC patterns
- **📡 Type-Safe Task Calls** - Call tasks like API endpoints with full TypeScript support
- **🔄 Job-Based Execution Model** - Track task execution with Job objects
- **✅ Zod Schema Validation** - Compile-time types + runtime validation
- **🌐 Multi-Runtime Support** - Works on Node.js, Deno, Bun, and Web Workers
- **📊 Multiple Brokers** - Choose from Memory, Redis, or Postgres backends
- **⚡ Distributed Workers** - Scale across multiple processes/servers
- **🔁 Scheduling & Retry** - Built-in delay, scheduling, and retry policies
- **📈 Status Tracking** - Monitor progress, success, failure, and retry states

## 🎯 Core Concepts

| Concept    | Description                                           | HTTP Analogy    |
| ---------- | ----------------------------------------------------- | --------------- |
| **Task**   | Executable work definition with input/output schemas  | Route handler   |
| **Job**    | Task execution instance with state tracking           | HTTP Request    |
| **Lane**   | Queue space for tasks with concurrency control        | Server endpoint |
| **Worker** | Task processor (pulls from queue and executes)        | Server process  |
| **Broker** | Storage/distribution system (Memory, Redis, Postgres) | Database        |

## 🏗️ Architecture

### Core Components

- **Core Package**: Main library with task definition, queuing, and worker functionality
- **Broker Drivers**: Pluggable storage backends (Memory, Redis, Postgres)
- **Multi-Runtime Support**: Consistent API across Node.js, Deno, Bun, and Web Workers
- **Type System**: Complete TypeScript integration with runtime validation

### Design Principles

- **API-First Design**: Familiar patterns from Express/tRPC applied to task queues
- **Type Safety**: Full TypeScript support with compile-time and runtime validation
- **Ergonomic DX**: Developer experience focused on simplicity and productivity

## 📦 Package Structure

```
forklane              # Main package with core functionality
@forklane/redis       # Redis broker driver
@forklane/postgres    # Postgres broker driver
```

## 🚀 Development Status

This project is in early development. Current focus areas:

- [ ] Core API design and implementation
- [ ] TypeScript type system and inference
- [ ] Basic broker implementations (Memory, Redis)
- [ ] Multi-runtime support
- [ ] Testing framework and examples
- [ ] Documentation and guides

## 🔄 Scaling & Deployment

### Development to Production

Seamless migration from in-memory development setup to production Redis/Postgres backends without code changes.

### Horizontal Scaling

Built-in support for multiple worker processes and servers with automatic load balancing through broker abstraction.

## 🤝 Contributing

We welcome contributions! This project is in early development and there are many opportunities to get involved.

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🔗 Links

Coming soon - documentation and examples will be available as the API stabilizes.
