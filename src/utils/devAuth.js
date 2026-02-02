export const loginAs = (role) => {
  localStorage.setItem(
    "user",
    JSON.stringify({
      id: "dev-id",
      name: role.toUpperCase(),
      role: role,
    })
  );

  localStorage.setItem("token", "dev-token");
};

export const logout = () => {
  localStorage.removeItem("user");
  localStorage.removeItem("token");
};
