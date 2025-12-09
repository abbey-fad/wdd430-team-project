import Link from 'next/link';

interface ProductCardProps {
    id: string;
    name: string;
    price: number;
    image: string;
    category: string;
    rating?: number;
    numReviews?: number;
}

export default function ProductCard({ id, name, price, image, category, rating = 0, numReviews = 0 }: ProductCardProps) {
    return (
        <Link href={`/products/${id}`} className="product-card">
            <div className="product-image-container">
                {image ? (
                    <img src={image} alt={name} className="product-image" />
                ) : (
                    <div className="placeholder-image">No Image</div>
                )}
            </div>
            <div className="product-info">
                <h3 className="product-title">{name}</h3>
                <p className="product-category-sm">{category}</p>
                <div className="product-rating-row">
                    <span className="rating-star">★</span>
                    <span className="rating-text">{rating.toFixed(1)}</span>
                    <span className="review-count">({numReviews})</span>
                </div>
                <p className="product-price">${price.toFixed(2)}</p>
            </div>
        </Link>
    );
}
