export interface Review {
  id: string;
  rating: number;
  text: string;
  createdAt: string;
  user: {id:string, name: string, profilePic: string };
}



export interface ReviewState {
  reviews: Review[];
  loading: boolean;
  error: string | null;
  fetchReviews: (productId: string) => Promise<void>;
  addReview: (data: {
    userId: string;
    productId: string;
    rating: number;
    text: string;
  }) => Promise<void>;
}
