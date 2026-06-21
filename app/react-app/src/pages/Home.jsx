import React, { useEffect, useState } from "react";
import { LogoutBtn } from "../components";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

function Home() {
  const status = useSelector((state) => state.auth.status);

  const navigate = useNavigate()

  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMouse({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // 🔥 Increase movement factors for bigger movement
  const calcTransform = (factorX, factorY) => ({
    x: (mouse.x - window.innerWidth / 2) * factorX,
    y: (mouse.y - window.innerHeight / 2) * factorY,
  });

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* ✅ Bigger, faster movement */}
      <motion.div
        className="absolute w-40 h-40 bg-purple-500/40 rounded-full"
        animate={calcTransform(0.05, 0.05)} // ⬅ increased from 0.02 to 0.05
        transition={{ type: "spring", stiffness: 80, damping: 10 }} // faster spring
        style={{ top: "15%", left: "20%" }}
      />

      <motion.div
        className="absolute w-56 h-56 bg-pink-400/40 rounded-full"
        animate={calcTransform(-0.05, 0.04)}
        transition={{ type: "spring", stiffness: 80, damping: 10 }}
        style={{ top: "50%", left: "60%" }}
      />

      <motion.div
        className="absolute w-32 h-32 bg-cyan-400/40 rounded-full"
        animate={calcTransform(0.04, -0.05)}
        transition={{ type: "spring", stiffness: 80, damping: 10 }}
        style={{ top: "70%", left: "25%" }}
      />

      <motion.div
        className="absolute w-48 h-48 bg-green-400/40 rounded-full"
        animate={calcTransform(-0.04, 0.04)}
        transition={{ type: "spring", stiffness: 80, damping: 10 }}
        style={{ top: "30%", left: "75%" }}
      />

      <motion.div
        className="absolute w-36 h-36 bg-yellow-400/40 rounded-full"
        animate={calcTransform(0.05, -0.04)}
        transition={{ type: "spring", stiffness: 80, damping: 10 }}
        style={{ top: "80%", left: "50%" }}
      />

      {/* ✅ Main content stays the same */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-5xl md:text-7xl font-extrabold mb-4 text-black">
          Welcome to Campusbuzz!
        </h1>
        {status ? (
          <div>

            <p className="text-lg md:text-xl text-black mb-3 max-w-xl">
              <Link to={"/events"} className=" underline text-blue-800 hover:text-blue-600 transition visited:text-violet-800">discover your favourite events</Link>
            </p>
            <p className="text-lg md:text-xl text-black mb-8 max-w-xl">
              <Link to={"/user"} className=" underline text-blue-800 hover:text-blue-600 transition visited:text-violet-800">Navigate to dashboard</Link>
            </p>
            <LogoutBtn />
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              to="/auth"
              className="px-6 py-3 rounded-full bg-black/80 text-white font-semibold hover:bg-black transition"
            >
              Create Account
            </Link>
            <Link
              to="/auth/login"
              className="px-6 py-3 rounded-full border border-black text-black font-semibold hover:bg-black hover:text-white transition"
            >
              Sign In
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;