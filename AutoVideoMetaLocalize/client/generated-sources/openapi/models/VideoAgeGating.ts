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
 * @interface VideoAgeGating
 */
export interface VideoAgeGating {
    /**
     * 
     * @type {boolean}
     * @memberof VideoAgeGating
     */
    alcoholContent?: boolean | null;
    /**
     * 
     * @type {boolean}
     * @memberof VideoAgeGating
     */
    restricted?: boolean | null;
    /**
     * 
     * @type {string}
     * @memberof VideoAgeGating
     */
    videoGameRating?: string | null;
    /**
     * 
     * @type {string}
     * @memberof VideoAgeGating
     */
    eTag?: string | null;
}

export function VideoAgeGatingFromJSON(json: any): VideoAgeGating {
    return VideoAgeGatingFromJSONTyped(json, false);
}

export function VideoAgeGatingFromJSONTyped(json: any, ignoreDiscriminator: boolean): VideoAgeGating {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'alcoholContent': !exists(json, 'alcoholContent') ? undefined : json['alcoholContent'],
        'restricted': !exists(json, 'restricted') ? undefined : json['restricted'],
        'videoGameRating': !exists(json, 'videoGameRating') ? undefined : json['videoGameRating'],
        'eTag': !exists(json, 'eTag') ? undefined : json['eTag'],
    };
}

export function VideoAgeGatingToJSON(value?: VideoAgeGating | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'alcoholContent': value.alcoholContent,
        'restricted': value.restricted,
        'videoGameRating': value.videoGameRating,
        'eTag': value.eTag,
    };
}


