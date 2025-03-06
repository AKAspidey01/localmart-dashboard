
const storedToken = localStorage.getItem('authToken');
const tokenObject = storedToken ? JSON.parse(storedToken) : null;
const token = tokenObject ? tokenObject.token : null;



const config = {
    api: "https://stage-api.localmart.app:8443/",
    // api: "http://localhost:8142/api/v1/",
    options: {
      headers: {
        "content-type": "application/json"
      },
    },
  };

  
  const hostUrl = "https://stage-api.localmart.app:8443";


  const handleResponse = (response) => {
    if (response.status == 200 || response.status == 201) {
      return response.json();
    } else {
      throw Error(response.json() | "error");
    }
  };


  export { config, hostUrl, handleResponse };
  