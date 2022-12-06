import { Operation } from '../levenshtein';
import { ParsedTypeDetailed } from './layout';
import { StorageItem as _StorageItem, StructMember as _StructMember, StorageField as _StorageField } from './layout';
import { LayoutCompatibilityReport } from './report';
export declare type StorageItem = _StorageItem<ParsedTypeDetailed>;
declare type StructMember = _StructMember<ParsedTypeDetailed>;
export declare type StorageField = _StorageField<ParsedTypeDetailed>;
export declare type StorageOperation<F extends StorageField> = Operation<F, StorageFieldChange<F>>;
export declare type EnumOperation = Operation<string, {
    kind: 'replace';
    original: string;
    updated: string;
}>;
declare type StorageFieldChange<F extends StorageField> = ({
    kind: 'replace' | 'rename';
} | {
    kind: 'typechange';
    change: TypeChange;
} | {
    kind: 'layoutchange';
    change: LayoutChange;
}) & {
    original: F;
    updated: F;
};
export declare type TypeChange = ({
    kind: 'obvious mismatch' | 'unknown' | 'array grow' | 'visibility change' | 'array shrink' | 'array dynamic' | 'enum resize' | 'missing members';
} | {
    kind: 'mapping key' | 'mapping value' | 'array value';
    inner: TypeChange;
} | {
    kind: 'enum members';
    ops: EnumOperation[];
} | {
    kind: 'struct members';
    ops: StorageOperation<StructMember>[];
    allowAppend: boolean;
}) & {
    original: ParsedTypeDetailed;
    updated: ParsedTypeDetailed;
};
export interface LayoutChange {
    uncertain?: boolean;
    slot?: Record<'from' | 'to', string>;
    offset?: Record<'from' | 'to', number>;
    bytes?: Record<'from' | 'to', string>;
}
export declare class StorageLayoutComparator {
    readonly unsafeAllowCustomTypes: boolean;
    readonly unsafeAllowRenames: boolean;
    hasAllowedUncheckedCustomTypes: boolean;
    stack: Set<string>;
    cache: Map<string, TypeChange | undefined>;
    constructor(unsafeAllowCustomTypes?: boolean, unsafeAllowRenames?: boolean);
    compareLayouts(original: StorageItem[], updated: StorageItem[]): LayoutCompatibilityReport;
    private layoutLevenshtein;
    getVisibilityChange(original: ParsedTypeDetailed, updated: ParsedTypeDetailed): TypeChange | undefined;
    getFieldChange<F extends StorageField>(original: F, updated: F): StorageFieldChange<F> | undefined;
    getLayoutChange(original: StorageField, updated: StorageField): LayoutChange | undefined;
    getTypeChange(original: ParsedTypeDetailed, updated: ParsedTypeDetailed, { allowAppend }: {
        allowAppend: boolean;
    }): TypeChange | undefined;
    private uncachedGetTypeChange;
}
export {};
//# sourceMappingURL=compare.d.ts.map