import API_BASE_URL from "../config/api";
const API_BASE =
  `${API_BASE_URL}/api/activity`;

/* ==================================================
   🇮🇳 GET IST TIMESTAMP
================================================== */

const getISTTimestamp =
  () => {

    const now =
      new Date();

    return new Intl.DateTimeFormat(
      "en-IN",
      {
        timeZone:
          "Asia/Kolkata",

        year: "numeric",

        month: "2-digit",

        day: "2-digit",

        hour: "2-digit",

        minute: "2-digit",

        second: "2-digit",

        hour12: true,
      }
    ).format(now);
  };

/* ==================================================
   🔥 GET TOKEN
================================================== */

const getToken =
  () => {

    return (

      localStorage.getItem(
        "access_token"
      )

      ||

      localStorage.getItem(
        "token"
      )

      ||

      ""
    );
  };

/* ==================================================
   🔥 GET COLLEGE ID
================================================== */

const getCollegeId =
  () => {

    return parseInt(

      localStorage.getItem(
        "college_id"
      )

      || 1
    );
  };

/* ==================================================
   🔥 CHECK JWT TOKEN
================================================== */

const isValidToken =
  (token) => {

    if (!token) {

      console.error(
        "❌ Missing JWT Token"
      );

      return false;
    }

    return true;
  };

/* ==================================================
   ADD NEW LOG
================================================== */

export const addLog = async ({
  module,
  action,
  type = "info",
}) => {

  try {

    /* ==================================================
       🔥 GET AUTH DATA
    ================================================== */

    const token =
      getToken();

    const collegeId =
      getCollegeId();

    /* ==================================================
       🔥 TOKEN CHECK
    ================================================== */

    if (
      !isValidToken(
        token
      )
    ) {

      return;
    }

    /* ==================================================
       VALIDATION
    ================================================== */

    if (
      !module ||
      !action
    ) {

      console.warn(
        "Invalid activity log"
      );

      return;
    }

    /* ==================================================
       🇮🇳 IST TIMESTAMP
    ================================================== */

    const istTimestamp =
      getISTTimestamp();

    /* ==================================================
       CREATE LOG OBJECT
    ================================================== */

    const newLog = {

      college_id:
        collegeId,

      module:
        module,

      action:
        action,

      type:
        type,

      timestamp:
        istTimestamp,
    };

    /* ==================================================
       SAVE TO BACKEND DATABASE
    ================================================== */

    const response =
      await fetch(
        `${API_BASE}/add`,
        {

          method: "POST",

          headers: {

            "Content-Type":
              "application/json",

            Authorization:
              `Bearer ${token}`,
          },

          body:
            JSON.stringify(
              newLog
            ),
        }
      );

    /* ==================================================
       🔥 SAFE JSON
    ================================================== */

    let data = {};

    try {

      data =
        await response.json();

    } catch {

      data = {};
    }

    /* ==================================================
       🔥 API ERROR
    ================================================== */

    if (
      !response.ok
    ) {

      console.error(
        "❌ Activity API Error:",
        data.message ||
        "Failed to add activity"
      );

      return;
    }

    console.log(
      "✅ Activity Log Added:",
      action,
      "| IST:",
      istTimestamp
    );

  } catch (err) {

    console.error(
      "❌ Error saving log:",
      err
    );
  }
};

/* ==================================================
   GET ALL LOGS
================================================== */

export const getLogs =
  async () => {

    try {

      /* ==================================================
         🔥 GET AUTH DATA
      ================================================== */

      const token =
        getToken();

      const collegeId =
        getCollegeId();

      /* ==================================================
         🔥 TOKEN CHECK
      ================================================== */

      if (
        !isValidToken(
          token
        )
      ) {

        return [];
      }

      /* ==================================================
         FETCH LOGS
      ================================================== */

      const response =
        await fetch(
          `${API_BASE}/all/${collegeId}`,
          {

            method: "GET",

            headers: {

              Authorization:
                `Bearer ${token}`,
            },
          }
        );

      /* ==================================================
         🔥 SAFE JSON
      ================================================== */

      let data = {};

      try {

        data =
          await response.json();

      } catch {

        data = {};
      }

      /* ==================================================
         🔥 API ERROR
      ================================================== */

      if (
        !response.ok
      ) {

        console.error(
          "❌ Fetch Logs Error:",
          data.message ||
          "Failed to fetch logs"
        );

        return [];
      }

      return (
        data.logs || []
      );

    } catch (err) {

      console.error(
        "❌ Error reading logs:",
        err
      );

      return [];
    }
  };

/* ==================================================
   DELETE SINGLE LOG
================================================== */

export const deleteLog =
  async (logId) => {

    try {

      const token =
        getToken();

      /* ==================================================
         🔥 TOKEN CHECK
      ================================================== */

      if (
        !isValidToken(
          token
        )
      ) {

        return false;
      }

      const response =
        await fetch(
          `${API_BASE}/delete/${logId}`,
          {

            method: "DELETE",

            headers: {

              Authorization:
                `Bearer ${token}`,
            },
          }
        );

      /* ==================================================
         🔥 SAFE JSON
      ================================================== */

      let data = {};

      try {

        data =
          await response.json();

      } catch {

        data = {};
      }

      /* ==================================================
         🔥 API ERROR
      ================================================== */

      if (
        !response.ok
      ) {

        console.error(
          "❌ Delete Log Error:",
          data.message ||
          "Failed to delete log"
        );

        return false;
      }

      return true;

    } catch (err) {

      console.error(
        "❌ Delete Log Error:",
        err
      );

      return false;
    }
  };

/* ==================================================
   DELETE FILTERED LOGS
================================================== */

export const deleteFilteredLogs =
  async (filterType) => {

    try {

      const token =
        getToken();

      const collegeId =
        getCollegeId();

      /* ==================================================
         🔥 TOKEN CHECK
      ================================================== */

      if (
        !isValidToken(
          token
        )
      ) {

        return false;
      }

      const response =
        await fetch(
          `${API_BASE}/delete-filtered`,
          {

            method: "DELETE",

            headers: {

              "Content-Type":
                "application/json",

              Authorization:
                `Bearer ${token}`,
            },

            body:
              JSON.stringify({

                college_id:
                  collegeId,

                filter:
                  filterType,
              }),
          }
        );

      /* ==================================================
         🔥 SAFE JSON
      ================================================== */

      let data = {};

      try {

        data =
          await response.json();

      } catch {

        data = {};
      }

      /* ==================================================
         🔥 API ERROR
      ================================================== */

      if (
        !response.ok
      ) {

        console.error(
          "❌ Delete Filtered Error:",
          data.message ||
          "Failed to delete logs"
        );

        return false;
      }

      return true;

    } catch (err) {

      console.error(
        "❌ Delete Filtered Error:",
        err
      );

      return false;
    }
  };

/* ==================================================
   CLEAR LOGS
================================================== */

export const clearLogs =
  () => {

    console.warn(

      "clearLogs disabled because logs are stored in PostgreSQL database."
    );
  };