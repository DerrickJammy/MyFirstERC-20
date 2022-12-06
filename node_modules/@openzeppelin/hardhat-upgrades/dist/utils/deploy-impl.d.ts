import { StorageLayout, ValidationDataCurrent, ValidationOptions, Version } from '@openzeppelin/upgrades-core';
import type { ContractFactory, ethers } from 'ethers';
import type { EthereumProvider, HardhatRuntimeEnvironment } from 'hardhat/types';
import { StandaloneOptions, UpgradeOptions } from './options';
interface DeployedProxyImpl {
    impl: string;
    kind: NonNullable<ValidationOptions['kind']>;
    txResponse?: ethers.providers.TransactionResponse;
}
interface DeployedBeaconImpl {
    impl: string;
    txResponse?: ethers.providers.TransactionResponse;
}
export interface DeployData {
    provider: EthereumProvider;
    validations: ValidationDataCurrent;
    unlinkedBytecode: string;
    encodedArgs: string;
    version: Version;
    layout: StorageLayout;
    fullOpts: Required<UpgradeOptions>;
}
export declare function getDeployData(hre: HardhatRuntimeEnvironment, ImplFactory: ContractFactory, opts: UpgradeOptions): Promise<DeployData>;
export declare function deployStandaloneImpl(hre: HardhatRuntimeEnvironment, ImplFactory: ContractFactory, opts: StandaloneOptions): Promise<DeployedProxyImpl>;
export declare function deployProxyImpl(hre: HardhatRuntimeEnvironment, ImplFactory: ContractFactory, opts: UpgradeOptions, proxyAddress?: string): Promise<DeployedProxyImpl>;
export declare function deployBeaconImpl(hre: HardhatRuntimeEnvironment, ImplFactory: ContractFactory, opts: UpgradeOptions, beaconAddress?: string): Promise<DeployedBeaconImpl>;
export {};
//# sourceMappingURL=deploy-impl.d.ts.map