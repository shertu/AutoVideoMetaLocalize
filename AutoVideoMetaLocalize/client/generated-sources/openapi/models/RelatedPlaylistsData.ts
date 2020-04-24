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
 * @interface RelatedPlaylistsData
 */
export interface RelatedPlaylistsData {
    /**
     * 
     * @type {string}
     * @memberof RelatedPlaylistsData
     */
    favorites?: string | null;
    /**
     * 
     * @type {string}
     * @memberof RelatedPlaylistsData
     */
    likes?: string | null;
    /**
     * 
     * @type {string}
     * @memberof RelatedPlaylistsData
     */
    uploads?: string | null;
    /**
     * 
     * @type {string}
     * @memberof RelatedPlaylistsData
     */
    watchHistory?: string | null;
    /**
     * 
     * @type {string}
     * @memberof RelatedPlaylistsData
     */
    watchLater?: string | null;
}

export function RelatedPlaylistsDataFromJSON(json: any): RelatedPlaylistsData {
    return RelatedPlaylistsDataFromJSONTyped(json, false);
}

export function RelatedPlaylistsDataFromJSONTyped(json: any, ignoreDiscriminator: boolean): RelatedPlaylistsData {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'favorites': !exists(json, 'favorites') ? undefined : json['favorites'],
        'likes': !exists(json, 'likes') ? undefined : json['likes'],
        'uploads': !exists(json, 'uploads') ? undefined : json['uploads'],
        'watchHistory': !exists(json, 'watchHistory') ? undefined : json['watchHistory'],
        'watchLater': !exists(json, 'watchLater') ? undefined : json['watchLater'],
    };
}

export function RelatedPlaylistsDataToJSON(value?: RelatedPlaylistsData | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'favorites': value.favorites,
        'likes': value.likes,
        'uploads': value.uploads,
        'watchHistory': value.watchHistory,
        'watchLater': value.watchLater,
    };
}


