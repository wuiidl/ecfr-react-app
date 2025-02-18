import axios from "axios";

const baseUrl = 'https://www.ecfr.gov';
export const agenciesApi = baseUrl + '/api/admin/v1/agencies.json';
export const chartDataApi = baseUrl + '/api/search/v1/counts/daily';
export const recentChangesApi = baseUrl + '/api/search/v1/results';

const customRequestTransformer = (data, headers) => {
    if (data) console.log(data);
    console.log(headers)
    return data;
};

const errorDebugResponseTransformer = (data, headers, status) => {
    // Log basic response information
    console.log('Error Response Status:', status);
    console.log('Error Response Headers:', headers);
    // If there's data, log it
    if (data) {
        console.log('Error Response Data:', data);

        // Further debugging: Check if it's a JSON error response
        try {
            const jsonData = JSON.parse(data);
            console.log('Parsed Error JSON:', jsonData);

            // If there's an error message or code in the JSON, log it specifically
            if (jsonData.message) console.log('Error Message:', jsonData.message);
            if (jsonData.error) console.log('Error Code:', jsonData.error);
            if (jsonData.errors) console.log('Validation Errors:', jsonData.errors);
        } catch (e) {
            // If it's not JSON, log the data as is
            console.log('Non-JSON Error Data:', data);
        }
    } else {
        console.log('No Response Data Received');
    }
    // Return the original data or modified data if needed
    return data;
};

export const configureAxios = () => {
    axios.defaults.baseURL = baseUrl;
    axios.defaults.headers.get.Accept = 'application/json'
    axios.defaults.headers.get["Content-Type"] = 'application/x-www-form-urlencoded';
    if (import.meta.env.PROD !== false) {
        axios.defaults.transformRequest = [customRequestTransformer];
        axios.interceptors.response.use(
            response => response, // For successful responses, do nothing special
            error => {
                if (error.response) {
                    // Only apply our transformer to responses that have a status code (i.e., server responded)
                    error.response.data = errorDebugResponseTransformer(
                        error.response.data,
                        error.response.headers,
                        error.response.status
                    );
                } else if (error.request) {
                    // The request was made but no response was received
                    console.log('Error: No response received');
                } else {
                    // Something happened in setting up the request that triggered an Error
                    console.log('Error:', error.message);
                }
                return Promise.reject(error);
            }
        );
    }
}

export const defaultDateRange = {
    date: '2024-12-31',
    last_modified_after: '2020-12-31'
}
