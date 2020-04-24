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
    LocalizedProperty,
    LocalizedPropertyFromJSON,
    LocalizedPropertyFromJSONTyped,
    LocalizedPropertyToJSON,
} from './';

/**
 * 
 * @export
 * @interface ImageSettings
 */
export interface ImageSettings {
    /**
     * 
     * @type {LocalizedProperty}
     * @memberof ImageSettings
     */
    backgroundImageUrl?: LocalizedProperty;
    /**
     * 
     * @type {string}
     * @memberof ImageSettings
     */
    bannerExternalUrl?: string | null;
    /**
     * 
     * @type {string}
     * @memberof ImageSettings
     */
    bannerImageUrl?: string | null;
    /**
     * 
     * @type {string}
     * @memberof ImageSettings
     */
    bannerMobileExtraHdImageUrl?: string | null;
    /**
     * 
     * @type {string}
     * @memberof ImageSettings
     */
    bannerMobileHdImageUrl?: string | null;
    /**
     * 
     * @type {string}
     * @memberof ImageSettings
     */
    bannerMobileImageUrl?: string | null;
    /**
     * 
     * @type {string}
     * @memberof ImageSettings
     */
    bannerMobileLowImageUrl?: string | null;
    /**
     * 
     * @type {string}
     * @memberof ImageSettings
     */
    bannerMobileMediumHdImageUrl?: string | null;
    /**
     * 
     * @type {string}
     * @memberof ImageSettings
     */
    bannerTabletExtraHdImageUrl?: string | null;
    /**
     * 
     * @type {string}
     * @memberof ImageSettings
     */
    bannerTabletHdImageUrl?: string | null;
    /**
     * 
     * @type {string}
     * @memberof ImageSettings
     */
    bannerTabletImageUrl?: string | null;
    /**
     * 
     * @type {string}
     * @memberof ImageSettings
     */
    bannerTabletLowImageUrl?: string | null;
    /**
     * 
     * @type {string}
     * @memberof ImageSettings
     */
    bannerTvHighImageUrl?: string | null;
    /**
     * 
     * @type {string}
     * @memberof ImageSettings
     */
    bannerTvImageUrl?: string | null;
    /**
     * 
     * @type {string}
     * @memberof ImageSettings
     */
    bannerTvLowImageUrl?: string | null;
    /**
     * 
     * @type {string}
     * @memberof ImageSettings
     */
    bannerTvMediumImageUrl?: string | null;
    /**
     * 
     * @type {LocalizedProperty}
     * @memberof ImageSettings
     */
    largeBrandedBannerImageImapScript?: LocalizedProperty;
    /**
     * 
     * @type {LocalizedProperty}
     * @memberof ImageSettings
     */
    largeBrandedBannerImageUrl?: LocalizedProperty;
    /**
     * 
     * @type {LocalizedProperty}
     * @memberof ImageSettings
     */
    smallBrandedBannerImageImapScript?: LocalizedProperty;
    /**
     * 
     * @type {LocalizedProperty}
     * @memberof ImageSettings
     */
    smallBrandedBannerImageUrl?: LocalizedProperty;
    /**
     * 
     * @type {string}
     * @memberof ImageSettings
     */
    trackingImageUrl?: string | null;
    /**
     * 
     * @type {string}
     * @memberof ImageSettings
     */
    watchIconImageUrl?: string | null;
    /**
     * 
     * @type {string}
     * @memberof ImageSettings
     */
    eTag?: string | null;
}

export function ImageSettingsFromJSON(json: any): ImageSettings {
    return ImageSettingsFromJSONTyped(json, false);
}

export function ImageSettingsFromJSONTyped(json: any, ignoreDiscriminator: boolean): ImageSettings {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'backgroundImageUrl': !exists(json, 'backgroundImageUrl') ? undefined : LocalizedPropertyFromJSON(json['backgroundImageUrl']),
        'bannerExternalUrl': !exists(json, 'bannerExternalUrl') ? undefined : json['bannerExternalUrl'],
        'bannerImageUrl': !exists(json, 'bannerImageUrl') ? undefined : json['bannerImageUrl'],
        'bannerMobileExtraHdImageUrl': !exists(json, 'bannerMobileExtraHdImageUrl') ? undefined : json['bannerMobileExtraHdImageUrl'],
        'bannerMobileHdImageUrl': !exists(json, 'bannerMobileHdImageUrl') ? undefined : json['bannerMobileHdImageUrl'],
        'bannerMobileImageUrl': !exists(json, 'bannerMobileImageUrl') ? undefined : json['bannerMobileImageUrl'],
        'bannerMobileLowImageUrl': !exists(json, 'bannerMobileLowImageUrl') ? undefined : json['bannerMobileLowImageUrl'],
        'bannerMobileMediumHdImageUrl': !exists(json, 'bannerMobileMediumHdImageUrl') ? undefined : json['bannerMobileMediumHdImageUrl'],
        'bannerTabletExtraHdImageUrl': !exists(json, 'bannerTabletExtraHdImageUrl') ? undefined : json['bannerTabletExtraHdImageUrl'],
        'bannerTabletHdImageUrl': !exists(json, 'bannerTabletHdImageUrl') ? undefined : json['bannerTabletHdImageUrl'],
        'bannerTabletImageUrl': !exists(json, 'bannerTabletImageUrl') ? undefined : json['bannerTabletImageUrl'],
        'bannerTabletLowImageUrl': !exists(json, 'bannerTabletLowImageUrl') ? undefined : json['bannerTabletLowImageUrl'],
        'bannerTvHighImageUrl': !exists(json, 'bannerTvHighImageUrl') ? undefined : json['bannerTvHighImageUrl'],
        'bannerTvImageUrl': !exists(json, 'bannerTvImageUrl') ? undefined : json['bannerTvImageUrl'],
        'bannerTvLowImageUrl': !exists(json, 'bannerTvLowImageUrl') ? undefined : json['bannerTvLowImageUrl'],
        'bannerTvMediumImageUrl': !exists(json, 'bannerTvMediumImageUrl') ? undefined : json['bannerTvMediumImageUrl'],
        'largeBrandedBannerImageImapScript': !exists(json, 'largeBrandedBannerImageImapScript') ? undefined : LocalizedPropertyFromJSON(json['largeBrandedBannerImageImapScript']),
        'largeBrandedBannerImageUrl': !exists(json, 'largeBrandedBannerImageUrl') ? undefined : LocalizedPropertyFromJSON(json['largeBrandedBannerImageUrl']),
        'smallBrandedBannerImageImapScript': !exists(json, 'smallBrandedBannerImageImapScript') ? undefined : LocalizedPropertyFromJSON(json['smallBrandedBannerImageImapScript']),
        'smallBrandedBannerImageUrl': !exists(json, 'smallBrandedBannerImageUrl') ? undefined : LocalizedPropertyFromJSON(json['smallBrandedBannerImageUrl']),
        'trackingImageUrl': !exists(json, 'trackingImageUrl') ? undefined : json['trackingImageUrl'],
        'watchIconImageUrl': !exists(json, 'watchIconImageUrl') ? undefined : json['watchIconImageUrl'],
        'eTag': !exists(json, 'eTag') ? undefined : json['eTag'],
    };
}

export function ImageSettingsToJSON(value?: ImageSettings | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'backgroundImageUrl': LocalizedPropertyToJSON(value.backgroundImageUrl),
        'bannerExternalUrl': value.bannerExternalUrl,
        'bannerImageUrl': value.bannerImageUrl,
        'bannerMobileExtraHdImageUrl': value.bannerMobileExtraHdImageUrl,
        'bannerMobileHdImageUrl': value.bannerMobileHdImageUrl,
        'bannerMobileImageUrl': value.bannerMobileImageUrl,
        'bannerMobileLowImageUrl': value.bannerMobileLowImageUrl,
        'bannerMobileMediumHdImageUrl': value.bannerMobileMediumHdImageUrl,
        'bannerTabletExtraHdImageUrl': value.bannerTabletExtraHdImageUrl,
        'bannerTabletHdImageUrl': value.bannerTabletHdImageUrl,
        'bannerTabletImageUrl': value.bannerTabletImageUrl,
        'bannerTabletLowImageUrl': value.bannerTabletLowImageUrl,
        'bannerTvHighImageUrl': value.bannerTvHighImageUrl,
        'bannerTvImageUrl': value.bannerTvImageUrl,
        'bannerTvLowImageUrl': value.bannerTvLowImageUrl,
        'bannerTvMediumImageUrl': value.bannerTvMediumImageUrl,
        'largeBrandedBannerImageImapScript': LocalizedPropertyToJSON(value.largeBrandedBannerImageImapScript),
        'largeBrandedBannerImageUrl': LocalizedPropertyToJSON(value.largeBrandedBannerImageUrl),
        'smallBrandedBannerImageImapScript': LocalizedPropertyToJSON(value.smallBrandedBannerImageImapScript),
        'smallBrandedBannerImageUrl': LocalizedPropertyToJSON(value.smallBrandedBannerImageUrl),
        'trackingImageUrl': value.trackingImageUrl,
        'watchIconImageUrl': value.watchIconImageUrl,
        'eTag': value.eTag,
    };
}


