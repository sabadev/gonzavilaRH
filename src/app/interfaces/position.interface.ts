export interface Position {
  id?: number;
  name: string;
  parent_id?: number | null;
  area_id?: number | null;
}

export interface Area {
  id: number;
  name: string;
}
