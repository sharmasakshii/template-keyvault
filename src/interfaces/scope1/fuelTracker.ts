export interface FuelDataItem {
    producType: {
        name: string;
    };
    getDataValue: (key: string) => number;
}

export type TypeNumStr = number | string | undefined | null;