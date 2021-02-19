import {ApmOptions} from "./interface";

export const APM_OPTIONS = Symbol('APM_OPTIONS');

export const defaultApmOptions: ApmOptions = {
    httpUserMapFunction: undefined,
};
