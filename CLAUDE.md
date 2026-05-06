# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Status

This repository is in an initial / empty state. It currently contains only a `README.md` describing the project as **"OS作り練習"** (OS creation practice) — a personal project for learning operating system development.

There is no source code, build system, test suite, or tooling configuration in the repository yet. As the project grows, this file should be updated to document:

- Toolchain setup (assembler, cross-compiler, emulator such as QEMU)
- Build / run / test commands
- Boot process and memory layout
- Directory layout once code exists (kernel, bootloader, drivers, etc.)

## Working in this repository

- Default development branch for Claude-authored work: `claude/add-claude-documentation-L4RRx` (per session instructions). All changes should be committed and pushed to the branch specified in the active session.
- The project language and target architecture have not yet been chosen — confirm with the user before scaffolding code, picking a toolchain (e.g. NASM vs GAS, GCC cross-compiler target), or introducing a build system.
