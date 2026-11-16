import React, { useEffect, useState } from "react";
import { resolveImageUrl } from "../helpers/imageUrl";
import placeholderImage from "../assets/cake-placeholder.svg";

/**
 * Image renderer for cake artwork.
 *
 * Handles the three things every cake image needs:
 *  1. Resolves backend `/uploads/...` paths to the API host.
 *  2. Falls back to a branded placeholder when the file is missing.
 *  3. Prevents a broken image icon if the fallback itself cannot load.
 */
export default function CakeImage({ src, alt = "", className = "", loading = "lazy", ...rest }) {
  const resolved = resolveImageUrl(src);
  const [source, setSource] = useState(resolved || placeholderImage);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setSource(resolved || placeholderImage);
    setFailed(false);
  }, [resolved]);

  const handleError = () => {
    if (failed) return;
    setFailed(true);
    setSource(placeholderImage);
  };

  return (
    <img
      src={source}
      alt={alt}
      className={className}
      loading={loading}
      onError={handleError}
      {...rest}
    />
  );
}
