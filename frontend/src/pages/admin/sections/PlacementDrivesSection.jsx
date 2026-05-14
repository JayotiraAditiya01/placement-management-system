import React, {
  useEffect,
  useState,
} from "react";

import {
  Plus,
  Trash2,
  Search,
  BriefcaseBusiness,
  Building2,
  Layers3,
  CheckCircle2,
  User,
  GraduationCap,
  Phone,
  Mail,
} from "lucide-react";

import { addLog } from "../../../utils/activityLogger";
import API_BASE_URL from "../../../config/api";
/* ================================================== */
/* API */
/* ================================================== */
const API_BASE =
  `${API_BASE_URL}/api/placement-drive`;

const PlacementDrivesSection = () => {

  /* ================================================== */
  /* STATES */
  /* ================================================== */
  const [companyName, setCompanyName] =
    useState("");

  const [driveName, setDriveName] =
    useState("");

  const [phases, setPhases] = useState([
    "Aptitude Test",
  ]);

  const [newPhase, setNewPhase] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const [error, setError] =
    useState("");

  const [drives, setDrives] =
    useState([]);

  /* ================================================== */
  /* STUDENT SEARCH */
  /* ================================================== */
  const [searchQuery, setSearchQuery] =
    useState("");

  const [searchLoading, setSearchLoading] =
    useState(false);

  const [students, setStudents] =
    useState([]);

  /* ================================================== */
  /* PHASE UPDATE STATES */
  /* ================================================== */
  const [selectedDrive, setSelectedDrive] =
    useState({});

  const [selectedPhases, setSelectedPhases] =
  useState({});

  const [selectedStatus, setSelectedStatus] =
    useState({});

  const [updateLoading, setUpdateLoading] =
    useState({});

  const [studentMessages, setStudentMessages] =
    useState({});

  const token =
    localStorage.getItem("access_token");

  /* ================================================== */
  /* FETCH DRIVES */
  /* ================================================== */
  useEffect(() => {

    fetchDrives();

  }, []);

  /* ================================================== */
  /* LIVE SEARCH */
  /* ================================================== */
  useEffect(() => {

    if (!searchQuery.trim()) {

      setStudents([]);

      return;
    }

    const delayDebounce = setTimeout(() => {

      searchStudents();

    }, 400);

    return () =>
      clearTimeout(delayDebounce);

  }, [searchQuery]);

  /* ================================================== */
  /* FETCH DRIVES */
  /* ================================================== */
  const fetchDrives = async () => {

    try {

      const res = await fetch(
        `${API_BASE}/all`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (data.success) {
        setDrives(data.drives || []);
      }

    } catch (err) {

      console.error(
        "Fetch drives error:",
        err
      );

    }
  };

  /* ================================================== */
  /* SEARCH STUDENTS */
  /* ================================================== */
  const searchStudents = async () => {

    try {

      setSearchLoading(true);

      const res = await fetch(
        `${API_BASE}/search-students?query=${searchQuery}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (data.success) {

        setStudents(
          data.students || []
        );

      }

    } catch (err) {

      console.error(
        "Search error:",
        err
      );

    } finally {

      setSearchLoading(false);

    }
  };

  /* ================================================== */
  /* ADD PHASE */
  /* ================================================== */
  const handleAddPhase = () => {

    if (!newPhase.trim()) return;

    setPhases([
      ...phases,
      newPhase.trim(),
    ]);

    setNewPhase("");
  };

  /* ================================================== */
  /* DELETE PHASE */
  /* ================================================== */
  const handleDeletePhase = (index) => {

    const updated = phases.filter(
      (_, i) => i !== index
    );

    setPhases(updated);
  };

  const handleDeleteDrive = async (driveId, companyName) => {

  try {

    const confirmDelete = window.confirm(
      `Delete ${companyName} placement drive?`
    );

    if (!confirmDelete) return;

    const res = await fetch(
      `${API_BASE}/delete/${driveId}`,
      {

        method: "DELETE",

        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await res.json();

    if (!res.ok) {

      alert(
        data.message ||
        "Failed to delete drive"
      );

      return;
    }

    await  addLog({

      module: "Placement Drive",

      type: "error",

      action:
        `Deleted placement drive for ${companyName}`,
    });

    fetchDrives();

  } catch (err) {

    console.error(
      "Delete drive error:",
      err
    );
  }
};

  /* ================================================== */
  /* CREATE DRIVE */
  /* ================================================== */
  const handleCreateDrive = async () => {

    try {

      setLoading(true);

      setMessage("");

      setError("");

      const res = await fetch(
        `${API_BASE}/create`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",

            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            company_name: companyName,

            drive_name: driveName,

            phases: phases,
          }),
        }
      );

      

      const data = await res.json();

      if (!res.ok) {

        setError(
          data.message ||
          "Failed to create drive"
        );

        return;
      }

      setMessage(
        "Placement drive created successfully"
      );

      await addLog({

  module: "Placement Drive",

  type: "success",

  action:
    `Created placement drive for ${companyName} (${driveName})`,
});

      setCompanyName("");

      setDriveName("");

      setPhases([
        "Aptitude Test",
      ]);

      setNewPhase("");

      fetchDrives();

    } catch (err) {

      console.error(err);

      setError(
        "Server error occurred"
      );

    } finally {

      setLoading(false);

    }
  };

  /* ================================================== */
  /* UPDATE PHASE STATUS */
  /* ================================================== */
  const handleUpdatePhaseStatus = async (
    studentId
  ) => {

    try {

      const driveId =
        selectedDrive[studentId];

      const phaseIds =
        selectedPhases[studentId]
        || [];

      const status =
        selectedStatus[studentId];

      if (
        !driveId ||
        !phaseIds.length ||
        !status
      ) {

        setStudentMessages((prev) => ({
          ...prev,

          [studentId]: {
            type: "error",

            text:
              "Please select drive, phase and status",
          },
        }));

        return;
      }

      setUpdateLoading((prev) => ({
        ...prev,
        [studentId]: true,
      }));

      const res = await fetch(
        `${API_BASE}/update-phase-status`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",

            Authorization:
              `Bearer ${token}`,
          },

          body: JSON.stringify({

            student_id: studentId,

            drive_id: parseInt(driveId),

            phase_ids: phaseIds,

            status: status,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {

        setStudentMessages((prev) => ({
          ...prev,

          [studentId]: {
            type: "error",

            text:
              data.message ||
              "Failed to update status",
          },
        }));

        return;
      }

      setStudentMessages((prev) => ({
        ...prev,

        [studentId]: {
          type: "success",

          text:
            "Phase status updated successfully",
        },
      }));

      const studentData = students.find(
  (s) => s.id === studentId
);

const driveData = drives.find(
  (d) => d.id === parseInt(driveId)
);

const phaseNames =
  (driveData?.phases || [])
    .filter((p) =>
      phaseIds.includes(p.id)
    )
    .map(
      (p) => p.phase_name
    )
    .join(", ");

await addLog({

  module: "Placement Tracker",

  type:
    status === "CLEARED"
      ? "success"
      : status === "REJECTED"
      ? "error"
      : "info",

  action:
    `${studentData?.name || "Student"} updated to ${status} in ${
      phaseNames || "Phase"
    } round for ${
      driveData?.company_name || "Company"
    }`,
});

      searchStudents();

    } catch (err) {

      console.error(err);

      setStudentMessages((prev) => ({
        ...prev,

        [studentId]: {
          type: "error",

          text:
            "Server error occurred",
        },
      }));

    } finally {

      setUpdateLoading((prev) => ({
        ...prev,
        [studentId]: false,
      }));
    }
  };

  return (
    <div style={container}>

      {/* HEADER */}
      <div style={pageHeader}>

        <div style={headerLeft}>

          <div style={iconBox}>
            <BriefcaseBusiness size={24} />
          </div>

          <div>

            <h1 style={mainHeading}>
              Placement Drives
            </h1>

            <p style={subHeading}>
              Manage hiring phases,
              placement workflow and
              student tracking
            </p>

          </div>

        </div>

      </div>

      {/* CREATE DRIVE */}
      <div style={card}>

        <h2 style={sectionTitle}>
          Create Placement Drive
        </h2>

        {message && (
          <div style={successBox}>
            <CheckCircle2 size={18} />
            {message}
          </div>
        )}

        {error && (
          <div style={errorBox}>
            {error}
          </div>
        )}

        <input
          type="text"
          placeholder="Company Name"
          value={companyName}
          onChange={(e) =>
            setCompanyName(e.target.value)
          }
          style={inputStyle}
        />

        <input
          type="text"
          placeholder="Drive Name"
          value={driveName}
          onChange={(e) =>
            setDriveName(e.target.value)
          }
          style={inputStyle}
        />

        <div style={{ marginTop: "25px" }}>

          <h3 style={phaseHeading}>
            Placement Phases
          </h3>

          <div style={phaseInputWrapper}>

            <input
              type="text"
              placeholder="Add New Phase"
              value={newPhase}
              onChange={(e) =>
                setNewPhase(e.target.value)
              }
              style={{
                ...inputStyle,
                marginBottom: 0,
              }}
            />

            <button
              onClick={handleAddPhase}
              style={addButton}
            >
              <Plus size={18} />
            </button>

          </div>

          <div style={phaseListWrapper}>

            {phases.map(
              (phase, index) => (

                <div
                  key={index}
                  style={phaseCard}
                >

                  <span style={phaseText}>
                    Phase {index + 1}: {phase}
                  </span>

                  <button
                    onClick={() =>
                      handleDeletePhase(
                        index
                      )
                    }
                    style={deleteBtn}
                  >
                    <Trash2 size={18} />
                  </button>

                </div>

              )
            )}

          </div>

          <button
            onClick={handleCreateDrive}
            disabled={loading}
            style={{
              ...createBtn,
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading
              ? "Creating..."
              : "Create Placement Drive"}
          </button>

        </div>

      </div>

      {/* SAVED DRIVES */}
      <div style={card}>

        <h2 style={sectionTitle}>
          Saved Placement Drives
        </h2>

        {drives.length === 0 ? (

          <div style={emptyCard}>
            No placement drives created yet
          </div>

        ) : (

          <div style={drivesGrid}>

            {drives.map((drive) => (

              <div
                key={drive.id}
                style={driveCard}
              >

                <div style={driveTop}>

                  <div style={companyIcon}>
                    <Building2 size={20} />
                  </div>

                  <div>

                    <h3 style={driveCompany}>
                      {drive.company_name}
                    </h3>

                    <p style={driveNameStyle}>
                      {drive.drive_name}
                    </p>

                  </div>
                  <button
  onClick={() =>
    handleDeleteDrive(
      drive.id,
      drive.company_name
    )
  }

  style={savedDriveDeleteBtn}
>
  <Trash2 size={18} />
</button>

                </div>

                <div style={phaseSection}>

                  <div style={phaseLabel}>
                    <Layers3 size={16} />

                    Total Phases:
                    {" "}
                    {drive.total_phases}
                  </div>

                  <div style={phaseChips}>

                    {drive.phases.map(
                      (phase) => (

                        <div
                          key={phase.id}
                          style={chip}
                        >
                          {phase.phase_name}
                        </div>

                      )
                    )}

                  </div>

                </div>

              </div>

            ))}

          </div>

        )}

      </div>

      {/* STUDENT TRACKER */}
      <div style={card}>

        <h2 style={sectionTitle}>
          Student Placement Tracker
        </h2>

        <div style={searchWrapper}>

          <Search
            size={18}
            style={searchIcon}
          />

          <input
            type="text"
            placeholder="Search by name, section or roll number..."
            value={searchQuery}
            onChange={(e) =>
              setSearchQuery(e.target.value)
            }
            style={{
              ...inputStyle,
              paddingLeft: "45px",
              marginBottom: 0,
            }}
          />

        </div>

        {searchLoading && (
          <div style={loadingText}>
            Searching students...
          </div>
        )}

        {!searchLoading &&
          students.length === 0 &&
          searchQuery && (

            <div style={emptyCard}>
              No students found
            </div>

          )}

        <div style={studentGrid}>

          {students.map((student) => (

            <div
              key={student.id}
              style={studentCard}
            >

              <div style={studentTop}>

                <div style={studentAvatar}>
                  <User size={22} />
                </div>

                <div>

                  <h3 style={studentName}>
                    {student.name ||
                      "Unnamed Student"}
                  </h3>

                  <p style={studentBranch}>
                    {student.branch}
                    {" • "}
                    {student.section}
                  </p>

                </div>

              </div>

              <div style={studentInfo}>

                <div style={infoRow}>
                  <GraduationCap
                    size={16}
                  />

                  Roll No:
                  {" "}
                  {student.classRollNo ||
                    "N/A"}
                </div>

                <div style={infoRow}>
                  <Mail size={16} />
                  {student.email}
                </div>

                <div style={infoRow}>
                  <Phone size={16} />
                  {student.phone ||
                    "No phone"}
                </div>

              </div>

              <div style={statusBadge}>
                {student.status}
              </div>

              {/* DRIVE SELECT */}
              <div style={selectWrapper}>

                <label style={selectLabel}>
                  Select Drive
                </label>

                <select
                  value={
                    selectedDrive[
                      student.id
                    ] || ""
                  }

                  onChange={(e) => {

                    setSelectedDrive(
                      (prev) => ({
                        ...prev,

                        [student.id]:
                          e.target.value,
                      })
                    );

                    setSelectedPhases(
                      (prev) => ({
                        ...prev,

                        [student.id]:
                          [],
                      })
                    );
                  }}

                  style={selectStyle}
                >

                  <option value="">
                    Choose Drive
                  </option>

                  {drives.map((drive) => (

                    <option
                      key={drive.id}
                      value={drive.id}
                    >
                      {drive.company_name}
                    </option>

                  ))}

                </select>

              </div>

              {/* MULTI PHASE SELECT */}
<div style={selectWrapper}>

  <label style={selectLabel}>
    Select Phases
  </label>

  <div style={multiPhaseWrapper}>

    {(drives.find(
      (d) =>
        d.id ===
        parseInt(
          selectedDrive[
            student.id
          ]
        )
    )?.phases || []).map(
      (phase) => {

        const checked =
          (
            selectedPhases[
              student.id
            ] || []
          ).includes(
            phase.id
          );

        return (

          <label
            key={phase.id}
            style={multiPhaseItem}
          >

            <input
              type="checkbox"

              checked={checked}

              onChange={(e) => {

                setSelectedPhases(
                  (prev) => {

                    const existing =
                      prev[
                        student.id
                      ] || [];

                    if (
                      e.target.checked
                    ) {

                      return {

                        ...prev,

                        [student.id]:
                          [
                            ...existing,
                            phase.id,
                          ],
                      };
                    }

                    return {

                      ...prev,

                      [student.id]:
                        existing.filter(
                          (id) =>
                            id !==
                            phase.id
                        ),
                    };
                  }
                );
              }}
            />

            {phase.phase_name}

          </label>
        );
      }
    )}

  </div>

</div>

              {/* STATUS SELECT */}
              <div style={selectWrapper}>

                <label style={selectLabel}>
                  Select Status
                </label>

                <select
                  value={
                    selectedStatus[
                      student.id
                    ] || ""
                  }

                  onChange={(e) =>
                    setSelectedStatus(
                      (prev) => ({
                        ...prev,

                        [student.id]:
                          e.target.value,
                      })
                    )
                  }

                  style={selectStyle}
                >

                  <option value="">
                    Choose Status
                  </option>

                  <option value="PENDING">
                    PENDING
                  </option>

                  <option value="CLEARED">
                    CLEARED
                  </option>

                  <option value="REJECTED">
                    REJECTED
                  </option>

                </select>

              </div>

              {/* MESSAGE */}
              {studentMessages[
                student.id
              ] && (

                <div
                  style={{
                    ...studentMessage,

                    background:
                      studentMessages[
                        student.id
                      ].type === "success"
                        ? "rgba(34,197,94,0.15)"
                        : "rgba(239,68,68,0.15)",

                    color:
                      studentMessages[
                        student.id
                      ].type === "success"
                        ? "#4ade80"
                        : "#f87171",
                  }}
                >

                  {
                    studentMessages[
                      student.id
                    ].text
                  }

                </div>

              )}

              {/* UPDATE BUTTON */}
              <button
                onClick={() =>
                  handleUpdatePhaseStatus(
                    student.id
                  )
                }

                disabled={
                  updateLoading[
                    student.id
                  ]
                }

                style={{
                  ...updateBtn,

                  opacity:
                    updateLoading[
                      student.id
                    ]
                      ? 0.7
                      : 1,
                }}
              >

                {updateLoading[
                  student.id
                ]
                  ? "Updating..."
                  : "Update Phase Status"}

              </button>

            </div>

          ))}

        </div>

      </div>

    </div>
  );
};

export default PlacementDrivesSection;

/* ================================================== */
/* ===================== STYLES ===================== */
/* ================================================== */

const container = {
  padding: "10px 5px",
};

const pageHeader = {
  marginBottom: "28px",
};

const headerLeft = {
  display: "flex",
  alignItems: "center",
  gap: "16px",
};

const iconBox = {
  width: "55px",
  height: "55px",

  borderRadius: "16px",

  background:
    "linear-gradient(135deg, #4f46e5, #6366f1)",

  display: "flex",
  alignItems: "center",
  justifyContent: "center",

  color: "#ffffff",

  boxShadow:
    "0 10px 25px rgba(79,70,229,0.35)",
};

const mainHeading = {
  fontSize: "30px",
  fontWeight: "800",

  color: "#0f172a",

  margin: 0,
};

const subHeading = {
  color: "#64748b",

  marginTop: "4px",

  fontSize: "14px",
};

const card = {
  background: "#0f172a",

  borderRadius: "24px",

  padding: "28px",

  marginBottom: "30px",

  border:
    "1px solid rgba(255,255,255,0.06)",
};

const sectionTitle = {
  color: "#ffffff",

  fontSize: "24px",

  fontWeight: "700",

  marginBottom: "22px",
};

const inputStyle = {
  width: "100%",

  padding: "15px",

  borderRadius: "14px",

  border: "1px solid #334155",

  background: "#1e293b",

  color: "#ffffff",

  marginBottom: "15px",

  outline: "none",

  fontSize: "15px",
};

const phaseHeading = {
  color: "#e2e8f0",

  fontSize: "18px",

  marginBottom: "15px",
};

const phaseInputWrapper = {
  display: "flex",

  gap: "12px",

  marginBottom: "20px",
};

const addButton = {
  background:
    "linear-gradient(135deg, #2563eb, #4f46e5)",

  border: "none",

  color: "#ffffff",

  padding: "0px 20px",

  borderRadius: "14px",

  cursor: "pointer",

  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const phaseListWrapper = {
  display: "flex",
  flexDirection: "column",
  gap: "14px",
};

const phaseCard = {
  background: "#1e293b",

  padding: "16px 18px",

  borderRadius: "16px",

  display: "flex",

  justifyContent: "space-between",

  alignItems: "center",
};

const phaseText = {
  color: "#f8fafc",

  fontWeight: "500",
};

const multiPhaseWrapper = {

  display: "flex",

  flexDirection: "column",

  gap: "10px",

  background: "#0f172a",

  padding: "14px",

  borderRadius: "14px",

  border:
    "1px solid #334155",
};

const multiPhaseItem = {

  display: "flex",

  alignItems: "center",

  gap: "10px",

  color: "#ffffff",

  fontSize: "14px",
};

const deleteBtn = {
  background: "transparent",

  border: "none",

  color: "#ef4444",

  cursor: "pointer",
};

const createBtn = {
  width: "100%",

  marginTop: "25px",

  padding: "15px",

  borderRadius: "14px",

  border: "none",

  background:
    "linear-gradient(135deg, #4f46e5, #6366f1)",

  color: "#ffffff",

  fontWeight: "700",

  cursor: "pointer",

  fontSize: "15px",
};

const successBox = {
  background:
    "rgba(34,197,94,0.15)",

  border:
    "1px solid rgba(34,197,94,0.25)",

  color: "#4ade80",

  padding: "14px",

  borderRadius: "14px",

  marginBottom: "18px",

  display: "flex",
  alignItems: "center",
  gap: "10px",
};

const errorBox = {
  background:
    "rgba(239,68,68,0.15)",

  border:
    "1px solid rgba(239,68,68,0.25)",

  color: "#f87171",

  padding: "14px",

  borderRadius: "14px",

  marginBottom: "18px",
};

const drivesGrid = {
  display: "grid",

  gridTemplateColumns:
    "repeat(auto-fit, minmax(320px, 1fr))",

  gap: "20px",
};

const driveCard = {
  background: "#1e293b",

  borderRadius: "20px",

  padding: "22px",

  border:
    "1px solid rgba(255,255,255,0.06)",
};

const driveTop = {
  display: "flex",

  alignItems: "center",

  gap: "14px",

  marginBottom: "20px",
};

const savedDriveDeleteBtn = {

  marginLeft: "auto",

  width: "40px",

  height: "40px",

  borderRadius: "12px",

  border: "none",

  background:
    "rgba(239,68,68,0.15)",

  color: "#ef4444",

  cursor: "pointer",

  display: "flex",

  alignItems: "center",

  justifyContent: "center",

  transition: "0.2s",
};

const companyIcon = {
  width: "50px",

  height: "50px",

  borderRadius: "14px",

  background:
    "linear-gradient(135deg, #4f46e5, #7c3aed)",

  display: "flex",

  alignItems: "center",

  justifyContent: "center",

  color: "#ffffff",
};

const driveCompany = {
  color: "#ffffff",

  fontSize: "20px",

  margin: 0,
};

const driveNameStyle = {
  color: "#94a3b8",

  marginTop: "5px",

  fontSize: "14px",
};

const phaseSection = {
  marginTop: "10px",
};

const phaseLabel = {
  display: "flex",

  alignItems: "center",

  gap: "8px",

  color: "#cbd5e1",

  marginBottom: "12px",

  fontSize: "14px",
};

const phaseChips = {
  display: "flex",

  flexWrap: "wrap",

  gap: "10px",
};

const chip = {
  background:
    "rgba(99,102,241,0.18)",

  color: "#c7d2fe",

  padding: "8px 12px",

  borderRadius: "999px",

  fontSize: "13px",

  border:
    "1px solid rgba(99,102,241,0.25)",
};

const searchWrapper = {
  position: "relative",

  marginBottom: "25px",
};

const searchIcon = {
  position: "absolute",

  top: "15px",

  left: "15px",

  color: "#94a3b8",
};

const loadingText = {
  color: "#94a3b8",

  marginBottom: "20px",
};

const studentGrid = {
  display: "grid",

  gridTemplateColumns:
    "repeat(auto-fit, minmax(320px, 1fr))",

  gap: "20px",
};

const studentCard = {
  background: "#1e293b",

  borderRadius: "20px",

  padding: "22px",

  border:
    "1px solid rgba(255,255,255,0.06)",
};

const studentTop = {
  display: "flex",

  alignItems: "center",

  gap: "14px",

  marginBottom: "18px",
};

const studentAvatar = {
  width: "52px",

  height: "52px",

  borderRadius: "14px",

  background:
    "linear-gradient(135deg, #4f46e5, #6366f1)",

  display: "flex",

  alignItems: "center",

  justifyContent: "center",

  color: "#ffffff",
};

const studentName = {
  color: "#ffffff",

  margin: 0,

  fontSize: "18px",
};

const studentBranch = {
  color: "#94a3b8",

  marginTop: "4px",

  fontSize: "14px",
};

const studentInfo = {
  display: "flex",

  flexDirection: "column",

  gap: "12px",

  marginBottom: "18px",
};

const infoRow = {
  display: "flex",

  alignItems: "center",

  gap: "10px",

  color: "#cbd5e1",

  fontSize: "14px",
};

const statusBadge = {
  display: "inline-block",

  padding: "8px 14px",

  borderRadius: "999px",

  background:
    "rgba(99,102,241,0.18)",

  color: "#c7d2fe",

  fontSize: "13px",

  fontWeight: "600",

  marginBottom: "18px",
};

const selectWrapper = {
  marginTop: "18px",
};

const selectLabel = {
  display: "block",

  marginBottom: "8px",

  color: "#cbd5e1",

  fontSize: "14px",

  fontWeight: "600",
};

const selectStyle = {
  width: "100%",

  padding: "13px",

  borderRadius: "12px",

  background: "#0f172a",

  border: "1px solid #334155",

  color: "#ffffff",

  outline: "none",

  fontSize: "14px",
};

const updateBtn = {
  width: "100%",

  marginTop: "22px",

  padding: "14px",

  borderRadius: "14px",

  border: "none",

  background:
    "linear-gradient(135deg, #2563eb, #4f46e5)",

  color: "#ffffff",

  fontWeight: "700",

  cursor: "pointer",

  fontSize: "14px",
};

const studentMessage = {
  marginTop: "16px",

  padding: "12px",

  borderRadius: "12px",

  fontSize: "13px",

  fontWeight: "600",
};

const emptyCard = {
  background: "#1e293b",

  borderRadius: "18px",

  padding: "30px",

  textAlign: "center",

  color: "#94a3b8",

  border:
    "1px dashed rgba(255,255,255,0.08)",
};