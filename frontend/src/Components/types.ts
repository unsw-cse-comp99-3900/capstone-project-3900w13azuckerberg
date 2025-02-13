export interface Point {
    latitude: number;
    longitude: number;
    intensity: number;
}

export type PointArray = [number, number, number];

export interface MapData {
	[date: string]: PointArray[];
}

export interface RegionData {
    [strain: string]: number;
}

export interface DateData {
    [state: string]: RegionData;
}

export interface GraphData {
    [date: string]: DateData;
}

export interface PieItem {
    id: string;
    label: string;
    value: number;
    color: string;
}

export interface DataPoint {
    x: string;
    y: number;
}

export interface LineItem {
    id: string;
    color: string;
    data: DataPoint[];
}

export interface Policy {
    startDate: string;
    endDate: string;
    policy: string;
}

export interface RData {
    numE: number;
    numI: number;
    numR: number;
    numS: number;
}

export interface DateSeirsData {
    [stateName: string]: RData;
}
  
export interface SeirsData {
    [date: string]: DateSeirsData;
}
  

export interface BarItem {
	statement: string;
	Infected: number;
	Recovered: number;
	Exposed: number;
}


export interface PolicyData {
    [state: string]: Policy;
  }