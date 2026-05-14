const KEY = "placementAnnouncements";

/* ---------- Helpers ---------- */

const load = () => {
  return JSON.parse(localStorage.getItem(KEY)) || [];
};

const save = (data) => {
  localStorage.setItem(KEY, JSON.stringify(data));
};

/* ---------- Public APIs ---------- */

// ✅ Get all announcements
export const getAnnouncements = () => {
  return load();
};

// ✅ Add announcement (ADMIN)
export const addAnnouncement = ({ title, message }) => {
  const announcements = load();

  announcements.unshift({
    id: Date.now(),
    title,
    message,
    time: new Date().toLocaleString(),
    read: false, // 🔔 unread by default
  });

  save(announcements);
};

// ✅ Delete announcement (ADMIN)
export const deleteAnnouncement = (id) => {
  const announcements = load().filter((a) => a.id !== id);
  save(announcements);
};

// ✅ Get unread count (STUDENT)
export const getUnreadCount = () => {
  return load().filter((a) => !a.read).length;
};

// ✅ Mark all as read (STUDENT)
export const markAllRead = () => {
  const announcements = load().map((a) => ({
    ...a,
    read: true,
  }));

  save(announcements);
};
