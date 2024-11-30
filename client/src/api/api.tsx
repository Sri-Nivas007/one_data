import axios from "axios";

export interface ImageDataResponse {
    id: string;
    image_url: string;
    tags: string[];
}

// Create an Axios instance
const API = axios.create({ baseURL: import.meta.env.VITE_BACKEND_URL }); // Update URL as needed

// Add a request interceptor to attach the token in the Authorization header
API.interceptors.request.use(
    (config) => {
        // Skip token attachment for signup and login requests
        if (!config.url?.includes("signup") && !config.url?.includes("login")) {
            const token = localStorage.getItem("token");

            if (token) {
                // Attach token in the Authorization header if it exists
                config.headers["Authorization"] = `Bearer ${token}`;
            }
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Define all your API calls as functions
const Signup = async (data: {
    name: string;
    email: string;
    password: string;
}) => {
    try {
        console.log("sfsfsfs");
        const response = await API.post(`/signup`, data);
        return response.data; // Return the response for further handling
    } catch (error) {
        console.log("error", error);
    }
};

const Login = async ({
    email,
    password,
}: {
    email: string;
    password: string;
}) => {
    try {
        const response = await API.post(`/login`, {
            email,
            password,
        });
        return response.data; // Assuming the response contains a 'token' and user info
    } catch (error) {
        console.error("Error logging in:", error);
        throw error; // Rethrow the error so it can be caught in the calling function
    }
};
const getData = async (): Promise<ImageDataResponse[]> => {
    try {
        const response = await API.get(`/getimages`);
        return response.data;
    } catch (error) {
        console.error("Error fetching images:", error);
        throw error;
    }
};

const Getprofile = async () => {
    try {
        const response = await API.get("/profile");
        return response; // Returns user data
    } catch (error) {
        console.error("Error fetching user data:", error);
        throw error;
    }
};

const Createpin = async (formData: FormData) => {
    try {
        const response = await API.post("/create/pin", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return response.data; // Returns the data from the response
    } catch (error) {
        console.error("Error creating pin:", error);
        throw error;
    }
};

const GetimagesBYid = async (id: string) => {
    try {
        console.log(333);
        const response = await API.get(`/getimages/${id}`); // Fixed URL and removed formData
        console.log("response", response.data);
        return response; // Returns the data from the response
    } catch (error) {
        console.error("Error fetching image by ID:", error);
        throw error;
    }
};

const ToggleLike = async (id: string) => {
    try {
        const response = await API.post(`/pin/${id}/like`); // Fixed URL and changed to POST
        return response; // Returns the data from the response
    } catch (error) {
        console.error("Error toggling like:", error);
        throw error;
    }
};

const ToggleFollow = async (id: string) => {
    try {
        const response = await API.post(`/users/${id}/follow`); // Fixed URL and changed to POST
        return response; // Returns the data from the response
    } catch (error) {
        console.error("Error toggling follow:", error);
        throw error;
    }
};







// Export the functions as default
export {
    Signup,
    Login,
    Getprofile,
    Createpin,
    getData,
    GetimagesBYid,
    ToggleLike,
    ToggleFollow,
};
