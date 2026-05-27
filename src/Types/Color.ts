export type ColorId = string;

export interface Color {
  id: ColorId;
  name: string;
  hex: string;
  isActive: boolean;
  [key: string]: unknown;
}

export interface ColorLookupItem {
  id?: ColorId;
  value?: ColorId;
  label?: string;
  name?: string;
  [key: string]: unknown;
}

export type ColorListResponse =
  | Color[]
  | {
      data?: Color[];
      items?: Color[];
    };

export interface PaginatedColors {
  items: Color[];
  totalPages: number;
  totalCount: number;
  pageNumber: number;
}

export type ColorDetailsResponse = Color | { data?: Color };

export type ColorLookupResponse =
  | ColorLookupItem[]
  | {
      data?: ColorLookupItem[];
      items?: ColorLookupItem[];
    };

export type ColorContextValue = {
  colors: Color[];
  selectedColor: Color | null;
  colorLookup: ColorLookupItem[];
  totalColorCount: number;
  loading: boolean;
  error: string | null;
  getAllColors: () => Promise<PaginatedColors>;
  getColorById: (colorId: ColorId) => Promise<Color>;
  getColorLookup: () => Promise<ColorLookupItem[]>;
};

export type ColorFormData = {
  name: string;
  hex: string;
  isActive: boolean;
};

export const MOCK_COLORS: Color[] = [
  { id: "1", name: "Black", hex: "#000000", isActive: true },
  { id: "2", name: "White", hex: "#FFFFFF", isActive: true },
  { id: "3", name: "Gold", hex: "#D4AF37", isActive: true },
  { id: "4", name: "Silver", hex: "#C0C0C0", isActive: true },
  { id: "5", name: "Rose Gold", hex: "#B76E79", isActive: true },
  { id: "6", name: "Emerald", hex: "#50C878", isActive: false },
  { id: "7", name: "Ruby", hex: "#E0115F", isActive: true },
  { id: "8", name: "Sapphire", hex: "#0F52BA", isActive: false },
];
