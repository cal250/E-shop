export interface Review {
    id: number
    rating: number
    comment?: string | null
    productId: number
    userId: number
    createdAt: Date
    updatedAt: Date
}

export interface CreateReviewInput {
    rating: number
    comment?: string
    productId: number
    userId: number
}

export interface UpdateReviewInput {
    id: number
    rating?: number
    comment?: string
}

export interface ReviewFilters {
    productId?: number
    userId?: number
    minRating?: number
    maxRating?: number
    sortBy?: 'rating' | 'createdAt'
    sortOrder?: 'asc' | 'desc'
    page?: number
    limit?: number
}

export interface ReviewResponse {
    id: number
    rating: number
    comment?: string
    productId: number
    userId: number
    createdAt: Date
    updatedAt: Date
    user: {
        id: number
        username: string
        avatar?: string
    }
}