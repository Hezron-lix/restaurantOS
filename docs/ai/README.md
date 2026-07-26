# RestaurantOS AI Documentation

Welcome to the canonical Source of Truth (SoT) for the RestaurantOS AI platform. 

This directory contains the internal engineering documentation for building the RestaurantOS Operations Intelligence Platform. It dictates the architecture, capabilities, and design principles that all future AI sprints must follow.

## Documentation Index

- [00. Vision & Principles](./00-vision.md): The core philosophy driving the AI platform.
- [01. The Restaurant Brain](./01-restaurant-brain.md): The central orchestrator for intent detection and tool routing.
- [02. Architecture](./02-architecture.md): High-level system design and data flow.
- [03. Capabilities](./03-capabilities.md): Operational domains the AI supports.
- [04. Supported Questions](./04-supported-questions.md): The contract of natural language queries the system must handle.
- [05. Tool Registry](./05-tool-registry.md): The structured API specification for the LLM tools.
- [06. System Prompt](./06-system-prompt.md): The core instructions and persona for the LLM.
- [07. End Shift Workflow](./07-end-shift.md): The automated shift summary generation process.
- [08. Roadmap](./08-roadmap.md): Future extensions and out-of-scope items.
- [09. Architectural Decisions](./09-decisions.md): Log of key technical decisions and trade-offs.

## Purpose

To provide a production-quality architectural blueprint that allows any engineer to implement the RestaurantOS AI capabilities without needing to make major architectural decisions on the fly. 

**Note to Engineers:** If you identify missing domain concepts, abstractions, or architectural improvements during implementation, please update these documents or create a new Architectural Decision Record (ADR) in `09-decisions.md` before writing code.
