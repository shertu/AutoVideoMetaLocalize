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
export enum ChartEnum {
    NUMBER_0 = 0,
    NUMBER_1 = 1
}

export function ChartEnumFromJSON(json: any): ChartEnum {
    return ChartEnumFromJSONTyped(json, false);
}

export function ChartEnumFromJSONTyped(json: any, ignoreDiscriminator: boolean): ChartEnum {
    return json as ChartEnum;
}

export function ChartEnumToJSON(value?: ChartEnum | null): any {
    return value as any;
}

