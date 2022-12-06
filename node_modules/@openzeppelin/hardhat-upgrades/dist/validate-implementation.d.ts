import { HardhatRuntimeEnvironment } from 'hardhat/types';
import type { ContractFactory } from 'ethers';
import { ValidateImplementationOptions } from './utils';
export declare type ValidateImplementationFunction = (ImplFactory: ContractFactory, opts?: ValidateImplementationOptions) => Promise<void>;
export declare function makeValidateImplementation(hre: HardhatRuntimeEnvironment): ValidateImplementationFunction;
//# sourceMappingURL=validate-implementation.d.ts.map