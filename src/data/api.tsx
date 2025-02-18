export interface AgencyDTO {
    name: string;
    slug: string;
    short_name: string;
}

export interface AgenciesResponse {
    agencies: AgencyDTO[];
}