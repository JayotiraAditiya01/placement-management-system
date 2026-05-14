import { addLog } from "../../../utils/activityLogger";
import { useState, useEffect } from "react";
import API_BASE_URL from "../../../config/api";
const API = `${API_BASE_URL}/api/admin/announcements`;

const AnnouncementSection = ({
  announcements,
  setAnnouncements,
}) => {

  const [loading, setLoading] =
    useState(false);

  const [fetching, setFetching] =
    useState(true);

  /* ================= TOKEN ================= */

  const getToken = () =>
    localStorage.getItem(
      "access_token"
    ) ||
    localStorage.getItem(
      "token"
    );

  /* ================= FETCH ================= */

  const fetchAnnouncements =
    async () => {

      try {

        const token =
          getToken();

        if (!token) {

          console.warn(
            "No token found"
          );

          setAnnouncements([]);

          return;
        }

        setFetching(true);

        const res = await fetch(
          API,
          {

            headers: {

              Authorization:
                `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) {

          console.error(
            "Fetch failed with status:",
            res.status
          );

          setAnnouncements([]);

          return;
        }

        const data =
          await res.json();

        console.log(
          "Fetched announcements:",
          data
        );

        /* 🔥 STORE TIMESTAMP */

        const parsed =
          Array.isArray(data)
            ? data.map((a) => ({
                ...a,

                created_at_raw:
                  a.created_at,

                created_at_ts:
                  new Date(
                    a.created_at
                  ).getTime(),
              }))
            : [];

        setAnnouncements(
          parsed
        );

      } catch (err) {

        console.error(
          "Fetch error:",
          err
        );

        setAnnouncements([]);

      } finally {

        setFetching(false);
      }
    };

  useEffect(() => {

    fetchAnnouncements();

  }, []);

  /* ================= CREATE ================= */

  const handleSubmit =
    async (e) => {

      e.preventDefault();

      setLoading(true);

      const token =
        getToken();

      const title =
        e.target.title.value;

      const message =
        e.target.message.value;

      try {

        const res =
          await fetch(
            API,
            {

              method: "POST",

              headers: {

                "Content-Type":
                  "application/json",

                Authorization:
                  `Bearer ${token}`,
              },

              body:
                JSON.stringify({
                  title,
                  message,
                }),
            }
          );

        const result =
          await res.json();

        if (
          res.ok &&
          result.id
        ) {

          const newItem = {

            ...result,

            created_at_raw:
              result.created_at,

            created_at_ts:
              new Date(
                result.created_at
              ).getTime(),
          };

          setAnnouncements(
            (prev) => [
              newItem,
              ...prev,
            ]
          );

        } else {

          await fetchAnnouncements();
        }

        /* 🔥 ACTIVITY LOGGER */

        await addLog({

          module:
            "Announcements",

          action:
            `Added announcement: ${title}`,

          type:
            "success",
        });

        e.target.reset();

      } catch (err) {

        console.error(
          "Create error:",
          err
        );

      } finally {

        setLoading(false);
      }
    };

  /* ================= DELETE ================= */

  const handleDelete =
    async (
      id,
      title
    ) => {

      const token =
        getToken();

      try {

        await fetch(
          `${API}/${id}`,
          {

            method:
              "DELETE",

            headers: {

              Authorization:
                `Bearer ${token}`,
            },
          }
        );

        setAnnouncements(
          (prev) =>
            prev.filter(
              (a) =>
                a.id !== id
            )
        );

        /* 🔥 ACTIVITY LOGGER */

        await addLog({

          module:
            "Announcements",

          action:
            `Deleted announcement: ${title}`,

          type:
            "error",
        });

      } catch (err) {

        console.error(
          "Delete error:",
          err
        );
      }
    };

  if (
    !Array.isArray(
      announcements
    )
  )
    return null;

  return (

    <div style={container}>

      {/* ================= CREATE ================= */}

      <div style={card}>

        <h3 style={heading}>
          📢 Create Announcement
        </h3>

        <form
          onSubmit={
            handleSubmit
          }
        >

          <input
            name="title"

            required

            placeholder="Enter title..."

            style={input}
          />

          <textarea
            name="message"

            required

            placeholder="Write announcement..."

            style={textarea}
          />

          <button
            style={{
              ...publishBtn,

              opacity:
                loading
                  ? 0.7
                  : 1,
            }}

            disabled={
              loading
            }
          >

            {loading
              ? "Publishing..."
              : "Publish"}

          </button>

        </form>

      </div>

      {/* ================= LIST ================= */}

      <div style={card}>

        <h3 style={heading}>
          📋 Published Announcements
        </h3>

        {fetching ? (

          <p
            style={{
              textAlign:
                "center",
            }}
          >
            Loading...
          </p>

        ) : announcements.length ===
          0 ? (

          <div style={emptyBox}>

            <p>
              No announcements yet 🚀
            </p>

          </div>

        ) : (

          [...announcements]

            .sort(
              (a, b) =>
                b.created_at_ts -
                a.created_at_ts
            )

            .map((a) => (

              <div
                key={a.id}

                style={
                  announcementCard
                }
              >

                <div
                  style={{
                    flex: 1,
                  }}
                >

                  <div
                    style={
                      titleStyle
                    }
                  >
                    {a.title}
                  </div>

                  <div
                    style={
                      messageStyle
                    }
                  >
                    {a.message}
                  </div>

                  <div
                    style={date}
                  >

                    {formatStable(
                      a.created_at_ts
                    )}

                  </div>

                </div>

                <button
                  style={
                    deleteBtn
                  }

                  onClick={() =>
                    handleDelete(
                      a.id,
                      a.title
                    )
                  }
                >
                  Delete
                </button>

              </div>
            ))
        )}

      </div>

    </div>
  );
};

export default AnnouncementSection;

/* ================= HELPER ================= */

const formatStable = (
  timestamp
) => {

  try {

    if (!timestamp)
      return "Invalid date";

    const d =
      new Date(
        timestamp
      );

    return d.toLocaleString(
      "en-IN",
      {

        timeZone:
          "Asia/Kolkata",

        day: "2-digit",

        month: "short",

        year: "numeric",

        hour: "2-digit",

        minute: "2-digit",

        hour12: true,
      }
    );

  } catch {

    return "Invalid date";
  }
};

/* ================= STYLES ================= */

const container = {

  display: "flex",

  flexDirection:
    "column",

  gap: 25,
};

const card = {

  background:
    "#ffffff",

  padding: 25,

  borderRadius: 20,

  boxShadow:
    "0 5px 20px rgba(0,0,0,0.05)",
};

const heading = {

  marginBottom: 15,

  fontSize: 18,

  fontWeight: 700,
};

const input = {

  width: "100%",

  padding: 12,

  borderRadius: 10,

  border:
    "1px solid #ddd",

  marginBottom: 10,
};

const textarea = {

  width: "100%",

  padding: 12,

  borderRadius: 10,

  border:
    "1px solid #ddd",

  marginBottom: 10,

  minHeight: 80,
};

const publishBtn = {

  padding:
    "10px 18px",

  borderRadius: 10,

  background:
    "#4f46e5",

  color: "#fff",

  border: "none",

  cursor: "pointer",
};

const announcementCard = {

  display: "flex",

  justifyContent:
    "space-between",

  gap: 15,

  padding: 15,

  borderRadius: 14,

  background:
    "#f9fafb",

  marginBottom: 12,
};

const titleStyle = {

  fontWeight: 700,

  fontSize: 15,
};

const messageStyle = {

  marginTop: 5,

  color: "#374151",
};

const date = {

  marginTop: 8,

  fontSize: 12,

  color: "#64748b",
};

const deleteBtn = {

  padding:
    "6px 12px",

  borderRadius: 8,

  background:
    "#dc2626",

  color: "#fff",

  border: "none",

  height:
    "fit-content",

  cursor: "pointer",
};

const emptyBox = {

  textAlign: "center",

  padding: 20,

  color: "#64748b",
};