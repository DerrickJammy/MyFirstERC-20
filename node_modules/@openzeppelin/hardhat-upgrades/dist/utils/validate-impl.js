"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateBeaconImpl = exports.validateProxyImpl = exports.validateImpl = void 0;
const upgrades_core_1 = require("@openzeppelin/upgrades-core");
async function processProxyImpl(deployData, proxyAddress, opts) {
    await (0, upgrades_core_1.processProxyKind)(deployData.provider, proxyAddress, opts, deployData.validations, deployData.version);
    let currentImplAddress;
    if (proxyAddress !== undefined) {
        // upgrade scenario
        currentImplAddress = await (0, upgrades_core_1.getImplementationAddress)(deployData.provider, proxyAddress);
    }
    return currentImplAddress;
}
async function processBeaconImpl(deployData, beaconAddress) {
    // upgrade scenario
    await (0, upgrades_core_1.assertNotProxy)(deployData.provider, beaconAddress);
    return await (0, upgrades_core_1.getImplementationAddressFromBeacon)(deployData.provider, beaconAddress);
}
async function validateImpl(deployData, opts, currentImplAddress) {
    (0, upgrades_core_1.assertUpgradeSafe)(deployData.validations, deployData.version, deployData.fullOpts);
    if (currentImplAddress !== undefined) {
        const manifest = await upgrades_core_1.Manifest.forNetwork(deployData.provider);
        const currentLayout = await (0, upgrades_core_1.getStorageLayoutForAddress)(manifest, deployData.validations, currentImplAddress);
        if (opts.unsafeSkipStorageCheck !== true) {
            (0, upgrades_core_1.assertStorageUpgradeSafe)(currentLayout, deployData.layout, deployData.fullOpts);
        }
    }
}
exports.validateImpl = validateImpl;
async function validateProxyImpl(deployData, opts, proxyAddress) {
    const currentImplAddress = await processProxyImpl(deployData, proxyAddress, opts);
    return validateImpl(deployData, opts, currentImplAddress);
}
exports.validateProxyImpl = validateProxyImpl;
async function validateBeaconImpl(deployData, opts, beaconAddress) {
    const currentImplAddress = beaconAddress !== undefined ? await processBeaconImpl(deployData, beaconAddress) : undefined;
    return validateImpl(deployData, opts, currentImplAddress);
}
exports.validateBeaconImpl = validateBeaconImpl;
//# sourceMappingURL=validate-impl.js.map