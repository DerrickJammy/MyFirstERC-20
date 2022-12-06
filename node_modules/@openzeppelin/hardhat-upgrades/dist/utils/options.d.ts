import { DeployOpts, ProxyKindOption, StandaloneValidationOptions, ValidationOptions } from '@openzeppelin/upgrades-core';
export declare type StandaloneOptions = StandaloneValidationOptions & DeployOpts & {
    constructorArgs?: unknown[];
    useDeployedImplementation?: boolean;
};
export declare type UpgradeOptions = ValidationOptions & StandaloneOptions;
export declare function withDefaults(opts?: UpgradeOptions): Required<UpgradeOptions>;
export declare type GetTxResponse = {
    getTxResponse?: boolean;
};
declare type Initializer = {
    initializer?: string | false;
};
export declare type DeployBeaconProxyOptions = ProxyKindOption & Initializer;
export declare type DeployBeaconOptions = StandaloneOptions;
export declare type DeployImplementationOptions = StandaloneOptions & GetTxResponse;
export declare type DeployProxyAdminOptions = DeployOpts;
export declare type DeployProxyOptions = StandaloneOptions & Initializer;
export declare type ForceImportOptions = ProxyKindOption;
export declare type PrepareUpgradeOptions = UpgradeOptions & GetTxResponse;
export declare type UpgradeBeaconOptions = UpgradeOptions;
export declare type UpgradeProxyOptions = UpgradeOptions & {
    call?: {
        fn: string;
        args?: unknown[];
    } | string;
};
export declare type ValidateImplementationOptions = StandaloneValidationOptions;
export declare type ValidateUpgradeOptions = ValidationOptions;
export {};
//# sourceMappingURL=options.d.ts.map