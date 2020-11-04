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
 * @interface PlaylistItemContentDetails
 */
export interface PlaylistItemContentDetails {
    /**
     * 
     * @type {string}
     * @memberof PlaylistItemContentDetails
     */
    endAt?: string | null;
    /**
     * 
     * @type {string}
     * @memberof PlaylistItemContentDetails
     */
    note?: string | null;
    /**
     * 
     * @type {string}
     * @memberof PlaylistItemContentDetails
     */
    startAt?: string | null;
    /**
     * 
     * @type {string}
     * @memberof PlaylistItemContentDetails
     */
    videoId?: string | null;
    /**
     * 
     * @type {string}
     * @memberof PlaylistItemContentDetails
     */
    videoPublishedAt?: string | null;
    /**
     * 
     * @type {string}
     * @memberof PlaylistItemContentDetails
     */
    eTag?: string | null;
}

export function PlaylistItemContentDetailsFromJSON(json: any): PlaylistItemContentDetails {
    return PlaylistItemContentDetailsFromJSONTyped(json, false);
}

export function PlaylistItemContentDetailsFromJSONTyped(json: any, ignoreDiscriminator: boolean): PlaylistItemContentDetails {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'endAt': !exists(json, 'endAt') ? undefined : json['endAt'],
        'note': !exists(json, 'note') ? undefined : json['note'],
        'startAt': !exists(json, 'startAt') ? undefined : json['startAt'],
        'videoId': !exists(json, 'videoId') ? undefined : json['videoId'],
        'videoPublishedAt': !exists(json, 'videoPublishedAt') ? undefined : json['videoPublishedAt'],
        'eTag': !exists(json, 'eTag') ? undefined : json['eTag'],
    };
}

export function PlaylistItemContentDetailsToJSON(value?: PlaylistItemContentDetails | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'endAt': value.endAt,
        'note': value.note,
        'startAt': value.startAt,
        'videoId': value.videoId,
        'videoPublishedAt': value.videoPublishedAt,
        'eTag': value.eTag,
    };
}


