import axios from "axios";

export const questions = async () => {
  try {
    const data = await axios.get("http://localhost:8000/api/questions");
    console.log(data.data?.data);
  } catch (error) {
    console.log(error);
  }
};

questions();
