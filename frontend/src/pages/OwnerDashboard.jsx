import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import EditNoteIcon from "@mui/icons-material/EditNote";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import LogoutIcon from "@mui/icons-material/Logout";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import MarkEmailReadIcon from "@mui/icons-material/MarkEmailRead";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import api, { apiErrorMessage } from "../services/api";
import { formatPrice } from "../helpers/site";
import "../styles/OwnerDashboard.css";

// Older orders store the unit price only, so fall back to price x quantity.
const formatOrderTotal = (order) => {
  const total =
    order.totalPrice || (order.cakePrice || 0) * (order.quantity || 1) || 0;
  return total > 0 ? formatPrice(total) : "On request";
};

export default function OwnerDashboard() {
  const navigate = useNavigate();
  const [ownerInfo, setOwnerInfo] = useState(null);
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    completedOrders: 0,
    totalRevenue: 0,
  });
  const [cakeCount, setCakeCount] = useState(0);
  const [newEnquiries, setNewEnquiries] = useState(0);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    const verifyToken = async () => {
      try {
        const { data } = await api.get("/api/owner/verify");
        setOwnerInfo(data.owner);
      } catch (err) {
        localStorage.removeItem("token");
        navigate("/login");
      }
    };

    verifyToken();
  }, [token, navigate]);

  const loadDashboard = useCallback(async () => {
    setLoading(true);
    try {
      const [statsRes, cakesRes, ordersRes, enquiriesRes] = await Promise.all([
        api.get("/api/orders/stats"),
        api.get("/api/cakes/owner/my-cakes"),
        api.get("/api/orders"),
        api.get("/api/contact"),
      ]);

      setStats(statsRes.data || {});
      setCakeCount((cakesRes.data || []).length);
      setRecentOrders((ordersRes.data || []).slice(0, 5));
      setNewEnquiries(
        (enquiriesRes.data || []).filter((item) => item.status === "New").length
      );
      setError("");
    } catch (err) {
      setError(apiErrorMessage(err, "Failed to load dashboard data."));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (token) loadDashboard();
  }, [token, loadDashboard]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const cards = [
    {
      to: "/update",
      Icon: AddPhotoAlternateIcon,
      title: "Upload new cakes",
      text: "Add a fresh design to your menu in a couple of minutes.",
      tone: "rose",
    },
    {
      to: "/manage",
      Icon: EditNoteIcon,
      title: "Manage your menu",
      text: "Rename, reprice and remove designs you no longer offer.",
      tone: "gold",
    },
    {
      to: "/orders",
      Icon: ReceiptLongIcon,
      title: "Customer orders",
      text: "Track every order from Pending through to Completed.",
      tone: "plum",
    },
  ];

  return (
    <div className="ownerPage">
      <div className="container">
        <header className="ownerHeader">
          <div>
            <p className="eyebrow">Owner dashboard</p>
            <h1 className="ownerTitle">
              Welcome back{ownerInfo ? `, ${ownerInfo.email}` : ""}
            </h1>
            <p className="ownerSub">
              Here is how your bakery is doing today.
            </p>
          </div>
          <button type="button" className="btn btn-outline" onClick={handleLogout}>
            <LogoutIcon fontSize="small" />
            Log out
          </button>
        </header>

        {error && <div className="alert alert-error ownerAlert">{error}</div>}

        <div className="ownerStats">
          <div className="ownerStat ownerStat--accent">
            <span className="ownerStatIcon">
              <ReceiptLongIcon fontSize="small" />
            </span>
            <strong>{loading ? "—" : stats.totalOrders ?? 0}</strong>
            <span>Total orders</span>
          </div>
          <div className="ownerStat">
            <span className="ownerStatIcon">
              <LocalShippingIcon fontSize="small" />
            </span>
            <strong>{loading ? "—" : stats.pendingOrders ?? 0}</strong>
            <span>In progress</span>
          </div>
          <div className="ownerStat">
            <span className="ownerStatIcon">
              <TrendingUpIcon fontSize="small" />
            </span>
            <strong>{loading ? "—" : formatPrice(stats.totalRevenue ?? 0)}</strong>
            <span>Total revenue</span>
          </div>
          <div className="ownerStat">
            <span className="ownerStatIcon">
              <EditNoteIcon fontSize="small" />
            </span>
            <strong>{loading ? "—" : cakeCount}</strong>
            <span>Cakes on your menu</span>
          </div>
          <div className="ownerStat">
            <span className="ownerStatIcon">
              <MarkEmailReadIcon fontSize="small" />
            </span>
            <strong>{loading ? "—" : newEnquiries}</strong>
            <span>New enquiries</span>
          </div>
        </div>

        <div className="ownerCards">
          {cards.map(({ to, Icon, title, text, tone }) => (
            <Link key={to} to={to} className={`ownerCard ownerCard--${tone}`}>
              <span className="ownerCardIcon">
                <Icon fontSize="small" />
              </span>
              <h2 className="ownerCardTitle">{title}</h2>
              <p className="ownerCardText">{text}</p>
              <span className="ownerCardLink">
                Open <ArrowForwardIcon fontSize="small" />
              </span>
            </Link>
          ))}
        </div>

        <section className="ownerRecent">
          <div className="ownerRecentHead">
            <h2 className="ownerRecentTitle">Recent orders</h2>
            <Link to="/orders" className="ownerRecentLink">
              View all
              <ArrowForwardIcon fontSize="small" />
            </Link>
          </div>

          {loading ? (
            <div className="ownerOrderList" aria-busy="true" aria-label="Loading orders">
              {[0, 1, 2, 3].map((index) => (
                <div key={index} className="ownerOrderRow ownerOrderRow--skeleton">
                  <span className="ownerOrderCustomer">
                    <span className="ownerSkeletonLine ownerSkeletonLine--wide" />
                    <span className="ownerSkeletonLine" />
                  </span>
                  <span className="ownerSkeletonPill" />
                  <span className="ownerSkeletonLine" />
                </div>
              ))}
            </div>
          ) : recentOrders.length === 0 ? (
            <p className="ownerEmpty">No orders yet — they will appear here.</p>
          ) : (
            <div className="ownerOrderList">
              {recentOrders.map((order) => (
                <Link
                  key={order._id}
                  to="/orders"
                  className="ownerOrderRow"
                >
                  <span className="ownerOrderCustomer">
                    <strong>{order.customerName}</strong>
                    <span>{order.cakeName}</span>
                  </span>
                  <span className={`ownerOrderStatus ownerOrderStatus--${order.status}`}>
                    {order.status}
                  </span>
                  <span className="ownerOrderTotal">
                    {formatOrderTotal(order)}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
