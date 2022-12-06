"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeDeployProxyAdmin = void 0;
const upgrades_core_1 = require("@openzeppelin/upgrades-core");
const utils_1 = require("./utils");
function makeDeployProxyAdmin(hre) {
    return async function deployProxyAdmin(signer, opts = {}) {
        const { provider } = hre.network;
        const AdminFactory = await (0, utils_1.getProxyAdminFactory)(hre, signer);
        return await (0, upgrades_core_1.fetchOrDeployAdmin)(provider, () => (0, utils_1.deploy)(AdminFactory), opts);
    };
}
exports.makeDeployProxyAdmin = makeDeployProxyAdmin;
//# sourceMappingURL=deploy-proxy-admin.js.map