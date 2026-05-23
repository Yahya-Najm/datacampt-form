"use client";

import { useState, useTransition } from "react";

export const PLATFORMS = [
  { value: "facebook",  label: "Facebook",  color: "#1877F2" },
  { value: "instagram", label: "Instagram", color: "#E1306C" },
  { value: "twitter",   label: "Twitter / X", color: "#000000" },
  { value: "linkedin",  label: "LinkedIn",  color: "#0A66C2" },
  { value: "telegram",  label: "Telegram",  color: "#2CA5E0" },
  { value: "whatsapp",  label: "WhatsApp",  color: "#25D366" },
  { value: "youtube",   label: "YouTube",   color: "#FF0000" },
  { value: "tiktok",    label: "TikTok",    color: "#000000" },
  { value: "discord",   label: "Discord",   color: "#5865F2" },
  { value: "other",     label: "Other",     color: "#6B7280" },
];

interface SocialLink {
  id: string;
  platform: string;
  label: string;
  url: string;
  order: number;
  isActive: boolean;
}

interface Props {
  links: SocialLink[];
  onAdd: (data: { platform: string; label: string; url: string; order: number }) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onUpdate: (id: string, data: { label?: string; url?: string; order?: number; isActive?: boolean }) => Promise<void>;
}

function PlatformIcon({ platform, size = 20 }: { platform: string; size?: number }) {
  const p = PLATFORMS.find((p) => p.value === platform);
  const color = p?.color ?? "#6B7280";
  const label = p?.label ?? platform;
  return (
    <span
      className="inline-flex items-center justify-center rounded-full font-bold text-white text-xs shrink-0"
      style={{ background: color, width: size, height: size, fontSize: size * 0.45 }}
    >
      {label[0].toUpperCase()}
    </span>
  );
}

export function SocialLinksManager({ links: initialLinks, onAdd, onDelete, onUpdate }: Props) {
  const [links, setLinks] = useState<SocialLink[]>(initialLinks);
  const [isPending, startTransition] = useTransition();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<{ label: string; url: string; order: string }>({ label: "", url: "", order: "" });

  const [form, setForm] = useState({ platform: "facebook", label: "", url: "", order: "" });
  const [formError, setFormError] = useState("");

  function handleAdd() {
    if (!form.label.trim()) { setFormError("Label is required."); return; }
    if (!form.url.trim()) { setFormError("URL is required."); return; }
    if (!/^https?:\/\/.+/.test(form.url.trim())) { setFormError("URL must start with http:// or https://"); return; }
    setFormError("");
    const order = parseInt(form.order) || links.length;
    startTransition(async () => {
      await onAdd({ platform: form.platform, label: form.label.trim(), url: form.url.trim(), order });
      setLinks((prev) => [...prev, { id: Date.now().toString(), platform: form.platform, label: form.label.trim(), url: form.url.trim(), order, isActive: true }]);
      setForm({ platform: "facebook", label: "", url: "", order: "" });
    });
  }

  function startEdit(link: SocialLink) {
    setEditingId(link.id);
    setEditData({ label: link.label, url: link.url, order: String(link.order) });
  }

  function handleSaveEdit(id: string) {
    if (!editData.label.trim() || !editData.url.trim()) return;
    startTransition(async () => {
      await onUpdate(id, { label: editData.label.trim(), url: editData.url.trim(), order: parseInt(editData.order) || 0 });
      setLinks((prev) => prev.map((l) => l.id === id ? { ...l, label: editData.label.trim(), url: editData.url.trim(), order: parseInt(editData.order) || 0 } : l));
      setEditingId(null);
    });
  }

  function handleToggle(id: string, current: boolean) {
    startTransition(async () => {
      await onUpdate(id, { isActive: !current });
      setLinks((prev) => prev.map((l) => l.id === id ? { ...l, isActive: !current } : l));
    });
  }

  function handleDelete(id: string) {
    startTransition(async () => {
      await onDelete(id);
      setLinks((prev) => prev.filter((l) => l.id !== id));
    });
  }

  return (
    <div className="space-y-6">
      {/* Add form */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5">
        <h2 className="text-sm font-bold text-gray-700 mb-4">Add New Link</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Platform</label>
            <select
              value={form.platform}
              onChange={(e) => setForm((f) => ({ ...f, platform: e.target.value }))}
              className="w-full h-9 rounded-lg border border-gray-300 bg-white px-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              {PLATFORMS.map((p) => (
                <option key={p.value} value={p.value}>{p.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Label <span className="text-red-400">*</span></label>
            <input
              type="text"
              value={form.label}
              onChange={(e) => setForm((f) => ({ ...f, label: e.target.value }))}
              placeholder="e.g. Join our Facebook Group"
              className="w-full h-9 rounded-lg border border-gray-300 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-xs font-medium text-gray-600 mb-1">URL <span className="text-red-400">*</span></label>
            <input
              type="url"
              value={form.url}
              onChange={(e) => setForm((f) => ({ ...f, url: e.target.value }))}
              placeholder="https://facebook.com/groups/..."
              className="w-full h-9 rounded-lg border border-gray-300 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
        </div>
        {formError && <p className="text-xs text-red-600 mt-2">{formError}</p>}
        <button
          type="button"
          onClick={handleAdd}
          disabled={isPending}
          className="mt-4 inline-flex items-center gap-2 bg-teal-600 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-teal-700 disabled:opacity-50 transition-colors"
        >
          + Add Link
        </button>
      </div>

      {/* Links list */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        {links.length === 0 ? (
          <div className="px-6 py-12 text-center text-gray-400 text-sm">
            No links yet. Add your first social link above.
          </div>
        ) : (
          <ul className="divide-y divide-gray-100">
            {links.map((link) => (
              <li key={link.id} className="px-5 py-4">
                {editingId === link.id ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Label</label>
                      <input
                        value={editData.label}
                        onChange={(e) => setEditData((d) => ({ ...d, label: e.target.value }))}
                        className="w-full h-9 rounded-lg border border-gray-300 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">URL</label>
                      <input
                        value={editData.url}
                        onChange={(e) => setEditData((d) => ({ ...d, url: e.target.value }))}
                        className="w-full h-9 rounded-lg border border-gray-300 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                    </div>
                    <div className="sm:col-span-2 flex gap-2 mt-1">
                      <button
                        onClick={() => handleSaveEdit(link.id)}
                        disabled={isPending}
                        className="h-8 px-4 rounded-lg bg-teal-600 text-white text-xs font-semibold hover:bg-teal-700 disabled:opacity-50 transition-colors"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="h-8 px-3 rounded-lg border border-gray-200 text-xs text-gray-600 hover:bg-gray-50 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <PlatformIcon platform={link.platform} size={36} />
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-semibold ${link.isActive ? "text-gray-900" : "text-gray-400 line-through"}`}>
                        {link.label}
                      </p>
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-teal-600 hover:underline truncate block max-w-xs"
                      >
                        {link.url}
                      </a>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => handleToggle(link.id, link.isActive)}
                        disabled={isPending}
                        className={`text-xs px-2 py-1 rounded-md font-medium transition-colors disabled:opacity-50 ${
                          link.isActive
                            ? "bg-teal-50 text-teal-700 hover:bg-teal-100"
                            : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                        }`}
                      >
                        {link.isActive ? "Active" : "Hidden"}
                      </button>
                      <button
                        onClick={() => startEdit(link)}
                        className="text-xs text-gray-500 hover:text-teal-700 transition-colors px-1"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(link.id)}
                        disabled={isPending}
                        className="text-xs text-gray-400 hover:text-red-600 transition-colors px-1 disabled:opacity-50"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
