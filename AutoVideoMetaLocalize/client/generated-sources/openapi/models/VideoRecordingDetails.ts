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
    GeoPoint,
    GeoPointFromJSON,
    GeoPointFromJSONTyped,
    GeoPointToJSON,
} from './';

/**
 * 
 * @export
 * @interface VideoRecordingDetails
 */
export interface VideoRecordingDetails {
    /**
     * 
     * @type {GeoPoint}
     * @memberof VideoRecordingDetails
     */
    location?: GeoPoint;
    /**
     * 
     * @type {string}
     * @memberof VideoRecordingDetails
     */
    locationDescription?: string | null;
    /**
     * 
     * @type {string}
     * @memberof VideoRecordingDetails
     */
    recordingDate?: string | null;
    /**
     * 
     * @type {string}
     * @memberof VideoRecordingDetails
     */
    eTag?: string | null;
}

export function VideoRecordingDetailsFromJSON(json: any): VideoRecordingDetails {
    return VideoRecordingDetailsFromJSONTyped(json, false);
}

export function VideoRecordingDetailsFromJSONTyped(json: any, ignoreDiscriminator: boolean): VideoRecordingDetails {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'location': !exists(json, 'location') ? undefined : GeoPointFromJSON(json['location']),
        'locationDescription': !exists(json, 'locationDescription') ? undefined : json['locationDescription'],
        'recordingDate': !exists(json, 'recordingDate') ? undefined : json['recordingDate'],
        'eTag': !exists(json, 'eTag') ? undefined : json['eTag'],
    };
}

export function VideoRecordingDetailsToJSON(value?: VideoRecordingDetails | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'location': GeoPointToJSON(value.location),
        'locationDescription': value.locationDescription,
        'recordingDate': value.recordingDate,
        'eTag': value.eTag,
    };
}


