/* tslint:disable */
/* eslint-disable */
/**
 * Memory Cache Hub
 * A backend server for Memory Cache.
 *
 * The version of the OpenAPI document: 0.1.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */


import * as runtime from '../runtime';
import type {
  HTTPValidationError,
  RagAskRequest,
} from '../models/index';
import {
    HTTPValidationErrorFromJSON,
    HTTPValidationErrorToJSON,
    RagAskRequestFromJSON,
    RagAskRequestToJSON,
} from '../models/index';

export interface RagAskApiV1RagAskPostRequest {
    ragAskRequest: RagAskRequest;
}

export interface VectorDbQueryApiV1VectorDbQueryPostRequest {
    ragAskRequest: RagAskRequest;
}

/**
 * 
 */
export class RagApi extends runtime.BaseAPI {

    /**
     * Rag Ask
     */
    async ragAskApiV1RagAskPostRaw(requestParameters: RagAskApiV1RagAskPostRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<any>> {
        if (requestParameters.ragAskRequest === null || requestParameters.ragAskRequest === undefined) {
            throw new runtime.RequiredError('ragAskRequest','Required parameter requestParameters.ragAskRequest was null or undefined when calling ragAskApiV1RagAskPost.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        const response = await this.request({
            path: `/api/v1/rag_ask`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: RagAskRequestToJSON(requestParameters.ragAskRequest),
        }, initOverrides);

        if (this.isJsonMime(response.headers.get('content-type'))) {
            return new runtime.JSONApiResponse<any>(response);
        } else {
            return new runtime.TextApiResponse(response) as any;
        }
    }

    /**
     * Rag Ask
     */
    async ragAskApiV1RagAskPost(requestParameters: RagAskApiV1RagAskPostRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<any> {
        const response = await this.ragAskApiV1RagAskPostRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Vector Db Query
     */
    async vectorDbQueryApiV1VectorDbQueryPostRaw(requestParameters: VectorDbQueryApiV1VectorDbQueryPostRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<any>> {
        if (requestParameters.ragAskRequest === null || requestParameters.ragAskRequest === undefined) {
            throw new runtime.RequiredError('ragAskRequest','Required parameter requestParameters.ragAskRequest was null or undefined when calling vectorDbQueryApiV1VectorDbQueryPost.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        const response = await this.request({
            path: `/api/v1/vector_db_query`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: RagAskRequestToJSON(requestParameters.ragAskRequest),
        }, initOverrides);

        if (this.isJsonMime(response.headers.get('content-type'))) {
            return new runtime.JSONApiResponse<any>(response);
        } else {
            return new runtime.TextApiResponse(response) as any;
        }
    }

    /**
     * Vector Db Query
     */
    async vectorDbQueryApiV1VectorDbQueryPost(requestParameters: VectorDbQueryApiV1VectorDbQueryPostRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<any> {
        const response = await this.vectorDbQueryApiV1VectorDbQueryPostRaw(requestParameters, initOverrides);
        return await response.value();
    }

}
