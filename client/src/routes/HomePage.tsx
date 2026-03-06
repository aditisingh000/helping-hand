import { env } from "../env";

export function HomePage() {
  return (
    <div className="card">
      <h1 style={{ marginTop: 0 }}>HelpingHand</h1>
      <p style={{ marginBottom: 0 }}>
        Client is running. API URL: <code>{env.apiUrl}</code>
      </p>
    </div>
  );
}

