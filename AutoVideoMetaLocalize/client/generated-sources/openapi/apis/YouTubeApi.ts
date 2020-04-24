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


import * as runtime from '../runtime';
import {
    Channel,
    ChannelFromJSON,
    ChannelToJSON,
} from '../models';

/**
 * no description
 */
export class YouTubeApi extends runtime.BaseAPI {

    /**
     */
    async apiYouTubeInstantiateServiceGetRaw(): Promise<runtime.ApiResponse<Array<Channel>>> {
        const queryParameters: runtime.HTTPQuery = {};

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/api/YouTube/InstantiateService`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        });

        return new runtime.JSONApiResponse(response, (jsonValue) => jsonValue.map(ChannelFromJSON));
    }

    /**
     */
    async apiYouTubeInstantiateServiceGet(): Promise<Array<Channel>> {
        const response = await this.apiYouTubeInstantiateServiceGetRaw();
        return await response.value();
    }

}
