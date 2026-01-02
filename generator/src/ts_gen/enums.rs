//! Enum IR for TypeScript code generation.
//!
//! Move enums generate multiple TypeScript constructs:
//! - Parent factory class (e.g., `Action`)
//! - Variant classes (e.g., `ActionStop`, `ActionPause`, `ActionJump`)
//! - Type aliases and guards

use indoc::formatdoc;

use super::structs::{
    is_balance_type, is_option_type, is_primitive_like_type, FieldIR, PackageInfo, TypeParamIR,
};

/// Represents a Move enum for TypeScript code generation.
#[derive(Debug, Clone)]
pub struct EnumIR {
    /// Enum name (e.g., "Action")
    pub name: String,
    /// Module and enum path (e.g., "enums::Action")
    pub module_enum_path: String,
    /// Package address info for generating the full type name
    pub package_info: PackageInfo,
    /// Type parameters with phantom status
    pub type_params: Vec<TypeParamIR>,
    /// Enum variants
    pub variants: Vec<EnumVariantIR>,
    /// Whether any variant uses Vector type
    pub uses_vector: bool,
    /// Whether any variant uses address type
    pub uses_address: bool,
    /// Whether any variant has phantom struct type args
    pub uses_phantom_struct_args: bool,
}

/// Represents a single enum variant.
#[derive(Debug, Clone)]
pub struct EnumVariantIR {
    /// Variant name (e.g., "Stop", "Pause", "Jump")
    pub name: String,
    /// Fields in this variant (empty for unit variants)
    pub fields: Vec<FieldIR>,
    /// Whether this is a tuple variant (positional fields) vs struct variant (named fields)
    pub is_tuple: bool,
}

impl EnumVariantIR {
    /// Check if this is a unit variant (no fields)
    pub fn is_unit(&self) -> bool {
        self.fields.is_empty()
    }
}

// ============================================================================
// Emission - Template-based code generation
// ============================================================================

impl EnumIR {
    /// Emit the complete TypeScript code for this enum.
    pub fn emit_body(&self) -> String {
        let mut sections = Vec::new();

        // Separator
        sections.push(format!(
            "/* ============================== {} =============================== */",
            self.name
        ));

        // Type guard function
        sections.push(self.emit_type_guard());

        // Union type for all variants
        sections.push(self.emit_variant_union());

        // Variant name type
        sections.push(self.emit_variant_name_type());

        // Variant name guard
        sections.push(self.emit_variant_name_guard());

        // Fields union type
        sections.push(self.emit_fields_union());

        // Reified type alias
        sections.push(self.emit_reified_type());

        // Parent factory class
        sections.push(self.emit_factory_class());

        // Variant classes
        for variant in &self.variants {
            sections.push(self.emit_variant_class(variant));
        }

        sections.join("\n\n")
    }

    fn full_type_name_template(&self) -> String {
        match &self.package_info {
            PackageInfo::System { address } => {
                format!("{}::{}", address, self.module_enum_path)
            }
            PackageInfo::Versioned { version } => {
                format!("${{PKG_V{}}}::{}", version, self.module_enum_path)
            }
        }
    }

    fn emit_type_guard(&self) -> String {
        let full_type_template = self.full_type_name_template();

        if self.type_params.is_empty() {
            formatdoc! {r#"
                export function is{name}(type: string): boolean {{
                  type = compressSuiType(type)
                  return type === `{full_name}`
                }}"#,
                name = self.name,
                full_name = full_type_template,
            }
        } else {
            formatdoc! {r#"
                export function is{name}(type: string): boolean {{
                  type = compressSuiType(type)
                  return type.startsWith(`{full_name}` + '<')
                }}"#,
                name = self.name,
                full_name = full_type_template,
            }
        }
    }

    fn emit_variant_union(&self) -> String {
        let name = &self.name;
        let type_params = self.emit_type_params_def();
        let type_params_use = self.emit_type_params_use();
        let variants: Vec<String> = self
            .variants
            .iter()
            .map(|v| {
                if type_params_use.is_empty() {
                    format!("  | {}{}", name, v.name)
                } else {
                    format!("  | {}{}<{}>", name, v.name, type_params_use)
                }
            })
            .collect();

        formatdoc! {r#"
            export type {name}Variant{type_params} =
            {variants}"#,
            name = name,
            type_params = type_params,
            variants = variants.join("\n"),
        }
    }

    fn emit_variant_name_type(&self) -> String {
        let variant_names: Vec<String> = self
            .variants
            .iter()
            .map(|v| format!("'{}'", v.name))
            .collect();

        format!(
            "export type {}VariantName = {}",
            self.name,
            variant_names.join(" | ")
        )
    }

    fn emit_variant_name_guard(&self) -> String {
        let checks: Vec<String> = self
            .variants
            .iter()
            .map(|v| format!("variant === '{}'", v.name))
            .collect();

        formatdoc! {r#"
            export function is{name}VariantName(variant: string): variant is {name}VariantName {{
              return {checks}
            }}"#,
            name = self.name,
            checks = checks.join(" || "),
        }
    }

    fn emit_fields_union(&self) -> String {
        let name = &self.name;
        let type_params = self.emit_type_params_def();
        let type_params_use = self.emit_type_params_use();
        let has_type_params = !self.type_params.is_empty();
        let variants: Vec<String> = self
            .variants
            .iter()
            .map(|v| {
                // Only add type params if the enum has them AND the variant has fields
                if v.fields.is_empty() || !has_type_params {
                    format!("  | {}{}Fields", name, v.name)
                } else {
                    format!("  | {}{}Fields<{}>", name, v.name, type_params_use)
                }
            })
            .collect();

        formatdoc! {r#"
            export type {name}Fields{type_params} =
            {variants}"#,
            name = name,
            type_params = type_params,
            variants = variants.join("\n"),
        }
    }

    fn emit_reified_type(&self) -> String {
        let name = &self.name;
        let type_params = self.emit_type_params_def();
        let type_args_use = self.emit_type_params_use();

        let (variant_type, fields_type) = if type_args_use.is_empty() {
            (format!("{}Variant", name), format!("{}Fields", name))
        } else {
            (
                format!("{}Variant<{}>", name, type_args_use),
                format!("{}Fields<{}>", name, type_args_use),
            )
        };

        formatdoc! {r#"
            export type {name}Reified{type_params} = Reified<
              {variant_type},
              {fields_type}
            >"#,
            name = name,
            type_params = type_params,
            variant_type = variant_type,
            fields_type = fields_type,
        }
    }

    fn emit_factory_class(&self) -> String {
        let name = &self.name;
        let full_type_template = self.full_type_name_template();
        let num_type_params = self.type_params.len();
        let is_phantom_array = self.emit_is_phantom_array();

        if self.type_params.is_empty() {
            self.emit_factory_class_no_type_params()
        } else {
            let reified_type_params = self.emit_reified_type_params();
            let reified_args_list = self.emit_reified_args_list();
            let reified_arg_names = self.emit_reified_arg_names();
            let to_type_args = self.emit_to_type_args();
            let extract_types = self.emit_extract_types();
            let full_type_as_type = self.emit_full_type_as_type();
            let type_args_as_type = self.emit_type_args_as_type();
            let bcs_section = self.emit_bcs_section();
            let reified_bcs_init = self.emit_reified_bcs_init();
            let new_switch_cases = self.emit_new_switch_cases();
            let from_fields_switch = self.emit_from_fields_switch();
            let from_fields_with_types_switch = self.emit_from_fields_with_types_switch();
            let from_json_field_switch = self.emit_from_json_field_switch();
            let has_non_phantom = self.type_params.iter().any(|p| !p.is_phantom);
            let bcs_parse_call = if has_non_phantom {
                let to_bcs_indexed = self.emit_to_bcs_indexed();
                format!("{}.bcs({}).parse(data)", name, to_bcs_indexed)
            } else {
                format!("{}.bcs.parse(data)", name)
            };

            formatdoc! {r#"
                export class {name} {{
                  static readonly $typeName = `{full_type_template}`
                  static readonly $numTypeParams = {num_type_params}
                  static readonly $isPhantom = {is_phantom_array} as const

                  static reified{reified_type_params}(
                    {reified_args_list}
                  ): {name}Reified{to_type_args} {{
                    const reifiedBcs = {reified_bcs_init}
                    return {{
                      typeName: {name}.$typeName,
                      fullTypeName: composeSuiType(
                        {name}.$typeName,
                        ...[{extract_types}]
                      ) as {full_type_as_type},
                      typeArgs: [{extract_types}] as {type_args_as_type},
                      isPhantom: {name}.$isPhantom,
                      reifiedTypeArgs: [{reified_arg_names}],
                      fromFields: (fields: Record<string, any>) => {name}.fromFields([{reified_arg_names}], fields),
                      fromFieldsWithTypes: (item: FieldsWithTypes) => {name}.fromFieldsWithTypes([{reified_arg_names}], item),
                      fromBcs: (data: Uint8Array) => {name}.fromBcs([{reified_arg_names}], data),
                      bcs: reifiedBcs,
                      fromJSONField: (field: any) => {name}.fromJSONField([{reified_arg_names}], field),
                      fromJSON: (json: Record<string, any>) => {name}.fromJSON([{reified_arg_names}], json),
                      new: (
                        variant: {name}VariantName,
                        fields: {name}Fields{to_type_args}
                      ) => {{
                        switch (variant) {{
                {new_switch_cases}
                        }}
                      }},
                      kind: 'EnumClassReified',
                    }} as {name}Reified{to_type_args}
                  }}

                  static get r() {{
                    return {name}.reified
                  }}

                  static phantom{reified_type_params}(
                    {reified_args_list}
                  ): PhantomReified<ToTypeStr<{name}Variant{to_type_args}>> {{
                    return phantom({name}.reified({reified_arg_names}))
                  }}

                  static get p() {{
                    return {name}.phantom
                  }}

                {bcs_section}

                  static fromFields{reified_type_params}(
                    {type_arg_param}: {type_arg_type},
                    fields: Record<string, any>
                  ): {name}Variant{to_type_args} {{
                    const r = {name}.reified({type_args_indexed})

                    if (!fields.$kind || !is{name}VariantName(fields.$kind)) {{
                      throw new Error(`Invalid {name_lower} variant: ${{fields.$kind}}`)
                    }}
                    switch (fields.$kind) {{
                {from_fields_switch}
                    }}
                  }}

                  static fromFieldsWithTypes{reified_type_params}(
                    {type_arg_param}: {type_arg_type},
                    item: FieldsWithTypes
                  ): {name}Variant{to_type_args} {{
                    if (!is{name}(item.type)) {{
                      throw new Error('not a {name} type')
                    }}
                    assertFieldsWithTypesArgsMatch(item, {type_arg_param})

                    const variant = (item as FieldsWithTypes & {{ variant: {name}VariantName }}).variant
                    if (!variant || !is{name}VariantName(variant)) {{
                      throw new Error(`Invalid {name_lower} variant: ${{variant}}`)
                    }}

                    const r = {name}.reified({type_args_indexed})
                    switch (variant) {{
                {from_fields_with_types_switch}
                    }}
                  }}

                  static fromBcs{reified_type_params}(
                    {type_arg_param}: {type_arg_type},
                    data: Uint8Array
                  ): {name}Variant{to_type_args} {{
                    const parsed = {bcs_parse_call}
                    return {name}.fromFields({type_arg_param}, parsed)
                  }}

                  static fromJSONField{reified_type_params}(
                    {type_arg_param}: {type_arg_type},
                    field: any
                  ): {name}Variant{to_type_args} {{
                    const r = {name}.reified({type_args_indexed})

                    const kind = field.$kind
                    if (!kind || !is{name}VariantName(kind)) {{
                      throw new Error(`Invalid {name_lower} variant: ${{kind}}`)
                    }}
                    switch (kind) {{
                {from_json_field_switch}
                    }}
                  }}

                  static fromJSON{reified_type_params}(
                    {type_arg_param}: {type_arg_type},
                    json: Record<string, any>
                  ): {name}Variant{to_type_args} {{
                    if (json.$typeName !== {name}.$typeName) {{
                      throw new Error(`not a {name} json object: expected '${{{name}.$typeName}}' but got '${{json.$typeName}}'`)
                    }}
                    assertReifiedTypeArgsMatch(
                      composeSuiType({name}.$typeName, ...{type_arg_map_extract}),
                      json.$typeArgs,
                      {type_arg_param}
                    )

                    return {name}.fromJSONField({type_arg_param}, json)
                  }}
                }}"#,
                name = name,
                name_lower = name.to_lowercase(),
                full_type_template = full_type_template,
                num_type_params = num_type_params,
                is_phantom_array = is_phantom_array,
                reified_type_params = reified_type_params,
                reified_args_list = reified_args_list,
                reified_arg_names = reified_arg_names,
                to_type_args = to_type_args,
                extract_types = extract_types,
                full_type_as_type = full_type_as_type,
                type_args_as_type = type_args_as_type,
                bcs_section = bcs_section,
                reified_bcs_init = reified_bcs_init,
                new_switch_cases = new_switch_cases,
                from_fields_switch = from_fields_switch,
                from_fields_with_types_switch = from_fields_with_types_switch,
                from_json_field_switch = from_json_field_switch,
                type_args_indexed = self.emit_type_args_indexed(),
                bcs_parse_call = bcs_parse_call,
                type_arg_param = self.emit_type_arg_param(),
                type_arg_type = self.emit_type_arg_type(),
                type_arg_map_extract = self.emit_type_arg_map_extract(),
            }
        }
    }

    fn emit_factory_class_no_type_params(&self) -> String {
        let name = &self.name;
        let full_type_template = self.full_type_name_template();
        let bcs_section = self.emit_bcs_section_no_type_params();
        let new_switch_cases = self.emit_new_switch_cases_no_type_params();
        let from_fields_switch = self.emit_from_fields_switch_no_type_params();
        let from_fields_with_types_switch =
            self.emit_from_fields_with_types_switch_no_type_params();
        let from_json_field_switch = self.emit_from_json_field_switch_no_type_params();

        formatdoc! {r#"
            export class {name} {{
              static readonly $typeName = `{full_type_template}`
              static readonly $numTypeParams = 0
              static readonly $isPhantom = [] as const

              static reified(): {name}Reified {{
                const reifiedBcs = {name}.bcs
                return {{
                  typeName: {name}.$typeName,
                  fullTypeName: composeSuiType({name}.$typeName) as `{full_type_template}`,
                  typeArgs: [] as [],
                  isPhantom: {name}.$isPhantom,
                  reifiedTypeArgs: [],
                  fromFields: (fields: Record<string, any>) => {name}.fromFields([], fields),
                  fromFieldsWithTypes: (item: FieldsWithTypes) => {name}.fromFieldsWithTypes([], item),
                  fromBcs: (data: Uint8Array) => {name}.fromBcs([], data),
                  bcs: reifiedBcs,
                  fromJSONField: (field: any) => {name}.fromJSONField([], field),
                  fromJSON: (json: Record<string, any>) => {name}.fromJSON([], json),
                  new: (variant: {name}VariantName, fields: {name}Fields) => {{
                    switch (variant) {{
            {new_switch_cases}
                    }}
                  }},
                  kind: 'EnumClassReified',
                }} as {name}Reified
              }}

              static get r() {{
                return {name}.reified
              }}

              static phantom(): PhantomReified<ToTypeStr<{name}Variant>> {{
                return phantom({name}.reified())
              }}

              static get p() {{
                return {name}.phantom
              }}

            {bcs_section}

              static fromFields(typeArgs: [], fields: Record<string, any>): {name}Variant {{
                const r = {name}.reified()

                if (!fields.$kind || !is{name}VariantName(fields.$kind)) {{
                  throw new Error(`Invalid {name_lower} variant: ${{fields.$kind}}`)
                }}
                switch (fields.$kind) {{
            {from_fields_switch}
                }}
              }}

              static fromFieldsWithTypes(typeArgs: [], item: FieldsWithTypes): {name}Variant {{
                if (!is{name}(item.type)) {{
                  throw new Error('not a {name} type')
                }}

                const variant = (item as FieldsWithTypes & {{ variant: {name}VariantName }}).variant
                if (!variant || !is{name}VariantName(variant)) {{
                  throw new Error(`Invalid {name_lower} variant: ${{variant}}`)
                }}

                const r = {name}.reified()
                switch (variant) {{
            {from_fields_with_types_switch}
                }}
              }}

              static fromBcs(typeArgs: [], data: Uint8Array): {name}Variant {{
                const parsed = {name}.bcs.parse(data)
                return {name}.fromFields([], parsed)
              }}

              static fromJSONField(typeArgs: [], field: any): {name}Variant {{
                const r = {name}.reified()

                const kind = field.$kind
                if (!kind || !is{name}VariantName(kind)) {{
                  throw new Error(`Invalid {name_lower} variant: ${{kind}}`)
                }}
                switch (kind) {{
            {from_json_field_switch}
                }}
              }}

              static fromJSON(typeArgs: [], json: Record<string, any>): {name}Variant {{
                if (json.$typeName !== {name}.$typeName) {{
                  throw new Error(`not a {name} json object: expected '${{{name}.$typeName}}' but got '${{json.$typeName}}'`)
                }}

                return {name}.fromJSONField(typeArgs, json)
              }}
            }}"#,
            name = name,
            name_lower = name.to_lowercase(),
            full_type_template = full_type_template,
            bcs_section = bcs_section,
            new_switch_cases = new_switch_cases,
            from_fields_switch = from_fields_switch,
            from_fields_with_types_switch = from_fields_with_types_switch,
            from_json_field_switch = from_json_field_switch,
        }
    }

    fn emit_variant_class(&self, variant: &EnumVariantIR) -> String {
        let enum_name = &self.name;
        let variant_name = &variant.name;
        let class_name = format!("{}{}", enum_name, variant_name);
        let type_params_def = self.emit_type_params_def();
        let type_params_use = self.emit_type_params_use();

        let type_args_string = self.emit_type_args_string();
        let variant_full_type_name = self.emit_variant_full_type_name();

        if variant.is_unit() {
            // Unit variant - no fields
            formatdoc! {r#"
                export type {class_name}Fields = Record<string, never>

                export class {class_name}{type_params_def}
                  implements EnumVariantClass
                {{
                  __EnumVariantClass = true as const

                  static readonly $typeName = {enum_name}.$typeName
                  static readonly $numTypeParams = {enum_name}.$numTypeParams
                  static readonly $isPhantom = {enum_name}.$isPhantom
                  static readonly $variantName = '{variant_name}'

                  readonly $typeName = {class_name}.$typeName
                  readonly $fullTypeName: `${{typeof {enum_name}.$typeName}}{variant_full_type_name}`
                  readonly $typeArgs: [{type_args_string}]
                  readonly $isPhantom = {enum_name}.$isPhantom
                  readonly $variantName = {class_name}.$variantName

                  constructor(typeArgs: [{type_args_string}], fields: {class_name}Fields) {{
                    this.$fullTypeName = composeSuiType(
                      {enum_name}.$typeName,
                      ...typeArgs
                    ) as `${{typeof {enum_name}.$typeName}}{variant_full_type_name}`
                    this.$typeArgs = typeArgs
                  }}

                  toJSONField() {{
                    return {{ $kind: this.$variantName }}
                  }}

                  toJSON() {{
                    return {{
                      $typeName: this.$typeName,
                      $typeArgs: this.$typeArgs,
                      $variantName: this.$variantName,
                      ...this.toJSONField(),
                    }}
                  }}
                }}"#,
                class_name = class_name,
                enum_name = enum_name,
                variant_name = variant_name,
                type_params_def = type_params_def,
                type_args_string = type_args_string,
                variant_full_type_name = variant_full_type_name,
            }
        } else {
            // Variant with fields
            let fields_interface = self.emit_variant_fields_interface(variant);
            let field_declarations = self.emit_variant_field_declarations(variant);
            let field_assignments = self.emit_variant_field_assignments(variant);
            let to_json_fields = self.emit_variant_to_json_fields(variant);
            let fields_type = if type_params_use.is_empty() {
                format!("{}Fields", class_name)
            } else {
                format!("{}Fields<{}>", class_name, type_params_use)
            };

            formatdoc! {r#"
                {fields_interface}

                export class {class_name}{type_params_def}
                  implements EnumVariantClass
                {{
                  __EnumVariantClass = true as const

                  static readonly $typeName = {enum_name}.$typeName
                  static readonly $numTypeParams = {enum_name}.$numTypeParams
                  static readonly $isPhantom = {enum_name}.$isPhantom
                  static readonly $variantName = '{variant_name}'

                  readonly $typeName = {class_name}.$typeName
                  readonly $fullTypeName: `${{typeof {enum_name}.$typeName}}{variant_full_type_name}`
                  readonly $typeArgs: [{type_args_string}]
                  readonly $isPhantom = {enum_name}.$isPhantom
                  readonly $variantName = {class_name}.$variantName

                {field_declarations}

                  constructor(typeArgs: [{type_args_string}], fields: {fields_type}) {{
                    this.$fullTypeName = composeSuiType(
                      {enum_name}.$typeName,
                      ...typeArgs
                    ) as `${{typeof {enum_name}.$typeName}}{variant_full_type_name}`
                    this.$typeArgs = typeArgs

                {field_assignments}
                  }}

                  toJSONField() {{
                    return {{
                      $kind: this.$variantName,
                {to_json_fields}
                    }}
                  }}

                  toJSON() {{
                    return {{
                      $typeName: this.$typeName,
                      $typeArgs: this.$typeArgs,
                      $variantName: this.$variantName,
                      ...this.toJSONField(),
                    }}
                  }}
                }}"#,
                fields_interface = fields_interface,
                class_name = class_name,
                enum_name = enum_name,
                variant_name = variant_name,
                type_params_def = type_params_def,
                type_args_string = type_args_string,
                variant_full_type_name = variant_full_type_name,
                field_declarations = field_declarations,
                field_assignments = field_assignments,
                to_json_fields = to_json_fields,
                fields_type = fields_type,
            }
        }
    }

    fn emit_variant_fields_interface(&self, variant: &EnumVariantIR) -> String {
        let class_name = format!("{}{}", self.name, variant.name);
        let type_params_def = self.emit_type_params_def();

        if variant.is_tuple {
            // Tuple variants use array type
            let fields: Vec<String> = variant
                .fields
                .iter()
                .map(|f| format!("ToField<{}>", f.field_type.to_ts_type()))
                .collect();

            formatdoc! {r#"
                export type {class_name}Fields{type_params_def} = [
                {fields},
                ]"#,
                class_name = class_name,
                type_params_def = type_params_def,
                fields = fields.join(",\n"),
            }
        } else {
            // Struct variants use interface
            let fields: Vec<String> = variant
                .fields
                .iter()
                .map(|f| format!("  {}: ToField<{}>", f.ts_name, f.field_type.to_ts_type()))
                .collect();

            formatdoc! {r#"
                export interface {class_name}Fields{type_params_def} {{
                {fields}
                }}"#,
                class_name = class_name,
                type_params_def = type_params_def,
                fields = fields.join("\n"),
            }
        }
    }

    fn emit_variant_field_declarations(&self, variant: &EnumVariantIR) -> String {
        if variant.is_tuple {
            // Tuple variants use numeric indices
            return variant
                .fields
                .iter()
                .enumerate()
                .map(|(i, f)| format!("  readonly {}: ToField<{}>", i, f.field_type.to_ts_type()))
                .collect::<Vec<_>>()
                .join("\n");
        }
        // Struct variants use named properties
        variant
            .fields
            .iter()
            .map(|f| {
                format!(
                    "  readonly {}: ToField<{}>",
                    f.ts_name,
                    f.field_type.to_ts_type()
                )
            })
            .collect::<Vec<_>>()
            .join("\n")
    }

    fn emit_variant_field_assignments(&self, variant: &EnumVariantIR) -> String {
        if variant.is_tuple {
            return variant
                .fields
                .iter()
                .enumerate()
                .map(|(i, _)| format!("    this[{}] = fields[{}]", i, i))
                .collect::<Vec<_>>()
                .join("\n");
        }
        variant
            .fields
            .iter()
            .map(|f| format!("    this.{} = fields.{}", f.ts_name, f.ts_name))
            .collect::<Vec<_>>()
            .join("\n")
    }

    fn emit_variant_to_json_fields(&self, variant: &EnumVariantIR) -> String {
        if variant.is_tuple {
            // Tuple variants use a `vec` array in toJSONField
            let fields: Vec<String> = variant
                .fields
                .iter()
                .enumerate()
                .map(|(i, f)| self.emit_json_field_for_tuple(&f.field_type, i))
                .collect();
            return format!("      vec: [\n{}\n      ],", fields.join("\n"));
        }
        // Struct variants use named properties with fieldToJSON for all fields
        variant
            .fields
            .iter()
            .map(|f| self.emit_json_field_for_struct(&f.field_type, &f.ts_name))
            .collect::<Vec<_>>()
            .join("\n")
    }

    /// Generate a fieldToJSON call for a struct variant field (named property)
    fn emit_json_field_for_struct(
        &self,
        field_type: &super::structs::FieldTypeIR,
        name: &str,
    ) -> String {
        use super::structs::FieldTypeIR;

        match field_type {
            FieldTypeIR::Primitive(p) => {
                format!(
                    "      {}: fieldToJSON<'{}'>(`{}`, this.{}),",
                    name, p, p, name
                )
            }
            FieldTypeIR::Vector(inner) => {
                let inner_ts = inner.to_ts_type();
                let bcs_name = field_type.to_json_bcs_name();
                format!(
                    "      {}: fieldToJSON<Vector<{}>>(`{}`, this.{}),",
                    name, inner_ts, bcs_name, name
                )
            }
            FieldTypeIR::Datatype { .. } => {
                let ts_type = field_type.to_ts_type();
                let bcs_name = field_type.to_json_bcs_name();
                format!(
                    "      {}: fieldToJSON<{}>(`{}`, this.{}),",
                    name, ts_type, bcs_name, name
                )
            }
            FieldTypeIR::TypeParam {
                name: type_name, ..
            } => {
                // Generic type parameter - use this.$typeArgs[n]
                let type_param_idx = self
                    .type_params
                    .iter()
                    .position(|p| &p.name == type_name)
                    .unwrap_or(0);
                format!(
                    "      {}: fieldToJSON<{}>(`${{this.$typeArgs[{}]}}`, this.{}),",
                    name, type_name, type_param_idx, name
                )
            }
        }
    }

    /// Generate a fieldToJSON call for a tuple field (array element)
    fn emit_json_field_for_tuple(
        &self,
        field_type: &super::structs::FieldTypeIR,
        index: usize,
    ) -> String {
        use super::structs::FieldTypeIR;

        match field_type {
            FieldTypeIR::Primitive(p) => match p.as_str() {
                "u64" | "u128" | "u256" => {
                    format!("        fieldToJSON<'{}'>(`{}`, this[{}]),", p, p, index)
                }
                "address" => format!("        this[{}],", index),
                "bool" | "u8" | "u16" | "u32" => {
                    format!("        fieldToJSON<'{}'>(`{}`, this[{}]),", p, p, index)
                }
                _ => format!("        fieldToJSON<'{}'>(`{}`, this[{}]),", p, p, index),
            },
            FieldTypeIR::Vector(inner) => {
                let inner_ts = inner.to_ts_type();
                let bcs_name = field_type.to_json_bcs_name();
                format!(
                    "        fieldToJSON<Vector<{}>>(`{}`, this[{}]),",
                    inner_ts, bcs_name, index
                )
            }
            FieldTypeIR::Datatype {
                full_type_name,
                type_args,
                ..
            } => {
                // Check if this is a primitive-like type based on full type path
                if is_primitive_like_type(full_type_name) {
                    format!("        this[{}],", index)
                } else if is_option_type(full_type_name) || is_balance_type(full_type_name) {
                    let ts_type = field_type.to_ts_type();
                    let bcs_name = field_type.to_json_bcs_name();
                    format!(
                        "        fieldToJSON<{}>(`{}`, this[{}]),",
                        ts_type, bcs_name, index
                    )
                } else if type_args.is_empty() {
                    format!("        this[{}].toJSONField(),", index)
                } else {
                    // Generic struct - use fieldToJSON
                    let ts_type = field_type.to_ts_type();
                    let bcs_name = field_type.to_json_bcs_name();
                    format!(
                        "        fieldToJSON<{}>(`{}`, this[{}]),",
                        ts_type, bcs_name, index
                    )
                }
            }
            FieldTypeIR::TypeParam { name, .. } => {
                // Generic type parameter - use this.$typeArgs[n]
                let type_param_idx = self
                    .type_params
                    .iter()
                    .position(|p| &p.name == name)
                    .unwrap_or(0);
                format!(
                    "        fieldToJSON<{}>(`${{this.$typeArgs[{}]}}`, this[{}]),",
                    name, type_param_idx, index
                )
            }
        }
    }

    // Helper methods for type parameters
    fn emit_type_params_def(&self) -> String {
        if self.type_params.is_empty() {
            String::new()
        } else {
            let params: Vec<String> = self
                .type_params
                .iter()
                .map(|p| {
                    if p.is_phantom {
                        format!("{} extends PhantomTypeArgument", p.name)
                    } else {
                        format!("{} extends TypeArgument", p.name)
                    }
                })
                .collect();
            format!("<{}>", params.join(", "))
        }
    }

    fn emit_type_params_use(&self) -> String {
        if self.type_params.is_empty() {
            String::new()
        } else {
            self.type_params
                .iter()
                .map(|p| p.name.clone())
                .collect::<Vec<_>>()
                .join(", ")
        }
    }

    /// Emit type args for typeArgs property (converts to string types)
    fn emit_type_args_string(&self) -> String {
        if self.type_params.is_empty() {
            String::new()
        } else {
            self.type_params
                .iter()
                .map(|p| {
                    if p.is_phantom {
                        format!("PhantomToTypeStr<{}>", p.name)
                    } else {
                        format!("ToTypeStr<{}>", p.name)
                    }
                })
                .collect::<Vec<_>>()
                .join(", ")
        }
    }

    /// Emit full type name with string type args for variant class $fullTypeName
    fn emit_variant_full_type_name(&self) -> String {
        let type_strs: Vec<String> = self
            .type_params
            .iter()
            .map(|p| {
                if p.is_phantom {
                    format!("${{PhantomToTypeStr<{}>}}", p.name)
                } else {
                    format!("${{ToTypeStr<{}>}}", p.name)
                }
            })
            .collect();
        if type_strs.is_empty() {
            String::new()
        } else {
            format!("<{}>", type_strs.join(", "))
        }
    }

    fn emit_is_phantom_array(&self) -> String {
        let values: Vec<&str> = self
            .type_params
            .iter()
            .map(|p| if p.is_phantom { "true" } else { "false" })
            .collect();
        format!("[{}]", values.join(", "))
    }

    // ========================================================================
    // Factory class helpers with type params
    // ========================================================================

    fn emit_reified_type_params(&self) -> String {
        let params: Vec<String> = self
            .type_params
            .iter()
            .map(|p| {
                if p.is_phantom {
                    format!("{} extends PhantomReified<PhantomTypeArgument>", p.name)
                } else {
                    format!("{} extends Reified<TypeArgument, any>", p.name)
                }
            })
            .collect();
        format!("<{}>", params.join(", "))
    }

    fn emit_reified_args_list(&self) -> String {
        self.type_params
            .iter()
            .map(|p| format!("{}: {}", p.name, p.name))
            .collect::<Vec<_>>()
            .join(", ")
    }

    fn emit_reified_arg_names(&self) -> String {
        self.type_params
            .iter()
            .map(|p| p.name.clone())
            .collect::<Vec<_>>()
            .join(", ")
    }

    fn emit_to_type_args(&self) -> String {
        let types: Vec<String> = self
            .type_params
            .iter()
            .map(|p| {
                if p.is_phantom {
                    format!("ToPhantomTypeArgument<{}>", p.name)
                } else {
                    format!("ToTypeArgument<{}>", p.name)
                }
            })
            .collect();
        format!("<{}>", types.join(", "))
    }

    fn emit_extract_types(&self) -> String {
        self.type_params
            .iter()
            .map(|p| format!("extractType({})", p.name))
            .collect::<Vec<_>>()
            .join(", ")
    }

    fn emit_full_type_as_type(&self) -> String {
        // For type context, need to use "typeof PKG_V" instead of just "PKG_V"
        let base_type = match &self.package_info {
            PackageInfo::System { address } => {
                format!("`{}::{}", address, self.module_enum_path)
            }
            PackageInfo::Versioned { version } => {
                format!("`${{typeof PKG_V{}}}::{}", version, self.module_enum_path)
            }
        };

        let type_strs: Vec<String> = self
            .type_params
            .iter()
            .map(|p| {
                if p.is_phantom {
                    format!("${{PhantomToTypeStr<ToPhantomTypeArgument<{}>>}}", p.name)
                } else {
                    format!("${{ToTypeStr<ToTypeArgument<{}>>}}", p.name)
                }
            })
            .collect();
        format!("{}<{}>`", base_type, type_strs.join(", "))
    }

    fn emit_type_args_as_type(&self) -> String {
        let types: Vec<String> = self
            .type_params
            .iter()
            .map(|p| {
                if p.is_phantom {
                    format!("PhantomToTypeStr<ToPhantomTypeArgument<{}>>", p.name)
                } else {
                    format!("ToTypeStr<ToTypeArgument<{}>>", p.name)
                }
            })
            .collect();
        format!("[{}]", types.join(", "))
    }

    #[allow(dead_code)]
    fn emit_type_args_for_call(&self) -> String {
        if self.type_params.len() == 1 {
            "typeArg".to_string()
        } else {
            "typeArgs".to_string()
        }
    }

    /// Parameter name for static methods - enums always use typeArgs array
    fn emit_type_arg_param(&self) -> String {
        "typeArgs".to_string()
    }

    /// Type annotation for the parameter - always array for enums [T] or [T, U]
    fn emit_type_arg_type(&self) -> String {
        format!(
            "[{}]",
            self.type_params
                .iter()
                .map(|p| p.name.clone())
                .collect::<Vec<_>>()
                .join(", ")
        )
    }

    /// Map extract call for assertReifiedTypeArgsMatch
    fn emit_type_arg_map_extract(&self) -> String {
        "typeArgs.map(extractType)".to_string()
    }

    /// Emit indexed access to typeArgs for use in reified() calls in static methods
    /// Enums always use typeArgs[n] even for single type param
    fn emit_type_args_indexed(&self) -> String {
        self.type_params
            .iter()
            .enumerate()
            .map(|(i, _)| format!("typeArgs[{}]", i))
            .collect::<Vec<_>>()
            .join(", ")
    }

    /// Emit the typeArgs array literal for use in return statements
    #[allow(dead_code)]
    fn emit_type_args_array(&self) -> String {
        if self.type_params.len() == 1 {
            "[typeArg]".to_string()
        } else {
            format!(
                "[{}]",
                self.type_params
                    .iter()
                    .enumerate()
                    .map(|(i, _)| format!("typeArgs[{}]", i))
                    .collect::<Vec<_>>()
                    .join(", ")
            )
        }
    }

    #[allow(dead_code)]
    fn emit_to_bcs_calls(&self) -> String {
        // For reified() method - use actual param names
        self.type_params
            .iter()
            .filter(|p| !p.is_phantom)
            .map(|p| format!("toBcs({})", p.name))
            .collect::<Vec<_>>()
            .join(", ")
    }

    fn emit_to_bcs_indexed(&self) -> String {
        // For static methods like fromBcs - always use indexed access for enums
        self.type_params
            .iter()
            .enumerate()
            .filter(|(_, p)| !p.is_phantom)
            .map(|(i, _)| format!("toBcs(typeArgs[{}])", i))
            .collect::<Vec<_>>()
            .join(", ")
    }

    fn emit_reified_bcs_init(&self) -> String {
        let has_non_phantom = self.type_params.iter().any(|p| !p.is_phantom);
        if has_non_phantom {
            let to_bcs_args: Vec<String> = self
                .type_params
                .iter()
                .filter(|p| !p.is_phantom)
                .map(|p| format!("toBcs({})", p.name))
                .collect();
            format!("{}.bcs({})", self.name, to_bcs_args.join(", "))
        } else {
            format!("{}.bcs", self.name)
        }
    }

    fn emit_bcs_section(&self) -> String {
        let name = &self.name;
        let has_non_phantom = self.type_params.iter().any(|p| !p.is_phantom);

        if has_non_phantom {
            let bcs_type_params = self.emit_bcs_type_params();
            let bcs_params = self.emit_bcs_params();
            let bcs_struct_name = self.emit_bcs_struct_name();
            let bcs_variants = self.emit_bcs_variants();

            formatdoc! {r#"
              private static instantiateBcs() {{
                return {bcs_type_params}{bcs_params} =>
                  bcs.enum({bcs_struct_name}, {{
            {bcs_variants}
                  }})
              }}

              private static cachedBcs: ReturnType<typeof {name}.instantiateBcs> | null = null

              static get bcs(): ReturnType<typeof {name}.instantiateBcs> {{
                if (!{name}.cachedBcs) {{
                  {name}.cachedBcs = {name}.instantiateBcs()
                }}
                return {name}.cachedBcs
              }}"#,
                name = name,
                bcs_type_params = bcs_type_params,
                bcs_params = bcs_params,
                bcs_struct_name = bcs_struct_name,
                bcs_variants = bcs_variants,
            }
        } else {
            let bcs_variants = self.emit_bcs_variants();
            formatdoc! {r#"
              private static instantiateBcs() {{
                return bcs.enum('{name}', {{
            {bcs_variants}
                }})
              }}

              private static cachedBcs: ReturnType<typeof {name}.instantiateBcs> | null = null

              static get bcs(): ReturnType<typeof {name}.instantiateBcs> {{
                if (!{name}.cachedBcs) {{
                  {name}.cachedBcs = {name}.instantiateBcs()
                }}
                return {name}.cachedBcs
              }}"#,
                name = name,
                bcs_variants = bcs_variants,
            }
        }
    }

    fn emit_bcs_section_no_type_params(&self) -> String {
        let name = &self.name;
        let bcs_variants = self.emit_bcs_variants();

        formatdoc! {r#"
          private static instantiateBcs() {{
            return bcs.enum('{name}', {{
        {bcs_variants}
            }})
          }}

          private static cachedBcs: ReturnType<typeof {name}.instantiateBcs> | null = null

          static get bcs(): ReturnType<typeof {name}.instantiateBcs> {{
            if (!{name}.cachedBcs) {{
              {name}.cachedBcs = {name}.instantiateBcs()
            }}
            return {name}.cachedBcs
          }}"#,
            name = name,
            bcs_variants = bcs_variants,
        }
    }

    fn emit_bcs_type_params(&self) -> String {
        let params: Vec<String> = self
            .type_params
            .iter()
            .filter(|p| !p.is_phantom)
            .map(|p| format!("{} extends BcsType<any>", p.name))
            .collect();
        if params.is_empty() {
            String::new()
        } else {
            format!("<{}>", params.join(", "))
        }
    }

    fn emit_bcs_params(&self) -> String {
        let params: Vec<String> = self
            .type_params
            .iter()
            .filter(|p| !p.is_phantom)
            .map(|p| format!("{}: {}", p.name, p.name))
            .collect();
        if params.is_empty() {
            String::new()
        } else {
            format!("({})", params.join(", "))
        }
    }

    fn emit_bcs_struct_name(&self) -> String {
        let name_parts: Vec<String> = self
            .type_params
            .iter()
            .filter(|p| !p.is_phantom)
            .map(|p| format!("${{{}.name}}", p.name))
            .collect();
        format!("`{}<{}>`", self.name, name_parts.join(", "))
    }

    fn emit_bcs_variants(&self) -> String {
        self.variants
            .iter()
            .map(|v| {
                if v.is_unit() {
                    format!("      {}: null,", v.name)
                } else if v.is_tuple {
                    let fields: Vec<String> =
                        v.fields.iter().map(|f| f.field_type.to_bcs()).collect();
                    format!("      {}: bcs.tuple([{}]),", v.name, fields.join(", "))
                } else {
                    let struct_name = format!("{}{}", self.name, v.name);
                    let fields: Vec<String> = v
                        .fields
                        .iter()
                        .map(|f| format!("{}: {},", f.move_name, f.field_type.to_bcs()))
                        .collect();
                    format!(
                        "      {}: bcs.struct('{}', {{\n        {}\n      }}),",
                        v.name,
                        struct_name,
                        fields.join("\n        ")
                    )
                }
            })
            .collect::<Vec<_>>()
            .join("\n")
    }

    fn emit_new_switch_cases(&self) -> String {
        let name = &self.name;
        self.variants
            .iter()
            .map(|v| {
                let v_name = &v.name;
                let class_name = format!("{}{}", name, v_name);
                let to_type_args = self.emit_to_type_args();
                let extract_types = self.emit_extract_types();

                if v.is_unit() {
                    format!(
                        "          case '{}':\n            return new {}([{}], fields as {}Fields)",
                        v_name, class_name, extract_types, class_name
                    )
                } else {
                    format!(
                        "          case '{}':\n            return new {}(\n              [{}],\n              fields as {}Fields{}\n            )",
                        v_name, class_name, extract_types, class_name, to_type_args
                    )
                }
            })
            .collect::<Vec<_>>()
            .join("\n")
    }

    fn emit_new_switch_cases_no_type_params(&self) -> String {
        let name = &self.name;
        self.variants
            .iter()
            .map(|v| {
                let v_name = &v.name;
                let class_name = format!("{}{}", name, v_name);
                format!(
                    "          case '{}':\n            return new {}([], fields as {}Fields)",
                    v_name, class_name, class_name
                )
            })
            .collect::<Vec<_>>()
            .join("\n")
    }

    fn emit_from_fields_switch(&self) -> String {
        self.variants
            .iter()
            .map(|v| {
                if v.is_unit() {
                    format!(
                        "      case '{}':\n        return r.new('{}', fields.{})",
                        v.name, v.name, v.name
                    )
                } else if v.is_tuple {
                    let decodes: Vec<String> = v
                        .fields
                        .iter()
                        .enumerate()
                        .map(|(i, f)| {
                            let reified =
                                f.field_type.to_reified_runtime_indexed(self.type_params.len());
                            format!("decodeFromFields({}, fields.{}[{}])", reified, v.name, i)
                        })
                        .collect();
                    format!(
                        "      case '{}':\n        return r.new('{}', [\n          {},\n        ])",
                        v.name,
                        v.name,
                        decodes.join(",\n          ")
                    )
                } else {
                    let decodes: Vec<String> = v
                        .fields
                        .iter()
                        .map(|f| {
                            let reified =
                                f.field_type.to_reified_runtime_indexed(self.type_params.len());
                            format!(
                                "{}: decodeFromFields({}, fields.{}.{})",
                                f.ts_name, reified, v.name, f.move_name
                            )
                        })
                        .collect();
                    format!(
                        "      case '{}':\n        return r.new('{}', {{\n          {},\n        }})",
                        v.name,
                        v.name,
                        decodes.join(",\n          ")
                    )
                }
            })
            .collect::<Vec<_>>()
            .join("\n")
    }

    fn emit_from_fields_switch_no_type_params(&self) -> String {
        self.emit_from_fields_switch()
    }

    fn emit_from_fields_with_types_switch(&self) -> String {
        self.variants
            .iter()
            .map(|v| {
                if v.is_unit() {
                    format!(
                        "      case '{}':\n        return r.new('{}', {{}})",
                        v.name, v.name
                    )
                } else if v.is_tuple {
                    let decodes: Vec<String> = v
                        .fields
                        .iter()
                        .enumerate()
                        .map(|(i, f)| {
                            let reified =
                                f.field_type.to_reified_runtime_indexed(self.type_params.len());
                            format!(
                                "decodeFromFieldsWithTypes({}, item.fields.pos{})",
                                reified, i
                            )
                        })
                        .collect();
                    format!(
                        "      case '{}':\n        return r.new('{}', [\n          {},\n        ])",
                        v.name,
                        v.name,
                        decodes.join(",\n          ")
                    )
                } else {
                    let decodes: Vec<String> = v
                        .fields
                        .iter()
                        .map(|f| {
                            let reified =
                                f.field_type.to_reified_runtime_indexed(self.type_params.len());
                            format!(
                                "{}: decodeFromFieldsWithTypes({}, item.fields.{})",
                                f.ts_name, reified, f.move_name
                            )
                        })
                        .collect();
                    format!(
                        "      case '{}':\n        return r.new('{}', {{\n          {},\n        }})",
                        v.name,
                        v.name,
                        decodes.join(",\n          ")
                    )
                }
            })
            .collect::<Vec<_>>()
            .join("\n")
    }

    fn emit_from_fields_with_types_switch_no_type_params(&self) -> String {
        self.emit_from_fields_with_types_switch()
    }

    fn emit_from_json_field_switch(&self) -> String {
        self.variants
            .iter()
            .map(|v| {
                if v.is_unit() {
                    format!(
                        "      case '{}':\n        return r.new('{}', {{}})",
                        v.name, v.name
                    )
                } else if v.is_tuple {
                    let decodes: Vec<String> = v
                        .fields
                        .iter()
                        .enumerate()
                        .map(|(i, f)| {
                            let reified =
                                f.field_type.to_reified_runtime_indexed(self.type_params.len());
                            format!("decodeFromJSONField({}, field.vec[{}])", reified, i)
                        })
                        .collect();
                    format!(
                        "      case '{}':\n        return r.new('{}', [\n          {},\n        ])",
                        v.name,
                        v.name,
                        decodes.join(",\n          ")
                    )
                } else {
                    let decodes: Vec<String> = v
                        .fields
                        .iter()
                        .map(|f| {
                            let reified =
                                f.field_type.to_reified_runtime_indexed(self.type_params.len());
                            format!(
                                "{}: decodeFromJSONField({}, field.{})",
                                f.ts_name, reified, f.ts_name
                            )
                        })
                        .collect();
                    format!(
                        "      case '{}':\n        return r.new('{}', {{\n          {},\n        }})",
                        v.name,
                        v.name,
                        decodes.join(",\n          ")
                    )
                }
            })
            .collect::<Vec<_>>()
            .join("\n")
    }

    fn emit_from_json_field_switch_no_type_params(&self) -> String {
        self.emit_from_json_field_switch()
    }
}

// Note: FieldTypeIR methods are defined in structs.rs

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_simple_enum() {
        let enum_ir = EnumIR {
            name: "Status".to_string(),
            module_enum_path: "module::Status".to_string(),
            package_info: PackageInfo::System {
                address: "0x2".to_string(),
            },
            type_params: vec![],
            variants: vec![
                EnumVariantIR {
                    name: "Active".to_string(),
                    fields: vec![],
                    is_tuple: false,
                },
                EnumVariantIR {
                    name: "Inactive".to_string(),
                    fields: vec![],
                    is_tuple: false,
                },
            ],
            uses_vector: false,
            uses_address: false,
            uses_phantom_struct_args: false,
        };

        let output = enum_ir.emit_body();
        assert!(output.contains("export function isStatus"));
        assert!(output.contains("StatusVariant"));
        assert!(output.contains("StatusActive"));
        assert!(output.contains("StatusInactive"));
    }
}
