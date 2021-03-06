/* tslint:disable */
/* eslint-disable */
/**
 * Meta Localize
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * The version of the OpenAPI document: 1.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import { exists, mapValues } from '../runtime';
/**
 * 
 * @export
 * @interface LanguageTag
 */
export interface LanguageTag {
    /**
     * 
     * @type {string}
     * @memberof LanguageTag
     */
    value?: string | null;
    /**
     * 
     * @type {string}
     * @memberof LanguageTag
     */
    eTag?: string | null;
}

export function LanguageTagFromJSON(json: any): LanguageTag {
    return LanguageTagFromJSONTyped(json, false);
}

export function LanguageTagFromJSONTyped(json: any, ignoreDiscriminator: boolean): LanguageTag {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'value': !exists(json, 'value') ? undefined : json['value'],
        'eTag': !exists(json, 'eTag') ? undefined : json['eTag'],
    };
}

export function LanguageTagToJSON(value?: LanguageTag | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'value': value.value,
        'eTag': value.eTag,
    };
}


