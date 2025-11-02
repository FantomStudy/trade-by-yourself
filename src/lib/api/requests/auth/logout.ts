export const logout = async (): Promise<{ message: string }> => {
  const response = await fetch("http://localhost:3000/auth/logout", {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
  });

  return response.json();
};
