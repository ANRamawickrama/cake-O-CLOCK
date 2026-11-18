import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import LogoutIcon from "@mui/icons-material/Logout";
import CakeOutlinedIcon from "@mui/icons-material/CakeOutlined";
import api, { apiErrorMessage } from "../services/api";
import CakeImage from "../component/CakeImage";
import useCustomerSession from "../hooks/useCustomerSession";
import { formatPrice } from "../helpers/site";
import "../styles/MyOrdersPage.css";

const formatDate = (value) => {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const orderTotal = (order) =>
  order.totalPrice || (order.cakePrice || 0) * (order.quantity || 1) || 0;

const STATUS_STEPS = ["Pending", "Confirmed", "Baking", "Ready", "Completed"];

const statusStep = (status) => {
  const index = STATUS_STEPS.indexOf(status);
  return index === -1 ? 0 : index;
};

export default function MyOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { isSignedIn, customer, signOut } = useCustomerSession();

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await api.get("/api/customer/orders");
      setOrders(data || []);
    } catch (err) {
      setError(apiErrorMessage(err, "Failed to load your orders."));
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isSignedIn) {
      navigate("/account", { replace: true });
      return;
    }
    fetchOrders();
  }, [isSignedIn, navigate, fetchOrders]);

  const activeOrders = useMemo(
    () => orders.filter((order) => order.status !== "Completed" && order.status !== "Cancelled"),
    [orders]
  );

  const pastOrders = useMemo(
    () => orders.filter((order) => order.status === "Completed" || order.status === "Cancelled"),
    [orders]
  );

  const handleSignOut = () => {
    signOut();
    navigate("/", { replace: true });
  };

  const renderOrder = (order) => {
    const currentStep = statusStep(order.status);
    const isCancelled = order.status === "Cancelled";
    const isCompleted = order.status === "Completed";

    return (
      <article key={order._id} className="myOrderCard">
        <div className="myOrderMedia">
          {order.cakeImage ? (
            <CakeImage src={order.cakeImage} alt={order.cakeName} />
          ) : (
            <span className="myOrderNoImage">
              <CakeOutlinedIcon fontSize="small" />
            </span>
          )}
        </div>

        <div className="myOrderBody">
          <div className="myOrderTop">
            <div>
              <p className="myOrderRef">
                Order #{String(order._id).slice(-6).toUpperCase()}
              </p>
              <h3 className="myOrderTitle">{order.cakeName}</h3>
            </div>
            <span className={`myOrderStatus myOrderStatus--${order.status}`}>
              {order.status}
            </span>
          </div>

          <dl className="myOrderMeta">
            <div>
              <dt>Placed</dt>
              <dd>{formatDate(order.createdAt)}</dd>
            </div>
            <div>
              <dt>Delivery</dt>
              <dd>{formatDate(order.deliveryDate)}</dd>
            </div>
            <div>
              <dt>Weight</dt>
              <dd>{order.weight ? `${order.weight} kg` : "—"}</dd>
            </div>
            <div>
              <dt>Qty</dt>
              <dd>{order.quantity || 1}</dd>
            </div>
            <div>
              <dt>Total</dt>
              <dd>{formatPrice(orderTotal(order))}</dd>
            </div>
          </dl>

          {!isCancelled && !isCompleted && (
            <div className="myOrderProgress" aria-label={`Status: ${order.status}`}>
              {STATUS_STEPS.map((step, index) => (
                <span
                  key={step}
                  className={`myOrderStep ${index <= currentStep ? "isDone" : ""} ${
                    index === currentStep ? "isCurrent" : ""
                  }`}
                >
                  <span className="myOrderStepDot" aria-hidden="true" />
                  {step}
                </span>
              ))}
            </div>
          )}

          {order.description && (
            <p className="myOrderNotes">Notes: {order.description}</p>
          )}
        </div>
      </article>
    );
  };

  return (
    <div className="myOrdersPage">
      <div className="container">
        <header className="myOrdersHeader">
          <div>
            <p className="eyebrow">Your account</p>
            <h1 className="myOrdersTitle">My orders</h1>
            <p className="myOrdersSub">
              {customer
                ? `Hi ${customer.name}, here is every order you have placed with us.`
                : "Here is every order you have placed with us."}
            </p>
          </div>
          <div className="myOrdersHeaderActions">
            <Link to="/menu" className="btn btn-primary">
              Order again
              <ArrowForwardIcon fontSize="small" />
            </Link>
            <button type="button" className="btn btn-outline" onClick={handleSignOut}>
              <LogoutIcon fontSize="small" />
              Sign out
            </button>
          </div>
        </header>

        {error && <div className="alert alert-error myOrdersAlert">{error}</div>}

        {loading ? (
          <div className="myOrdersList">
            {[0, 1, 2].map((index) => (
              <div key={index} className="myOrdersSkeleton" />
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="myOrdersEmpty">
            <h2>No orders yet</h2>
            <p>
              When you place an order it will show up here with its live status,
              so you always know when your cake is ready.
            </p>
            <Link to="/menu" className="btn btn-primary">
              Browse the menu
              <ArrowForwardIcon fontSize="small" />
            </Link>
          </div>
        ) : (
          <>
            {activeOrders.length > 0 && (
              <section className="myOrdersSection">
                <h2 className="myOrdersSectionTitle">
                  <LocalShippingIcon fontSize="small" />
                  In progress
                </h2>
                <div className="myOrdersList">{activeOrders.map(renderOrder)}</div>
              </section>
            )}

            {pastOrders.length > 0 && (
              <section className="myOrdersSection">
                <h2 className="myOrdersSectionTitle">Past orders</h2>
                <div className="myOrdersList">{pastOrders.map(renderOrder)}</div>
              </section>
            )}
          </>
        )}
      </div>
    </div>
  );
}
