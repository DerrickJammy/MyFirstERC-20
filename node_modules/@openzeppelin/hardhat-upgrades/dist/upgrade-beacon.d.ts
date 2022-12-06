import { HardhatRuntimeEnvironment } from 'hardhat/types';
import type { ContractFactory, Contract } from 'ethers';
import { ContractAddressOrInstance, UpgradeBeaconOptions } from './utils';
export declare type UpgradeBeaconFunction = (beacon: ContractAddressOrInstance, ImplFactory: ContractFactory, opts?: UpgradeBeaconOptions) => Promise<Contract>;
export declare function makeUpgradeBeacon(hre: HardhatRuntimeEnvironment): UpgradeBeaconFunction;
//# sourceMappingURL=upgrade-beacon.d.ts.map