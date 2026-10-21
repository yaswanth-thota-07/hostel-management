import { useEffect, useState, useCallback } from "react";
import { api } from "../api/client";
import { ComplaintCard } from "./ComplaintCard";
import { EmptyState } from "./EmptyState";
import { useToast } from "./Toast";

const TABS = [
  { key: "pending", label: "Pending" },
  { key: "today", label: "Today" },
  { key: "completed", label: "Completed" }
];

function ResolveForm({ complaint, base, token, onDone }) {
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const { toast } = useToast();

  const submit = async (e) => {
    e.preventDefault();
    if (!note.trim()) {
      toast("Add a short resolution note", "error");
      return;
    }
    setBusy(true);
    try {
      await api.patch(
        `${base}/complaints/${complaint._id}/complete`,
        { resolutionNote: note.trim() },
        token
      );
      toast("Complaint resolved");
      onDone();
    } catch (err) {
      toast(err.message, "error");
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} className="stack" style={{ flexBasis: "100%" }}>
      <textarea
        className="input"
        rows={2}
        placeholder="What was done? e.g. Updated the tap washer, water back by 6pm."
        value={note}
        onChange={(e) => setNote(e.target.value)}
        autoFocus
      />
      <div className="row">
        <button className="btn btn--primary btn--sm" disabled={busy}>
          {busy ? <span className="spinner" /> : null} Mark resolved
        </button>
        <button
          type="button"
          className="btn btn--ghost btn--sm"
          onClick={() => onDone()}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

export function ComplaintTriage({ base, token, showStudent = true, onChanged }) {
  const [tab, setTab] = useState("pending");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [resolvingId, setResolvingId] = useState(null);
  const { toast } = useToast();

  const load = useCallback(async () => {
    setLoading(true);
    setResolvingId(null);
    try {
      const res = await api.get(`${base}/complaints/${tab}`, token);
      setData(res.complaints || []);
    } catch (err) {
      toast(err.message, "error");
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [base, tab, token, toast]);

  useEffect(() => {
    load();
  }, [load]);

  const resolveDone = () => {
    setResolvingId(null);
    load();
    if (onChanged) onChanged();
  };

  const renderCard = (entry) => {
    let complaint = entry;
    let resolvedBy = null;

    if (tab === "completed") {
      complaint = entry.complaint;
      resolvedBy = entry.solvedBy || null;
    }

    const isPending = tab !== "completed";

    return (
      <ComplaintCard
        key={complaint._id}
        complaint={complaint}
        showStudent={showStudent}
        resolvedBy={resolvedBy}
        actions={
          isPending && resolvingId !== complaint._id ? (
            <button
              className="btn btn--primary btn--sm"
              onClick={() => setResolvingId(complaint._id)}
            >
              Resolve
            </button>
          ) : null
        }
      >
        {isPending && resolvingId === complaint._id ? (
          <ResolveForm
            complaint={complaint}
            base={base}
            token={token}
            onDone={resolveDone}
          />
        ) : null}
      </ComplaintCard>
    );
  };

  const count = (k) => {
    if (!data) return null;
    return Array.isArray(data) ? data.length : null;
  };

  return (
    <div>
      <div className="stacked-tabs">
        <div className="tabs">
          {TABS.map((t) => (
            <button
              key={t.key}
              className={`tab${tab === t.key ? " tab--active" : ""}`}
              onClick={() => setTab(t.key)}
            >
              {t.label}
            </button>
          ))}
        </div>
        <span className="body-sm">
          {loading ? "loading…" : `${count(tab) ?? 0} open`}
        </span>
      </div>

      {loading ? (
        <EmptyState title="Reading the register…" body="Fetching complaints from the desk." />
      ) : data.length === 0 ? (
        <EmptyState
          title={
            tab === "completed"
              ? "Nothing resolved yet"
              : tab === "today"
                ? "No complaints filed today"
                : "The queue is clear"
          }
          body={
            tab === "completed"
              ? "Resolved complaints will be archived here with a note and the staff who handled them."
              : "New complaints will land here the moment a student files them."
          }
        />
      ) : (
        data.map((entry) => {
          const id = entry?.complaint?._id ?? entry?._id;
          return (
            <div key={id}>
              {renderCard(entry)}
            </div>
          );
        })
      )}

      <div
        style={{
          borderLeft: "2px solid var(--color-stone-300)",
          paddingLeft: 16,
          marginTop: 28,
          fontSize: 13,
          color: "var(--color-stone-500)",
          lineHeight: 1.55
        }}
      >
        Only pending complaints can be resolved or cancelled. Completing one pins
        your name and the resolution note to the archive.
      </div>
    </div>
  );
}