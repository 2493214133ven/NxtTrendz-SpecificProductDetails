// Write your code here
import './index.css'

const SimilarProductItem = props => {
  const {similarities} = props
  const {imageUrl, title, price, rating, brand} = similarities

  return (
    <li className="similar-product-card">
      <img
        className="similar-image-url"
        src={imageUrl}
        alt={`similar product ${title}`}
      />
      <h1 className="similar-title">{title}</h1>
      <p className="similar-brand">by {brand}</p>
      <div className="price-rating-start-cart-container">
        <p className="similar-price">Rs {price}/-</p>
        <div className="rating-start-cart-container">
          <p className="similar-rating">{rating}</p>
          <img
            className="similar-star-imgs"
            src="https://assets.ccbp.in/frontend/react-js/star-img.png "
            alt="star"
          />
        </div>
      </div>
    </li>
  )
}
export default SimilarProductItem
