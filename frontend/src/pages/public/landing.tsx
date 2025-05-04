import { useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";
import { Github, LogIn, MoveRight } from "lucide-react";
import { Button } from "@/components/ui/button";
// import { SplashCursor } from "@/components/custom/cursor";
import { useNavigate } from "react-router-dom";

function Hero() {
  const [titleNumber, setTitleNumber] = useState(0);
  const titles = useMemo(
    () => ["amazing", "new", "wonderful", "beautiful", "smart"],
    []
  );
  const navigate = useNavigate();

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (titleNumber === titles.length - 1) {
        setTitleNumber(0);
      } else {
        setTitleNumber(titleNumber + 1);
      }
    }, 2000);
    return () => clearTimeout(timeoutId);
  }, [titleNumber, titles]);

  return (
    <div className="w-full">
      <div className="container mx-auto">
        <div className="flex gap-8 py-20 lg:py-40 items-center justify-center flex-col">
          <div>
            <a href="https://github.com/sujal8976/sync2gether" target="_blank">
              <Button variant="secondary" size="sm" className="gap-4 cursor-pointer">
                <Github className="w-4 h-4" /> Github
              </Button>
            </a>
          </div>
          <div className="flex gap-4 flex-col">
            <h1 className="text-5xl md:text-7xl max-w-2xl tracking-tighter text-center font-regular">
              <span className="text-spektr-cyan-50">This is something</span>
              <span className="relative flex w-full justify-center overflow-hidden text-center md:pb-4 md:pt-1">
                &nbsp;
                {titles.map((title, index) => (
                  <motion.span
                    key={index}
                    className="absolute font-semibold"
                    initial={{ opacity: 0, y: "-100" }}
                    transition={{ type: "spring", stiffness: 50 }}
                    animate={
                      titleNumber === index
                        ? {
                            y: 0,
                            opacity: 1,
                          }
                        : {
                            y: titleNumber > index ? -150 : 150,
                            opacity: 0,
                          }
                    }
                  >
                    {title}
                  </motion.span>
                ))}
              </span>
            </h1>

            <p className="text-lg md:text-xl leading-relaxed tracking-tight text-muted-foreground max-w-2xl text-center">
              Managing a small business today is already tough. Avoid further
              complications by ditching outdated, tedious trade methods. Our
              goal is to streamline SMB trade, making it easier and faster than
              ever.
            </p>
          </div>
          <div className="flex flex-row gap-3">
            <Button size="lg" className="gap-4 cursor-pointer" onClick={() => navigate('/auth/login')}>
              Login <LogIn className="w-4 h-4" />
            </Button>
            <Button
              size="lg"
              className="gap-4 cursor-pointer"
              variant="outline"
              onClick={() => navigate('/auth/signup')}
            >
              Sign up here <MoveRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export { Hero };

export default function Home() {
  return (
    <div className="block">
      {/* <SplashCursor /> */}
      <Hero />
    </div>
  );
}
