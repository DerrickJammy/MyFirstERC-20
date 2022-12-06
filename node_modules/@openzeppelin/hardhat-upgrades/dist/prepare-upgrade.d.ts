import { HardhatRuntimeEnvironment } from 'hardhat/types';
import type { ContractFactory } from 'ethers';
import { ContractAddressOrInstance, PrepareUpgradeOptions } from './utils';
import { DeployImplementationResponse } from './deploy-implementation';
export declare type PrepareUpgradeFunction = (proxyOrBeaconAddress: ContractAddressOrInstance, ImplFactory: ContractFactory, opts?: PrepareUpgradeOptions) => Promise<DeployImplementationResponse>;
export declare function makePrepareUpgrade(hre: HardhatRuntimeEnvironment): PrepareUpgradeFunction;
//# sourceMappingURL=prepare-upgrade.d.ts.map