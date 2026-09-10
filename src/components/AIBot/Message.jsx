export default function Message({ message }) {
  return (
    <div
      className={`ai-bot-message-row ${message.role}`}
      data-testid={`message-${message.role}-${message.id}`}
    >
      <div className="ai-bot-message-bubble">{message.content}</div>
    </div>
  );
}

