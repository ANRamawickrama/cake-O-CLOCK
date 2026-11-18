import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import api, { apiErrorMessage } from "../services/api";
import CakeImage from "../component/CakeImage";
import useCustomerSession from "../hooks/useCustomerSession";
import { formatPrice } from "../helpers/site";
import "../styles/OrderForm.css";

function OrderForm() {
  const location = useLocation();
  const navigate = useNavigate();
  const cake = location.state?.cake;
  const { customer } = useCustomerSession();

  const [userLocation, setUserLocation] = useState("");
  const [fullName, setFullName] = useState(customer?.name || "");
  const [contactNumber, setContactNumber] = useState(customer?.phone || "");
  const [description, setDescription] = useState("");
  const [weight, setWeight] = useState(
    cake?.weightKg ? String(cake.weightKg) : ""
  );
  const [deliveryDate, setDeliveryDate] = useState("");
  const [email, setEmail] = useState(customer?.email || "");
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [placedOrder, setPlacedOrder] = useState(null);

  const tomorrow = useMemo(() => {
    const date = new Date();
    date.setDate(date.getDate() + 1);
    return date.toISOString().split("T")[0];
  }, []);

  useEffect(() => {
    setDeliveryDate((current) => current || tomorrow);
  }, [tomorrow]);

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      setError("Location services are not supported by your browser.");
      return;
    }

    setError("");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation(
          `Lat: ${latitude.toFixed(4)}, Lng: ${longitude.toFixed(4)}`
        );
      },
      () => {
        setError(
          "We could not detect your location. Please type your delivery address instead."
        );
      }
    );
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!cake) {
      setError("Please pick a cake from the menu before placing an order.");
      return;
    }

    if (
      !fullName.trim() ||
      !contactNumber.trim() ||
      !userLocation.trim() ||
      !weight.trim() ||
      !deliveryDate
    ) {
      setError("Please fill in all the required fields.");
      return;
    }

    setLoading(true);

    try {
      const { data } = await api.post(
        "/api/orders",
        {
          customerName: fullName.trim(),
          customerEmail: email.trim(),
          customerPhone: contactNumber.trim(),
          cakeId: cake._id,
          cakeName: cake.type,
          cakeImage: cake.image || "",
          cakePrice: cake.price,
          quantity: Number(quantity),
          location: userLocation.trim(),
          description: description.trim(),
          weight: weight.trim(),
          deliveryDate,
        },
        { timeout: 20000, authScope: "customer" }
      );

      setPlacedOrder(data.order);
    } catch (err) {
      setError(apiErrorMessage(err, "Failed to place order. Please try again."));
    } finally {
      setLoading(false);
    }
  };

  if (placedOrder) {
    return (
      <div className="orderPage">
        <div className="container orderSuccessWrap">
          <div className="orderSuccess">
            <span className="orderSuccessIcon">
              <CheckCircleIcon fontSize="large" />
            </span>
            <h1 className="orderSuccessTitle">Order placed!</h1>
            <p className="orderSuccessText">
              Thanks {placedOrder.customerName} — we have your order for{" "}
              <strong>{placedOrder.cakeName}</strong>. We will call you on{" "}
              {placedOrder.customerPhone} to confirm the details.
            </p>

            <dl className="orderSuccessMeta">
              <div>
                <dt>Order reference</dt>
                <dd>#{String(placedOrder._id).slice(-6).toUpperCase()}</dd>
              </div>
              <div>
                <dt>Total</dt>
                <dd>
                  {formatPrice(placedOrder.totalPrice || placedOrder.cakePrice)}
                </dd>
              </div>
              <div>
                <dt>Delivery date</dt>
                <dd>
                  {new Date(placedOrder.deliveryDate).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </dd>
              </div>
            </dl>

            <div className="orderSuccessActions">
              <Link to="/menu" className="btn btn-primary">
                Browse more cakes
              </Link>
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => navigate("/")}
              >
                Back to home
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="orderPage">
      <div className="container orderLayout">
        <aside className="orderAside">
          {cake ? (
            <>
              <div className="orderCakeCard">
                <div className="orderCakeMedia">
                  <CakeImage src={cake.image} alt={cake.type} />
                </div>
                <div className="orderCakeBody">
                  <p className="orderCakeType">{cake.type}</p>
                  <h2 className="orderCakeTitle">{cake.type}</h2>
                  <p className="orderCakePrice">{formatPrice(cake.price)}</p>
                </div>
              </div>

              <Link to="/menu" className="orderBackLink">
                <ArrowBackIcon fontSize="small" />
                Choose a different design
              </Link>
            </>
          ) : (
            <div className="orderCakeCard orderCakeCard--empty">
              <h2 className="orderCakeTitle">No cake selected</h2>
              <p className="orderCakeText">
                Pick a design from our menu and it will appear here.
              </p>
              <Link to="/menu" className="btn btn-primary">
                Browse the menu
              </Link>
            </div>
          )}
        </aside>

        <div className="orderFormPanel">
          <header className="orderFormHead">
            <p className="eyebrow">Almost there</p>
            <h1 className="orderFormTitle">Order details</h1>
            <p className="orderFormSub">
              Tell us where to deliver and how you want it decorated.
            </p>
          </header>

          {error && <div className="alert alert-error orderAlert">{error}</div>}

          <form className="orderForm" onSubmit={handleSubmit}>
            <div className="orderFormGrid">
              <div className="field">
                <label htmlFor="order-name">Full name</label>
                <input
                  id="order-name"
                  type="text"
                  placeholder="Jane Perera"
                  value={fullName}
                  onChange={(event) => setFullName(event.target.value)}
                  required
                />
              </div>

              <div className="field">
                <label htmlFor="order-phone">Contact number</label>
                <input
                  id="order-phone"
                  type="tel"
                  placeholder="077 000 0000"
                  value={contactNumber}
                  onChange={(event) => setContactNumber(event.target.value)}
                  required
                />
              </div>
            </div>

            <div className="field">
              <label htmlFor="order-email">Email (optional)</label>
              <input
                id="order-email"
                type="email"
                placeholder="jane@email.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </div>

            <div className="field">
              <label htmlFor="order-location">Delivery address</label>
              <div className="orderLocationRow">
                <input
                  id="order-location"
                  type="text"
                  placeholder="House no, street, city"
                  value={userLocation}
                  onChange={(event) => setUserLocation(event.target.value)}
                  required
                />
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={handleGetLocation}
                >
                  <LocationOnIcon fontSize="small" />
                  Use my location
                </button>
              </div>
            </div>

            <div className="orderFormGrid">
              <div className="field">
                <label htmlFor="order-weight">Weight (kg)</label>
                <input
                  id="order-weight"
                  type="text"
                  placeholder="2"
                  value={weight}
                  onChange={(event) => setWeight(event.target.value)}
                  required
                />
                {cake?.weightKg > 0 && (
                  <span className="fieldHint">
                    This design is usually {cake.weightKg} kg — tell us if you
                    need a different size.
                  </span>
                )}
              </div>

              <div className="field">
                <label htmlFor="order-date">Delivery date</label>
                <input
                  id="order-date"
                  type="date"
                  min={tomorrow}
                  value={deliveryDate}
                  onChange={(event) => setDeliveryDate(event.target.value)}
                  required
                />
              </div>
            </div>

            <div className="field">
              <label>Quantity</label>
              <div className="orderQuantity">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  aria-label="Decrease quantity"
                >
                  −
                </button>
                <span>{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.min(50, q + 1))}
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
            </div>

            <div className="field">
              <label htmlFor="order-description">Design notes</label>
              <textarea
                id="order-description"
                placeholder="Colours, message on the cake, allergies, anything else we should know..."
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                rows="4"
              />
            </div>

            {cake && (
              <div className="orderTotal">
                <span>Total</span>
                <strong>{formatPrice(cake.price * quantity)}</strong>
              </div>
            )}

            <button
              type="submit"
              className="btn btn-primary btn-lg btn-block"
              disabled={loading}
            >
              {loading ? "Placing order..." : "Place order"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default OrderForm;
