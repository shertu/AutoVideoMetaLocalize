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
 * @interface VideoSuggestionsTagSuggestion
 */
export interface VideoSuggestionsTagSuggestion {
    /**
     * 
     * @type {Array<string>}
     * @memberof VideoSuggestionsTagSuggestion
     */
    categoryRestricts?: Array<string> | null;
    /**
     * 
     * @type {string}
     * @memberof VideoSuggestionsTagSuggestion
     */
    tag?: string | null;
    /**
     * 
     * @type {string}
     * @memberof VideoSuggestionsTagSuggestion
     */
    eTag?: string | null;
}

export function VideoSuggestionsTagSuggestionFromJSON(json: any): VideoSuggestionsTagSuggestion {
    return VideoSuggestionsTagSuggestionFromJSONTyped(json, false);
}

export function VideoSuggestionsTagSuggestionFromJSONTyped(json: any, ignoreDiscriminator: boolean): VideoSuggestionsTagSuggestion {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'categoryRestricts': !exists(json, 'categoryRestricts') ? undefined : json['categoryRestricts'],
        'tag': !exists(json, 'tag') ? undefined : json['tag'],
        'eTag': !exists(json, 'eTag') ? undefined : json['eTag'],
    };
}

export function VideoSuggestionsTagSuggestionToJSON(value?: VideoSuggestionsTagSuggestion | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'categoryRestricts': value.categoryRestricts,
        'tag': value.tag,
        'eTag': value.eTag,
    };
}


