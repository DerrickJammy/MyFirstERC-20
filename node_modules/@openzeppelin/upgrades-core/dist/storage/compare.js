"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StorageLayoutComparator = void 0;
const levenshtein_1 = require("../levenshtein");
const layout_1 = require("./layout");
const error_1 = require("../error");
const report_1 = require("./report");
const assert_1 = require("../utils/assert");
const is_value_type_1 = require("../utils/is-value-type");
class StorageLayoutComparator {
    constructor(unsafeAllowCustomTypes = false, unsafeAllowRenames = false) {
        this.unsafeAllowCustomTypes = unsafeAllowCustomTypes;
        this.unsafeAllowRenames = unsafeAllowRenames;
        this.hasAllowedUncheckedCustomTypes = false;
        // Holds a stack of type comparisons to detect recursion
        this.stack = new Set();
        this.cache = new Map();
    }
    compareLayouts(original, updated) {
        return new report_1.LayoutCompatibilityReport(this.layoutLevenshtein(original, updated, { allowAppend: true }));
    }
    layoutLevenshtein(original, updated, { allowAppend }) {
        const ops = (0, levenshtein_1.levenshtein)(original, updated, (a, b) => this.getFieldChange(a, b));
        if (allowAppend) {
            return ops.filter(o => o.kind !== 'append');
        }
        else {
            return ops;
        }
    }
    getVisibilityChange(original, updated) {
        const re = /^t_function_(internal|external)/;
        const originalVisibility = original.head.match(re);
        const updatedVisibility = updated.head.match(re);
        (0, assert_1.assert)(originalVisibility && updatedVisibility);
        if (originalVisibility[0] !== updatedVisibility[0]) {
            return { kind: 'visibility change', original, updated };
        }
    }
    getFieldChange(original, updated) {
        const nameChange = !this.unsafeAllowRenames &&
            original.label !== updated.renamedFrom &&
            (updated.label !== original.label ||
                (updated.renamedFrom !== undefined && updated.renamedFrom !== original.renamedFrom));
        const retypedFromOriginal = original.type.item.label === updated.retypedFrom?.trim();
        const typeChange = !retypedFromOriginal && this.getTypeChange(original.type, updated.type, { allowAppend: false });
        const layoutChange = this.getLayoutChange(original, updated);
        if (updated.retypedFrom && layoutChange) {
            return { kind: 'layoutchange', original, updated, change: layoutChange };
        }
        else if (typeChange && nameChange) {
            return { kind: 'replace', original, updated };
        }
        else if (nameChange) {
            return { kind: 'rename', original, updated };
        }
        else if (typeChange) {
            return { kind: 'typechange', change: typeChange, original, updated };
        }
        else if (layoutChange && !layoutChange.uncertain) {
            // Any layout change should be caught earlier as a type change, but we
            // add this check as a safety fallback.
            return { kind: 'layoutchange', original, updated, change: layoutChange };
        }
    }
    getLayoutChange(original, updated) {
        const validPair = ['uint8', 'bool'];
        const knownCompatibleTypes = validPair.includes(original.type.item.label) && validPair.includes(updated.type.item.label);
        if (original.type.item.label == updated.type.item.label || knownCompatibleTypes) {
            return undefined;
        }
        else if ((0, layout_1.hasLayout)(original) && (0, layout_1.hasLayout)(updated)) {
            const change = (from, to) => (from === to ? undefined : { from, to });
            const slot = change(original.slot, updated.slot);
            const offset = change(original.offset, updated.offset);
            const bytes = change(original.type.item.numberOfBytes, updated.type.item.numberOfBytes);
            if (slot || offset || bytes) {
                return { slot, offset, bytes };
            }
        }
        else {
            return { uncertain: true };
        }
    }
    getTypeChange(original, updated, { allowAppend }) {
        const key = JSON.stringify({ original: original.id, updated: updated.id, allowAppend });
        if (this.cache.has(key)) {
            return this.cache.get(key);
        }
        if (this.stack.has(key)) {
            throw new error_1.UpgradesError(`Recursive types are not supported`, () => `Recursion found in ${updated.item.label}\n`);
        }
        try {
            this.stack.add(key);
            const result = this.uncachedGetTypeChange(original, updated, { allowAppend });
            this.cache.set(key, result);
            return result;
        }
        finally {
            this.stack.delete(key);
        }
    }
    uncachedGetTypeChange(original, updated, { allowAppend }) {
        if (updated.head.startsWith('t_function')) {
            return this.getVisibilityChange(original, updated);
        }
        if (original.head !== updated.head) {
            return { kind: 'obvious mismatch', original, updated };
        }
        if (original.args === undefined || updated.args === undefined) {
            // both should be undefined at the same time
            (0, assert_1.assert)(original.args === updated.args);
            return undefined;
        }
        switch (original.head) {
            case 't_contract':
                // no storage layout errors can be introduced here since it is just an address
                return undefined;
            case 't_struct': {
                const originalMembers = original.item.members;
                const updatedMembers = updated.item.members;
                if (originalMembers === undefined || updatedMembers === undefined) {
                    if (this.unsafeAllowCustomTypes) {
                        this.hasAllowedUncheckedCustomTypes = true;
                        return undefined;
                    }
                    else {
                        return { kind: 'missing members', original, updated };
                    }
                }
                (0, assert_1.assert)((0, layout_1.isStructMembers)(originalMembers) && (0, layout_1.isStructMembers)(updatedMembers));
                const ops = this.layoutLevenshtein(originalMembers, updatedMembers, { allowAppend });
                if (ops.length > 0) {
                    return { kind: 'struct members', ops, original, updated, allowAppend };
                }
                else {
                    return undefined;
                }
            }
            case 't_enum': {
                const originalMembers = original.item.members;
                const updatedMembers = updated.item.members;
                if (originalMembers === undefined || updatedMembers === undefined) {
                    if (this.unsafeAllowCustomTypes) {
                        this.hasAllowedUncheckedCustomTypes = true;
                        return undefined;
                    }
                    else {
                        return { kind: 'missing members', original, updated };
                    }
                }
                (0, assert_1.assert)((0, layout_1.isEnumMembers)(originalMembers) && (0, layout_1.isEnumMembers)(updatedMembers));
                if (enumSize(originalMembers.length) !== enumSize(updatedMembers.length)) {
                    return { kind: 'enum resize', original, updated };
                }
                else {
                    const ops = (0, levenshtein_1.levenshtein)(originalMembers, updatedMembers, (a, b) => a === b ? undefined : { kind: 'replace', original: a, updated: b }).filter(o => o.kind !== 'append');
                    if (ops.length > 0) {
                        return { kind: 'enum members', ops, original, updated };
                    }
                    else {
                        return undefined;
                    }
                }
            }
            case 't_mapping': {
                const [originalKey, originalValue] = original.args;
                const [updatedKey, updatedValue] = updated.args;
                // validate an invariant we assume from solidity: key types are always simple value types
                (0, assert_1.assert)((0, is_value_type_1.isValueType)(originalKey) && (0, is_value_type_1.isValueType)(updatedKey));
                // network files migrated from the OZ CLI have an unknown key type
                // we allow it to match with any other key type, carrying over the semantics of OZ CLI
                const keyChange = originalKey.head === 'unknown'
                    ? undefined
                    : this.getTypeChange(originalKey, updatedKey, { allowAppend: false });
                if (keyChange) {
                    return { kind: 'mapping key', inner: keyChange, original, updated };
                }
                else {
                    // mapping value types are allowed to grow
                    const inner = this.getTypeChange(originalValue, updatedValue, { allowAppend: true });
                    if (inner) {
                        return { kind: 'mapping value', inner, original, updated };
                    }
                    else {
                        return undefined;
                    }
                }
            }
            case 't_array': {
                const originalLength = original.tail?.match(/^(\d+|dyn)/)?.[0];
                const updatedLength = updated.tail?.match(/^(\d+|dyn)/)?.[0];
                (0, assert_1.assert)(originalLength !== undefined && updatedLength !== undefined);
                if (originalLength === 'dyn' || updatedLength === 'dyn') {
                    if (originalLength !== updatedLength) {
                        return { kind: 'array dynamic', original, updated };
                    }
                }
                const originalLengthInt = parseInt(originalLength, 10);
                const updatedLengthInt = parseInt(updatedLength, 10);
                if (updatedLengthInt < originalLengthInt) {
                    return { kind: 'array shrink', original, updated };
                }
                else if (!allowAppend && updatedLengthInt > originalLengthInt) {
                    return { kind: 'array grow', original, updated };
                }
                const inner = this.getTypeChange(original.args[0], updated.args[0], { allowAppend: false });
                if (inner) {
                    return { kind: 'array value', inner, original, updated };
                }
                else {
                    return undefined;
                }
            }
            default:
                return { kind: 'unknown', original, updated };
        }
    }
}
exports.StorageLayoutComparator = StorageLayoutComparator;
function enumSize(memberCount) {
    return Math.ceil(Math.log2(Math.max(2, memberCount)) / 8);
}
//# sourceMappingURL=compare.js.map