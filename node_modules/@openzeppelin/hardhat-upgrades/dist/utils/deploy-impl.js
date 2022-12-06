"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deployBeaconImpl = exports.deployProxyImpl = exports.deployStandaloneImpl = exports.getDeployData = void 0;
const upgrades_core_1 = require("@openzeppelin/upgrades-core");
const utils_1 = require("ethers/lib/utils");
const deploy_1 = require("./deploy");
const options_1 = require("./options");
const validate_impl_1 = require("./validate-impl");
const validations_1 = require("./validations");
async function getDeployData(hre, ImplFactory, opts) {
    const { provider } = hre.network;
    const validations = await (0, validations_1.readValidations)(hre);
    const unlinkedBytecode = (0, upgrades_core_1.getUnlinkedBytecode)(validations, ImplFactory.bytecode);
    const encodedArgs = ImplFactory.interface.encodeDeploy(opts.constructorArgs);
    const version = (0, upgrades_core_1.getVersion)(unlinkedBytecode, ImplFactory.bytecode, encodedArgs);
    const layout = (0, upgrades_core_1.getStorageLayout)(validations, version);
    const fullOpts = (0, options_1.withDefaults)(opts);
    return { provider, validations, unlinkedBytecode, encodedArgs, version, layout, fullOpts };
}
exports.getDeployData = getDeployData;
async function deployStandaloneImpl(hre, ImplFactory, opts) {
    const deployData = await getDeployData(hre, ImplFactory, opts);
    await (0, validate_impl_1.validateImpl)(deployData, opts);
    return await deployImpl(hre, deployData, ImplFactory, opts);
}
exports.deployStandaloneImpl = deployStandaloneImpl;
async function deployProxyImpl(hre, ImplFactory, opts, proxyAddress) {
    const deployData = await getDeployData(hre, ImplFactory, opts);
    await (0, validate_impl_1.validateProxyImpl)(deployData, opts, proxyAddress);
    return await deployImpl(hre, deployData, ImplFactory, opts);
}
exports.deployProxyImpl = deployProxyImpl;
async function deployBeaconImpl(hre, ImplFactory, opts, beaconAddress) {
    const deployData = await getDeployData(hre, ImplFactory, opts);
    await (0, validate_impl_1.validateBeaconImpl)(deployData, opts, beaconAddress);
    return await deployImpl(hre, deployData, ImplFactory, opts);
}
exports.deployBeaconImpl = deployBeaconImpl;
async function deployImpl(hre, deployData, ImplFactory, opts) {
    const layout = deployData.layout;
    const deployment = await (0, upgrades_core_1.fetchOrDeployGetDeployment)(deployData.version, deployData.provider, async () => {
        const abi = ImplFactory.interface.format(utils_1.FormatTypes.minimal);
        const attemptDeploy = () => {
            if (opts.useDeployedImplementation) {
                throw new upgrades_core_1.UpgradesError('The implementation contract was not previously deployed.', () => 'The useDeployedImplementation option was set to true but the implementation contract was not previously deployed on this network.');
            }
            else {
                return (0, deploy_1.deploy)(ImplFactory, ...deployData.fullOpts.constructorArgs);
            }
        };
        const deployment = Object.assign({ abi }, await attemptDeploy());
        return { ...deployment, layout };
    }, opts);
    let txResponse;
    if (opts.getTxResponse) {
        if ('deployTransaction' in deployment) {
            txResponse = deployment.deployTransaction;
        }
        else if (deployment.txHash !== undefined) {
            txResponse = hre.ethers.provider.getTransaction(deployment.txHash);
        }
    }
    return { impl: deployment.address, kind: opts.kind, txResponse };
}
//# sourceMappingURL=deploy-impl.js.map