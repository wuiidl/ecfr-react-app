import axios from "axios";

const baseUrl = 'https://www.ecfr.gov';
export const agenciesApi = '/api/admin/v1/agencies.json';
export const chartDataApi = '/api/search/v1/counts/daily';
export const recentChangesApi = '/api/search/v1/results';

export const configureAxios = () => {
    axios.defaults.baseURL = baseUrl;
    axios.defaults.headers.get.Accept = 'application/json'
    axios.defaults.headers.get["Content-Type"] = 'application/x-www-form-urlencoded';
}

export const defaultDateRange = {
    date: '2024-12-31',
    last_modified_after: '2020-12-31'
}
