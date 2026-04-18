async function test() {
  const response = await fetch("http://smarttrack.ctbsplus.dtdc.com/ratecalapi/PincodeApiCall", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ orgPincode: "160020", desPincode: "390012" })
  });
  const data = await response.json();
  console.log(JSON.stringify(data, null, 2));
}
test();
