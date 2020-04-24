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
import {
    ChannelConversionPing,
    ChannelConversionPingFromJSON,
    ChannelConversionPingFromJSONTyped,
    ChannelConversionPingToJSON,
} from './';

/**
 * 
 * @export
 * @interface ChannelConversionPings
 */
export interface ChannelConversionPings {
    /**
     * 
     * @type {Array<ChannelConversionPing>}
     * @memberof ChannelConversionPings
     */
    pings?: Array<ChannelConversionPing> | null;
    /**
     * 
     * @type {string}
     * @memberof ChannelConversionPings
     */
    eTag?: string | null;
}

export function ChannelConversionPingsFromJSON(json: any): ChannelConversionPings {
    return ChannelConversionPingsFromJSONTyped(json, false);
}

export function ChannelConversionPingsFromJSONTyped(json: any, ignoreDiscriminator: boolean): ChannelConversionPings {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'pings': !exists(json, 'pings') ? undefined : (json['pings'] === null ? null : (json['pings'] as Array<any>).map(ChannelConversionPingFromJSON)),
        'eTag': !exists(json, 'eTag') ? undefined : json['eTag'],
    };
}

export function ChannelConversionPingsToJSON(value?: ChannelConversionPings | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'pings': value.pings === undefined ? undefined : (value.pings === null ? null : (value.pings as Array<any>).map(ChannelConversionPingToJSON)),
        'eTag': value.eTag,
    };
}


