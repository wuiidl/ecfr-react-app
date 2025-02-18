export interface Agency {
    name: string;
    shortName: string;
    slug: string;
}

export interface DateCounts {
    [date: string]: number;
}
export interface InputData {
    dates: DateCounts;
}

export interface AgencyDTO {
    name: string;
    slug: string;
    short_name: string;
}

export interface AgenciesResponse {
    agencies: AgencyDTO[];
}

export interface RecentChange {
    key: string;
    title: string;
    subtitle: string;
    chapter: string;
    hierarchy: Hierarchy;
    section: string;
    link: string;
}

export interface Hierarchy {
    title: string;
    chapter: string;
    part: string;
}

export interface SearchResults {
    results: Array<{
        starts_on: string;
        ends_on: string;
        type: string;
        hierarchy: {
            title: string;
            subtitle: string;
            chapter: string;
            subchapter: string;
            part: string;
            subpart: string;
            subject_group: string;
            section: string;
            appendix: string;
        };
        hierarchy_headings: {
            title: string;
            subtitle: string;
            chapter: string;
            subchapter: string;
            part: string;
            subpart: string;
            subject_group: string;
            section: string;
            appendix: string;
        };
        headings: {
            title: string;
            subtitle: string;
            chapter: string;
            subchapter: string;
            part: string;
            subpart: string;
            subject_group: string;
            section: string;
            appendix: string;
        };
        full_text_excerpt: string;
        score: number;
        structure_index: number;
        reserved: boolean;
        removed: boolean;
        change_types: string[];
    }>;
}

