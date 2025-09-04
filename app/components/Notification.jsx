export default function Notification({ message, type }) {
  if (!message) return null;
  return <div className={`notification notification-${type}`}>{message}</div>;
}
