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


import * as runtime from '../runtime';
import {
    AppChannelListRequest,
    AppChannelListRequestFromJSON,
    AppChannelListRequestToJSON,
    ChannelListResponse,
    ChannelListResponseFromJSON,
    ChannelListResponseToJSON,
} from '../models';

export interface ApiYouTubeChannelListGetRequest {
    appChannelListRequest: AppChannelListRequest;
}

/**
 * no description
 */
export class YouTubeChannelApi extends runtime.BaseAPI {

    /**
     */
    async apiYouTubeChannelListGetRaw(requestParameters: ApiYouTubeChannelListGetRequest): Promise<runtime.ApiResponse<ChannelListResponse>> {
        if (requestParameters.appChannelListRequest === null || requestParameters.appChannelListRequest === undefined) {
            throw new runtime.RequiredError('appChannelListRequest','Required parameter requestParameters.appChannelListRequest was null or undefined when calling apiYouTubeChannelListGet.');
        }

        const queryParameters: runtime.HTTPQuery = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        const response = await this.request({
            path: `/api/YouTubeChannel/List`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
            body: AppChannelListRequestToJSON(requestParameters.appChannelListRequest),
        });

        return new runtime.JSONApiResponse(response, (jsonValue) => ChannelListResponseFromJSON(jsonValue));
    }

    /**
     */
    async apiYouTubeChannelListGet(requestParameters: ApiYouTubeChannelListGetRequest): Promise<ChannelListResponse> {
        const response = await this.apiYouTubeChannelListGetRaw(requestParameters);
        return await response.value();
    }

}
