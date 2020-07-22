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
    ThumbnailDetails,
    ThumbnailDetailsFromJSON,
    ThumbnailDetailsFromJSONTyped,
    ThumbnailDetailsToJSON,
    VideoLocalization,
    VideoLocalizationFromJSON,
    VideoLocalizationFromJSONTyped,
    VideoLocalizationToJSON,
} from './';

/**
 * 
 * @export
 * @interface VideoSnippet
 */
export interface VideoSnippet {
    /**
     * 
     * @type {string}
     * @memberof VideoSnippet
     */
    categoryId?: string | null;
    /**
     * 
     * @type {string}
     * @memberof VideoSnippet
     */
    channelId?: string | null;
    /**
     * 
     * @type {string}
     * @memberof VideoSnippet
     */
    channelTitle?: string | null;
    /**
     * 
     * @type {string}
     * @memberof VideoSnippet
     */
    defaultAudioLanguage?: string | null;
    /**
     * 
     * @type {string}
     * @memberof VideoSnippet
     */
    defaultLanguage?: string | null;
    /**
     * 
     * @type {string}
     * @memberof VideoSnippet
     */
    description?: string | null;
    /**
     * 
     * @type {string}
     * @memberof VideoSnippet
     */
    liveBroadcastContent?: string | null;
    /**
     * 
     * @type {VideoLocalization}
     * @memberof VideoSnippet
     */
    localized?: VideoLocalization;
    /**
     * 
     * @type {string}
     * @memberof VideoSnippet
     */
    publishedAt?: string | null;
    /**
     * 
     * @type {Array<string>}
     * @memberof VideoSnippet
     */
    tags?: Array<string> | null;
    /**
     * 
     * @type {ThumbnailDetails}
     * @memberof VideoSnippet
     */
    thumbnails?: ThumbnailDetails;
    /**
     * 
     * @type {string}
     * @memberof VideoSnippet
     */
    title?: string | null;
    /**
     * 
     * @type {string}
     * @memberof VideoSnippet
     */
    eTag?: string | null;
}

export function VideoSnippetFromJSON(json: any): VideoSnippet {
    return VideoSnippetFromJSONTyped(json, false);
}

export function VideoSnippetFromJSONTyped(json: any, ignoreDiscriminator: boolean): VideoSnippet {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'categoryId': !exists(json, 'categoryId') ? undefined : json['categoryId'],
        'channelId': !exists(json, 'channelId') ? undefined : json['channelId'],
        'channelTitle': !exists(json, 'channelTitle') ? undefined : json['channelTitle'],
        'defaultAudioLanguage': !exists(json, 'defaultAudioLanguage') ? undefined : json['defaultAudioLanguage'],
        'defaultLanguage': !exists(json, 'defaultLanguage') ? undefined : json['defaultLanguage'],
        'description': !exists(json, 'description') ? undefined : json['description'],
        'liveBroadcastContent': !exists(json, 'liveBroadcastContent') ? undefined : json['liveBroadcastContent'],
        'localized': !exists(json, 'localized') ? undefined : VideoLocalizationFromJSON(json['localized']),
        'publishedAt': !exists(json, 'publishedAt') ? undefined : json['publishedAt'],
        'tags': !exists(json, 'tags') ? undefined : json['tags'],
        'thumbnails': !exists(json, 'thumbnails') ? undefined : ThumbnailDetailsFromJSON(json['thumbnails']),
        'title': !exists(json, 'title') ? undefined : json['title'],
        'eTag': !exists(json, 'eTag') ? undefined : json['eTag'],
    };
}

export function VideoSnippetToJSON(value?: VideoSnippet | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'categoryId': value.categoryId,
        'channelId': value.channelId,
        'channelTitle': value.channelTitle,
        'defaultAudioLanguage': value.defaultAudioLanguage,
        'defaultLanguage': value.defaultLanguage,
        'description': value.description,
        'liveBroadcastContent': value.liveBroadcastContent,
        'localized': VideoLocalizationToJSON(value.localized),
        'publishedAt': value.publishedAt,
        'tags': value.tags,
        'thumbnails': ThumbnailDetailsToJSON(value.thumbnails),
        'title': value.title,
        'eTag': value.eTag,
    };
}


