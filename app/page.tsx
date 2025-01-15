"use client"

import Social from "@/components/Social";
import { Button } from "@/components/ui/button";
import {FiDownload} from "react-icons/fi"
import { useEffect , useState } from "react";
import Photo from "@/components/Photo";
import Stats from "@/components/Stats";
import Link from "next/link";


const Home = () => {
  const [loopNum , setLoopNum] = useState(0);
  const [isDeleting , setIsDeleting] = useState(false);
  const toRotate = ["bhishek Aggarwal." , " Web Developer!" , " Software Engineer!" , " Data Analyst!"];
  const [text , setText] = useState('');
  const period = 100;

  const [delta , setDelta] = useState(period);

  useEffect(()=>{
    let ticker = setInterval(()=>{
      tick();
    } , delta)

    return ()=>{
      clearInterval(ticker)
    };
  },[text])

  const tick =()=> {
    let i = loopNum % toRotate.length;
    let fullText = toRotate[i];
    let updatedText = isDeleting ? fullText.substring(0 , text.length - 1) : fullText.substring(0 , text.length + 1);

    setText(updatedText);

    if(isDeleting){
      setDelta(period => period/1.5)
    }

    if(!isDeleting && updatedText === fullText){
      setIsDeleting(true);
      setDelta(period);
    }
    else if(isDeleting && updatedText === ''){
      setIsDeleting(false);
      setLoopNum(loopNum+1);
      setDelta(250);
    }
  }

  return (
    <section className="h-full">
      <div className="container mx-auto h-full">
        <div className="flex flex-col xl:flex-row items-center justify-between xl:pt-8
         xl:pb-24">
          <div className="text-center xl:text-left order-2 xl:order-none">
            <span className="text-xl">MERN & More: Crafting Digital Solutions</span>
            <h1 className="h2">
              Hello I'm <br /><span className="text-accent">A{text}</span>
              </h1>
              <p className="max-w-[500px] mb-9 mt-8 text-white/80 text-lg ">
              "Skilled in building dynamic and responsive 
              web applications using the MERN stack, with 
              a strong foundation in software development 
              principles and best practices. Proficient in
               crafting efficient, scalable solutions tailored 
               to meet diverse project needs."
              </p>
              <div className="flex flex-col xl:flex-row items-center gap-8">
                <Link href="https://drive.google.com/file/d/1SpVEEuf9CTFe3i1NsxtE7mvVoZG0rWoK/view?usp=sharing" target="_blank">
                <Button variant="outline" size="lg" className="uppercase flex items-center gap-2">
                  <span>
                    Download Resume
                  </span>
                  <FiDownload className="text-xl"/>
                </Button>
                </Link>
                
                <div className="mb-8 xl:mb-0">
                  <Social containerStyles="flex gap-6" iconStyles="w-9 h-9 border border-accent 
                  rounded-full flex justify-center items-center text-accent text-base hover:bg-accent 
                  hover:text-primary hover:transition-all duration-500"/>
                </div>
              </div>
          </div>
          <div className="order-1 xl:order-none mb-8 xl:mb-0">
            <Photo/>
          </div>

        </div>
      </div>
      <Stats/>
    </section>

  )
}

export default Home
