exports.handler = async (event) => {
  console.log("Hello");
  return {
    statusCode: 200,
    body: JSON.stringify("Hello World"),
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "*",
      "Access-Control-Allow-Methods": "*",
    },
  };
};
