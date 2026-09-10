function initialsFor(name) {
  return name
    .split(' ')
    .map((word) => word[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

function Avatar({ avatar, botName, className }) {
  const isImage = avatar?.startsWith('http') || avatar?.startsWith('data:');

  return (
    <div className={`ai-bot-avatar ${className}`} aria-hidden="true">
      {isImage ? <img src={avatar} alt="" /> : avatar || initialsFor(botName)}
    </div>
  );
}

export default function BotButton({ botName, avatar, onClick }) {
  return (
    <button
      className="ai-bot-launcher"
      type="button"
      onClick={onClick}
      aria-label={`Open ${botName} chat`}
      data-testid="button-open-chat"
    >
      <span className="ai-bot-launcher-pulse" />
      <Avatar avatar={avatar} botName={botName} className="ai-bot-avatar-launcher" />
      <span className="ai-bot-launcher-label">Ask {botName}</span>
    </button>
  );
}