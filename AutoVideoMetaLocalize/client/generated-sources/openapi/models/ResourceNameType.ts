/* tslint:disable */
/* eslint-disable */
/**
 * AutoVideoMetaLocalize
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * The version of the OpenAPI document: 1.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

/**
 * 
 * @export
 * @enum {string}
 */
export enum ResourceNameType {
    NUMBER_0 = 0,
    NUMBER_1 = 1
}

export function ResourceNameTypeFromJSON(json: any): ResourceNameType {
    return ResourceNameTypeFromJSONTyped(json, false);
}

export function ResourceNameTypeFromJSONTyped(json: any, ignoreDiscriminator: boolean): ResourceNameType {
    return json as ResourceNameType;
}

export function ResourceNameTypeToJSON(value?: ResourceNameType | null): any {
    return value as any;
}

