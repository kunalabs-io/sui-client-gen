//! JSDoc formatting utilities for TypeScript code generation.

use super::doc_utils::process_doc_string;

/// Format a documentation string as a JSDoc comment.
///
/// # Rules
/// - Single-line docs (no newlines): `/** doc */`
/// - Multi-line docs:
///   ```
///   /**
///    * line 1
///    * line 2
///    */
///   ```
/// - Preserves markdown formatting
/// - Escapes */ sequences (via process_doc_string)
/// - Returns None if doc_comment is None or empty after processing
///
/// # Arguments
/// - `doc_comment`: The documentation string to format
/// - `indent`: The indentation string (e.g., "", "  ", "    ")
///
/// # Returns
/// - `Some(String)` with formatted JSDoc if doc exists
/// - `None` if no doc or doc is empty after processing
pub fn format_jsdoc(doc_comment: &Option<String>, indent: &str) -> Option<String> {
    let doc = doc_comment.as_ref()?;

    let processed = process_doc_string(doc);

    if processed.is_empty() {
        return None;
    }

    // Check if single-line (no newlines in processed doc)
    if !processed.contains('\n') {
        return Some(format!("{}/** {} */", indent, processed));
    }

    // Multi-line formatting
    let lines: Vec<&str> = processed.lines().collect();
    let mut result = format!("{}/**\n", indent);
    for line in lines {
        if line.is_empty() {
            result.push_str(&format!("{} *\n", indent));
        } else {
            result.push_str(&format!("{} * {}\n", indent, line));
        }
    }
    result.push_str(&format!("{} */", indent));
    Some(result)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_format_jsdoc_none() {
        assert_eq!(format_jsdoc(&None, ""), None);
    }

    #[test]
    fn test_format_jsdoc_empty() {
        assert_eq!(format_jsdoc(&Some("".to_string()), ""), None);
        assert_eq!(format_jsdoc(&Some("   ".to_string()), ""), None);
    }

    #[test]
    fn test_format_jsdoc_single_line() {
        let doc = Some("A simple doc comment".to_string());
        let result = format_jsdoc(&doc, "");
        assert_eq!(result, Some("/** A simple doc comment */".to_string()));
    }

    #[test]
    fn test_format_jsdoc_single_line_with_indent() {
        let doc = Some("A simple doc comment".to_string());
        let result = format_jsdoc(&doc, "  ");
        assert_eq!(result, Some("  /** A simple doc comment */".to_string()));
    }

    #[test]
    fn test_format_jsdoc_multiline() {
        let doc = Some("Line 1\nLine 2\nLine 3".to_string());
        let result = format_jsdoc(&doc, "");
        let expected = "/**\n * Line 1\n * Line 2\n * Line 3\n */";
        assert_eq!(result, Some(expected.to_string()));
    }

    #[test]
    fn test_format_jsdoc_multiline_with_indent() {
        let doc = Some("Line 1\nLine 2".to_string());
        let result = format_jsdoc(&doc, "  ");
        let expected = "  /**\n   * Line 1\n   * Line 2\n   */";
        assert_eq!(result, Some(expected.to_string()));
    }

    #[test]
    fn test_format_jsdoc_with_empty_lines() {
        let doc = Some("Paragraph 1\n\nParagraph 2".to_string());
        let result = format_jsdoc(&doc, "");
        let expected = "/**\n * Paragraph 1\n *\n * Paragraph 2\n */";
        assert_eq!(result, Some(expected.to_string()));
    }

    #[test]
    fn test_format_jsdoc_escapes_closing() {
        let doc = Some("Doc with */ sequence".to_string());
        let result = format_jsdoc(&doc, "");
        assert_eq!(result, Some("/** Doc with *\\/ sequence */".to_string()));
    }

    #[test]
    fn test_format_jsdoc_markdown() {
        let doc = Some("# Heading\n\n- List item 1\n- List item 2\n\n`code example`".to_string());
        let result = format_jsdoc(&doc, "");
        let expected = "/**\n * # Heading\n *\n * - List item 1\n * - List item 2\n *\n * `code example`\n */";
        assert_eq!(result, Some(expected.to_string()));
    }

    #[test]
    fn test_format_jsdoc_multiline_escaping() {
        let doc = Some("Line with */\nAnother line".to_string());
        let result = format_jsdoc(&doc, "");
        let expected = "/**\n * Line with *\\/\n * Another line\n */";
        assert_eq!(result, Some(expected.to_string()));
    }
}
