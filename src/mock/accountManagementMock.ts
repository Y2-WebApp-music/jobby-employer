export type AccountManagementItem = {
  id: number;
  employeeId: string;
  name: string;
  email: string;
  role: "Admin" | "Recruiter" | "HR";
};

const mockNames = [
  "Pimnara Srisuk",
  "Thanawat Chansiri",
  "Napat Kittikul",
  "Ploypailin Arun",
  "Kittipong Manee",
  "Sasima Chotika",
  "Nuttapon Siriwat",
  "Kanyarat Charoen",
  "Patcharin Wongchai",
  "Jirapat Kulnarin",
];

const mockRoles: AccountManagementItem["role"][] = ["Admin", "Recruiter", "HR"];

export const accountManagementMock: AccountManagementItem[] = Array.from(
  { length: 230 },
  (_, index) => {
    const id = index + 1;
    const name = mockNames[index % mockNames.length];
    const role = mockRoles[index % mockRoles.length];

    return {
      id,
      employeeId: `A${String(333333 + id).padStart(6, "0")}`,
      name,
      email: `${name.toLowerCase().replace(/\s+/g, ".")}@jobby.co`,
      role,
    };
  },
);
