export interface VerifyCodeRequest {
  code: string;
}

export const verifyCode = async (data: VerifyCodeRequest) => {
  const response = await fetch("http://localhost:3000/auth/verify-code", {
    body: new URLSearchParams({ code: data.code }),
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
  });

  return response.json();
};
