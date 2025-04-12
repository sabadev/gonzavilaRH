export interface Employee {
  id: string;
  name: string;
  last_name: string;
  second_last_name?: string;
  username?: string;
  position_name?: string;
  area?: string;
  activo: boolean;
  // Agrega más campos según necesites
}
