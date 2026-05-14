const DEFAULT_DATA = {
  students: [],
};

export const getPlacementData = () => {
  const data = localStorage.getItem("placementData");
  return data ? JSON.parse(data) : DEFAULT_DATA;
};

export const savePlacementData = (data) => {
  localStorage.setItem("placementData", JSON.stringify(data));
};

// Student adds profile
export const addStudent = (student) => {
  const data = getPlacementData();

  data.students.push({
    id: Date.now(),
    name: student.name,
    branch: student.branch,
    cgpa: student.cgpa,
    skills: student.skills,
    phone: student.phone,
    email: student.email,
    city: student.city,
    bio: student.bio,
    languages: student.languages,
    resume: student.resume,      // link or file name
    linkedin: student.linkedin,  // LinkedIn URL
    status: "UNPLACED",
  });

  savePlacementData(data);
};


// Admin marks student as placed
export const markStudentPlaced = (id) => {
  const data = getPlacementData();
  data.students = data.students.map((s) =>
    s.id === id ? { ...s, status: "PLACED" } : s
  );
  savePlacementData(data);
};

// Analytics helpers
export const getStats = () => {
  const data = getPlacementData();
  const total = data.students.length;
  const placed = data.students.filter((s) => s.status === "PLACED").length;
  const unplaced = total - placed;

  return { total, placed, unplaced };
};
