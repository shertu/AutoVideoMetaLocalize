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
    ChannelSettings,
    ChannelSettingsFromJSON,
    ChannelSettingsFromJSONTyped,
    ChannelSettingsToJSON,
    ImageSettings,
    ImageSettingsFromJSON,
    ImageSettingsFromJSONTyped,
    ImageSettingsToJSON,
    PropertyValue,
    PropertyValueFromJSON,
    PropertyValueFromJSONTyped,
    PropertyValueToJSON,
    WatchSettings,
    WatchSettingsFromJSON,
    WatchSettingsFromJSONTyped,
    WatchSettingsToJSON,
} from './';

/**
 * 
 * @export
 * @interface ChannelBrandingSettings
 */
export interface ChannelBrandingSettings {
    /**
     * 
     * @type {ChannelSettings}
     * @memberof ChannelBrandingSettings
     */
    channel?: ChannelSettings;
    /**
     * 
     * @type {Array<PropertyValue>}
     * @memberof ChannelBrandingSettings
     */
    hints?: Array<PropertyValue> | null;
    /**
     * 
     * @type {ImageSettings}
     * @memberof ChannelBrandingSettings
     */
    image?: ImageSettings;
    /**
     * 
     * @type {WatchSettings}
     * @memberof ChannelBrandingSettings
     */
    watch?: WatchSettings;
    /**
     * 
     * @type {string}
     * @memberof ChannelBrandingSettings
     */
    eTag?: string | null;
}

export function ChannelBrandingSettingsFromJSON(json: any): ChannelBrandingSettings {
    return ChannelBrandingSettingsFromJSONTyped(json, false);
}

export function ChannelBrandingSettingsFromJSONTyped(json: any, ignoreDiscriminator: boolean): ChannelBrandingSettings {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'channel': !exists(json, 'channel') ? undefined : ChannelSettingsFromJSON(json['channel']),
        'hints': !exists(json, 'hints') ? undefined : (json['hints'] === null ? null : (json['hints'] as Array<any>).map(PropertyValueFromJSON)),
        'image': !exists(json, 'image') ? undefined : ImageSettingsFromJSON(json['image']),
        'watch': !exists(json, 'watch') ? undefined : WatchSettingsFromJSON(json['watch']),
        'eTag': !exists(json, 'eTag') ? undefined : json['eTag'],
    };
}

export function ChannelBrandingSettingsToJSON(value?: ChannelBrandingSettings | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'channel': ChannelSettingsToJSON(value.channel),
        'hints': value.hints === undefined ? undefined : (value.hints === null ? null : (value.hints as Array<any>).map(PropertyValueToJSON)),
        'image': ImageSettingsToJSON(value.image),
        'watch': WatchSettingsToJSON(value.watch),
        'eTag': value.eTag,
    };
}

