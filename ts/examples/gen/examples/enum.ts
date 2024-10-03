//onchain structure:
// public enum AuthSession has store, copy, drop {
//   Any,
//   Specific {val:u8},
// }

import { bcs, EnumOutputShapeWithKeys } from "@mysten/bcs";
import { EnumClass, Reified, ToField } from "../_framework/reified";
import {
  composeSuiType,
  compressSuiType,
  DataWithTypes,
} from "../_framework/util";

export function isAuthSession(type: string): boolean {
  type = compressSuiType(type);
  return type === "package::module::AuthSession";
}

export type AuthSessionType = EnumOutputShapeWithKeys<
  { Any: true; Specific: { val: ToField<"u8"> } },
  "Any" | "Specific"
>;

//only needed if we use variants as a generic i.e. defining a function myFunc<A: store> where we use a variant for A
export type AuthSessionReified = Reified<AuthSession, AuthSessionType>;

export class AuthSession implements EnumClass {
  static readonly $typeName = "package::module::AuthSession";
  static readonly $numTypeParams = 0;

  readonly $typeName = AuthSession.$typeName;

  readonly $fullTypeName: "package::module::AuthSession";

  readonly $typeArgs: [];
  readonly data: AuthSessionType;

  private constructor(typeArgs: [], data: AuthSessionType) {
    this.$fullTypeName = composeSuiType(
      AuthSession.$typeName,
      ...typeArgs,
    ) as "package::module::AuthSession";
    this.$typeArgs = typeArgs;
    this.data = data;
  }

  static reified(): AuthSessionReified {
    return {
      typeName: AuthSession.$typeName,
      fullTypeName: composeSuiType(
        AuthSession.$typeName,
        ...[],
      ) as "package::module::AuthSession",
      typeArgs: [] as [],
      reifiedTypeArgs: [],
      // fromFields: (fields: Record<string, any>) =>
      //   AuthSession.fromFields(fields),
      // fromFieldsWithTypes: (item: DataWithTypes) =>
      //   AuthSession.fromFieldsWithTypes(item),
      fromBcs: (data: Uint8Array) => AuthSession.fromBcs(data),
      bcs: AuthSession.bcs,
      // fromJSONField: (field: any) => AuthSession.fromJSONField(field),
      // fromJSON: (json: Record<string, any>) => AuthSession.fromJSON(json),
      // fromSuiParsedData: (content: SuiParsedData) =>
      //   AuthSession.fromSuiParsedData(content),
      // fetch: async (client: SuiClient, id: string) =>
      //   AuthSession.fetch(client, id),
      new: (data: AuthSessionType) => {
        return new AuthSession([], data);
      },
      kind: "EnumClassReified",
    };
  }

  static get r() {
    return AuthSession.reified();
  }

  // static phantom(): PhantomReified<ToTypeStr<AuthSession>> {
  //   return phantom(AuthSession.reified());
  // }
  // static get p() {
  //   return AuthSession.phantom();
  // }

  static get bcs() {
    return bcs.enum("AuthSession", {
      Any: null,
      Specific: bcs.struct("Specific", { val: bcs.u8() }),
    });
  }

  // static fromFields(data: EnumOutputShapeWithKeys<any, string>): AuthSession {
  //   return AuthSession.reified().new(data as AuthSessionType);
  // }

  //todo: not sure if correct
  // static fromFieldsWithTypes(item: DataWithTypes): AuthSession {
  //   if (!isAuthSession(item.type)) {
  //     throw new Error("not a AuthSession type");
  //   }

  //   return AuthSession.reified().new(item.data as AuthSessionType);
  // }

  static fromBcs(data: Uint8Array): AuthSession {
    const parsed: AuthSessionType = AuthSession.bcs.parse(data);
    return new AuthSession([], parsed);
  }

  // toJSONField() {
  //   return {
  //     workspaceId: this.workspaceId,
  //     authenticatedUser: this.authenticatedUser,
  //     authPermissions: fieldToJSON<Vector<"u8">>(
  //       `vector<u8>`,
  //       this.authPermissions,
  //     ),
  //     isTaskAuth: this.isTaskAuth,
  //     executorId: fieldToJSON<Option<ID>>(
  //       `0x1::option::Option<0x2::object::ID>`,
  //       this.executorId,
  //     ),
  //     taskModuleId: fieldToJSON<Option<ID>>(
  //       `0x1::option::Option<0x2::object::ID>`,
  //       this.taskModuleId,
  //     ),
  //   };
  // }

  // toJSON() {
  //   return {
  //     $typeName: this.$typeName,
  //     $typeArgs: this.$typeArgs,
  //     ...this.toJSONField(),
  //   };
  // }

  // static fromJSONField(data: any): AuthSession {
  //   return AuthSession.reified().new(data as AuthSessionType);
  // }

  // static fromJSON(json: Record<string, any>): AuthSession {
  //   if (json.$typeName !== AuthSession.$typeName) {
  //     throw new Error("not a WithTwoGenerics json object");
  //   }

  //   return AuthSession.fromJSONField(json);
  // }

  // static fromSuiParsedData(content: SuiParsedData): AuthSession {
  //   if (content.dataType !== "moveObject") {
  //     throw new Error("not an object");
  //   }
  //   if (!isAuthSession(content.type)) {
  //     throw new Error(
  //       `object at ${(content.fields as any).id} is not a AuthSession object`,
  //     );
  //   }
  //   return AuthSession.fromFieldsWithTypes(content);
  // }

  // static async fetch(client: SuiClient, id: string): Promise<AuthSession> {
  //   const res = await client.getObject({ id, options: { showBcs: true } });
  //   if (res.error) {
  //     throw new Error(
  //       `error fetching AuthSession object at id ${id}: ${res.error.code}`,
  //     );
  //   }
  //   if (
  //     res.data?.bcs?.dataType !== "moveObject" ||
  //     !isAuthSession(res.data.bcs.type)
  //   ) {
  //     throw new Error(`object at id ${id} is not a AuthSession object`);
  //   }
  //   return AuthSession.fromBcs(fromB64(res.data.bcs.bcsBytes));
  // }
}
