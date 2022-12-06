import { HardhatRuntimeEnvironment } from 'hardhat/types';
import type { ContractFactory, ethers } from 'ethers';
import { DeployImplementationOptions } from './utils';
export declare type DeployImplementationFunction = (ImplFactory: ContractFactory, opts?: DeployImplementationOptions) => Promise<DeployImplementationResponse>;
export declare type DeployImplementationResponse = string | ethers.providers.TransactionResponse;
export declare function makeDeployImplementation(hre: HardhatRuntimeEnvironment): DeployImplementationFunction;
//# sourceMappingURL=deploy-implementation.d.ts.map