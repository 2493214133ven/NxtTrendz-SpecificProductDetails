// Write your code here

import Cookies from 'js-cookie'
import {Link} from 'react-router-dom'
import Loader from 'react-loader-spinner'
import {BsPlusSquare, BsDashSquare} from 'react-icons/bs'

import {Component} from 'react'
import Header from '../Header'
import SimilarProductItem from '../SimilarProductItem'
import './index.css'

const apiStatusContainer = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  in_progress: 'INPROGRESS',
}

class ProductItemDetails extends Component {
  state = {
    productItemDetails: {},
    similarProductsList: [],
    quantity: 1,
    apiStatus: apiStatusContainer.initial,
  }

  componentDidMount() {
    this.getProductDetailList()
  }

  UpdateSnakeToCamel = data => ({
    availability: data.availability,
    brand: data.brand,
    description: data.description,
    id: data.id,
    imageUrl: data.image_url,
    price: data.price,
    rating: data.rating,
    title: data.title,
    totalReviews: data.total_reviews,
  })

  getProductDetailList = async () => {
    this.setState({apiStatus: apiStatusContainer.in_progress})
    const jwtToken = Cookies.get('jwt_token')
    const {match} = this.props
    const {params} = match
    const {id} = params
    const apiUrl = `https://apis.ccbp.in/products/${id}`
    const options = {
      headers: {
        authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)

    if (response.ok) {
      const data = await response.json()
      const updateData = this.UpdateSnakeToCamel(data)
      const SimilarData = data.similar_products.map(product => ({
        availability: product.availability,
        brand: product.brand,
        description: product.description,
        id: product.id,
        imageUrl: product.image_url,
        price: product.price,
        rating: product.rating,
        style: product.style,
        title: product.title,
        totalReviews: product.total_reviews,
      }))

      this.setState({
        productItemDetails: updateData,
        similarProductsList: SimilarData,
        apiStatus: apiStatusContainer.success,
      })
    } else {
      this.setState({
        apiStatus: apiStatusContainer.failure,
      })
    }
  }

  onClickIncrease = () => {
    this.setState(prevState => ({quantity: prevState.quantity + 1}))
  }

  onClickDecrease = () => {
    const {quantity} = this.state
    if (quantity > 1) {
      this.setState(prevState => ({quantity: prevState.quantity - 1}))
    }
  }

  renderProductItemDetail = () => {
    const {productItemDetails, quantity, similarProductsList} = this.state
    const {
      availability,
      brand,
      description,
      imageUrl,
      price,
      rating,
      title,
      totalReviews,
    } = productItemDetails
    return (
      <div className="product-similar-item-container">
        <div className="product-detail-container">
          <img className="p-image-url" src={imageUrl} alt="product" />
          <div className="price-title-etc-container">
            <h1 className="title-item">{title}</h1>
            <p className="price-details">Rs {price}/-</p>
            <div className="rating-star-reviews-container">
              <div className="rating-star-card">
                <p className="rate">{rating}</p>
                <img
                  className="star-imgs"
                  src="https://assets.ccbp.in/frontend/react-js/star-img.png "
                  alt="star"
                />
              </div>
              <p className="reviews-details">{totalReviews} Reviews</p>
            </div>
            <p className="script">{description}</p>
            <p className="brand-stock">
              <span className="span-ele">Available: </span>
              {availability}
            </p>
            <p className="brand-stock">
              <span className="span-ele">Brand: </span>
              {brand}
            </p>
            <hr className="line" />
            <div className="button-elements-card">
              <button
                onClick={this.onClickIncrease}
                className="buttons-increase-decrease"
                data-testid="plus"
                type="button"
              >
                <BsPlusSquare className="square" />
              </button>
              <p className="quantity">{quantity}</p>
              <button
                onClick={this.onClickDecrease}
                className="buttons-increase-decrease"
                data-testid="minus"
                type="button"
              >
                <BsDashSquare className="square" />
              </button>
            </div>
            <button className="add-to-cart" type="button">
              ADD TO CART
            </button>
          </div>
        </div>
        <h1 className="similar-product-name">Similar Products</h1>
        <ul className="similar-products-card-container">
          {similarProductsList.map(product => (
            <SimilarProductItem key={product.id} similarities={product} />
          ))}
        </ul>
      </div>
    )
  }

  renderFailure = () => (
    <>
      <img
        className="error-view"
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
        alt="failure view"
      />
      <h1 className="product-not-found">Product Not Found</h1>
      <Link to="/products">
        <button className="back-to-continue" type="button">
          Continue Shopping
        </button>
      </Link>
    </>
  )

  renderLoader = () => (
    <div data-testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height={80} width={80} />
    </div>
  )

  renderApiStatus = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusContainer.success:
        return this.renderProductItemDetail()
      case apiStatusContainer.failure:
        return this.renderFailure()
      case apiStatusContainer.in_progress:
        return this.renderLoader()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        <div className="product-product-not-found-similar-item-container">
          {this.renderApiStatus()}
        </div>
      </>
    )
  }
}
export default ProductItemDetails
