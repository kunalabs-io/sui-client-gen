//! TypeScript code formatting using dprint.
//!
//! Provides Prettier-compatible formatting for generated TypeScript code.

use std::path::Path;

use anyhow::Result;
use dprint_core::configuration::NewLineKind;
use dprint_plugin_typescript::configuration::{
    ConfigurationBuilder, Configuration, QuoteStyle, SemiColons, TrailingCommas, UseParentheses,
};
use dprint_plugin_typescript::{format_text, FormatTextOptions};

/// TypeScript formatter with Prettier-compatible configuration.
pub struct TsFormatter {
    config: Configuration,
}

impl Default for TsFormatter {
    fn default() -> Self {
        Self::new()
    }
}

impl TsFormatter {
    /// Create a new formatter with Prettier-compatible settings.
    ///
    /// Configuration matches:
    /// - `printWidth: 100`
    /// - `tabWidth: 2`
    /// - `useTabs: false`
    /// - `semi: false`
    /// - `singleQuote: true`
    /// - `trailingComma: "es5"`
    /// - `arrowParens: "avoid"`
    /// - `endOfLine: "lf"`
    pub fn new() -> Self {
        let config = ConfigurationBuilder::new()
            .line_width(100)
            .indent_width(2)
            .use_tabs(false)
            .semi_colons(SemiColons::Asi)
            .quote_style(QuoteStyle::PreferSingle)
            .trailing_commas(TrailingCommas::OnlyMultiLine)
            .arrow_function_use_parentheses(UseParentheses::PreferNone)
            .new_line_kind(NewLineKind::LineFeed)
            .build();

        Self { config }
    }

    /// Format TypeScript code.
    ///
    /// The file path is used for error messages and to determine the file type.
    pub fn format(&self, file_path: &Path, code: &str) -> Result<String> {
        let options = FormatTextOptions {
            path: file_path,
            extension: None,
            text: code.to_string(),
            config: &self.config,
            external_formatter: None,
        };

        match format_text(options) {
            Ok(Some(formatted)) => Ok(formatted),
            Ok(None) => Ok(code.to_string()), // No changes needed
            Err(e) => Err(anyhow::anyhow!("Failed to format {}: {}", file_path.display(), e)),
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use std::path::PathBuf;

    #[test]
    fn test_removes_semicolons() {
        let formatter = TsFormatter::new();
        let code = "const x = 1;";
        let result = formatter
            .format(&PathBuf::from("test.ts"), code)
            .unwrap();
        assert!(!result.contains(';'), "Should remove semicolons");
    }

    #[test]
    fn test_uses_single_quotes() {
        let formatter = TsFormatter::new();
        let code = r#"const x = "hello";"#;
        let result = formatter
            .format(&PathBuf::from("test.ts"), code)
            .unwrap();
        assert!(result.contains("'hello'"), "Should use single quotes");
    }

    #[test]
    fn test_arrow_function_parens() {
        let formatter = TsFormatter::new();
        let code = "const fn = (x) => x * 2;";
        let result = formatter
            .format(&PathBuf::from("test.ts"), code)
            .unwrap();
        // Should avoid parens when possible
        assert!(result.contains("x =>"), "Should avoid unnecessary parens");
    }
}
