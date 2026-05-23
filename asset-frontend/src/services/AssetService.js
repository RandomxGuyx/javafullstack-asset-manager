import axios from "axios";

const API_URL = "http://localhost:8080/api/assets";

export const getAssets = () => {
  return axios.get(API_URL);
};

export const addAsset = (asset) => {
  return axios.post(API_URL, asset);
};

export const deleteAsset = (id) => {
  return axios.delete(`${API_URL}/${id}`);
};