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
 * @interface ResourceId
 */
export interface ResourceId {
    /**
     * 
     * @type {string}
     * @memberof ResourceId
     */
    channelId?: string | null;
    /**
     * 
     * @type {string}
     * @memberof ResourceId
     */
    kind?: string | null;
    /**
     * 
     * @type {string}
     * @memberof ResourceId
     */
    playlistId?: string | null;
    /**
     * 
     * @type {string}
     * @memberof ResourceId
     */
    videoId?: string | null;
    /**
     * 
     * @type {string}
     * @memberof ResourceId
     */
    eTag?: string | null;
}

export function ResourceIdFromJSON(json: any): ResourceId {
    return ResourceIdFromJSONTyped(json, false);
}

export function ResourceIdFromJSONTyped(json: any, ignoreDiscriminator: boolean): ResourceId {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'channelId': !exists(json, 'channelId') ? undefined : json['channelId'],
        'kind': !exists(json, 'kind') ? undefined : json['kind'],
        'playlistId': !exists(json, 'playlistId') ? undefined : json['playlistId'],
        'videoId': !exists(json, 'videoId') ? undefined : json['videoId'],
        'eTag': !exists(json, 'eTag') ? undefined : json['eTag'],
    };
}

export function ResourceIdToJSON(value?: ResourceId | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'channelId': value.channelId,
        'kind': value.kind,
        'playlistId': value.playlistId,
        'videoId': value.videoId,
        'eTag': value.eTag,
    };
}


