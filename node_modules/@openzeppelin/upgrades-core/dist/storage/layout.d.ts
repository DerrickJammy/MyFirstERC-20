import { ParsedTypeId } from '../utils/parse-type-id';
export interface StorageLayout {
    layoutVersion?: string;
    storage: StorageItem[];
    types: Record<string, TypeItem>;
    flat?: boolean;
}
export declare type StorageField<Type = string> = StorageItem<Type> | StructMember<Type>;
export interface StorageItem<Type = string> {
    astId?: number;
    contract: string;
    label: string;
    type: Type;
    src: string;
    offset?: number;
    slot?: string;
    retypedFrom?: string;
    renamedFrom?: string;
}
export interface TypeItem<Type = string> {
    label: string;
    members?: TypeItemMembers<Type>;
    numberOfBytes?: string;
}
export declare type TypeItemMembers<Type = string> = StructMember<Type>[] | EnumMember[];
export interface StructMember<Type = string> {
    label: string;
    type: Type;
    retypedFrom?: string;
    renamedFrom?: string;
    offset?: number;
    slot?: string;
}
export declare type EnumMember = string;
export interface ParsedTypeDetailed extends ParsedTypeId {
    item: TypeItem<ParsedTypeDetailed>;
    args?: ParsedTypeDetailed[];
    rets?: ParsedTypeDetailed[];
}
export declare function getDetailedLayout(layout: StorageLayout): StorageItem<ParsedTypeDetailed>[];
export declare function isEnumMembers<T>(members: TypeItemMembers<T>): members is EnumMember[];
export declare function isStructMembers<T>(members: TypeItemMembers<T>): members is StructMember<T>[];
export declare type StorageFieldWithLayout = StorageField<ParsedTypeDetailed> & Required<Pick<StorageField, 'offset' | 'slot'>> & {
    type: {
        item: Required<Pick<TypeItem, 'numberOfBytes'>>;
    };
};
export declare function hasLayout(field: StorageField<ParsedTypeDetailed>): field is StorageFieldWithLayout;
//# sourceMappingURL=layout.d.ts.map