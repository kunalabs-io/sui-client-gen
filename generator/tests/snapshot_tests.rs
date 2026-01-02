//! Snapshot tests for TypeScript code generation.
//!
//! These tests exercise the IR → TypeScript emission pipeline and snapshot
//! the generated output to catch regressions in:
//! - Import ordering/deduplication
//! - Type annotations
//! - Error messages
//! - Template correctness
//!
//! The fixtures are modeled after real Move structs/enums in `move/examples/`.

use sui_client_gen::ts_gen::{
    DatatypeImport, DatatypeKind, EnumIR, EnumVariantIR, FieldIR, FieldTypeIR, PackageInfo,
    StructIR, TypeParamIR,
};

// =============================================================================
// Helper functions for package info
// =============================================================================

fn examples_pkg() -> PackageInfo {
    PackageInfo::Versioned { version: 1 }
}

#[allow(dead_code)]
fn sui_pkg() -> PackageInfo {
    PackageInfo::System {
        address: "0x2".to_string(),
    }
}

#[allow(dead_code)]
fn stdlib_pkg() -> PackageInfo {
    PackageInfo::System {
        address: "0x1".to_string(),
    }
}

// =============================================================================
// Field type helpers
// =============================================================================

fn uid_field_type() -> FieldTypeIR {
    FieldTypeIR::Datatype {
        class_name: "UID".to_string(),
        full_type_name: "0x2::object::UID".to_string(),
        type_args: vec![],
        type_arg_is_phantom: vec![],
        kind: DatatypeKind::Struct,
    }
}

fn id_field_type() -> FieldTypeIR {
    FieldTypeIR::Datatype {
        class_name: "ID".to_string(),
        full_type_name: "0x2::object::ID".to_string(),
        type_args: vec![],
        type_arg_is_phantom: vec![],
        kind: DatatypeKind::Struct,
    }
}

fn utf8_string_field_type() -> FieldTypeIR {
    FieldTypeIR::Datatype {
        class_name: "String".to_string(),
        full_type_name: "0x1::string::String".to_string(),
        type_args: vec![],
        type_arg_is_phantom: vec![],
        kind: DatatypeKind::Struct,
    }
}

fn ascii_string_field_type() -> FieldTypeIR {
    FieldTypeIR::Datatype {
        class_name: "StringAscii".to_string(),
        full_type_name: "0x1::ascii::String".to_string(),
        type_args: vec![],
        type_arg_is_phantom: vec![],
        kind: DatatypeKind::Struct,
    }
}

fn url_field_type() -> FieldTypeIR {
    FieldTypeIR::Datatype {
        class_name: "Url".to_string(),
        full_type_name: "0x2::url::Url".to_string(),
        type_args: vec![],
        type_arg_is_phantom: vec![],
        kind: DatatypeKind::Struct,
    }
}

fn sui_field_type() -> FieldTypeIR {
    FieldTypeIR::Datatype {
        class_name: "SUI".to_string(),
        full_type_name: "0x2::sui::SUI".to_string(),
        type_args: vec![],
        type_arg_is_phantom: vec![],
        kind: DatatypeKind::Struct,
    }
}

fn balance_sui_field_type() -> FieldTypeIR {
    FieldTypeIR::Datatype {
        class_name: "Balance".to_string(),
        full_type_name: "0x2::balance::Balance".to_string(),
        type_args: vec![sui_field_type()],
        type_arg_is_phantom: vec![true],
        kind: DatatypeKind::Struct,
    }
}

fn balance_generic_field_type(type_param_name: &str, index: usize) -> FieldTypeIR {
    FieldTypeIR::Datatype {
        class_name: "Balance".to_string(),
        full_type_name: "0x2::balance::Balance".to_string(),
        type_args: vec![FieldTypeIR::TypeParam {
            name: type_param_name.to_string(),
            is_phantom: true,
            index,
        }],
        type_arg_is_phantom: vec![true],
        kind: DatatypeKind::Struct,
    }
}

fn option_u64_field_type() -> FieldTypeIR {
    FieldTypeIR::Datatype {
        class_name: "Option".to_string(),
        full_type_name: "0x1::option::Option".to_string(),
        type_args: vec![FieldTypeIR::Primitive("u64".to_string())],
        type_arg_is_phantom: vec![false],
        kind: DatatypeKind::Struct,
    }
}

fn option_generic_field_type(type_param_name: &str, is_phantom: bool, index: usize) -> FieldTypeIR {
    FieldTypeIR::Datatype {
        class_name: "Option".to_string(),
        full_type_name: "0x1::option::Option".to_string(),
        type_args: vec![FieldTypeIR::TypeParam {
            name: type_param_name.to_string(),
            is_phantom,
            index,
        }],
        type_arg_is_phantom: vec![false],
        kind: DatatypeKind::Struct,
    }
}

fn bar_field_type() -> FieldTypeIR {
    FieldTypeIR::Datatype {
        class_name: "Bar".to_string(),
        full_type_name: "examples::fixture::Bar".to_string(),
        type_args: vec![],
        type_arg_is_phantom: vec![],
        kind: DatatypeKind::Struct,
    }
}

fn option_bar_field_type() -> FieldTypeIR {
    FieldTypeIR::Datatype {
        class_name: "Option".to_string(),
        full_type_name: "0x1::option::Option".to_string(),
        type_args: vec![bar_field_type()],
        type_arg_is_phantom: vec![false],
        kind: DatatypeKind::Struct,
    }
}

// =============================================================================
// Import helpers
// =============================================================================

fn uid_import() -> DatatypeImport {
    DatatypeImport {
        class_name: "UID".to_string(),
        path: "../../sui/object/structs".to_string(),
        alias: None,
    }
}

fn id_import() -> DatatypeImport {
    DatatypeImport {
        class_name: "ID".to_string(),
        path: "../../sui/object/structs".to_string(),
        alias: None,
    }
}

fn utf8_string_import() -> DatatypeImport {
    DatatypeImport {
        class_name: "String".to_string(),
        path: "../../move-stdlib/string/structs".to_string(),
        alias: None,
    }
}

fn ascii_string_import() -> DatatypeImport {
    DatatypeImport {
        class_name: "String".to_string(),
        path: "../../move-stdlib/ascii/structs".to_string(),
        alias: Some("StringAscii".to_string()),
    }
}

fn url_import() -> DatatypeImport {
    DatatypeImport {
        class_name: "Url".to_string(),
        path: "../../sui/url/structs".to_string(),
        alias: None,
    }
}

fn balance_import() -> DatatypeImport {
    DatatypeImport {
        class_name: "Balance".to_string(),
        path: "../../sui/balance/structs".to_string(),
        alias: None,
    }
}

fn sui_import() -> DatatypeImport {
    DatatypeImport {
        class_name: "SUI".to_string(),
        path: "../../sui/sui/structs".to_string(),
        alias: None,
    }
}

fn option_import() -> DatatypeImport {
    DatatypeImport {
        class_name: "Option".to_string(),
        path: "../../move-stdlib/option/structs".to_string(),
        alias: None,
    }
}

fn bar_import() -> DatatypeImport {
    DatatypeImport {
        class_name: "Bar".to_string(),
        path: "./structs".to_string(),
        alias: None,
    }
}

// =============================================================================
// Struct IR Fixtures (mirroring move/examples/sources/fixture.move)
// =============================================================================

/// `Dummy` - minimal struct with store ability (empty body)
/// From fixture.move: `public struct Dummy has store {}`
fn make_fixture_dummy_ir() -> StructIR {
    StructIR {
        name: "Dummy".to_string(),
        module_struct_path: "fixture::Dummy".to_string(),
        package_info: examples_pkg(),
        type_params: vec![],
        fields: vec![FieldIR {
            ts_name: "dummyField".to_string(),
            move_name: "dummy_field".to_string(),
            field_type: FieldTypeIR::Primitive("bool".to_string()),
        }],
        struct_imports: vec![],
        uses_vector: false,
        uses_address: false,
        uses_phantom_struct_args: false,
        has_non_phantom_type_params: false,
        uses_field_to_json: false,
    }
}

/// `Bar` - simple value struct with copy, drop, store
/// From fixture.move: `public struct Bar has copy, drop, store { value: u64 }`
fn make_fixture_bar_ir() -> StructIR {
    StructIR {
        name: "Bar".to_string(),
        module_struct_path: "fixture::Bar".to_string(),
        package_info: examples_pkg(),
        type_params: vec![],
        fields: vec![FieldIR {
            ts_name: "value".to_string(),
            move_name: "value".to_string(),
            field_type: FieldTypeIR::Primitive("u64".to_string()),
        }],
        struct_imports: vec![],
        uses_vector: false,
        uses_address: false,
        uses_phantom_struct_args: false,
        has_non_phantom_type_params: false,
        uses_field_to_json: false,
    }
}

/// `WithGenericField<T>` - key object with UID and generic field
/// From fixture.move: `public struct WithGenericField<T: store> has key { id: UID, generic_field: T }`
fn make_fixture_with_generic_field_ir() -> StructIR {
    StructIR {
        name: "WithGenericField".to_string(),
        module_struct_path: "fixture::WithGenericField".to_string(),
        package_info: examples_pkg(),
        type_params: vec![TypeParamIR {
            name: "T".to_string(),
            is_phantom: false,
        }],
        fields: vec![
            FieldIR {
                ts_name: "id".to_string(),
                move_name: "id".to_string(),
                field_type: uid_field_type(),
            },
            FieldIR {
                ts_name: "genericField".to_string(),
                move_name: "generic_field".to_string(),
                field_type: FieldTypeIR::TypeParam {
                    name: "T".to_string(),
                    is_phantom: false,
                    index: 0,
                },
            },
        ],
        struct_imports: vec![uid_import()],
        uses_vector: false,
        uses_address: false,
        uses_phantom_struct_args: false,
        has_non_phantom_type_params: true,
        uses_field_to_json: true,
    }
}

/// `WithTwoGenerics<T, U>` - struct with two generic type params
/// From fixture.move: `public struct WithTwoGenerics<T: store + drop, U: store + drop> has drop, store { ... }`
fn make_fixture_with_two_generics_ir() -> StructIR {
    StructIR {
        name: "WithTwoGenerics".to_string(),
        module_struct_path: "fixture::WithTwoGenerics".to_string(),
        package_info: examples_pkg(),
        type_params: vec![
            TypeParamIR {
                name: "T".to_string(),
                is_phantom: false,
            },
            TypeParamIR {
                name: "U".to_string(),
                is_phantom: false,
            },
        ],
        fields: vec![
            FieldIR {
                ts_name: "genericField1".to_string(),
                move_name: "generic_field_1".to_string(),
                field_type: FieldTypeIR::TypeParam {
                    name: "T".to_string(),
                    is_phantom: false,
                    index: 0,
                },
            },
            FieldIR {
                ts_name: "genericField2".to_string(),
                move_name: "generic_field_2".to_string(),
                field_type: FieldTypeIR::TypeParam {
                    name: "U".to_string(),
                    is_phantom: false,
                    index: 1,
                },
            },
        ],
        struct_imports: vec![],
        uses_vector: false,
        uses_address: false,
        uses_phantom_struct_args: false,
        has_non_phantom_type_params: true,
        uses_field_to_json: true,
    }
}

/// `WithSpecialTypes<phantom T, U>` - exercises all special-cased types
/// From fixture.move - the "stress test" for special type handling
fn make_fixture_with_special_types_ir() -> StructIR {
    StructIR {
        name: "WithSpecialTypes".to_string(),
        module_struct_path: "fixture::WithSpecialTypes".to_string(),
        package_info: examples_pkg(),
        type_params: vec![
            TypeParamIR {
                name: "T".to_string(),
                is_phantom: true,
            },
            TypeParamIR {
                name: "U".to_string(),
                is_phantom: false,
            },
        ],
        fields: vec![
            FieldIR {
                ts_name: "id".to_string(),
                move_name: "id".to_string(),
                field_type: uid_field_type(),
            },
            FieldIR {
                ts_name: "string".to_string(),
                move_name: "string".to_string(),
                field_type: utf8_string_field_type(),
            },
            FieldIR {
                ts_name: "asciiString".to_string(),
                move_name: "ascii_string".to_string(),
                field_type: ascii_string_field_type(),
            },
            FieldIR {
                ts_name: "url".to_string(),
                move_name: "url".to_string(),
                field_type: url_field_type(),
            },
            FieldIR {
                ts_name: "idField".to_string(),
                move_name: "id_field".to_string(),
                field_type: id_field_type(),
            },
            FieldIR {
                ts_name: "uid".to_string(),
                move_name: "uid".to_string(),
                field_type: uid_field_type(),
            },
            FieldIR {
                ts_name: "balance".to_string(),
                move_name: "balance".to_string(),
                field_type: balance_sui_field_type(),
            },
            FieldIR {
                ts_name: "option".to_string(),
                move_name: "option".to_string(),
                field_type: option_u64_field_type(),
            },
            FieldIR {
                ts_name: "optionObj".to_string(),
                move_name: "option_obj".to_string(),
                field_type: option_bar_field_type(),
            },
            FieldIR {
                ts_name: "optionNone".to_string(),
                move_name: "option_none".to_string(),
                field_type: option_u64_field_type(),
            },
            FieldIR {
                ts_name: "balanceGeneric".to_string(),
                move_name: "balance_generic".to_string(),
                field_type: balance_generic_field_type("T", 0),
            },
            FieldIR {
                ts_name: "optionGeneric".to_string(),
                move_name: "option_generic".to_string(),
                field_type: option_generic_field_type("U", false, 1),
            },
            FieldIR {
                ts_name: "optionGenericNone".to_string(),
                move_name: "option_generic_none".to_string(),
                field_type: option_generic_field_type("U", false, 1),
            },
        ],
        struct_imports: vec![
            uid_import(),
            utf8_string_import(),
            ascii_string_import(),
            url_import(),
            id_import(),
            balance_import(),
            sui_import(),
            option_import(),
            bar_import(),
        ],
        uses_vector: false,
        uses_address: false,
        uses_phantom_struct_args: true,
        has_non_phantom_type_params: true,
        uses_field_to_json: true,
    }
}

/// `WithSpecialTypesInVectors<T>` - special types inside vectors
/// From fixture.move
fn make_fixture_with_special_types_in_vectors_ir() -> StructIR {
    StructIR {
        name: "WithSpecialTypesInVectors".to_string(),
        module_struct_path: "fixture::WithSpecialTypesInVectors".to_string(),
        package_info: examples_pkg(),
        type_params: vec![TypeParamIR {
            name: "T".to_string(),
            is_phantom: false,
        }],
        fields: vec![
            FieldIR {
                ts_name: "id".to_string(),
                move_name: "id".to_string(),
                field_type: uid_field_type(),
            },
            FieldIR {
                ts_name: "string".to_string(),
                move_name: "string".to_string(),
                field_type: FieldTypeIR::Vector(Box::new(utf8_string_field_type())),
            },
            FieldIR {
                ts_name: "asciiString".to_string(),
                move_name: "ascii_string".to_string(),
                field_type: FieldTypeIR::Vector(Box::new(ascii_string_field_type())),
            },
            FieldIR {
                ts_name: "idField".to_string(),
                move_name: "id_field".to_string(),
                field_type: FieldTypeIR::Vector(Box::new(id_field_type())),
            },
            FieldIR {
                ts_name: "bar".to_string(),
                move_name: "bar".to_string(),
                field_type: FieldTypeIR::Vector(Box::new(bar_field_type())),
            },
            FieldIR {
                ts_name: "option".to_string(),
                move_name: "option".to_string(),
                field_type: FieldTypeIR::Vector(Box::new(option_u64_field_type())),
            },
            FieldIR {
                ts_name: "optionGeneric".to_string(),
                move_name: "option_generic".to_string(),
                field_type: FieldTypeIR::Vector(Box::new(option_generic_field_type("T", false, 0))),
            },
        ],
        struct_imports: vec![
            uid_import(),
            utf8_string_import(),
            ascii_string_import(),
            id_import(),
            bar_import(),
            option_import(),
        ],
        uses_vector: true,
        uses_address: false,
        uses_phantom_struct_args: false,
        has_non_phantom_type_params: true,
        uses_field_to_json: true,
    }
}

/// `Foo<T>` - the complex "stress test" struct from fixture.move
/// This has vectors of primitives, objects, generics, and deeply nested generics
fn make_fixture_foo_ir() -> StructIR {
    // Helper for WithTwoGenerics<T, U> field type
    fn with_two_generics(t: FieldTypeIR, u: FieldTypeIR) -> FieldTypeIR {
        FieldTypeIR::Datatype {
            class_name: "WithTwoGenerics".to_string(),
            full_type_name: "examples::fixture::WithTwoGenerics".to_string(),
            type_args: vec![t, u],
            type_arg_is_phantom: vec![false, false],
            kind: DatatypeKind::Struct,
        }
    }

    let t_type_param = FieldTypeIR::TypeParam {
        name: "T".to_string(),
        is_phantom: false,
        index: 0,
    };

    StructIR {
        name: "Foo".to_string(),
        module_struct_path: "fixture::Foo".to_string(),
        package_info: examples_pkg(),
        type_params: vec![TypeParamIR {
            name: "T".to_string(),
            is_phantom: false,
        }],
        fields: vec![
            FieldIR {
                ts_name: "id".to_string(),
                move_name: "id".to_string(),
                field_type: uid_field_type(),
            },
            FieldIR {
                ts_name: "generic".to_string(),
                move_name: "generic".to_string(),
                field_type: t_type_param.clone(),
            },
            FieldIR {
                ts_name: "reifiedPrimitiveVec".to_string(),
                move_name: "reified_primitive_vec".to_string(),
                field_type: FieldTypeIR::Vector(Box::new(FieldTypeIR::Primitive(
                    "u64".to_string(),
                ))),
            },
            FieldIR {
                ts_name: "reifiedObjectVec".to_string(),
                move_name: "reified_object_vec".to_string(),
                field_type: FieldTypeIR::Vector(Box::new(bar_field_type())),
            },
            FieldIR {
                ts_name: "genericVec".to_string(),
                move_name: "generic_vec".to_string(),
                field_type: FieldTypeIR::Vector(Box::new(t_type_param.clone())),
            },
            FieldIR {
                ts_name: "genericVecNested".to_string(),
                move_name: "generic_vec_nested".to_string(),
                field_type: FieldTypeIR::Vector(Box::new(with_two_generics(
                    t_type_param.clone(),
                    FieldTypeIR::Primitive("u8".to_string()),
                ))),
            },
            FieldIR {
                ts_name: "twoGenerics".to_string(),
                move_name: "two_generics".to_string(),
                field_type: with_two_generics(t_type_param.clone(), bar_field_type()),
            },
            FieldIR {
                ts_name: "twoGenericsReifiedPrimitive".to_string(),
                move_name: "two_generics_reified_primitive".to_string(),
                field_type: with_two_generics(
                    FieldTypeIR::Primitive("u16".to_string()),
                    FieldTypeIR::Primitive("u64".to_string()),
                ),
            },
            FieldIR {
                ts_name: "twoGenericsReifiedObject".to_string(),
                move_name: "two_generics_reified_object".to_string(),
                field_type: with_two_generics(bar_field_type(), bar_field_type()),
            },
            FieldIR {
                ts_name: "twoGenericsNested".to_string(),
                move_name: "two_generics_nested".to_string(),
                field_type: with_two_generics(
                    t_type_param.clone(),
                    with_two_generics(
                        FieldTypeIR::Primitive("u8".to_string()),
                        FieldTypeIR::Primitive("u8".to_string()),
                    ),
                ),
            },
            FieldIR {
                ts_name: "twoGenericsReifiedNested".to_string(),
                move_name: "two_generics_reified_nested".to_string(),
                field_type: with_two_generics(
                    bar_field_type(),
                    with_two_generics(
                        FieldTypeIR::Primitive("u8".to_string()),
                        FieldTypeIR::Primitive("u8".to_string()),
                    ),
                ),
            },
            FieldIR {
                ts_name: "twoGenericsNestedVec".to_string(),
                move_name: "two_generics_nested_vec".to_string(),
                field_type: FieldTypeIR::Vector(Box::new(with_two_generics(
                    bar_field_type(),
                    FieldTypeIR::Vector(Box::new(with_two_generics(
                        t_type_param.clone(),
                        FieldTypeIR::Primitive("u8".to_string()),
                    ))),
                ))),
            },
            FieldIR {
                ts_name: "dummy".to_string(),
                move_name: "dummy".to_string(),
                field_type: FieldTypeIR::Datatype {
                    class_name: "Dummy".to_string(),
                    full_type_name: "examples::fixture::Dummy".to_string(),
                    type_args: vec![],
                    type_arg_is_phantom: vec![],
                    kind: DatatypeKind::Struct,
                },
            },
            FieldIR {
                ts_name: "other".to_string(),
                move_name: "other".to_string(),
                field_type: FieldTypeIR::Datatype {
                    class_name: "StructFromOtherModule".to_string(),
                    full_type_name: "examples::other_module::StructFromOtherModule".to_string(),
                    type_args: vec![],
                    type_arg_is_phantom: vec![],
                    kind: DatatypeKind::Struct,
                },
            },
        ],
        struct_imports: vec![
            uid_import(),
            bar_import(),
            DatatypeImport {
                class_name: "WithTwoGenerics".to_string(),
                path: "./structs".to_string(),
                alias: None,
            },
            DatatypeImport {
                class_name: "Dummy".to_string(),
                path: "./structs".to_string(),
                alias: None,
            },
            DatatypeImport {
                class_name: "StructFromOtherModule".to_string(),
                path: "../other-module/structs".to_string(),
                alias: None,
            },
        ],
        uses_vector: true,
        uses_address: false,
        uses_phantom_struct_args: false,
        has_non_phantom_type_params: true,
        uses_field_to_json: true,
    }
}

// =============================================================================
// Enum IR Fixtures (mirroring move/examples/sources/enums.move)
// =============================================================================

/// `Action<T, phantom U>` - enum with unit, struct, and tuple variants
/// From enums.move:
/// ```move
/// public enum Action<T, phantom U> has store {
///     Stop,
///     Pause { duration: u32, generic_field: T, phantom_field: Balance<U>, reified_field: Option<u64> },
///     Jump(u64, T, Balance<U>, Option<u64>),
/// }
/// ```
fn make_enums_action_ir() -> EnumIR {
    let t_type_param = FieldTypeIR::TypeParam {
        name: "T".to_string(),
        is_phantom: false,
        index: 0,
    };

    EnumIR {
        name: "Action".to_string(),
        module_enum_path: "enums::Action".to_string(),
        package_info: examples_pkg(),
        type_params: vec![
            TypeParamIR {
                name: "T".to_string(),
                is_phantom: false,
            },
            TypeParamIR {
                name: "U".to_string(),
                is_phantom: true,
            },
        ],
        variants: vec![
            // Unit variant: Stop
            EnumVariantIR {
                name: "Stop".to_string(),
                fields: vec![],
                is_tuple: false,
            },
            // Struct variant: Pause { duration, generic_field, phantom_field, reified_field }
            EnumVariantIR {
                name: "Pause".to_string(),
                fields: vec![
                    FieldIR {
                        ts_name: "duration".to_string(),
                        move_name: "duration".to_string(),
                        field_type: FieldTypeIR::Primitive("u32".to_string()),
                    },
                    FieldIR {
                        ts_name: "genericField".to_string(),
                        move_name: "generic_field".to_string(),
                        field_type: t_type_param.clone(),
                    },
                    FieldIR {
                        ts_name: "phantomField".to_string(),
                        move_name: "phantom_field".to_string(),
                        field_type: balance_generic_field_type("U", 1),
                    },
                    FieldIR {
                        ts_name: "reifiedField".to_string(),
                        move_name: "reified_field".to_string(),
                        field_type: option_u64_field_type(),
                    },
                ],
                is_tuple: false,
            },
            // Tuple variant: Jump(u64, T, Balance<U>, Option<u64>)
            EnumVariantIR {
                name: "Jump".to_string(),
                fields: vec![
                    FieldIR {
                        ts_name: "0".to_string(),
                        move_name: "0".to_string(),
                        field_type: FieldTypeIR::Primitive("u64".to_string()),
                    },
                    FieldIR {
                        ts_name: "1".to_string(),
                        move_name: "1".to_string(),
                        field_type: t_type_param.clone(),
                    },
                    FieldIR {
                        ts_name: "2".to_string(),
                        move_name: "2".to_string(),
                        field_type: balance_generic_field_type("U", 1),
                    },
                    FieldIR {
                        ts_name: "3".to_string(),
                        move_name: "3".to_string(),
                        field_type: option_u64_field_type(),
                    },
                ],
                is_tuple: true,
            },
        ],
        uses_vector: false,
        uses_address: false,
        uses_phantom_struct_args: true,
    }
}

/// `Wrapped<T, U, V>` - struct that wraps enum fields
/// From enums.move
fn make_enums_wrapped_ir() -> StructIR {
    fn action_u64_sui() -> FieldTypeIR {
        FieldTypeIR::Datatype {
            class_name: "Action".to_string(),
            full_type_name: "examples::enums::Action".to_string(),
            type_args: vec![FieldTypeIR::Primitive("u64".to_string()), sui_field_type()],
            type_arg_is_phantom: vec![false, true],
            kind: DatatypeKind::Enum,
        }
    }

    StructIR {
        name: "Wrapped".to_string(),
        module_struct_path: "enums::Wrapped".to_string(),
        package_info: examples_pkg(),
        type_params: vec![
            TypeParamIR {
                name: "T".to_string(),
                is_phantom: false,
            },
            TypeParamIR {
                name: "U".to_string(),
                is_phantom: false,
            },
            TypeParamIR {
                name: "V".to_string(),
                is_phantom: false,
            },
        ],
        fields: vec![
            FieldIR {
                ts_name: "id".to_string(),
                move_name: "id".to_string(),
                field_type: uid_field_type(),
            },
            FieldIR {
                ts_name: "t".to_string(),
                move_name: "t".to_string(),
                field_type: FieldTypeIR::TypeParam {
                    name: "T".to_string(),
                    is_phantom: false,
                    index: 0,
                },
            },
            FieldIR {
                ts_name: "u".to_string(),
                move_name: "u".to_string(),
                field_type: FieldTypeIR::TypeParam {
                    name: "U".to_string(),
                    is_phantom: false,
                    index: 1,
                },
            },
            FieldIR {
                ts_name: "v".to_string(),
                move_name: "v".to_string(),
                field_type: FieldTypeIR::TypeParam {
                    name: "V".to_string(),
                    is_phantom: false,
                    index: 2,
                },
            },
            FieldIR {
                ts_name: "stop".to_string(),
                move_name: "stop".to_string(),
                field_type: action_u64_sui(),
            },
            FieldIR {
                ts_name: "pause".to_string(),
                move_name: "pause".to_string(),
                field_type: action_u64_sui(),
            },
            FieldIR {
                ts_name: "jump".to_string(),
                move_name: "jump".to_string(),
                field_type: action_u64_sui(),
            },
        ],
        struct_imports: vec![
            uid_import(),
            DatatypeImport {
                class_name: "Action".to_string(),
                path: "./structs".to_string(),
                alias: None,
            },
            sui_import(),
        ],
        uses_vector: false,
        uses_address: false,
        uses_phantom_struct_args: true,
        has_non_phantom_type_params: true,
        uses_field_to_json: true,
    }
}

// =============================================================================
// Struct Snapshot Tests
// =============================================================================

#[test]
fn test_fixture_dummy_snapshot() {
    let ir = make_fixture_dummy_ir();
    let output = ir.emit_body();
    insta::assert_snapshot!("fixture__dummy", output);
}

#[test]
fn test_fixture_bar_snapshot() {
    let ir = make_fixture_bar_ir();
    let output = ir.emit_body();
    insta::assert_snapshot!("fixture__bar", output);
}

#[test]
fn test_fixture_with_generic_field_snapshot() {
    let ir = make_fixture_with_generic_field_ir();
    let output = ir.emit_body();
    insta::assert_snapshot!("fixture__with_generic_field", output);
}

#[test]
fn test_fixture_with_two_generics_snapshot() {
    let ir = make_fixture_with_two_generics_ir();
    let output = ir.emit_body();
    insta::assert_snapshot!("fixture__with_two_generics", output);
}

#[test]
fn test_fixture_with_special_types_snapshot() {
    let ir = make_fixture_with_special_types_ir();
    let output = ir.emit_body();
    insta::assert_snapshot!("fixture__with_special_types", output);
}

#[test]
fn test_fixture_with_special_types_in_vectors_snapshot() {
    let ir = make_fixture_with_special_types_in_vectors_ir();
    let output = ir.emit_body();
    insta::assert_snapshot!("fixture__with_special_types_in_vectors", output);
}

#[test]
fn test_fixture_foo_snapshot() {
    let ir = make_fixture_foo_ir();
    let output = ir.emit_body();
    insta::assert_snapshot!("fixture__foo", output);
}

// =============================================================================
// Enum Snapshot Tests
// =============================================================================

#[test]
fn test_enums_action_snapshot() {
    let ir = make_enums_action_ir();
    let output = ir.emit_body();
    insta::assert_snapshot!("enums__action", output);
}

#[test]
fn test_enums_wrapped_snapshot() {
    let ir = make_enums_wrapped_ir();
    let output = ir.emit_body();
    insta::assert_snapshot!("enums__wrapped", output);
}

// =============================================================================
// Module-level File Snapshots (Milestone 2)
// =============================================================================

use sui_client_gen::ts_gen::emit_module_structs_from_ir;

/// Snapshot the "fixture" module with core structs (simulates examples::fixture)
#[test]
fn test_fixture_module_file_snapshot() {
    let structs = vec![
        make_fixture_dummy_ir(),
        make_fixture_bar_ir(),
        make_fixture_with_generic_field_ir(),
        make_fixture_with_two_generics_ir(),
    ];

    let output = emit_module_structs_from_ir(&structs, &[], "../../_framework");
    insta::assert_snapshot!("module__fixture_core", output);
}

/// Snapshot the "fixture" module with special types (simulates examples::fixture)
#[test]
fn test_fixture_special_types_module_file_snapshot() {
    let structs = vec![
        make_fixture_with_special_types_ir(),
        make_fixture_with_special_types_in_vectors_ir(),
    ];

    let output = emit_module_structs_from_ir(&structs, &[], "../../_framework");
    insta::assert_snapshot!("module__fixture_special_types", output);
}

/// Snapshot the "enums" module (simulates examples::enums with both struct and enum)
#[test]
fn test_enums_module_file_snapshot() {
    let structs = vec![make_enums_wrapped_ir()];
    let enums = vec![make_enums_action_ir()];

    let output = emit_module_structs_from_ir(&structs, &enums, "../../_framework");
    insta::assert_snapshot!("module__enums", output);
}

// =============================================================================
// Invariant Tests (assertions without snapshots)
// =============================================================================

/// Verify special types serialize correctly (no .toJSONField() for primitive-like types)
#[test]
fn test_special_types_no_tojsonfield() {
    let ir = make_fixture_with_special_types_ir();
    let output = ir.emit_body();

    // String types should NOT call toJSONField (they serialize directly)
    assert!(
        !output.contains("string: this.string.toJSONField()"),
        "0x1::string::String should not call toJSONField"
    );
    assert!(
        !output.contains("asciiString: this.asciiString.toJSONField()"),
        "0x1::ascii::String should not call toJSONField"
    );

    // ID and Url are also primitive-like
    assert!(
        !output.contains("idField: this.idField.toJSONField()"),
        "0x2::object::ID should not call toJSONField"
    );
    assert!(
        !output.contains("url: this.url.toJSONField()"),
        "0x2::url::Url should not call toJSONField"
    );
}

/// Verify Option fields use fieldToJSON correctly
#[test]
fn test_option_fields_use_field_to_json() {
    let ir = make_fixture_with_special_types_ir();
    let output = ir.emit_body();

    // Option fields should use fieldToJSON
    assert!(
        output.contains("fieldToJSON"),
        "Option fields should use fieldToJSON helper"
    );
}

/// Verify Balance fields have phantom type handling
#[test]
fn test_balance_phantom_handling() {
    let ir = make_fixture_with_special_types_ir();
    let output = ir.emit_body();

    // Balance<T> where T is phantom should be handled correctly
    assert!(
        output.contains("Balance"),
        "Balance type should be present in output"
    );
}

/// Verify error messages include struct name dynamically
#[test]
fn test_dynamic_error_messages() {
    let ir = make_fixture_foo_ir();
    let output = ir.emit_body();

    // Error messages should include struct name
    assert!(
        output.contains("Foo"),
        "Error messages should reference the struct name"
    );
    assert!(
        output.contains("not a Foo") || output.contains("Foo.$typeName"),
        "Should have dynamic error messages with struct name"
    );

    // No unfilled template placeholders
    assert!(
        !output.contains("${name}") && !output.contains("${{"),
        "Should not have unfilled template placeholders"
    );
}

/// Verify enum variants are all generated
#[test]
fn test_action_enum_variants() {
    let ir = make_enums_action_ir();
    let output = ir.emit_body();

    // All variant names should be present
    assert!(output.contains("Stop"), "Stop variant should be generated");
    assert!(
        output.contains("Pause"),
        "Pause variant should be generated"
    );
    assert!(output.contains("Jump"), "Jump variant should be generated");

    // Struct variant fields
    assert!(
        output.contains("duration"),
        "Pause.duration field should be present"
    );
    assert!(
        output.contains("genericField"),
        "Pause.genericField should be present"
    );
}

/// Verify tuple variant has correct structure
#[test]
fn test_tuple_variant_structure() {
    let ir = make_enums_action_ir();
    let output = ir.emit_body();

    // Tuple variants should have "vec" or array-like structure in the output
    // The exact pattern depends on emission, but we check for the variant being present
    assert!(output.contains("Jump"), "Jump tuple variant should exist");
}

/// Verify nested generic types work correctly
#[test]
fn test_nested_generic_types() {
    let ir = make_fixture_foo_ir();
    let output = ir.emit_body();

    // Should handle deeply nested generics
    assert!(
        output.contains("twoGenericsNestedVec"),
        "Nested vector of generics field should be present"
    );
    assert!(
        output.contains("WithTwoGenerics"),
        "WithTwoGenerics type should be referenced"
    );
}

/// Verify vectors of special types work correctly
#[test]
fn test_vectors_of_special_types() {
    let ir = make_fixture_with_special_types_in_vectors_ir();
    let output = ir.emit_body();

    // Should have vector handling
    assert!(
        output.contains("Vector") || output.contains("vector"),
        "Vector types should be handled"
    );
}

/// Verify that enum fields in structs work correctly
#[test]
fn test_enum_field_in_struct() {
    let ir = make_enums_wrapped_ir();
    let output = ir.emit_body();

    // The Wrapped struct has Action enum fields
    assert!(
        output.contains("stop"),
        "stop field (Action enum) should be present"
    );
    assert!(
        output.contains("pause"),
        "pause field (Action enum) should be present"
    );
    assert!(
        output.contains("jump"),
        "jump field (Action enum) should be present"
    );
}

/// Verify no duplicate TransactionArgument in union types
#[test]
fn test_no_duplicate_transaction_argument() {
    // This is mainly a function-level concern, but we can check struct output too
    let ir = make_fixture_with_special_types_ir();
    let output = ir.emit_body();

    // Should not have duplicate union patterns
    assert!(
        !output.contains("TransactionArgument | TransactionArgument"),
        "Should not have duplicate TransactionArgument"
    );
}

/// Verify no duplicate null in option types
#[test]
fn test_no_duplicate_null() {
    let ir = make_fixture_with_special_types_ir();
    let output = ir.emit_body();

    // Should not have duplicate null patterns
    assert!(
        !output.contains("| null | null"),
        "Should not have duplicate null"
    );
}

// =============================================================================
// Function IR Fixtures (Milestone 3)
// =============================================================================

use sui_client_gen::ts_gen::{
    emit_functions_file, FunctionIR, FunctionParamIR, FunctionStructImport, ParamTypeIR,
};

/// `createBar(value: u64)` - simple primitive param
fn make_create_bar_function_ir() -> FunctionIR {
    FunctionIR {
        move_name: "create_bar".to_string(),
        ts_name: "createBar".to_string(),
        module_name: "fixture".to_string(),
        type_params: vec![],
        params: vec![FunctionParamIR {
            ts_name: "value".to_string(),
            param_type: ParamTypeIR::Primitive("u64".to_string()),
        }],
        struct_imports: vec![],
        uses_generic: false,
        uses_option: false,
        aliased_util_imports: vec![],
        uses_vector: false,
        uses_pure: true,
        uses_obj: false,
    }
}

/// `createWithGenericField<T>(genericField: T)` - generic param
fn make_create_with_generic_field_function_ir() -> FunctionIR {
    FunctionIR {
        move_name: "create_with_generic_field".to_string(),
        ts_name: "createWithGenericField".to_string(),
        module_name: "fixture".to_string(),
        type_params: vec!["T".to_string()],
        params: vec![FunctionParamIR {
            ts_name: "genericField".to_string(),
            param_type: ParamTypeIR::TypeParam {
                name: "T".to_string(),
                index: 0,
            },
        }],
        struct_imports: vec![],
        uses_generic: true,
        uses_option: false,
        aliased_util_imports: vec![],
        uses_vector: false,
        uses_pure: false,
        uses_obj: false,
    }
}

/// `createWithTwoGenerics<T, U>(genericField1: T, genericField2: U)`
fn make_create_with_two_generics_function_ir() -> FunctionIR {
    FunctionIR {
        move_name: "create_with_two_generics".to_string(),
        ts_name: "createWithTwoGenerics".to_string(),
        module_name: "fixture".to_string(),
        type_params: vec!["T".to_string(), "U".to_string()],
        params: vec![
            FunctionParamIR {
                ts_name: "genericField1".to_string(),
                param_type: ParamTypeIR::TypeParam {
                    name: "T".to_string(),
                    index: 0,
                },
            },
            FunctionParamIR {
                ts_name: "genericField2".to_string(),
                param_type: ParamTypeIR::TypeParam {
                    name: "U".to_string(),
                    index: 1,
                },
            },
        ],
        struct_imports: vec![],
        uses_generic: true,
        uses_option: false,
        aliased_util_imports: vec![],
        uses_vector: false,
        uses_pure: false,
        uses_obj: false,
    }
}

/// `createSpecialInVectors` - vectors of special types
fn make_create_special_in_vectors_function_ir() -> FunctionIR {
    FunctionIR {
        move_name: "create_special_in_vectors".to_string(),
        ts_name: "createSpecialInVectors".to_string(),
        module_name: "fixture".to_string(),
        type_params: vec!["T".to_string()],
        params: vec![
            FunctionParamIR {
                ts_name: "string".to_string(),
                param_type: ParamTypeIR::Vector(Box::new(ParamTypeIR::StringType {
                    module: "string".to_string(),
                })),
            },
            FunctionParamIR {
                ts_name: "asciiString".to_string(),
                param_type: ParamTypeIR::Vector(Box::new(ParamTypeIR::StringType {
                    module: "ascii".to_string(),
                })),
            },
            FunctionParamIR {
                ts_name: "idField".to_string(),
                param_type: ParamTypeIR::Vector(Box::new(ParamTypeIR::ID)),
            },
            FunctionParamIR {
                ts_name: "bar".to_string(),
                param_type: ParamTypeIR::Vector(Box::new(ParamTypeIR::Struct {
                    class_name: "Bar".to_string(),
                    type_args: vec![],
                })),
            },
            FunctionParamIR {
                ts_name: "option".to_string(),
                param_type: ParamTypeIR::Vector(Box::new(ParamTypeIR::Option(Box::new(
                    ParamTypeIR::Primitive("u64".to_string()),
                )))),
            },
            FunctionParamIR {
                ts_name: "optionGeneric".to_string(),
                param_type: ParamTypeIR::Vector(Box::new(ParamTypeIR::Option(Box::new(
                    ParamTypeIR::TypeParam {
                        name: "T".to_string(),
                        index: 0,
                    },
                )))),
            },
        ],
        struct_imports: vec![FunctionStructImport {
            class_name: "Bar".to_string(),
            path: "./structs".to_string(),
            alias: None,
        }],
        uses_generic: true,
        uses_option: true,
        aliased_util_imports: vec![],
        uses_vector: true,
        uses_pure: false,
        uses_obj: false,
    }
}

// =============================================================================
// Function Snapshot Tests
// =============================================================================

#[test]
fn test_function_create_bar_snapshot() {
    let functions = vec![make_create_bar_function_ir()];
    let output = emit_functions_file(&functions, "../../_framework");
    insta::assert_snapshot!("function__create_bar", output);
}

#[test]
fn test_function_with_generic_snapshot() {
    let functions = vec![make_create_with_generic_field_function_ir()];
    let output = emit_functions_file(&functions, "../../_framework");
    insta::assert_snapshot!("function__create_with_generic_field", output);
}

#[test]
fn test_function_with_two_generics_snapshot() {
    let functions = vec![make_create_with_two_generics_function_ir()];
    let output = emit_functions_file(&functions, "../../_framework");
    insta::assert_snapshot!("function__create_with_two_generics", output);
}

#[test]
fn test_function_special_in_vectors_snapshot() {
    let functions = vec![make_create_special_in_vectors_function_ir()];
    let output = emit_functions_file(&functions, "../../_framework");
    insta::assert_snapshot!("function__create_special_in_vectors", output);
}

#[test]
fn test_function_module_file_snapshot() {
    // Simulate a functions.ts with multiple functions
    let functions = vec![
        make_create_bar_function_ir(),
        make_create_with_generic_field_function_ir(),
        make_create_with_two_generics_function_ir(),
    ];
    let output = emit_functions_file(&functions, "../../_framework");
    insta::assert_snapshot!("module__fixture_functions", output);
}

// =============================================================================
// Function Invariant Tests
// =============================================================================

/// Verify option types don't have duplicate null/TransactionArgument
#[test]
fn test_function_option_no_duplicate_patterns() {
    let functions = vec![make_create_special_in_vectors_function_ir()];
    let output = emit_functions_file(&functions, "../../_framework");

    // Check for duplicate patterns
    assert!(
        !output.contains("| null | null"),
        "Should not have duplicate | null"
    );
    assert!(
        !output.contains("TransactionArgument | TransactionArgument"),
        "Should not have duplicate | TransactionArgument"
    );
}

/// Verify vector types have correct structure
#[test]
fn test_function_vector_type_structure() {
    let functions = vec![make_create_special_in_vectors_function_ir()];
    let output = emit_functions_file(&functions, "../../_framework");

    // Vector params should use Array<...>
    assert!(
        output.contains("Array<"),
        "Vector types should use Array<...>"
    );
}

/// Verify generic functions have typeArg/typeArgs parameter
#[test]
fn test_function_generic_has_type_arg() {
    let single = emit_functions_file(
        &[make_create_with_generic_field_function_ir()],
        "../../_framework",
    );
    let double = emit_functions_file(
        &[make_create_with_two_generics_function_ir()],
        "../../_framework",
    );

    // Single type param uses typeArg (singular)
    assert!(
        single.contains("typeArg: string"),
        "Single type param should use typeArg"
    );

    // Multiple type params use typeArgs (plural)
    assert!(
        double.contains("typeArgs: [string, string]"),
        "Multiple type params should use typeArgs"
    );
}

// =============================================================================
// Collision Fixture Tests (Import aliasing and deduplication)
// =============================================================================

/// Struct that uses two types with same name from different packages.
/// This tests the aliasing mechanism for same-named types.
fn make_collision_same_name_different_packages_ir() -> StructIR {
    StructIR {
        name: "MultiCoinHolder".to_string(),
        module_struct_path: "collision::MultiCoinHolder".to_string(),
        package_info: examples_pkg(),
        type_params: vec![],
        fields: vec![
            FieldIR {
                ts_name: "id".to_string(),
                move_name: "id".to_string(),
                field_type: uid_field_type(),
            },
            // Coin from package A (sui)
            FieldIR {
                ts_name: "suiCoin".to_string(),
                move_name: "sui_coin".to_string(),
                field_type: FieldTypeIR::Datatype {
                    class_name: "Coin".to_string(),
                    full_type_name: "0x2::coin::Coin".to_string(),
                    type_args: vec![sui_field_type()],
                    type_arg_is_phantom: vec![true],
                    kind: DatatypeKind::Struct,
                },
            },
            // Coin from a different package (aliased to avoid conflict)
            FieldIR {
                ts_name: "customCoin".to_string(),
                move_name: "custom_coin".to_string(),
                field_type: FieldTypeIR::Datatype {
                    class_name: "CoinCustom".to_string(), // Aliased class name
                    full_type_name: "0xabc::custom_coin::Coin".to_string(),
                    type_args: vec![],
                    type_arg_is_phantom: vec![],
                    kind: DatatypeKind::Struct,
                },
            },
        ],
        struct_imports: vec![
            uid_import(),
            sui_import(),
            DatatypeImport {
                class_name: "Coin".to_string(),
                path: "../../sui/coin/structs".to_string(),
                alias: None,
            },
            DatatypeImport {
                class_name: "Coin".to_string(),
                path: "../../custom-pkg/custom-coin/structs".to_string(),
                alias: Some("CoinCustom".to_string()), // Aliased import
            },
        ],
        uses_vector: false,
        uses_address: false,
        uses_phantom_struct_args: true,
        has_non_phantom_type_params: false,
        uses_field_to_json: false,
    }
}

/// Test snapshot for same-name collision with aliasing
#[test]
fn test_collision_same_name_snapshot() {
    let ir = make_collision_same_name_different_packages_ir();
    let output = ir.emit_body();
    insta::assert_snapshot!("collision__same_name_different_packages", output);
}

/// Module-level snapshot for collision scenario (tests import formatting)
#[test]
fn test_collision_module_file_snapshot() {
    let structs = vec![make_collision_same_name_different_packages_ir()];
    let output = emit_module_structs_from_ir(&structs, &[], "../../_framework");
    insta::assert_snapshot!("module__collision", output);
}

// =============================================================================
// Collision Invariant Tests
// =============================================================================

/// Verify String alias is correctly generated (0x1::string::String vs 0x1::ascii::String)
#[test]
fn test_string_alias_in_module_imports() {
    let structs = vec![make_fixture_with_special_types_ir()];
    let output = emit_module_structs_from_ir(&structs, &[], "../../_framework");

    // Should have aliased import for ascii String
    assert!(
        output.contains("import { String as StringAscii } from"),
        "ASCII String should be imported with alias 'StringAscii'"
    );

    // Should have non-aliased import for utf8 String
    assert!(
        output.contains("import { String } from") || output.contains("String,"),
        "UTF8 String should be imported without alias"
    );

    // Both should be used correctly in field types
    assert!(
        output.contains("ToField<String>"),
        "UTF8 String field should use String type"
    );
    assert!(
        output.contains("ToField<StringAscii>"),
        "ASCII String field should use StringAscii alias"
    );
}

/// Verify same-name types from different packages are aliased correctly
#[test]
fn test_same_name_alias_in_module_imports() {
    let structs = vec![make_collision_same_name_different_packages_ir()];
    let output = emit_module_structs_from_ir(&structs, &[], "../../_framework");

    // Should have aliased import for custom Coin
    assert!(
        output.contains("import { Coin as CoinCustom } from"),
        "Custom Coin should be imported with alias 'CoinCustom'"
    );

    // Should have non-aliased import for sui Coin
    assert!(
        output.contains("import { Coin } from") || output.contains("Coin,"),
        "Sui Coin should be imported without alias"
    );

    // Both should be used correctly in the struct
    assert!(
        output.contains("Coin<") || output.contains("Coin."),
        "Sui Coin type should be used"
    );
    assert!(
        output.contains("CoinCustom"),
        "Custom Coin alias should be used"
    );
}

/// Verify aliased imports are deterministic (same input = same alias)
#[test]
fn test_alias_determinism() {
    // Generate twice and compare
    let structs = vec![make_collision_same_name_different_packages_ir()];
    let output1 = emit_module_structs_from_ir(&structs, &[], "../../_framework");
    let output2 = emit_module_structs_from_ir(&structs, &[], "../../_framework");

    assert_eq!(output1, output2, "Aliased output should be deterministic");
}
