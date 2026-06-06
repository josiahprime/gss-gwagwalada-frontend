import { motion } from "framer-motion";
import { Search } from "lucide-react";

const SearchIconAnimated = () => {
  return (
    <motion.div
      animate={{
        rotate: [-10, 10, -10], // tilt left-right-left
      }}
      transition={{
        duration: 1.2,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      className="inline-block"
    >
      <Search className="w-10 h-10  text-emerald-600" />
    </motion.div>
  );
};

export default SearchIconAnimated;
