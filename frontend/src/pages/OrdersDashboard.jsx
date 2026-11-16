import { useCallback, useEffect, useMemo, useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import VisibilityIcon from "@mui/icons-material/Visibility";
import PhoneIcon from "@mui/icons-material/Phone";
import api, { apiErrorMessage } from "../services/api";
import CakeImage from "../component/CakeImage";
import { formatPrice } from "../helpers/site";
import "../styles/OrdersDashboard.css";

const STATUSES = [
  "Pending",
  "Confirmed",
  "Baking",
  "Ready",
  "Completed",
  "Cancelled",
];

const formatDate = (value) => {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

// Legacy orders may not carry a price at all, and older rows store the unit
// price only - fall back to unit price multiplied by the quantity.
const orderTotal = (order) =>
  order.totalPrice || (order.cakePrice || 0) * (order.quantity || 1) || 0;

const formatOrderTotal = (order) => {
  const total = orderTotal(order);
  return total > 0 ? formatPrice(total) : "Price on request";
};

export default function OrdersDashboard() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [statusFilter, setStatusFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await api.get("/api/orders");
      setOrders(data || []);
    } catch (err) {
      setError(apiErrorMessage(err, "Failed to load orders."));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  useEffect(() => {
    document.body.style.overflow = selectedOrder ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [selectedOrder]);

  const counts = useMemo(() => {
    const result = { All: orders.length };
    STATUSES.forEach((status) => {
      result[status] = orders.filter((order) => order.status === status).length;
    });
    return result;
  }, [orders]);

  const visibleOrders = useMemo(() => {
    const term = search.trim().toLowerCase();

    return orders.filter((order) => {
      const matchesStatus =
        statusFilter === "All" || order.status === statusFilter;
      const matchesSearch =
        !term ||
        order.customerName?.toLowerCase().includes(term) ||
        order.customerPhone?.includes(term) ||
        order.cakeName?.toLowerCase().includes(term) ||
        order.location?.toLowerCase().includes(term);
      return matchesStatus && matchesSearch;
    });
  }, [orders, statusFilter, search]);

  const handleStatusChange = async (orderId, status) => {
    setUpdatingId(orderId);
    try {
      const { data } = await api.patch(`/api/orders/${orderId}/status`, { status });
      setOrders((current) =>
        current.map((order) => (order._id === orderId ? data.order : order))
      );
      setSelectedOrder((current) =>
        current && current._id === orderId ? data.order : current
      );
    } catch (err) {
      setError(apiErrorMessage(err, "Failed to update the order status."));
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (orderId) => {
    if (!window.confirm("Delete this order permanently?")) return;

    try {
      await api.delete(`/api/orders/${orderId}`);
      setOrders((current) => current.filter((order) => order._id !== orderId));
      setSelectedOrder(null);
    } catch (err) {
      setError(apiErrorMessage(err, "Failed to delete the order."));
    }
  };

  const revenue = orders
    .filter((order) => order.status !== "Cancelled")
    .reduce((sum, order) => sum + orderTotal(order), 0);

  return (
    <div className="ordersPage">
      <div className="container">
        <header className="ordersHeader">
          <div>
            <p className="eyebrow">Order management</p>
            <h1 className="ordersTitle">Customer orders</h1>
            <p className="ordersSub">
              Move each order through your kitchen workflow and keep customers
              in the loop.
            </p>
          </div>
          <div className="ordersSummary">
            <div className="ordersSummaryItem">
              <strong>{orders.length}</strong>
              <span>Orders</span>
            </div>
            <div className="ordersSummaryItem">
              <strong>{counts.Pending || 0}</strong>
              <span>Pending</span>
            </div>
            <div className="ordersSummaryItem">
              <strong>{formatPrice(revenue)}</strong>
              <span>Revenue</span>
            </div>
          </div>
        </header>

        {error && <div className="alert alert-error ordersAlert">{error}</div>}

        <div className="ordersToolbar">
          <div className="ordersTabs" role="tablist" aria-label="Order status">
            {["All", ...STATUSES].map((status) => (
              <button
                key={status}
                type="button"
                role="tab"
                aria-selected={statusFilter === status}
                className={`ordersTab ${statusFilter === status ? "isActive" : ""}`}
                onClick={() => setStatusFilter(status)}
              >
                {status}
                <span className="ordersTabCount">{counts[status] || 0}</span>
              </button>
            ))}
          </div>

          <div className="ordersSearch">
            <SearchIcon fontSize="small" />
            <label className="srOnly" htmlFor="orders-search">
              Search orders
            </label>
            <input
              id="orders-search"
              type="search"
              placeholder="Search name, phone or cake..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <div className="ordersList">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="ordersSkeleton" />
            ))}
          </div>
        ) : visibleOrders.length === 0 ? (
          <div className="ordersEmpty">
            <h2>No orders here</h2>
            <p>
              {orders.length === 0
                ? "Customer orders will appear here as soon as they come in."
                : "No orders match this filter. Try another status or search term."}
            </p>
          </div>
        ) : (
          <div className="ordersList">
            {visibleOrders.map((order) => (
              <article key={order._id} className="orderCard">
                <div className="orderCardMedia">
                  {order.cakeImage ? (
                    <CakeImage src={order.cakeImage} alt={order.cakeName} />
                  ) : (
                    <span className="orderCardNoImage">No image</span>
                  )}
                </div>

                <div className="orderCardMain">
                  <div className="orderCardTop">
                    <div>
                      <h3 className="orderCardCustomer">{order.customerName}</h3>
                      <p className="orderCardCake">{order.cakeName}</p>
                    </div>
                    <span className={`orderStatus orderStatus--${order.status}`}>
                      {order.status}
                    </span>
                  </div>

                  <dl className="orderCardMeta">
                    <div>
                      <dt>Placed</dt>
                      <dd>{formatDate(order.createdAt)}</dd>
                    </div>
                    <div>
                      <dt>Delivery</dt>
                      <dd>{formatDate(order.deliveryDate)}</dd>
                    </div>
                    <div>
                      <dt>Qty</dt>
                      <dd>{order.quantity || 1}</dd>
                    </div>
                    <div>
                      <dt>Weight</dt>
                      <dd>{order.weight || "—"}</dd>
                    </div>
                  </dl>

                  <p className="orderCardLocation">{order.location}</p>
                </div>

                <div className="orderCardSide">
                  <span className="orderCardTotal">
                    {formatOrderTotal(order)}
                  </span>

                  <label className="srOnly" htmlFor={`status-${order._id}`}>
                    Update status for {order.customerName}
                  </label>
                  <select
                    id={`status-${order._id}`}
                    className="orderStatusSelect"
                    value={order.status}
                    disabled={updatingId === order._id}
                    onChange={(event) =>
                      handleStatusChange(order._id, event.target.value)
                    }
                  >
                    {STATUSES.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>

                  <div className="orderCardButtons">
                    <a
                      href={`tel:${order.customerPhone}`}
                      className="btn btn-outline btn-sm"
                    >
                      <PhoneIcon fontSize="small" />
                      Call
                    </a>
                    <button
                      type="button"
                      className="btn btn-outline btn-sm"
                      onClick={() => setSelectedOrder(order)}
                    >
                      <VisibilityIcon fontSize="small" />
                      View
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      {selectedOrder && (
        <div
          className="ordersModalOverlay"
          role="dialog"
          aria-modal="true"
          aria-label="Order details"
          onClick={() => setSelectedOrder(null)}
        >
          <div
            className="ordersModal"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="ordersModalClose"
              onClick={() => setSelectedOrder(null)}
              aria-label="Close"
            >
              <CloseIcon />
            </button>

            <div className="ordersModalGrid">
              <div className="ordersModalMedia">
                {selectedOrder.cakeImage ? (
                  <CakeImage src={selectedOrder.cakeImage} alt={selectedOrder.cakeName} />
                ) : (
                  <div className="orderCardNoImage">No image available</div>
                )}
              </div>

              <div className="ordersModalBody">
                <p className="ordersModalEyebrow">Order details</p>
                <h2 className="ordersModalTitle">{selectedOrder.cakeName}</h2>
                <p className="ordersModalCustomer">
                  {selectedOrder.customerName} · {selectedOrder.customerPhone}
                </p>

                <dl className="ordersModalMeta">
                  <div>
                    <dt>Cake price</dt>
                    <dd>{formatPrice(selectedOrder.cakePrice)}</dd>
                  </div>
                  <div>
                    <dt>Quantity</dt>
                    <dd>{selectedOrder.quantity || 1}</dd>
                  </div>
                  <div>
                    <dt>Total</dt>
                    <dd>{formatOrderTotal(selectedOrder)}</dd>
                  </div>
                  <div>
                    <dt>Weight</dt>
                    <dd>{selectedOrder.weight || "—"}</dd>
                  </div>
                  <div>
                    <dt>Order date</dt>
                    <dd>{formatDate(selectedOrder.createdAt)}</dd>
                  </div>
                  <div>
                    <dt>Delivery date</dt>
                    <dd>{formatDate(selectedOrder.deliveryDate)}</dd>
                  </div>
                  <div>
                    <dt>Email</dt>
                    <dd>{selectedOrder.customerEmail || "—"}</dd>
                  </div>
                  <div>
                    <dt>Status</dt>
                    <dd>{selectedOrder.status}</dd>
                  </div>
                </dl>

                <div className="ordersModalSection">
                  <h3>Delivery location</h3>
                  <p>{selectedOrder.location}</p>
                </div>

                <div className="ordersModalSection">
                  <h3>Customer notes</h3>
                  <p>{selectedOrder.description || "No notes added."}</p>
                </div>

                <div className="ordersModalActions">
                  <a
                    href={`tel:${selectedOrder.customerPhone}`}
                    className="btn btn-primary"
                  >
                    <PhoneIcon fontSize="small" />
                    Call customer
                  </a>
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={() => handleDelete(selectedOrder._id)}
                  >
                    <DeleteOutlineIcon fontSize="small" />
                    Delete order
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
