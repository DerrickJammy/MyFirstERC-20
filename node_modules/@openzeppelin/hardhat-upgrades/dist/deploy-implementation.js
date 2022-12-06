"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeDeployImplementation = void 0;
const deploy_impl_1 = require("./utils/deploy-impl");
function makeDeployImplementation(hre) {
    return async function deployImplementation(ImplFactory, opts = {}) {
        const deployedImpl = await (0, deploy_impl_1.deployStandaloneImpl)(hre, ImplFactory, opts);
        if (opts.getTxResponse && deployedImpl.txResponse !== undefined) {
            return deployedImpl.txResponse;
        }
        else {
            return deployedImpl.impl;
        }
    };
}
exports.makeDeployImplementation = makeDeployImplementation;
//# sourceMappingURL=deploy-implementation.js.map