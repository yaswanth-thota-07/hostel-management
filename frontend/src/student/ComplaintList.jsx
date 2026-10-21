import ComplaintCard from "./ComplaintCard.jsx";

export default function ComplaintList({ complaints }) {
  return (
    <div className="complaint-list">
      {complaints.map((complaint) => (
        <ComplaintCard key={complaint.id} complaint={complaint} />
      ))}
    </div>
  );
}
