//! File I/O utilities for code generation.
//!
//! Provides safe, reusable file operations for the generator.

use std::path::Path;

use anyhow::Result;

use crate::ts_gen::TsFormatter;

/// Write a string to a file, creating parent directories if needed.
///
/// Does nothing if the string is empty.
pub fn write_str_to_file(s: &str, path: &Path) -> Result<()> {
    if s.is_empty() {
        return Ok(());
    }

    std::fs::write(path, s)?;
    Ok(())
}

/// Write TypeScript content to a file, formatting it first.
///
/// Does nothing if the string is empty.
pub fn write_ts_file(formatter: &TsFormatter, content: &str, path: &Path) -> Result<()> {
    if content.is_empty() {
        return Ok(());
    }

    let formatted = formatter.format(path, content)?;
    std::fs::write(path, formatted)?;
    Ok(())
}

/// Clean the output directory, removing all contents except gen.toml.
pub fn clean_output(out_root: &Path) -> Result<()> {
    let mut paths_to_remove = vec![];
    for entry in std::fs::read_dir(out_root)? {
        let entry = entry?;
        let path = entry.path();
        if path.is_file() && path.file_name().unwrap() == "gen.toml" {
            continue;
        }
        paths_to_remove.push(path);
    }

    for path in paths_to_remove {
        if path.is_dir() {
            std::fs::remove_dir_all(path)?;
        } else {
            std::fs::remove_file(path)?;
        }
    }

    Ok(())
}
