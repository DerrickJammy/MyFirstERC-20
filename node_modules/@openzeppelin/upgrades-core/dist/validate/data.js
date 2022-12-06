"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.concatRunData = exports.isCurrentValidationData = exports.normalizeValidationData = void 0;
const compare_versions_1 = __importDefault(require("compare-versions"));
const currentMajor = '3';
const currentVersion = '3.2';
function normalizeValidationData(data) {
    if (isCurrentValidationData(data, false)) {
        return data;
    }
    else if (Array.isArray(data)) {
        return { version: currentVersion, log: data };
    }
    else {
        return { version: currentVersion, log: [data] };
    }
}
exports.normalizeValidationData = normalizeValidationData;
function isCurrentValidationData(data, exact = true) {
    if (Array.isArray(data)) {
        return false;
    }
    else if (!('version' in data)) {
        return false;
    }
    else if (typeof data.version === 'string' && compare_versions_1.default.validate(data.version)) {
        if (exact) {
            return data.version === currentVersion;
        }
        else {
            return compare_versions_1.default.compare(data.version, `${currentMajor}.*`, '=');
        }
    }
    else {
        throw new Error('Unknown version or malformed validation data');
    }
}
exports.isCurrentValidationData = isCurrentValidationData;
function concatRunData(newRunData, previousData) {
    return {
        version: currentVersion,
        log: [newRunData].concat(previousData?.log ?? []),
    };
}
exports.concatRunData = concatRunData;
//# sourceMappingURL=data.js.map