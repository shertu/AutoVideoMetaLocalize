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
import {
    PageInfo,
    PageInfoFromJSON,
    PageInfoFromJSONTyped,
    PageInfoToJSON,
    PlaylistItem,
    PlaylistItemFromJSON,
    PlaylistItemFromJSONTyped,
    PlaylistItemToJSON,
    TokenPagination,
    TokenPaginationFromJSON,
    TokenPaginationFromJSONTyped,
    TokenPaginationToJSON,
} from './';

/**
 * 
 * @export
 * @interface PlaylistItemListResponse
 */
export interface PlaylistItemListResponse {
    /**
     * 
     * @type {string}
     * @memberof PlaylistItemListResponse
     */
    eTag?: string | null;
    /**
     * 
     * @type {string}
     * @memberof PlaylistItemListResponse
     */
    eventId?: string | null;
    /**
     * 
     * @type {Array<PlaylistItem>}
     * @memberof PlaylistItemListResponse
     */
    items?: Array<PlaylistItem> | null;
    /**
     * 
     * @type {string}
     * @memberof PlaylistItemListResponse
     */
    kind?: string | null;
    /**
     * 
     * @type {string}
     * @memberof PlaylistItemListResponse
     */
    nextPageToken?: string | null;
    /**
     * 
     * @type {PageInfo}
     * @memberof PlaylistItemListResponse
     */
    pageInfo?: PageInfo;
    /**
     * 
     * @type {string}
     * @memberof PlaylistItemListResponse
     */
    prevPageToken?: string | null;
    /**
     * 
     * @type {TokenPagination}
     * @memberof PlaylistItemListResponse
     */
    tokenPagination?: TokenPagination;
    /**
     * 
     * @type {string}
     * @memberof PlaylistItemListResponse
     */
    visitorId?: string | null;
}

export function PlaylistItemListResponseFromJSON(json: any): PlaylistItemListResponse {
    return PlaylistItemListResponseFromJSONTyped(json, false);
}

export function PlaylistItemListResponseFromJSONTyped(json: any, ignoreDiscriminator: boolean): PlaylistItemListResponse {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'eTag': !exists(json, 'eTag') ? undefined : json['eTag'],
        'eventId': !exists(json, 'eventId') ? undefined : json['eventId'],
        'items': !exists(json, 'items') ? undefined : (json['items'] === null ? null : (json['items'] as Array<any>).map(PlaylistItemFromJSON)),
        'kind': !exists(json, 'kind') ? undefined : json['kind'],
        'nextPageToken': !exists(json, 'nextPageToken') ? undefined : json['nextPageToken'],
        'pageInfo': !exists(json, 'pageInfo') ? undefined : PageInfoFromJSON(json['pageInfo']),
        'prevPageToken': !exists(json, 'prevPageToken') ? undefined : json['prevPageToken'],
        'tokenPagination': !exists(json, 'tokenPagination') ? undefined : TokenPaginationFromJSON(json['tokenPagination']),
        'visitorId': !exists(json, 'visitorId') ? undefined : json['visitorId'],
    };
}

export function PlaylistItemListResponseToJSON(value?: PlaylistItemListResponse | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'eTag': value.eTag,
        'eventId': value.eventId,
        'items': value.items === undefined ? undefined : (value.items === null ? null : (value.items as Array<any>).map(PlaylistItemToJSON)),
        'kind': value.kind,
        'nextPageToken': value.nextPageToken,
        'pageInfo': PageInfoToJSON(value.pageInfo),
        'prevPageToken': value.prevPageToken,
        'tokenPagination': TokenPaginationToJSON(value.tokenPagination),
        'visitorId': value.visitorId,
    };
}


