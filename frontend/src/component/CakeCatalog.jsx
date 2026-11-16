import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import StarIcon from "@mui/icons-material/Star";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import api, { apiErrorMessage } from "../services/api";
import { getCategory } from "../helpers/cakeCatalog";
import { formatPrice } from "../helpers/site";
import CakeImage from "./CakeImage";
import ReviewSection from "./ReviewSection";
import "../styles/CakeCatalog.css";

const SORTS = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
  { value: "name", label: "Name: A to Z" },
];

function CakeCatalog({ categoryId }) {
  const category = getCategory(categoryId);
  const navigate = useNavigate();

  const [remoteCakes, setRemoteCakes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("featured");
  const [selected, setSelected] = useState(null);

  const fetchCakes = useCallback(async () => {
    setLoading(true);
    setLoadError("");
    try {
      const { data } = await api.get(
        `/api/cakes/type/${encodeURIComponent(category.type)}`
      );
      setRemoteCakes(data || []);
    } catch (error) {
      setRemoteCakes([]);
      setLoadError(apiErrorMessage(error, "Could not load the latest cakes."));
    } finally {
      setLoading(false);
    }
  }, [category.type]);

  useEffect(() => {
    fetchCakes();
  }, [fetchCakes]);

  useEffect(() => {
    setSelected(null);
    setSearch("");
    setSort("featured");
  }, [categoryId]);

  useEffect(() => {
    document.body.style.overflow = selected ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [selected]);

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === "Escape") setSelected(null);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const cakes = useMemo(() => {
    const staticCakes = (category.staticCakes || []).map((cake, index) => ({
      id: `static-${category.id}-${index}`,
      name: `${category.shortTitle} Design ${String(index + 1).padStart(2, "0")}`,
      type: category.type,
      price: cake.price ?? category.priceFrom,
      image: cake.image,
      description: "",
      source: "studio",
    }));

    const liveCakes = remoteCakes.map((cake) => ({
      id: cake._id,
      name: cake.name || cake.type,
      type: cake.type,
      price: cake.price,
      image: cake.image,
      description: cake.description || "",
      source: "live",
    }));

    const merged = [...liveCakes, ...staticCakes];

    const term = search.trim().toLowerCase();
    const filtered = term
      ? merged.filter(
          (cake) =>
            cake.name.toLowerCase().includes(term) ||
            cake.type.toLowerCase().includes(term) ||
            (cake.description || "").toLowerCase().includes(term)
        )
      : merged;

    switch (sort) {
      case "price-asc":
        return [...filtered].sort((a, b) => a.price - b.price);
      case "price-desc":
        return [...filtered].sort((a, b) => b.price - a.price);
      case "name":
        return [...filtered].sort((a, b) => a.name.localeCompare(b.name));
      default:
        return filtered;
    }
  }, [category, remoteCakes, search, sort]);

  const goToOrder = (cake) => {
    navigate("/order", {
      state: {
        cake: {
          _id: cake.id,
          name: cake.name,
          type: cake.type,
          price: cake.price,
          image: cake.image,
          description: cake.description,
        },
      },
    });
  };

  if (!category) return null;

  return (
    <div className="catalogPage">
      <section className="catalogHero" style={{ "--accent": category.accent }}>
        <div className="container catalogHeroInner">
          <nav className="catalogBreadcrumb" aria-label="Breadcrumb">
            <Link to="/">Home</Link>
            <span aria-hidden="true">/</span>
            <Link to="/menu">Menu</Link>
            <span aria-hidden="true">/</span>
            <span className="catalogBreadcrumbCurrent">{category.title}</span>
          </nav>

          <h1 className="catalogTitle">{category.title}</h1>
          <p className="catalogTagline">{category.tagline}</p>
          <p className="catalogText">{category.description}</p>

          <div className="catalogFacts">
            <span className="catalogFact">
              <strong>{cakes.length}</strong> designs available
            </span>
            <span className="catalogFactDivider" aria-hidden="true" />
            <span className="catalogFact">
              From <strong>{formatPrice(category.priceFrom)}</strong>
            </span>
          </div>
        </div>
      </section>

      <section className="section section--tight section--paper">
        <div className="container">
          <div className="catalogToolbar">
            <div className="catalogSearch">
              <SearchIcon fontSize="small" />
              <label className="srOnly" htmlFor="catalog-search">
                Search designs
              </label>
              <input
                id="catalog-search"
                type="search"
                placeholder="Search designs..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </div>

            <div className="catalogSort">
              <label htmlFor="catalog-sort">Sort by</label>
              <select
                id="catalog-sort"
                value={sort}
                onChange={(event) => setSort(event.target.value)}
              >
                {SORTS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <span className="catalogCount">
              {cakes.length} {cakes.length === 1 ? "design" : "designs"}
            </span>
          </div>

          {loadError && (
            <p className="alert alert-error catalogAlert">{loadError}</p>
          )}

          {loading ? (
            <div className="catalogGrid">
              {Array.from({ length: 8 }).map((_, index) => (
                <div key={index} className="catalogSkeleton" />
              ))}
            </div>
          ) : cakes.length === 0 ? (
            <div className="catalogEmpty">
              <h2>No designs match your search</h2>
              <p>
                Try a different keyword, or send us your idea and we will design
                it for you.
              </p>
              <div className="catalogEmptyActions">
                {search && (
                  <button
                    type="button"
                    className="btn btn-outline"
                    onClick={() => setSearch("")}
                  >
                    Clear search
                  </button>
                )}
                <Link to="/contact" className="btn btn-primary">
                  Request a custom design
                  <ArrowForwardIcon fontSize="small" />
                </Link>
              </div>
            </div>
          ) : (
            <div className="catalogGrid">
              {cakes.map((cake, index) => (
                <article
                  key={cake.id}
                  className="catalogCard"
                  style={{ "--delay": `${Math.min(index, 11) * 45}ms` }}
                >
                  <button
                    type="button"
                    className="catalogCardMedia"
                    onClick={() => setSelected(cake)}
                    aria-label={`View ${cake.name}`}
                  >
                    <CakeImage src={cake.image} alt={cake.name} loading="lazy" />
                    {cake.source === "live" && (
                      <span className="catalogCardBadge">New</span>
                    )}
                    <span className="catalogCardZoom">
                      <SearchIcon fontSize="small" />
                      View details
                    </span>
                  </button>

                  <div className="catalogCardBody">
                    <h2 className="catalogCardTitle">{cake.name}</h2>
                    {cake.description && (
                      <p className="catalogCardText">{cake.description}</p>
                    )}
                    <div className="catalogCardFoot">
                      <span className="catalogCardPrice">
                        {formatPrice(cake.price)}
                      </span>
                      <button
                        type="button"
                        className="catalogCardOrder"
                        onClick={() => goToOrder(cake)}
                      >
                        <ShoppingCartIcon fontSize="small" />
                        Order
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {selected && (
        <div
          className="catalogModalOverlay"
          role="dialog"
          aria-modal="true"
          aria-label={`${selected.name} details`}
          onClick={() => setSelected(null)}
        >
          <div
            className="catalogModal"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="catalogModalClose"
              onClick={() => setSelected(null)}
              aria-label="Close details"
            >
              <CloseIcon />
            </button>

            <div className="catalogModalGrid">
              <div className="catalogModalMedia">
                <CakeImage src={selected.image} alt={selected.name} />
              </div>

              <div className="catalogModalInfo">
                <p className="catalogModalEyebrow">{selected.type}</p>
                <h2 className="catalogModalTitle">{selected.name}</h2>

                {selected.description && (
                  <p className="catalogModalText">{selected.description}</p>
                )}

                <p className="catalogModalPrice">
                  {formatPrice(selected.price)}
                </p>

                <div className="catalogModalActions">
                  <button
                    type="button"
                    className="btn btn-primary btn-lg"
                    onClick={() => goToOrder(selected)}
                  >
                    <ShoppingCartIcon fontSize="small" />
                    Order this design
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline btn-lg"
                    onClick={() => setSelected(null)}
                  >
                    <ArrowBackIcon fontSize="small" />
                    Back to designs
                  </button>
                </div>

                <div className="catalogModalMeta">
                  <span>
                    <StarIcon fontSize="small" />
                    Customisable size &amp; message
                  </span>
                  <span>
                    <ArrowForwardIcon fontSize="small" />
                    Island-wide delivery
                  </span>
                </div>

                <div className="catalogModalReviews">
                  <ReviewSection cakeName={selected.type} />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CakeCatalog;
