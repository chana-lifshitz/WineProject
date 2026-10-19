export class ReviewModel {
  clientId!: number;
  clientName!: string;
  comment!: string;
}

export class WineModel {
  id!: number;
  name!: string;
  category!: string;
  description!: string;
  price!: number;
  totalSold!: number;
  reviews!: ReviewModel[];  // לשנות כאן למערך של אובייקטים מסוג ReviewModel
  image!: string;
}
