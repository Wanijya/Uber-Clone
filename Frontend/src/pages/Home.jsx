import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="bg-cover bg-center bg-[url(https://img.freepik.com/free-photo/vertical-shot-traffic-light-with-number-13-stopwatch_181624-11218.jpg?t=st=1733476920~exp=1733480520~hmac=3e5c19a0f4276956a697d8a2592b59a76838e6bf00ec25fbe7fe5c97765bbeb1&w=360)] h-screen w-full flex justify-between flex-col pt-8">
      <img
        className="w-16 ml-8"
        src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png"
        alt=""
      />
      <div className="bg-white pb-7 py-4 px-4">
        <h2 className="text-3xl font-bold">Get Started with Uber</h2>
        <Link to="/login" className="w-full flex items-center justify-center bg-black text-white py-3 rounded mt-5">
          Continue
        </Link>
      </div>
    </div>
  );
};

export default Home;
