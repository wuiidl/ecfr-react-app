export interface Agency {
    name: string;
    shortName: string;
    slug: string;
}

export interface RecentChange {
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