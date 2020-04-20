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
    Claim,
    ClaimFromJSON,
    ClaimToJSON,
} from '../models';

/**
 * no description
 */
export class AccountApi extends runtime.BaseAPI {

    /**
     */
    async apiAccountGetRaw(): Promise<runtime.ApiResponse<Array<Claim>>> {
        const queryParameters: runtime.HTTPQuery = {};

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/api/Account`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        });

        return new runtime.JSONApiResponse(response, (jsonValue) => jsonValue.map(ClaimFromJSON));
    }

    /**
     */
    async apiAccountGet(): Promise<Array<Claim>> {
        const response = await this.apiAccountGetRaw();
        return await response.value();
    }

}
