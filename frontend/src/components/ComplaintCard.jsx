import { useEffect, useState } from "react";
import { StatusBadge } from "./StatusBadge";
import { fmtDateTime } from "../lib/format";

export function ComplaintCard({ complaint, showStudent, resolvedBy, actions, children }) {
  const images =
    Array.isArray(complaint?.images) && complaint.images.length
      ? complaint.images
      : complaint?.image
        ? [complaint.image]
        : [];

  const [lightbox, setLightbox] = useState(false);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e) => {
      if (e.key === "Escape") setLightbox(false);
      if (images.length > 1 && e.key === "ArrowRight") {
        setIndex((i) => (i + 1) % images.length);
      }
      if (images.length > 1 && e.key === "ArrowLeft") {
        setIndex((i) => (i + images.length - 1) % images.length);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [lightbox, images.length]);

  const open = () => {
    setIndex(0);
    setLightbox(true);
  };

  return (
    <article className="complaint">
      <div className="complaint__row">
        <div className="complaint__main">
          <div className="complaint__head">
            <div>
              <div className="complaint__title">
                {complaint?.category || "Complaint"}
                <span style={{ color: "var(--color-stone-400)" }}> · </span>
                <span style={{ fontSize: "16px" }}>{complaint?.roomNo}</span>
              </div>
              <div className="complaint__meta">
                <span className="tag">
                  {complaint?.hostel}, Wing {complaint?.wing}
                </span>
                {showStudent && complaint?.student ? (
                  <>
                    <span className="chip">{complaint.student.regNo}</span>
                    <span className="body-sm">{complaint.student.name}</span>
                  </>
                ) : null}
                <span className="body-sm">{fmtDateTime(complaint?.createdAt)}</span>
              </div>
            </div>
          </div>

          {complaint?.description ? (
            <p className="complaint__desc">{complaint.description}</p>
          ) : null}

          {images.length ? (
            <a
              className="complaint__image-link"
              href={images[0]}
              onClick={(e) => {
                e.preventDefault();
                open();
              }}
            >
              {images.length > 1
                ? `View ${images.length} photos →`
                : "View attached photo →"}
            </a>
          ) : null}

          {complaint?.status === "completed" && complaint?.resolutionNote ? (
            <div className="complaint__resolved">
              Resolution — {complaint.resolutionNote}
            </div>
          ) : null}

          {complaint?.status === "completed" && resolvedBy ? (
            <div className="complaint__resolved">
              Handled by{resolvedBy.staffName ? ` ${resolvedBy.staffName}` : ""}
              {resolvedBy.staffEmail
                ? ` (${resolvedBy.staffEmail})`
                : resolvedBy.email
                  ? ` (${resolvedBy.email})`
                  : ""}
              {complaint.resolvedAt ? ` · ${fmtDateTime(complaint.resolvedAt)}` : ""}
            </div>
          ) : null}

          {actions ? (
            <div className="complaint__foot">
              <span className="body-sm">{complaint?.student?.email || ""}</span>
              {actions}
            </div>
          ) : null}

          {children ? <div className="mt-16">{children}</div> : null}
        </div>

        <div className="complaint__badge">
          <StatusBadge status={complaint?.status} />
        </div>
      </div>

      {lightbox && images.length ? (
        <div className="lightbox" onClick={() => setLightbox(false)}>
          {images.length > 1 ? (
            <>
              <button
                type="button"
                className="lightbox__nav lightbox__nav--prev"
                aria-label="Previous photo"
                onClick={(e) => {
                  e.stopPropagation();
                  setIndex((i) => (i + images.length - 1) % images.length);
                }}
              >
                ‹
              </button>
              <button
                type="button"
                className="lightbox__nav lightbox__nav--next"
                aria-label="Next photo"
                onClick={(e) => {
                  e.stopPropagation();
                  setIndex((i) => (i + 1) % images.length);
                }}
              >
                ›
              </button>
            </>
          ) : null}
          <button
            type="button"
            className="lightbox__close"
            aria-label="Close photo"
            onClick={() => setLightbox(false)}
          >
            ✕
          </button>
          <img
            src={images[index]}
            alt={`Complaint photo ${index + 1}`}
            onClick={(e) => e.stopPropagation()}
          />
          {images.length > 1 ? (
            <span className="lightbox__count">
              {index + 1} / {images.length}
            </span>
          ) : null}
        </div>
      ) : null}
    </article>
  );
}