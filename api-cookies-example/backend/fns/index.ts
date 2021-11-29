const cookie = require("cookie");

exports.handler = async (event, context) => {
  console.log("Event", event);
  console.log("Headers", event.headers);

  const jwtCookie = cookie.serialize("jwt", "SampleToken", {
    secure: true,
    sameSite: "none",
    // domain: "apigw-cookies-test.netlify.app",
    // domain: "localhost:3000/",
    httpOnly: true,
    path: "/",
    expires: new Date(new Date().getTime() + 1000 * 1000),
  });

  return {
    statusCode: 200,
    body: JSON.stringify({ message: "Hello World" }),
    headers: {
      "Set-Cookie": jwtCookie,
      "Content-Type": "application/json",
      // "Access-Control-Allow-Origin": "https://apigw-cookies-test.netlify.app",
      // "Access-Control-Allow-Headers": "*",
      // "Access-Control-Allow-Methods": "*",
      "Access-Control-Allow-Credentials": true,
    },
  };
  // context.done(null, { Cookie: jwtCookie });
};
