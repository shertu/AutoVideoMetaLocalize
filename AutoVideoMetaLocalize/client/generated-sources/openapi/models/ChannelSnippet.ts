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
    ChannelLocalization,
    ChannelLocalizationFromJSON,
    ChannelLocalizationFromJSONTyped,
    ChannelLocalizationToJSON,
    ThumbnailDetails,
    ThumbnailDetailsFromJSON,
    ThumbnailDetailsFromJSONTyped,
    ThumbnailDetailsToJSON,
} from './';

/**
 * 
 * @export
 * @interface ChannelSnippet
 */
export interface ChannelSnippet {
    /**
     * 
     * @type {string}
     * @memberof ChannelSnippet
     */
    country?: string | null;
    /**
     * 
     * @type {string}
     * @memberof ChannelSnippet
     */
    customUrl?: string | null;
    /**
     * 
     * @type {string}
     * @memberof ChannelSnippet
     */
    defaultLanguage?: string | null;
    /**
     * 
     * @type {string}
     * @memberof ChannelSnippet
     */
    description?: string | null;
    /**
     * 
     * @type {ChannelLocalization}
     * @memberof ChannelSnippet
     */
    localized?: ChannelLocalization;
    /**
     * 
     * @type {string}
     * @memberof ChannelSnippet
     */
    publishedAtRaw?: string | null;
    /**
     * 
     * @type {Date}
     * @memberof ChannelSnippet
     */
    publishedAt?: Date | null;
    /**
     * 
     * @type {ThumbnailDetails}
     * @memberof ChannelSnippet
     */
    thumbnails?: ThumbnailDetails;
    /**
     * 
     * @type {string}
     * @memberof ChannelSnippet
     */
    title?: string | null;
    /**
     * 
     * @type {string}
     * @memberof ChannelSnippet
     */
    eTag?: string | null;
}

export function ChannelSnippetFromJSON(json: any): ChannelSnippet {
    return ChannelSnippetFromJSONTyped(json, false);
}

export function ChannelSnippetFromJSONTyped(json: any, ignoreDiscriminator: boolean): ChannelSnippet {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'country': !exists(json, 'country') ? undefined : json['country'],
        'customUrl': !exists(json, 'customUrl') ? undefined : json['customUrl'],
        'defaultLanguage': !exists(json, 'defaultLanguage') ? undefined : json['defaultLanguage'],
        'description': !exists(json, 'description') ? undefined : json['description'],
        'localized': !exists(json, 'localized') ? undefined : ChannelLocalizationFromJSON(json['localized']),
        'publishedAtRaw': !exists(json, 'publishedAtRaw') ? undefined : json['publishedAtRaw'],
        'publishedAt': !exists(json, 'publishedAt') ? undefined : (json['publishedAt'] === null ? null : new Date(json['publishedAt'])),
        'thumbnails': !exists(json, 'thumbnails') ? undefined : ThumbnailDetailsFromJSON(json['thumbnails']),
        'title': !exists(json, 'title') ? undefined : json['title'],
        'eTag': !exists(json, 'eTag') ? undefined : json['eTag'],
    };
}

export function ChannelSnippetToJSON(value?: ChannelSnippet | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'country': value.country,
        'customUrl': value.customUrl,
        'defaultLanguage': value.defaultLanguage,
        'description': value.description,
        'localized': ChannelLocalizationToJSON(value.localized),
        'publishedAtRaw': value.publishedAtRaw,
        'publishedAt': value.publishedAt === undefined ? undefined : (value.publishedAt === null ? null : value.publishedAt.toISOString()),
        'thumbnails': ThumbnailDetailsToJSON(value.thumbnails),
        'title': value.title,
        'eTag': value.eTag,
    };
}

