"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const F = "var(--font-nunito), system-ui, sans-serif";
const PURPLE = "#7C3AED";

function PersonDuoIcon({ size = 22, color = PURPLE }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="8" r="4" stroke={color} strokeWidth="1.8" />
      <path d="M4 20c0-4 3.6-6.5 8-6.5S20 16 20 20" stroke={color} strokeWidth="1.8" strokeLinecap="round" fill="none" />
    </svg>
  );
}

function CameraIcon({ size = 16, color = "#fff" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M4 8.5A1.5 1.5 0 0 1 5.5 7h2l1-2h7l1 2h2A1.5 1.5 0 0 1 20 8.5v9A1.5 1.5 0 0 1 18.5 19h-13A1.5 1.5 0 0 1 4 17.5v-9Z"
        stroke={color} strokeWidth="1.7" strokeLinejoin="round" fill="none" />
      <circle cx="12" cy="13" r="3.4" stroke={color} strokeWidth="1.7" />
    </svg>
  );
}

function ShieldCheckIcon({ size = 14, color = PURPLE }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M12 3l7 3v5c0 4.5-3 7.7-7 9-4-1.3-7-4.5-7-9V6Z" fill={color} />
      <path d="M8.5 12.2l2.3 2.3 4.2-4.6" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}

function CatFaceIcon({ size = 20, color = PURPLE }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M6 8 4 4l4 2M18 8l2-4-4 2" stroke={color} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <circle cx="12" cy="12" r="7" stroke={color} strokeWidth="1.7" />
      <circle cx="9.3" cy="11.3" r="0.9" fill={color} />
      <circle cx="14.7" cy="11.3" r="0.9" fill={color} />
      <path d="M9.5 14.5c.8.7 3.2.7 4 0" stroke={color} strokeWidth="1.5" strokeLinecap="round" fill="none" />
    </svg>
  );
}

function LogOutIcon({ size = 20, color = "#D97706" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M9 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h3" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M15 16l4-4-4-4M9 12h10" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}

function TrashIcon({ size = 20, color = "#DC2626" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M4 7h16M9 7V4.5A1.5 1.5 0 0 1 10.5 3h3A1.5 1.5 0 0 1 15 4.5V7M6 7l1 12.5A2 2 0 0 0 9 21h6a2 2 0 0 0 2-2L18 7"
        stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M10 11v6M14 11v6" stroke={color} strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

function BellGlyph({ size = 20, color = PURPLE }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M12 3a6 6 0 0 0-6 6v3.5c0 .6-.2 1.2-.6 1.7L4 16.5c-.5.6-.1 1.5.7 1.5h14.6c.8 0 1.2-.9.7-1.5l-1.4-2.3c-.4-.5-.6-1.1-.6-1.7V9a6 6 0 0 0-6-6Z"
        stroke={color} strokeWidth="1.7" strokeLinejoin="round" fill="none" />
      <path d="M9.5 20a2.5 2.5 0 0 0 5 0" stroke={color} strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

function ShieldIcon({ size = 20, color = PURPLE }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M12 3l7 3v5c0 4.5-3 7.7-7 9-4-1.3-7-4.5-7-9V6Z" stroke={color} strokeWidth="1.8" strokeLinejoin="round" fill="none" />
    </svg>
  );
}

function ChevronRightIcon({ size = 18, color = "#C4C7D1" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M9 5l7 7-7 7" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}

function PencilIcon({ size = 16, color = PURPLE }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M4 20l1-4.2L15.5 5.3a1.7 1.7 0 0 1 2.4 0l.8.8a1.7 1.7 0 0 1 0 2.4L8.2 19 4 20Z"
        stroke={color} strokeWidth="1.6" strokeLinejoin="round" fill="none" />
      <path d="M13.8 6.8l3.4 3.4" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

// Same illustrated-avatar style used on the report header — dark tousled
// hair, blue hoodie, warm skin tone, soft blue gradient backdrop.
function ParentAvatarGlyph({ size = 78 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{ display: "block" }}>
      <defs>
        <radialGradient id="pag-bg" cx="0.35" cy="0.3" r="0.9">
          <stop offset="0%" stopColor="#DCEBFF" />
          <stop offset="100%" stopColor="#6C9CE0" />
        </radialGradient>
      </defs>
      <circle cx="50" cy="50" r="50" fill="url(#pag-bg)" />
      <path d="M14 100 C14 80 30 72 50 72 C70 72 86 80 86 100 Z" fill="#3454C9" />
      <path d="M40 76 Q50 84 60 76 L58 92 Q50 98 42 92 Z" fill="#2A44AE" />
      <rect x="43" y="62" width="14" height="14" rx="6" fill="#D89A6A" />
      <circle cx="27" cy="54" r="4.5" fill="#D89A6A" />
      <circle cx="73" cy="54" r="4.5" fill="#D89A6A" />
      <ellipse cx="50" cy="50" rx="20" ry="22" fill="#E4AC79" />
      <path d="M28 46 C26 26 34 14 50 14 C66 14 74 26 72 46 C70 38 64 34 64 34 C60 40 54 32 50 32 C46 32 40 40 36 34 C36 34 30 38 28 46 Z" fill="#1D2333" />
      <path d="M30 40 C30 36 33 33 33 33 M70 40 C70 36 67 33 67 33" stroke="#1D2333" strokeWidth="3" strokeLinecap="round" fill="none" />
      <path d="M39 44 Q43 41 47 43" stroke="#1D2333" strokeWidth="1.8" strokeLinecap="round" fill="none" />
      <path d="M53 43 Q57 41 61 44" stroke="#1D2333" strokeWidth="1.8" strokeLinecap="round" fill="none" />
      <ellipse cx="43" cy="49" rx="2.6" ry="3.2" fill="#1D2333" />
      <ellipse cx="57" cy="49" rx="2.6" ry="3.2" fill="#1D2333" />
      <circle cx="44" cy="47.5" r="0.8" fill="#fff" />
      <circle cx="58" cy="47.5" r="0.8" fill="#fff" />
      <ellipse cx="38" cy="56" rx="3.5" ry="2.2" fill="#E8836B" opacity="0.35" />
      <ellipse cx="62" cy="56" rx="3.5" ry="2.2" fill="#E8836B" opacity="0.35" />
      <path d="M49 51 Q48 55 50 56" stroke="#C4875A" strokeWidth="1.4" strokeLinecap="round" fill="none" />
      <path d="M44 59 Q50 63.5 56 59" stroke="#8A4B2E" strokeWidth="1.8" strokeLinecap="round" fill="none" />
    </svg>
  );
}

function ToggleSwitch({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      style={{
        flexShrink: 0, width: 46, height: 27, borderRadius: 999, border: "none", cursor: "pointer",
        background: on ? "linear-gradient(180deg, #9D6FE8, #7C3AED)" : "#E1E2E9",
        position: "relative", padding: 0, transition: "background 0.2s ease",
      }}
    >
      <motion.div
        animate={{ x: on ? 20 : 3 }}
        transition={{ type: "spring", stiffness: 500, damping: 32 }}
        style={{
          position: "absolute", top: 3, width: 21, height: 21, borderRadius: "50%",
          background: "#fff", boxShadow: "0 1px 4px rgba(0,0,0,0.25)",
        }}
      />
    </button>
  );
}

type Row = {
  label: string; desc: string; iconBg: string;
  Icon: (p: { size?: number; color?: string }) => React.ReactElement;
  iconColor: string;
};

export function ProfileScreen({
  parentName,
  childName,
  childAge,
  onHome,
  onReports,
}: {
  parentName?: string;
  childName?: string;
  childAge?: number | null;
  onHome: () => void;
  onReports: () => void;
}) {
  const name = parentName?.trim() || "Parent Name";
  const childLabel = childName?.trim() || "Child";
  const [notifOn, setNotifOn] = useState(true);
  const [profileOpen, setProfileOpen] = useState(false);

  const ACCOUNT_ROWS: Row[] = [
    { label: "Switch to Child Dashboard", desc: "Go to Fumi world and manage activities.", iconBg: "#EDE7FE", Icon: CatFaceIcon, iconColor: PURPLE },
    { label: "Log Out", desc: "Log out from your parent account.", iconBg: "#FDECC8", Icon: LogOutIcon, iconColor: "#D97706" },
    { label: "Delete Account", desc: "Permanently delete your account and all associated data.", iconBg: "#FBDADA", Icon: TrashIcon, iconColor: "#DC2626" },
  ];

  return (
    <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", background: "#FAFAFD" }}>
      <div className="prof-scroll" style={{ flex: 1, minHeight: 0, overflowY: "auto", padding: "56px 16px 16px" }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 18 }}>
          <div>
            <p style={{ margin: 0, fontFamily: F, fontSize: 26, fontWeight: 900, color: "#1E1B3A" }}>Profile</p>
            <p style={{ margin: "4px 0 0", fontFamily: F, fontSize: 13, fontWeight: 500, color: "#8A8FA3" }}>
              Manage your account and app preferences.
            </p>
          </div>
          <div style={{
            flexShrink: 0, width: 46, height: 46, borderRadius: "50%",
            background: "#EDE7FE", display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <PersonDuoIcon size={22} />
          </div>
        </div>

        {/* Parent card — tap to reveal Profile Information + Linked Children */}
        <div style={{ marginBottom: 22 }}>
          <button
            onClick={() => setProfileOpen((v) => !v)}
            style={{
              width: "100%", display: "flex", alignItems: "center", gap: 14,
              background: "#fff", border: "1px solid #EEF0F4", borderRadius: 18,
              padding: "14px 14px", boxShadow: "0 2px 10px rgba(30,20,70,0.06)",
              cursor: "pointer", textAlign: "left",
            }}
          >
            <div style={{ flexShrink: 0, position: "relative", width: 72, height: 72 }}>
              <div style={{ width: 72, height: 72, borderRadius: "50%", overflow: "hidden" }}>
                <ParentAvatarGlyph size={72} />
              </div>
              <div style={{
                position: "absolute", bottom: -2, right: -2, width: 26, height: 26, borderRadius: "50%",
                background: PURPLE, border: "2.5px solid #fff",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <CameraIcon size={13} />
              </div>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ margin: 0, fontFamily: F, fontSize: 16.5, fontWeight: 800, color: "#1E1B3A" }}>{name}</p>
              <p style={{ margin: "2px 0 8px", fontFamily: F, fontSize: 12.5, fontWeight: 500, color: "#8A8FA3" }}>
                parent@example.com
              </p>
              <div style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                background: "#EDE7FE", borderRadius: 999, padding: "4px 11px",
              }}>
                <ShieldCheckIcon size={13} />
                <span style={{ fontFamily: F, fontSize: 11.5, fontWeight: 700, color: PURPLE }}>Parent Account</span>
              </div>
            </div>
            <motion.div
              animate={{ rotate: profileOpen ? 90 : 0 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              style={{ flexShrink: 0, display: "flex" }}
            >
              <ChevronRightIcon />
            </motion.div>
          </button>

          <AnimatePresence initial={false}>
            {profileOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                style={{ overflow: "hidden" }}
              >
                <div style={{ paddingTop: 14 }}>
                  {/* Profile Information */}
                  <div style={{
                    background: "#fff", border: "1px solid #EEF0F4", borderRadius: 18,
                    padding: "16px 16px", marginBottom: 14, boxShadow: "0 2px 10px rgba(30,20,70,0.06)",
                  }}>
                    <p style={{ margin: "0 0 14px", fontFamily: F, fontSize: 15, fontWeight: 800, color: "#1E1B3A" }}>
                      Profile Information
                    </p>

                    <p style={{ margin: "0 0 6px", fontFamily: F, fontSize: 12.5, fontWeight: 700, color: "#5B6472" }}>Parent Name</p>
                    <div style={{
                      display: "flex", alignItems: "center", justifyContent: "space-between",
                      border: "1px solid #E5E7EE", borderRadius: 12, padding: "12px 14px", marginBottom: 14,
                    }}>
                      <span style={{ fontFamily: F, fontSize: 14, fontWeight: 500, color: "#1E1B3A" }}>{name}</span>
                      <PencilIcon size={16} />
                    </div>

                    <p style={{ margin: "0 0 6px", fontFamily: F, fontSize: 12.5, fontWeight: 700, color: "#5B6472" }}>Email Address</p>
                    <div style={{
                      display: "flex", alignItems: "center", justifyContent: "space-between",
                      border: "1px solid #E5E7EE", borderRadius: 12, padding: "12px 14px", marginBottom: 14,
                    }}>
                      <span style={{ fontFamily: F, fontSize: 14, fontWeight: 500, color: "#1E1B3A" }}>parent@example.com</span>
                      <PencilIcon size={16} />
                    </div>

                    <p style={{ margin: "0 0 6px", fontFamily: F, fontSize: 12.5, fontWeight: 700, color: "#5B6472" }}>Account Type</p>
                    <div style={{
                      display: "flex", alignItems: "center", gap: 10,
                      background: "#F7F7FA", border: "1px solid #EEF0F4", borderRadius: 12, padding: "12px 14px",
                    }}>
                      <div style={{
                        flexShrink: 0, width: 34, height: 34, borderRadius: "50%",
                        background: PURPLE, display: "flex", alignItems: "center", justifyContent: "center",
                      }}>
                        <ShieldCheckIcon size={16} color="#fff" />
                      </div>
                      <div>
                        <p style={{ margin: 0, fontFamily: F, fontSize: 13.5, fontWeight: 700, color: "#1E1B3A" }}>Parent Account</p>
                        <p style={{ margin: 0, fontFamily: F, fontSize: 11.5, fontWeight: 500, color: "#8A8FA3" }}>Primary parent account</p>
                      </div>
                    </div>
                  </div>

                  {/* Linked Children */}
                  <div style={{
                    background: "#fff", border: "1px solid #EEF0F4", borderRadius: 18,
                    padding: "16px 16px", boxShadow: "0 2px 10px rgba(30,20,70,0.06)",
                  }}>
                    <p style={{ margin: "0 0 4px", fontFamily: F, fontSize: 15, fontWeight: 800, color: "#1E1B3A" }}>Linked Children</p>
                    <p style={{ margin: "0 0 14px", fontFamily: F, fontSize: 12.5, fontWeight: 500, color: "#8A8FA3" }}>
                      Children connected to this parent account.
                    </p>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div style={{ flexShrink: 0, width: 48, height: 48, borderRadius: "50%", overflow: "hidden" }}>
                        <ParentAvatarGlyph size={48} />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ margin: 0, fontFamily: F, fontSize: 14.5, fontWeight: 800, color: "#1E1B3A" }}>{childLabel}</p>
                        {typeof childAge === "number" && (
                          <p style={{ margin: 0, fontFamily: F, fontSize: 12, fontWeight: 500, color: "#8A8FA3" }}>Age {childAge}</p>
                        )}
                      </div>
                      <ChevronRightIcon />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Account Actions */}
        <p style={{ margin: "0 0 10px", fontFamily: F, fontSize: 15, fontWeight: 800, color: "#1E1B3A" }}>Account Actions</p>
        <div style={{
          background: "#fff", border: "1px solid #EEF0F4", borderRadius: 18,
          boxShadow: "0 2px 10px rgba(30,20,70,0.06)", marginBottom: 22, overflow: "hidden",
        }}>
          {ACCOUNT_ROWS.map((row, i) => (
            <div key={row.label} style={{
              display: "flex", alignItems: "center", gap: 14, padding: "14px 14px",
              borderTop: i > 0 ? "1px solid #F1F2F6" : "none",
            }}>
              <div style={{
                flexShrink: 0, width: 44, height: 44, borderRadius: 14,
                background: row.iconBg, display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <row.Icon size={20} color={row.iconColor} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ margin: "0 0 2px", fontFamily: F, fontSize: 14.5, fontWeight: 800, color: "#1E1B3A" }}>{row.label}</p>
                <p style={{ margin: 0, fontFamily: F, fontSize: 12, fontWeight: 500, color: "#8A8FA3", lineHeight: 1.4 }}>{row.desc}</p>
              </div>
              <ChevronRightIcon />
            </div>
          ))}
        </div>

        {/* App Preferences */}
        <p style={{ margin: "0 0 10px", fontFamily: F, fontSize: 15, fontWeight: 800, color: "#1E1B3A" }}>App Preferences</p>
        <div style={{
          background: "#fff", border: "1px solid #EEF0F4", borderRadius: 18,
          boxShadow: "0 2px 10px rgba(30,20,70,0.06)", marginBottom: 18, overflow: "hidden",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 14px" }}>
            <div style={{ flexShrink: 0, width: 44, height: 44, borderRadius: 14, background: "#EDE7FE", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <BellGlyph size={20} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ margin: "0 0 2px", fontFamily: F, fontSize: 14.5, fontWeight: 800, color: "#1E1B3A" }}>Notifications</p>
              <p style={{ margin: 0, fontFamily: F, fontSize: 12, fontWeight: 500, color: "#8A8FA3", lineHeight: 1.4 }}>Manage email and app notifications.</p>
            </div>
            <ToggleSwitch on={notifOn} onToggle={() => setNotifOn((v) => !v)} />
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 14px", borderTop: "1px solid #F1F2F6" }}>
            <div style={{ flexShrink: 0, width: 44, height: 44, borderRadius: 14, background: "#EDE7FE", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <ShieldIcon size={20} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ margin: "0 0 2px", fontFamily: F, fontSize: 14.5, fontWeight: 800, color: "#1E1B3A" }}>Privacy & Data</p>
              <p style={{ margin: 0, fontFamily: F, fontSize: 12, fontWeight: 500, color: "#8A8FA3", lineHeight: 1.4 }}>View and manage your data settings.</p>
            </div>
            <ChevronRightIcon />
          </div>
        </div>

        <p style={{ textAlign: "center", margin: "8px 0 12px", fontFamily: F, fontSize: 12, fontWeight: 500, color: "#B0B4C0" }}>
          Fumi Parent App &nbsp;•&nbsp; Version 1.0.0
        </p>
      </div>

      {/* ── Bottom Tab Bar — same dark bar as Home/Reports, Profile active. ── */}
      <div style={{
        flexShrink: 0, height: 74,
        background: "rgba(6,4,20,0.97)",
        borderTop: "1px solid rgba(255,255,255,0.06)",
        display: "flex", alignItems: "center",
        position: "relative",
      }}>
        <motion.button
          onClick={onHome}
          whileHover={{ scale: 1.12 }} whileTap={{ scale: 0.92 }}
          style={{
            flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 2,
            background: "none", border: "none", cursor: "pointer",
          }}
        >
          <div style={{ width: 46, height: 46, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontSize: 22 }}>🏠</span>
          </div>
          <span style={{ fontFamily: F, color: "#fff", fontSize: 11, fontWeight: 600 }}>Home</span>
        </motion.button>

        <motion.button
          onClick={onReports}
          whileHover={{ scale: 1.12 }} whileTap={{ scale: 0.92 }}
          style={{
            flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 2,
            background: "none", border: "none", cursor: "pointer",
          }}
        >
          <div style={{ width: 46, height: 46, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontSize: 22 }}>📊</span>
          </div>
          <span style={{ fontFamily: F, color: "#fff", fontSize: 11, fontWeight: 600 }}>Reports</span>
        </motion.button>

        <motion.div
          whileHover={{ scale: 1.12 }} whileTap={{ scale: 0.92 }}
          style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 2, cursor: "pointer" }}
        >
          <div style={{
            width: 46, height: 46, borderRadius: "50%",
            background: PURPLE, display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <span style={{ fontSize: 22 }}>👤</span>
          </div>
          <span style={{ fontFamily: F, color: "#fff", fontSize: 11, fontWeight: 800 }}>Profile</span>
          <div style={{
            position: "absolute", bottom: 0, left: "calc(83.33% - 20px)", width: 40, height: 3,
            background: PURPLE, borderRadius: 2,
          }} />
        </motion.div>
      </div>

      <style>{`
        .prof-scroll::-webkit-scrollbar { display: none; }
        .prof-scroll { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}
