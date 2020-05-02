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
 * @interface ChannelStatus
 */
export interface ChannelStatus {
    /**
     * 
     * @type {boolean}
     * @memberof ChannelStatus
     */
    isLinked?: boolean | null;
    /**
     * 
     * @type {string}
     * @memberof ChannelStatus
     */
    longUploadsStatus?: string | null;
    /**
     * 
     * @type {boolean}
     * @memberof ChannelStatus
     */
    madeForKids?: boolean | null;
    /**
     * 
     * @type {string}
     * @memberof ChannelStatus
     */
    privacyStatus?: string | null;
    /**
     * 
     * @type {boolean}
     * @memberof ChannelStatus
     */
    selfDeclaredMadeForKids?: boolean | null;
    /**
     * 
     * @type {string}
     * @memberof ChannelStatus
     */
    eTag?: string | null;
}

export function ChannelStatusFromJSON(json: any): ChannelStatus {
    return ChannelStatusFromJSONTyped(json, false);
}

export function ChannelStatusFromJSONTyped(json: any, ignoreDiscriminator: boolean): ChannelStatus {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'isLinked': !exists(json, 'isLinked') ? undefined : json['isLinked'],
        'longUploadsStatus': !exists(json, 'longUploadsStatus') ? undefined : json['longUploadsStatus'],
        'madeForKids': !exists(json, 'madeForKids') ? undefined : json['madeForKids'],
        'privacyStatus': !exists(json, 'privacyStatus') ? undefined : json['privacyStatus'],
        'selfDeclaredMadeForKids': !exists(json, 'selfDeclaredMadeForKids') ? undefined : json['selfDeclaredMadeForKids'],
        'eTag': !exists(json, 'eTag') ? undefined : json['eTag'],
    };
}

export function ChannelStatusToJSON(value?: ChannelStatus | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'isLinked': value.isLinked,
        'longUploadsStatus': value.longUploadsStatus,
        'madeForKids': value.madeForKids,
        'privacyStatus': value.privacyStatus,
        'selfDeclaredMadeForKids': value.selfDeclaredMadeForKids,
        'eTag': value.eTag,
    };
}

