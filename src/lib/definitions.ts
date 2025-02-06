export interface RuTrackerRawFileEntryCore {
    id: number;
    category: string;
    description: string;
    size: number;
    seeds: number;
    leeches: number;
    downloads: number;
    date: Date;
}