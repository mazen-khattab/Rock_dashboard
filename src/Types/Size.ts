export interface Size {
  id: string;
  name: string;
  sortOrder: number;
  isActive: boolean;
}

export type SizeFormData = {
  name: string;
  sortOrder: number;
  isActive: boolean;
};

export const MOCK_SIZES: Size[] = [
  { id: "1", name: "XS", sortOrder: 1, isActive: true },
  { id: "2", name: "S", sortOrder: 2, isActive: true },
  { id: "3", name: "M", sortOrder: 3, isActive: true },
  { id: "4", name: "L", sortOrder: 4, isActive: true },
  { id: "5", name: "XL", sortOrder: 5, isActive: true },
  { id: "6", name: "XXL", sortOrder: 6, isActive: false },
];
