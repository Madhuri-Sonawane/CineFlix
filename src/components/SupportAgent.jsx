import { useState, useRef, useEffect } from "react";
import gsap from "gsap";

const SYSTEM_PROMPT = `You are Cleo, the friendly AI support assistant for Cineflex — a premium movie streaming platform.

Cineflex features:
- Multi-profile system: users can create Adult and Kids profiles. Each profile has its own Watch Later list, Watch Activity, and Continue Watching row.
- Owner role: the first profile created is the Owner, who can add/edit/delete other profiles.
- Kids profile: restricted content, no search, no filters, safe movies only.
- Movie discovery: powered by TMDB API. Users can search, filter by genre, rating, and year.
- Mood filtering: "I'm feeling…" bar with 8 mood presets (Comedy, Action, Thriller, Romance, Sci-Fi, Drama, Fantasy, Mystery).
- Watch Later: bookmark any movie from the grid using the bookmark icon on movie cards.
- Activity page: shows watch history with progress bars. Can be cleared.
- Hero banner: featured movie shown on homepage with Play and More Info buttons.
- Filters sidebar: on the left — genre (2-column grid), rating slider, year buttons. Has a Clear button when filters are active.
- Trailer: available on the Movie Detail page via the Watch Trailer button.
- Profile editing: click the pencil icon on Manage Profiles page to edit name, avatar, role, and PIN.
- Loading screen: cinematic intro plays once on app launch.

Keep answers short, friendly, and helpful. If someone asks something unrelated to Cineflex, politely redirect them. Use a warm, slightly playful tone. Address the user by name if they mention it. Never make up features that don't exist.`;

const SUGGESTIONS = [
  "How do I create a Kids profile?",
  "How does Watch Later work?",
  "How do I filter by mood?",
  "Can I edit my profile?",
];

function TypingIndicator() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 5, padding: "10px 14px", background: "rgba(124,58,237,0.1)", border: "1px solid rgba(124,58,237,0.2)", borderRadius: "16px 16px 16px 4px", width: "fit-content" }}>
      {[0, 1, 2].map(i => (
        <div key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: "#a78bfa", animation: `cf-bounce 1.2s ease-in-out ${i * 0.2}s infinite` }} />
      ))}
      <style>{`@keyframes cf-bounce { 0%,80%,100%{transform:translateY(0)} 40%{transform:translateY(-6px)} }`}</style>
    </div>
  );
}

export default function SupportAgent() {
  const [open,     setOpen]     = useState(false);
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hey! I'm **Cleo**, your Cineflex assistant 🎬\nHow can I help you today?" }
  ]);
  const [input,    setInput]    = useState("");
  const [loading,  setLoading]  = useState(false);
  const [unread,   setUnread]   = useState(0);

  const panelRef   = useRef(null);
  const buttonRef  = useRef(null);
  const bottomRef  = useRef(null);
  const inputRef   = useRef(null);

  /* ── open/close animation ── */
  useEffect(() => {
    if (!panelRef.current) return;
    if (open) {
      setUnread(0);
      gsap.fromTo(panelRef.current,
        { opacity: 0, y: 24, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 0.35, ease: "power3.out" }
      );
      setTimeout(() => inputRef.current?.focus(), 350);
    } else {
      gsap.to(panelRef.current,
        { opacity: 0, y: 16, scale: 0.97, duration: 0.22, ease: "power2.in" }
      );
    }
  }, [open]);

  /* ── scroll to bottom on new message ── */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  /* ── FAB pulse on unread ── */
  useEffect(() => {
    if (unread > 0 && buttonRef.current) {
      gsap.fromTo(buttonRef.current,
        { scale: 1 },
        { scale: 1.12, duration: 0.25, ease: "power2.out", yoyo: true, repeat: 1 }
      );
    }
  }, [unread]);

  const sendMessage = async (text) => {
    const userText = (text || input).trim();
    if (!userText || loading) return;
    setInput("");

    const newMessages = [...messages, { role: "user", content: userText }];
    setMessages(newMessages);
    setLoading(true);

    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: SYSTEM_PROMPT,
          messages: newMessages.map(m => ({ role: m.role, content: m.content })),
        }),
      });
      const data = await res.json();
      const reply = data.content?.[0]?.text || "Sorry, I couldn't get a response. Try again!";
      setMessages(prev => [...prev, { role: "assistant", content: reply }]);
      if (!open) setUnread(u => u + 1);
    } catch {
      setMessages(prev => [...prev, { role: "assistant", content: "Hmm, something went wrong on my end. Please try again in a moment!" }]);
    } finally {
      setLoading(false);
    }
  };

  /* ── render markdown-lite (bold + newlines) ── */
  const renderText = (text) => {
    return text.split("\n").map((line, i) => {
      const parts = line.split(/\*\*(.*?)\*\*/g);
      return (
        <span key={i}>
          {parts.map((p, j) => j % 2 === 1 ? <strong key={j}>{p}</strong> : p)}
          {i < text.split("\n").length - 1 && <br />}
        </span>
      );
    });
  };

  return (
    <>
      {/* ── CHAT PANEL ── */}
      {open && (
        <div ref={panelRef} style={{
          position: "fixed", bottom: 90, right: 24, zIndex: 1000,
          width: "clamp(320px, 90vw, 400px)",
          height: "clamp(420px, 65vh, 560px)",
          background: "rgba(14,12,26,0.98)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          border: "1px solid rgba(124,58,237,0.25)",
          borderRadius: 20,
          boxShadow: "0 24px 64px rgba(0,0,0,0.7), 0 0 0 1px rgba(124,58,237,0.1)",
          display: "flex", flexDirection: "column",
          overflow: "hidden",
        }}>
          {/* Top shimmer */}
          <div style={{ height: 2, background: "linear-gradient(90deg, transparent, #7c3aed, #f59e0b, transparent)", flexShrink: 0 }} />

          {/* Header */}
          <div style={{ padding: "14px 16px", borderBottom: "1px solid rgba(124,58,237,0.15)", display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
            <div style={{ position: "relative" }}>
              <div style={{ width: 38, height: 38, borderRadius: 12, background: "linear-gradient(135deg, #7c3aed, #a78bfa)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.1rem" }}>🎬</div>
              <div style={{ position: "absolute", bottom: -1, right: -1, width: 10, height: 10, borderRadius: "50%", background: "#34d399", border: "2px solid #09080f" }} />
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.9rem", fontWeight: 700, color: "#f1eeff" }}>Cleo</p>
              <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.68rem", color: "#34d399", fontWeight: 600 }}>● Online — Cineflex Support</p>
            </div>
            <button onClick={() => setOpen(false)} style={{ width: 30, height: 30, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(124,58,237,0.12)", border: "1px solid rgba(124,58,237,0.2)", borderRadius: 8, cursor: "pointer", color: "#a78bfa", fontSize: "0.85rem" }}>✕</button>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: "auto", padding: "14px 14px 8px", display: "flex", flexDirection: "column", gap: 10 }}
            className="cf-chat-scroll">
            <style>{`.cf-chat-scroll::-webkit-scrollbar{width:3px}.cf-chat-scroll::-webkit-scrollbar-thumb{background:rgba(124,58,237,0.3);border-radius:99px}`}</style>

            {messages.map((msg, i) => {
              const isUser = msg.role === "user";
              return (
                <div key={i} style={{ display: "flex", justifyContent: isUser ? "flex-end" : "flex-start" }}>
                  <div style={{
                    maxWidth: "82%",
                    padding: "9px 13px",
                    borderRadius: isUser ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                    background: isUser
                      ? "linear-gradient(135deg, #7c3aed, #a78bfa)"
                      : "rgba(124,58,237,0.1)",
                    border: isUser ? "none" : "1px solid rgba(124,58,237,0.2)",
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontSize: "0.83rem",
                    lineHeight: 1.55,
                    color: isUser ? "#fff" : "#d4cff0",
                    boxShadow: isUser ? "0 4px 16px rgba(124,58,237,0.35)" : "none",
                  }}>
                    {renderText(msg.content)}
                  </div>
                </div>
              );
            })}

            {loading && (
              <div style={{ display: "flex", justifyContent: "flex-start" }}>
                <TypingIndicator />
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Suggestions — only on first message */}
          {messages.length === 1 && (
            <div style={{ padding: "0 14px 10px", display: "flex", gap: 6, flexWrap: "wrap", flexShrink: 0 }}>
              {SUGGESTIONS.map(s => (
                <button key={s} onClick={() => sendMessage(s)} style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.7rem", fontWeight: 600, color: "#a78bfa", background: "rgba(124,58,237,0.1)", border: "1px solid rgba(124,58,237,0.22)", borderRadius: 99, padding: "5px 11px", cursor: "pointer", transition: "all 0.18s ease" }}
                  onMouseEnter={e => { e.currentTarget.style.background = "rgba(124,58,237,0.22)"; e.currentTarget.style.color = "#f1eeff"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "rgba(124,58,237,0.1)"; e.currentTarget.style.color = "#a78bfa"; }}>
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div style={{ padding: "10px 12px 14px", borderTop: "1px solid rgba(124,58,237,0.12)", display: "flex", gap: 8, alignItems: "flex-end", flexShrink: 0 }}>
            <input
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && !e.shiftKey && sendMessage()}
              placeholder="Ask Cleo anything…"
              disabled={loading}
              style={{ flex: 1, padding: "9px 13px", background: "rgba(26,23,48,0.9)", border: "1.5px solid rgba(124,58,237,0.25)", borderRadius: 12, color: "#f1eeff", fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.83rem", outline: "none", transition: "border-color 0.2s", resize: "none" }}
              onFocus={e => e.target.style.borderColor = "rgba(124,58,237,0.6)"}
              onBlur={e => e.target.style.borderColor = "rgba(124,58,237,0.25)"}
            />
            <button onClick={() => sendMessage()} disabled={!input.trim() || loading}
              style={{ width: 38, height: 38, borderRadius: 12, background: input.trim() && !loading ? "linear-gradient(135deg, #7c3aed, #a78bfa)" : "rgba(124,58,237,0.15)", border: "none", cursor: input.trim() && !loading ? "pointer" : "default", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "all 0.2s", boxShadow: input.trim() && !loading ? "0 0 16px rgba(124,58,237,0.4)" : "none" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={input.trim() && !loading ? "#fff" : "#a78bfa"} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* ── FAB BUTTON ── */}
      <button ref={buttonRef} onClick={() => setOpen(o => !o)}
        style={{
          position: "fixed", bottom: 24, right: 24, zIndex: 1001,
          width: 56, height: 56, borderRadius: "50%",
          background: open ? "rgba(124,58,237,0.3)" : "linear-gradient(135deg, #7c3aed 0%, #a78bfa 100%)",
          border: open ? "1.5px solid rgba(124,58,237,0.5)" : "none",
          cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: open ? "none" : "0 0 28px rgba(124,58,237,0.6), 0 8px 24px rgba(0,0,0,0.5)",
          transition: "all 0.25s ease",
        }}
        onMouseEnter={e => { if (!open) e.currentTarget.style.transform = "scale(1.1)"; }}
        onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; }}
      >
        {open ? (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        ) : (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          </svg>
        )}

        {/* Unread badge */}
        {unread > 0 && !open && (
          <div style={{ position: "absolute", top: -2, right: -2, width: 18, height: 18, borderRadius: "50%", background: "#f59e0b", border: "2px solid #09080f", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.6rem", fontWeight: 800, color: "#09080f" }}>
            {unread}
          </div>
        )}
      </button>
    </>
  );
}