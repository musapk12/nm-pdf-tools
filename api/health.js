module.exports = (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  if (req.method !== "GET") {
    return res.status(405).json({
      ok: false,
      error: "Please use GET."
    });
  }

  return res.status(200).json({
    ok: true,
    service: "NM PDF Tools API",
    message: "Backend is online!"
  });
};
