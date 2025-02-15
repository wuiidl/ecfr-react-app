import { AxiosRequestConfig } from "axios";

const baseUrl = 'https://www.ecfr.gov';
export const agenciesApi = '/api/admin/v1/agencies.json';
export const chartDataApi = '/api/search/v1/counts/daily';
export const recentChangesApi = '/api/search/v1/results';

export const axiosConfig: AxiosRequestConfig = {
    baseURL: baseUrl,
    headers: {
        'accept': 'application/json'
    }
};

export const defaultDateRange = {
    date: '2024-12-31',
    last_modified_after: '2020-12-31'
}
