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
  CreateProjectRequest,
  DeleteProjectRequest,
  HTTPValidationError,
  ListProjectsResponse,
} from '../models/index';
import {
    CreateProjectRequestFromJSON,
    CreateProjectRequestToJSON,
    DeleteProjectRequestFromJSON,
    DeleteProjectRequestToJSON,
    HTTPValidationErrorFromJSON,
    HTTPValidationErrorToJSON,
    ListProjectsResponseFromJSON,
    ListProjectsResponseToJSON,
} from '../models/index';

export interface CreateProjectApiV1CreateProjectPostRequest {
    createProjectRequest: CreateProjectRequest;
}

export interface CreateProjectDirectoryApiV1CreateProjectDirectoryPostRequest {
    projectId: number;
    path: string;
}

export interface DeleteProjectApiV1DeleteProjectDeleteRequest {
    deleteProjectRequest: DeleteProjectRequest;
}

export interface DeleteProjectDirectoryApiV1DeleteProjectDirectoryDeleteRequest {
    directoryId: number;
}

export interface ListProjectDirectoriesApiV1ListProjectDirectoriesGetRequest {
    projectId: number;
}

/**
 * 
 */
export class ProjectsApi extends runtime.BaseAPI {

    /**
     * Create Project
     */
    async createProjectApiV1CreateProjectPostRaw(requestParameters: CreateProjectApiV1CreateProjectPostRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ListProjectsResponse>> {
        if (requestParameters.createProjectRequest === null || requestParameters.createProjectRequest === undefined) {
            throw new runtime.RequiredError('createProjectRequest','Required parameter requestParameters.createProjectRequest was null or undefined when calling createProjectApiV1CreateProjectPost.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        const response = await this.request({
            path: `/api/v1/create_project`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: CreateProjectRequestToJSON(requestParameters.createProjectRequest),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ListProjectsResponseFromJSON(jsonValue));
    }

    /**
     * Create Project
     */
    async createProjectApiV1CreateProjectPost(requestParameters: CreateProjectApiV1CreateProjectPostRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ListProjectsResponse> {
        const response = await this.createProjectApiV1CreateProjectPostRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Create Project Directory
     */
    async createProjectDirectoryApiV1CreateProjectDirectoryPostRaw(requestParameters: CreateProjectDirectoryApiV1CreateProjectDirectoryPostRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<any>> {
        if (requestParameters.projectId === null || requestParameters.projectId === undefined) {
            throw new runtime.RequiredError('projectId','Required parameter requestParameters.projectId was null or undefined when calling createProjectDirectoryApiV1CreateProjectDirectoryPost.');
        }

        if (requestParameters.path === null || requestParameters.path === undefined) {
            throw new runtime.RequiredError('path','Required parameter requestParameters.path was null or undefined when calling createProjectDirectoryApiV1CreateProjectDirectoryPost.');
        }

        const queryParameters: any = {};

        if (requestParameters.projectId !== undefined) {
            queryParameters['project_id'] = requestParameters.projectId;
        }

        if (requestParameters.path !== undefined) {
            queryParameters['path'] = requestParameters.path;
        }

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/api/v1/create_project_directory`,
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
     * Create Project Directory
     */
    async createProjectDirectoryApiV1CreateProjectDirectoryPost(requestParameters: CreateProjectDirectoryApiV1CreateProjectDirectoryPostRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<any> {
        const response = await this.createProjectDirectoryApiV1CreateProjectDirectoryPostRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Delete Project
     */
    async deleteProjectApiV1DeleteProjectDeleteRaw(requestParameters: DeleteProjectApiV1DeleteProjectDeleteRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<any>> {
        if (requestParameters.deleteProjectRequest === null || requestParameters.deleteProjectRequest === undefined) {
            throw new runtime.RequiredError('deleteProjectRequest','Required parameter requestParameters.deleteProjectRequest was null or undefined when calling deleteProjectApiV1DeleteProjectDelete.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        const response = await this.request({
            path: `/api/v1/delete_project`,
            method: 'DELETE',
            headers: headerParameters,
            query: queryParameters,
            body: DeleteProjectRequestToJSON(requestParameters.deleteProjectRequest),
        }, initOverrides);

        if (this.isJsonMime(response.headers.get('content-type'))) {
            return new runtime.JSONApiResponse<any>(response);
        } else {
            return new runtime.TextApiResponse(response) as any;
        }
    }

    /**
     * Delete Project
     */
    async deleteProjectApiV1DeleteProjectDelete(requestParameters: DeleteProjectApiV1DeleteProjectDeleteRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<any> {
        const response = await this.deleteProjectApiV1DeleteProjectDeleteRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Delete Project Directory
     */
    async deleteProjectDirectoryApiV1DeleteProjectDirectoryDeleteRaw(requestParameters: DeleteProjectDirectoryApiV1DeleteProjectDirectoryDeleteRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<any>> {
        if (requestParameters.directoryId === null || requestParameters.directoryId === undefined) {
            throw new runtime.RequiredError('directoryId','Required parameter requestParameters.directoryId was null or undefined when calling deleteProjectDirectoryApiV1DeleteProjectDirectoryDelete.');
        }

        const queryParameters: any = {};

        if (requestParameters.directoryId !== undefined) {
            queryParameters['directory_id'] = requestParameters.directoryId;
        }

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/api/v1/delete_project_directory`,
            method: 'DELETE',
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
     * Delete Project Directory
     */
    async deleteProjectDirectoryApiV1DeleteProjectDirectoryDelete(requestParameters: DeleteProjectDirectoryApiV1DeleteProjectDirectoryDeleteRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<any> {
        const response = await this.deleteProjectDirectoryApiV1DeleteProjectDirectoryDeleteRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * List Project Directories
     */
    async listProjectDirectoriesApiV1ListProjectDirectoriesGetRaw(requestParameters: ListProjectDirectoriesApiV1ListProjectDirectoriesGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<any>> {
        if (requestParameters.projectId === null || requestParameters.projectId === undefined) {
            throw new runtime.RequiredError('projectId','Required parameter requestParameters.projectId was null or undefined when calling listProjectDirectoriesApiV1ListProjectDirectoriesGet.');
        }

        const queryParameters: any = {};

        if (requestParameters.projectId !== undefined) {
            queryParameters['project_id'] = requestParameters.projectId;
        }

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/api/v1/list_project_directories`,
            method: 'GET',
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
     * List Project Directories
     */
    async listProjectDirectoriesApiV1ListProjectDirectoriesGet(requestParameters: ListProjectDirectoriesApiV1ListProjectDirectoriesGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<any> {
        const response = await this.listProjectDirectoriesApiV1ListProjectDirectoriesGetRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * List Projects
     */
    async listProjectsApiV1ListProjectsGetRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ListProjectsResponse>> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/api/v1/list_projects`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ListProjectsResponseFromJSON(jsonValue));
    }

    /**
     * List Projects
     */
    async listProjectsApiV1ListProjectsGet(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ListProjectsResponse> {
        const response = await this.listProjectsApiV1ListProjectsGetRaw(initOverrides);
        return await response.value();
    }

}
