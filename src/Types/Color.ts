export type ColorId = number | string;

export interface Color {
  id: ColorId;
  name: string;
  hex: string;
  hexCode?: string;
  nameAr?: string;
  nameEn?: string;
  isActive: boolean;
  [key: string]: unknown;
}

export interface ColorFormData {
  name?: string;
  nameAr: string;
  nameEn: string;
  hex: string;
  hexCode?: string;
  isActive: boolean;
}

export interface ColorDetailsAdminDto {
  id?: number;
  nameAr: string;
  nameEn: string;
  hexCode: string;
  isActive: boolean;
}

export interface ColorLookupItem {
  id?: ColorId;
  value?: ColorId;
  label?: string;
  name?: string;
  hex?: string;
  hexCode?: string;
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

export type ColorDetailsResponse = Color | { data?: Color; [key: string]: unknown };

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
  createColor: (payload: ColorFormData) => Promise<Color>;
  updateColor: (colorId: ColorId, payload: ColorFormData) => Promise<Color>;
  deleteColor: (colorId: ColorId) => Promise<void>;
};

export const MOCK_COLORS: Color[] = [
  { id: 1, name: "Black", nameEn: "Black", nameAr: "أسود", hex: "#000000", isActive: true },
  { id: 2, name: "White", nameEn: "White", nameAr: "أبيض", hex: "#FFFFFF", isActive: true },
  { id: 3, name: "Gold", nameEn: "Gold", nameAr: "ذهبي", hex: "#D4AF37", isActive: true },
  { id: 4, name: "Silver", nameEn: "Silver", nameAr: "فضي", hex: "#C0C0C0", isActive: true },
  { id: 5, name: "Rose Gold", nameEn: "Rose Gold", nameAr: "ذهب وردي", hex: "#B76E79", isActive: true },
  { id: 6, name: "Emerald", nameEn: "Emerald", nameAr: "زمردي", hex: "#50C878", isActive: false },
  { id: 7, name: "Ruby", nameEn: "Ruby", nameAr: "ياقوتي", hex: "#E0115F", isActive: true },
  { id: 8, name: "Sapphire", nameEn: "Sapphire", nameAr: "ياقوت أزرق", hex: "#0F52BA", isActive: false },
];
