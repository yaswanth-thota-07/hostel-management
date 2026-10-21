const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

export function fmtDateTime(value) {
  if (!value) return "—";
  const d = new Date(value);
  const day = d.getDate();
  const mon = MONTHS[d.getMonth()];
  const year = d.getFullYear() === new Date().getFullYear() ? "" : ` ${d.getFullYear()}`;
  let h = d.getHours();
  const ampm = h >= 12 ? "pm" : "am";
  h = h % 12 || 12;
  const min = String(d.getMinutes()).padStart(2, "0");
  return `${day} ${mon}${year}, ${h}:${min}${ampm}`;
}

export function fmtDate(value) {
  if (!value) return "—";
  const d = new Date(value);
  const day = d.getDate();
  const mon = MONTHS[d.getMonth()];
  return `${day} ${mon}`;
}

export function initials(name = "") {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase() || "?";
}

export function firstError(err) {
  if (!err) return "Something went wrong";
  if (err.message) return err.message;
  return "Something went wrong";
}

export const CATEGORIES = [
  "Electrical",
  "Plumbing",
  "Carpentry",
  "Mess & Kitchen",
  "Internet / Wi-Fi",
  "Washroom",
  "Cleaning",
  "Furniture",
  "Other"
];

export const WINGS = ["A", "B", "C", "D"];

export const HOSTELS = ["Boys Hostel", "Girls Hostel"];