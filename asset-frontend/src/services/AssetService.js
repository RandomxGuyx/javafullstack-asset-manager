import axios from "axios";

const API_URL = "http://localhost:8080/api/assets";

export const getAssets = () => axios.get(API_URL);

export const addAsset = (asset) => axios.post(API_URL, asset);