import { ValidationOptions } from '@openzeppelin/upgrades-core';
import { DeployData } from './deploy-impl';
export declare function validateImpl(deployData: DeployData, opts: ValidationOptions, currentImplAddress?: string): Promise<void>;
export declare function validateProxyImpl(deployData: DeployData, opts: ValidationOptions, proxyAddress?: string): Promise<void>;
export declare function validateBeaconImpl(deployData: DeployData, opts: ValidationOptions, beaconAddress?: string): Promise<void>;
//# sourceMappingURL=validate-impl.d.ts.map