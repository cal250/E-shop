export type ProductAttributeType = 'color' | 'size';

export interface BaseProductAttribute {
    type: ProductAttributeType;
    value: string;
}

export interface ProductAttribute extends BaseProductAttribute {
    id: number;
    createdAt: Date;
    deletedAt: Date | null;
}

export type CreateProductAttributeDTO = BaseProductAttribute;

export type UpdateProductAttributeDTO = Partial<BaseProductAttribute>;

export interface ProductAttributeFilters {
    type?: ProductAttributeType;
    value?: string;
}

// Response types
export interface ProductAttributeResponse extends ProductAttribute {
    skusSize?: number[]; 
    skusColor?: number[]; 
}

// For bulk operations
export type BulkCreateProductAttributeDTO = CreateProductAttributeDTO[];
export type BulkUpdateProductAttributeDTO = {
    id: number;
    data: UpdateProductAttributeDTO;
}[];