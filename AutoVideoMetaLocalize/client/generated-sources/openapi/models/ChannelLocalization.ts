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
 * @interface ChannelLocalization
 */
export interface ChannelLocalization {
    /**
     * 
     * @type {string}
     * @memberof ChannelLocalization
     */
    description?: string | null;
    /**
     * 
     * @type {string}
     * @memberof ChannelLocalization
     */
    title?: string | null;
    /**
     * 
     * @type {string}
     * @memberof ChannelLocalization
     */
    eTag?: string | null;
}

export function ChannelLocalizationFromJSON(json: any): ChannelLocalization {
    return ChannelLocalizationFromJSONTyped(json, false);
}

export function ChannelLocalizationFromJSONTyped(json: any, ignoreDiscriminator: boolean): ChannelLocalization {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'description': !exists(json, 'description') ? undefined : json['description'],
        'title': !exists(json, 'title') ? undefined : json['title'],
        'eTag': !exists(json, 'eTag') ? undefined : json['eTag'],
    };
}

export function ChannelLocalizationToJSON(value?: ChannelLocalization | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'description': value.description,
        'title': value.title,
        'eTag': value.eTag,
    };
}


