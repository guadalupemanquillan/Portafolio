import { motion } from "framer-motion";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";

export const Footer = () => {
  const navigate = useNavigate();
  const countRef = useRef(0);
  const tRef = useRef(null);
  const year = new Date().getFullYear();

  const handleCopyClick = () => {
    if (tRef.current) clearTimeout(tRef.current);
    const next = countRef.current + 1;
    if (next >= 5) {
      // reset and go to login
      countRef.current = 0;
      tRef.current = null;
      navigate("/login");
      return;
    }
    countRef.current = next;
    tRef.current = setTimeout(() => {
      countRef.current = 0;
    }, 1500);
  };

  return (
    <motion.footer
      className="footer"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <p>
        <span onClick={handleCopyClick}>
          &copy;
        </span>
        {" "}{year} Rocio Guadalupe Manquillan - Full Stack Developer
      </p>
    </motion.footer>
  );
};
