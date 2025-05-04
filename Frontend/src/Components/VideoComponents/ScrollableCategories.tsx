import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface ScrollableCategoriesProps {
  isCollapsed: boolean;
}

interface categoriesprops {
  text: string;
}
const categories: categoriesprops[] = [
  { text: "All" },
  { text: "Music" },
  { text: "Gaming" },
  { text: "T-Series" },
  { text: "APIs" },
  { text: "Thrillers" },
  { text: "AI" },
  { text: "Movies" },
  { text: "Movies" },
  { text: "Movies" },
  { text: "Movies" },
  { text: "Movies" },
  { text: "Movies" },
  { text: "Movies" },
  { text: "Movies" },
  { text: "Movies" },
  { text: "Movies" },
  { text: "Movies" },
];
const ScrollableCategories = ({ isCollapsed }: ScrollableCategoriesProps) => {
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const checkScroll = () => {
    if (containerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;
      const tolerance = 5;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft + clientWidth + tolerance < scrollWidth - 1);
    }
  };

  const scroll = (direction: "left" | "right") => {
    if (containerRef.current) {
      const scrollAmount = direction === "left" ? -150 : 150;
      containerRef.current.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      });
      setTimeout(checkScroll, direction === "left" ? 300 : 500);
    }
  };

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener("scroll", checkScroll);
      checkScroll();
    }
    return () => {
      if (container) {
        container.removeEventListener("scroll", checkScroll);
      }
    };
  }, []);

  return (
    <div className="relative sm:mt-14 w-full caret-transparent sm:flex hidden">
      {showLeftArrow && (
        <div className="absolute flex -left-2 top-1/2 -translate-y-1/2 bg-gradient-to-r from-[#16181b] to-transparent/80 w-20 h-12 rounded-full z-20">
          <button
            onClick={() => scroll("left")}
            className="flex items-center justify-center text-xl bg-[#16181b] text-white h-12 w-12 rounded-full z-10 hover:bg-neutral-600"
          >
            &lt;
          </button>
        </div>
      )}

      <div
        ref={containerRef}
        onScroll={checkScroll}
        className={`relative flex space-x-4 overflow-x-scroll scrollbar-hidden ${
          isCollapsed
            ? "sm:max-w-[80vw] md:max-w-[85vw] lg:max-w-[86vw] xl:max-w-[90vw]"
            : "sm:max-w-[56vw] md:max-w-[65vw] lg:max-w-[72vw] xl:max-w-[80vw]"
        }`}
      >
        {categories.map((category, id) => (
          <div
            key={id}
            onClick={() =>
              navigate(
                `/search?q=${encodeURIComponent(category.text.toLowerCase())}`
              )
            }
            className="text-white flex-shrink-0 whitespace-nowrap bg-neutral-700 cursor-pointer hover:bg-neutral-400 py-1.5 px-4 font-[500] rounded-lg"
          >
            {category.text}
          </div>
        ))}
      </div>

      {showRightArrow && (
        <div className="absolute right-1 top-1/2 -translate-y-1/2 bg-gradient-to-l from-[#16181b] to-transparent/80 h-12 w-20 rounded-full z-20">
          <button
            onClick={() => scroll("right")}
            className="absolute right-0 top-1/2 flex justify-center items-center text-xl -translate-y-1/2 bg-[#16181b] text-white h-12 w-12 rounded-full z-10 hover:bg-neutral-600"
          >
            &gt;
          </button>
        </div>
      )}
    </div>
  );
};

export default ScrollableCategories;
