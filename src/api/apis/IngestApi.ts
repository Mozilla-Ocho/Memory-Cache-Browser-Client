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
} from '../models/index';
import {
    HTTPValidationErrorFromJSON,
    HTTPValidationErrorToJSON,
} from '../models/index';

export interface IngestProjectFilesApiV1IngestProjectFilesPostRequest {
    projectId: number;
}

/**
 * 
 */
export class IngestApi extends runtime.BaseAPI {

    /**
     * Ingest Project Files
     */
    async ingestProjectFilesApiV1IngestProjectFilesPostRaw(requestParameters: IngestProjectFilesApiV1IngestProjectFilesPostRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<any>> {
        if (requestParameters.projectId === null || requestParameters.projectId === undefined) {
            throw new runtime.RequiredError('projectId','Required parameter requestParameters.projectId was null or undefined when calling ingestProjectFilesApiV1IngestProjectFilesPost.');
        }

        const queryParameters: any = {};

        if (requestParameters.projectId !== undefined) {
            queryParameters['project_id'] = requestParameters.projectId;
        }

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/api/v1/ingest_project_files`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        if (this.isJsonMime(response.headers.get('content-type'))) {
            return new runtime.JSONApiResponse<any>(response);
        } else {
            return new runtime.TextApiResponse(response) as any;
        }
    }

    /**
     * Ingest Project Files
     */
    async ingestProjectFilesApiV1IngestProjectFilesPost(requestParameters: IngestProjectFilesApiV1IngestProjectFilesPostRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<any> {
        const response = await this.ingestProjectFilesApiV1IngestProjectFilesPostRaw(requestParameters, initOverrides);
        return await response.value();
    }

}
