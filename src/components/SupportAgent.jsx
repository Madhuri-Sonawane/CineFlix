import { useState, useRef, useEffect } from "react";
import gsap from "gsap";

// ── RESPONSE ENGINE ──────────────────────────────────────────────
const QA = [
  {
    keys: ["kids", "child", "children", "family", "safe", "restrict"],
    answer: "**Kids Profile** keeps things safe! 🧒\nWhen you create a profile and enable **Kids mode**, it automatically:\n• Shows only family-friendly content\n• Hides the search bar and filters\n• Locks the sidebar genres to Animation & Family\n\nCreate one from the **Profile Select** screen.",
  },
  {
    keys: ["watch later", "watchlater", "bookmark", "save", "saved"],
    answer: "**Watch Later** lets you save movies for later! 🔖\n\n• Hover over any movie card and click the **bookmark icon**\n• Access your list anytime from the **Profile sidebar → Watch Later**\n• Each profile has its own separate watchlist\n• Remove movies by hovering and clicking ✕",
  },
  {
    keys: ["mood", "feeling", "vibe", "i'm in", "genre preset"],
    answer: "The **Mood Bar** is one of Cineflex's coolest features! ✨\n\nJust below the hero banner you'll see:\n😂 Comedy · 💥 Action · 😱 Thriller · 💕 Romance\n🚀 Sci-Fi · 🎭 Drama · 🧙 Fantasy · 🔍 Mystery\n\nClick any mood to instantly filter movies to that genre. Click again to deselect!",
  },
  {
    keys: ["edit", "change name", "update profile", "avatar", "rename"],
    answer: "To **edit your profile**: 🖊️\n\n1. Click your avatar in the top-right navbar\n2. Select **Manage Profiles**\n3. Click the ✏️ pencil icon on any profile card\n4. Change your name, avatar, or role\n5. Hit **Save Changes**\n\nOnly the Owner profile can edit other profiles.",
  },
  {
    keys: ["filter", "genre", "year", "rating", "sidebar"],
    answer: "The **Filter Sidebar** on the left has three sections: 🎯\n\n• **Genres** — 2-column grid, select multiple\n• **Min Rating** — drag the slider (0–10)\n• **Year** — tap any year button to filter\n\nAll filters combine together and update results instantly. A badge shows how many filters are active. Hit **Clear** to reset everything.",
  },
  {
    keys: ["search", "find", "look for", "looking for"],
    answer: "Use the **Search bar** in the navbar to find any movie! 🔍\n\nJust start typing — results update automatically with a 350ms debounce so it doesn't spam the API.\n\nNote: Search is **disabled for Kids profiles** to keep content safe.",
  },
  {
    keys: ["profile", "create", "add profile", "new profile", "multiple"],
    answer: "Cineflex supports **multiple profiles**, just like Netflix! 👤\n\n• Go to **/profiles** to create your first profile\n• Choose a name, avatar, and enable Kids mode if needed\n• The first profile becomes the **Owner** automatically\n• Owner can add, edit, and delete other profiles\n• Each profile has its own watch history and lists",
  },
  {
    keys: ["activity", "history", "watched", "continue watching", "progress"],
    answer: "Your **Watch Activity** tracks everything you've opened! 🕐\n\n• Visit a movie's detail page to log it to your history\n• The **Continue Watching** row on the home page shows recent movies with progress bars\n• Go to **Activity page** (via sidebar) for your full history\n• Progress turns green when a movie is 80%+ complete\n• You can **Clear History** from the Activity page",
  },
  {
    keys: ["trailer", "watch trailer", "video", "play"],
    answer: "To watch a **trailer**: 🎬\n\n1. Click any movie card or the **More Info** button on the hero\n2. On the Movie Detail page, click **Watch Trailer**\n3. A cinematic modal opens with the embedded trailer\n4. Press ✕ or click outside to close\n\nTrailers are sourced directly from TMDB's video API.",
  },
  {
    keys: ["hero", "banner", "featured", "homepage"],
    answer: "The **Hero Banner** showcases a featured movie on the homepage! 🌟\n\n• Shows a different featured movie for Adults vs Kids profiles\n• Includes genre tags, star rating bar, and overview\n• **Play Now** → goes to the movie detail page\n• **More Info** → same destination with full details\n• Animates in with shimmer letterbox bars on load",
  },
  {
    keys: ["switch", "change profile", "different profile", "log out"],
    answer: "To **switch profiles**: 🔀\n\n1. Click your avatar in the top-right navbar\n2. Select **Switch Profile** from the panel\n3. You'll be taken back to the Profile Select screen\n4. Pick any profile to jump straight in\n\nEach profile loads its own data instantly.",
  },
  {
    keys: ["owner", "role", "permission", "admin", "delete profile"],
    answer: "The **Owner role** is the admin of all profiles 👑\n\n• Automatically assigned to the first profile created\n• Can add, edit, and delete other profiles\n• Can set an optional 4-digit PIN for extra security\n• Only the Owner can promote another profile to Owner\n• Kids profiles cannot be edited by non-owners",
  },
  {
    keys: ["loading", "intro", "launch", "startup", "screen"],
    answer: "The **Cinematic Loading Screen** plays once on launch! 🎬\n\n• Black screen with sliding cinematic bars (top + bottom)\n• Cineflex logo drops in with a bounce animation\n• Gold wordmark glows in from the left\n• Progress bar fills from 0→100%\n• A purple scan line sweeps across\n• Everything exits smoothly before the app fades in",
  },
  {
    keys: ["tech", "built", "stack", "react", "api", "tmdb", "gsap"],
    answer: "**Cineflex Tech Stack** ⚙️\n\n• **React 18 + Vite** — frontend framework\n• **TMDB API** — all movie data, posters & trailers\n• **GSAP** — all animations and transitions\n• **Tailwind CSS + CSS Variables** — styling & design tokens\n• **React Router v6** — page routing\n• **localStorage** — profile & watchlist persistence\n• **Vercel** — deployment",
  },
  {
    keys: ["hi", "hello", "hey", "hii", "sup", "yo", "help"],
    answer: "Hey there! 👋 I'm **Cleo**, your Cineflex assistant.\n\nI can help you with:\n• Creating and managing profiles\n• Using filters and mood-based search\n• Watch Later & Activity history\n• Trailers, hero banner, and more\n\nWhat would you like to know? 🎬",
  },
  {
    keys: ["thanks", "thank you", "thx", "ty", "great", "awesome", "perfect"],
    answer: "Happy to help! 🎉 Enjoy your movies on Cineflex. If you have any more questions, I'm right here! 🍿",
  },
];

const FALLBACK = "Hmm, I'm not sure about that one! 🤔\n\nTry asking me about:\n• **Profiles** — creating, editing, Kids mode\n• **Filters** — genre, rating, year, mood bar\n• **Watch Later** — bookmarking movies\n• **Activity** — watch history & progress\n• **Trailers** — how to watch them";

function getReply(input) {
  const text = input.toLowerCase();
  for (const item of QA) {
    if (item.keys.some(k => text.includes(k))) return item.answer;
  }
  return FALLBACK;
}

// Simulate typing delay based on response length
function replyDelay(text) {
  return Math.min(600 + text.length * 8, 2200);
}
// ─────────────────────────────────────────────────────────────────

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
      <style>{`@keyframes cf-bounce{0%,80%,100%{transform:translateY(0)}40%{transform:translateY(-6px)}}`}</style>
    </div>
  );
}

export default function SupportAgent() {
  const [open,     setOpen]     = useState(false);
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hey! I'm **Cleo**, your Cineflex assistant 🎬\nHow can I help you today?" }
  ]);
  const [input,   setInput]   = useState("");
  const [loading, setLoading] = useState(false);
  const [unread,  setUnread]  = useState(0);

  const panelRef  = useRef(null);
  const buttonRef = useRef(null);
  const bottomRef = useRef(null);
  const inputRef  = useRef(null);

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

  /* ── scroll to bottom ── */
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

  const sendMessage = (text) => {
    const userText = (text || input).trim();
    if (!userText || loading) return;
    setInput("");

    setMessages(prev => [...prev, { role: "user", content: userText }]);
    setLoading(true);

    const reply = getReply(userText);
    setTimeout(() => {
      setMessages(prev => [...prev, { role: "assistant", content: reply }]);
      setLoading(false);
      if (!open) setUnread(u => u + 1);
    }, replyDelay(reply));
  };

  /* ── render bold + newlines ── */
  const renderText = (text) =>
    text.split("\n").map((line, i, arr) => {
      const parts = line.split(/\*\*(.*?)\*\*/g);
      return (
        <span key={i}>
          {parts.map((p, j) => j % 2 === 1 ? <strong key={j}>{p}</strong> : p)}
          {i < arr.length - 1 && <br />}
        </span>
      );
    });

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
          <div style={{ flex: 1, overflowY: "auto", padding: "14px 14px 8px", display: "flex", flexDirection: "column", gap: 10 }} className="cf-chat-scroll">
            <style>{`.cf-chat-scroll::-webkit-scrollbar{width:3px}.cf-chat-scroll::-webkit-scrollbar-thumb{background:rgba(124,58,237,0.3);border-radius:99px}`}</style>

            {messages.map((msg, i) => {
              const isUser = msg.role === "user";
              return (
                <div key={i} style={{ display: "flex", justifyContent: isUser ? "flex-end" : "flex-start" }}>
                  <div style={{
                    maxWidth: "82%", padding: "9px 13px",
                    borderRadius: isUser ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                    background: isUser ? "linear-gradient(135deg, #7c3aed, #a78bfa)" : "rgba(124,58,237,0.1)",
                    border: isUser ? "none" : "1px solid rgba(124,58,237,0.2)",
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontSize: "0.83rem", lineHeight: 1.55,
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
                <button key={s} onClick={() => sendMessage(s)}
                  style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.7rem", fontWeight: 600, color: "#a78bfa", background: "rgba(124,58,237,0.1)", border: "1px solid rgba(124,58,237,0.22)", borderRadius: 99, padding: "5px 11px", cursor: "pointer", transition: "all 0.18s ease" }}
                  onMouseEnter={e => { e.currentTarget.style.background = "rgba(124,58,237,0.22)"; e.currentTarget.style.color = "#f1eeff"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "rgba(124,58,237,0.1)"; e.currentTarget.style.color = "#a78bfa"; }}>
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div style={{ padding: "10px 12px 14px", borderTop: "1px solid rgba(124,58,237,0.12)", display: "flex", gap: 8, alignItems: "center", flexShrink: 0 }}>
            <input ref={inputRef} value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && sendMessage()}
              placeholder="Ask Cleo anything…"
              disabled={loading}
              style={{ flex: 1, padding: "9px 13px", background: "rgba(26,23,48,0.9)", border: "1.5px solid rgba(124,58,237,0.25)", borderRadius: 12, color: "#f1eeff", fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.83rem", outline: "none", transition: "border-color 0.2s" }}
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

      {/* ── FAB ── */}
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
        {open
          ? <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          : <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
        }
        {unread > 0 && !open && (
          <div style={{ position: "absolute", top: -2, right: -2, width: 18, height: 18, borderRadius: "50%", background: "#f59e0b", border: "2px solid #09080f", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.6rem", fontWeight: 800, color: "#09080f" }}>
            {unread}
          </div>
        )}
      </button>
    </>
  );
}