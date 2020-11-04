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
 * @interface ChannelConversionPing
 */
export interface ChannelConversionPing {
    /**
     * 
     * @type {string}
     * @memberof ChannelConversionPing
     */
    context?: string | null;
    /**
     * 
     * @type {string}
     * @memberof ChannelConversionPing
     */
    conversionUrl?: string | null;
    /**
     * 
     * @type {string}
     * @memberof ChannelConversionPing
     */
    eTag?: string | null;
}

export function ChannelConversionPingFromJSON(json: any): ChannelConversionPing {
    return ChannelConversionPingFromJSONTyped(json, false);
}

export function ChannelConversionPingFromJSONTyped(json: any, ignoreDiscriminator: boolean): ChannelConversionPing {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'context': !exists(json, 'context') ? undefined : json['context'],
        'conversionUrl': !exists(json, 'conversionUrl') ? undefined : json['conversionUrl'],
        'eTag': !exists(json, 'eTag') ? undefined : json['eTag'],
    };
}

export function ChannelConversionPingToJSON(value?: ChannelConversionPing | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'context': value.context,
        'conversionUrl': value.conversionUrl,
        'eTag': value.eTag,
    };
}


