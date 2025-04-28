import { motion } from "framer-motion";

const RedLoader = () => {
  return (
    <div className="fixed top-0 left-0 w-full z-50">
      <motion.div
        className="h-1 bg-red-600"
        initial={{ width: "0%" }}
        animate={{ width: ["0%", "20%", "90%", "99%"] }}
        transition={{
          duration: 1,
          ease: "easeInOut",
          // times: [0, 0.3, 0.9],
        }}
      />
    </div>
  );
};

export default RedLoader;
