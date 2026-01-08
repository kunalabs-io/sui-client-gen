//! Utilities for extracting and processing documentation from Move model.

use move_model_2::summary::{Attribute, Attributes, FromSource};

/// Extract documentation from FromSource<Option<String>>.
///
/// FromSource<T> is a type alias for Option<T>, so this is Option<Option<String>>.
///
/// Returns None if:
/// - No source available (outer None - on-chain/bytecode-only packages)
/// - Source exists but no doc comment (Some(None))
pub fn extract_doc(doc: &FromSource<Option<String>>) -> Option<String> {
    doc.as_ref()?.clone()
}

/// Process raw doc string for JSDoc emission.
///
/// - Trims whitespace from each line
/// - Escapes */ sequences to prevent breaking JSDoc blocks
/// - Normalizes line endings
/// - Returns the processed string (may be empty after trimming)
pub fn process_doc_string(raw: &str) -> String {
    raw.trim()
        .replace("*/", "*\\/") // Escape closing JSDoc
        .lines()
        .map(|line| line.trim())  // Trim both leading and trailing whitespace
        .collect::<Vec<_>>()
        .join("\n")
}

/// Extract deprecated status and note from Move attributes.
///
/// Detects `#[deprecated]` or `#[deprecated(note = "...")]` attributes.
///
/// Returns:
/// - `(true, Some(note))` if `#[deprecated(note = "...")]` is found
/// - `(true, None)` if `#[deprecated]` is found without a note
/// - `(false, None)` if no deprecated attribute is present or no source available
pub fn extract_deprecated(attributes: &FromSource<Attributes>) -> (bool, Option<String>) {
    match attributes.as_ref() {
        Some(attrs) => {
            for attr in attrs.iter() {
                match attr {
                    Attribute::Name(name) if name.as_str() == "deprecated" => {
                        return (true, None);
                    }
                    Attribute::Parameterized(name, params) if name.as_str() == "deprecated" => {
                        // Look for the "note" parameter in the deprecated attribute
                        let note = params.iter().find_map(|param| {
                            if let Attribute::Assigned(param_name, value) = param {
                                if param_name.as_str() == "note" {
                                    return Some(value.clone());
                                }
                            }
                            None
                        });
                        return (true, note);
                    }
                    _ => {}
                }
            }
            (false, None)
        }
        None => (false, None),
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_process_doc_string_single_line() {
        let input = "  Simple doc  ";
        assert_eq!(process_doc_string(input), "Simple doc");
    }

    #[test]
    fn test_process_doc_string_multiline() {
        let input = "Line 1\nLine 2\nLine 3";
        assert_eq!(process_doc_string(input), "Line 1\nLine 2\nLine 3");
    }

    #[test]
    fn test_process_doc_string_escapes_jsdoc_close() {
        let input = "Documentation with */ sequence";
        assert_eq!(process_doc_string(input), "Documentation with *\\/ sequence");
    }

    #[test]
    fn test_process_doc_string_multiple_escapes() {
        let input = "First */ and second */";
        assert_eq!(process_doc_string(input), "First *\\/ and second *\\/");
    }

    #[test]
    fn test_process_doc_string_empty() {
        assert_eq!(process_doc_string(""), "");
        assert_eq!(process_doc_string("   "), "");
        assert_eq!(process_doc_string("  \n  \n  "), "");
    }

    #[test]
    fn test_process_doc_string_trailing_whitespace() {
        let input = "Line 1  \nLine 2  \nLine 3  ";
        assert_eq!(process_doc_string(input), "Line 1\nLine 2\nLine 3");
    }

    #[test]
    fn test_process_doc_string_leading_whitespace() {
        let input = "First line\n  Second line with leading spaces\n    Third line";
        assert_eq!(
            process_doc_string(input),
            "First line\nSecond line with leading spaces\nThird line"
        );
    }

    #[test]
    fn test_process_doc_string_both_whitespace() {
        let input = "  Line 1  \n  Line 2  \n  Line 3  ";
        assert_eq!(process_doc_string(input), "Line 1\nLine 2\nLine 3");
    }

    #[test]
    fn test_extract_deprecated_no_source() {
        let attributes: FromSource<Attributes> = None;
        assert_eq!(extract_deprecated(&attributes), (false, None));
    }

    #[test]
    fn test_extract_deprecated_empty_attributes() {
        let attributes: FromSource<Attributes> = Some(vec![]);
        assert_eq!(extract_deprecated(&attributes), (false, None));
    }

    #[test]
    fn test_extract_deprecated_simple() {
        use move_symbol_pool::Symbol;
        let attributes: FromSource<Attributes> =
            Some(vec![Attribute::Name(Symbol::from("deprecated"))]);
        assert_eq!(extract_deprecated(&attributes), (true, None));
    }

    #[test]
    fn test_extract_deprecated_with_note() {
        use move_symbol_pool::Symbol;
        let note_param = Attribute::Assigned(
            Symbol::from("note"),
            "Use `new_function` instead".to_string(),
        );
        let attributes: FromSource<Attributes> = Some(vec![Attribute::Parameterized(
            Symbol::from("deprecated"),
            vec![note_param],
        )]);
        assert_eq!(
            extract_deprecated(&attributes),
            (true, Some("Use `new_function` instead".to_string()))
        );
    }

    #[test]
    fn test_extract_deprecated_other_attributes() {
        use move_symbol_pool::Symbol;
        let attributes: FromSource<Attributes> = Some(vec![
            Attribute::Name(Symbol::from("test")),
            Attribute::Name(Symbol::from("some_other_attr")),
        ]);
        assert_eq!(extract_deprecated(&attributes), (false, None));
    }

    #[test]
    fn test_extract_deprecated_mixed_attributes() {
        use move_symbol_pool::Symbol;
        let attributes: FromSource<Attributes> = Some(vec![
            Attribute::Name(Symbol::from("test")),
            Attribute::Name(Symbol::from("deprecated")),
            Attribute::Name(Symbol::from("another")),
        ]);
        assert_eq!(extract_deprecated(&attributes), (true, None));
    }
}
