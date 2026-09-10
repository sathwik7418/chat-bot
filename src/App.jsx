import { AIBot } from "./components/AIBot/AIBot";

function App() {
  return (
    <main className="app">
      <AIBot
        botName="Milo"
        greeting="Hi, I’m Milo. How can I help you?"
        avatar="M"
        accentColor="#2f7773"
        suggestions={[
          "What can you help me with?",
          "Explain something to me",
          "Help me get started",
        ]}
      />
    </main>
  );
}

export default App;

