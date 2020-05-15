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

import { exists, mapValues } from '../runtime';
/**
 * 
 * @export
 * @interface VideoContentDetailsRegionRestriction
 */
export interface VideoContentDetailsRegionRestriction {
    /**
     * 
     * @type {Array<string>}
     * @memberof VideoContentDetailsRegionRestriction
     */
    allowed?: Array<string> | null;
    /**
     * 
     * @type {Array<string>}
     * @memberof VideoContentDetailsRegionRestriction
     */
    blocked?: Array<string> | null;
    /**
     * 
     * @type {string}
     * @memberof VideoContentDetailsRegionRestriction
     */
    eTag?: string | null;
}

export function VideoContentDetailsRegionRestrictionFromJSON(json: any): VideoContentDetailsRegionRestriction {
    return VideoContentDetailsRegionRestrictionFromJSONTyped(json, false);
}

export function VideoContentDetailsRegionRestrictionFromJSONTyped(json: any, ignoreDiscriminator: boolean): VideoContentDetailsRegionRestriction {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'allowed': !exists(json, 'allowed') ? undefined : json['allowed'],
        'blocked': !exists(json, 'blocked') ? undefined : json['blocked'],
        'eTag': !exists(json, 'eTag') ? undefined : json['eTag'],
    };
}

export function VideoContentDetailsRegionRestrictionToJSON(value?: VideoContentDetailsRegionRestriction | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'allowed': value.allowed,
        'blocked': value.blocked,
        'eTag': value.eTag,
    };
}

