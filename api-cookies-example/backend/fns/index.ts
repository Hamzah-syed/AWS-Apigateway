const cookie = require("cookie");

exports.handler = async (event, context) => {
  console.log(event["Cookie"]);

  const jwtCookie = cookie.serialize("jwt", "SampleToken", {
    // secure: false,
    sameSite: "strict",
    httpOnly: true,
    path: "/",
    expires: new Date(new Date().getTime() + 100 * 1000),
  });

  return {
    statusCode: 200,
    body: JSON.stringify({ message: "Hello World" }),
    headers: {
      "Set-Cookie": jwtCookie,
      "Content-Type": "application/json",
      // "Access-Control-Allow-Origin": "*",
      // "Access-Control-Allow-Headers": "*",
      // "Access-Control-Allow-Methods": "*",
      // "Access-Control-Allow-Credentials": true,
    },
  };
  // context.done(null, { Cookie: jwtCookie });
};
