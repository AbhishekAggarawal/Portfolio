"use client";

import { motion} from "framer-motion"
import React, {useState} from "react";
import { Swiper , SwiperSlide } from "swiper/react"
import "swiper/css"

import {BsArrowUpRight , BsGithub} from "react-icons/bs"
import { Tooltip , TooltipContent , TooltipProvider , TooltipTrigger } from "@/components/ui/tooltip";
import Link from "next/link";
import Image from "next/image";
import WorkSliderBtns from "@/components/ui/WorkSliderBtns";

const projects = [
  {
    num: '01' , 
    course: 'Computer Networks',
    description: "Completed a comprehensive Computer Networks course from Scaler Academy, gaining in-depth knowledge of network protocols, data communication, and network security principles.",
    outcome : [
      {name: ' Network Design and Configuration'},
      {name: 'Network Troubleshooting'},
      {name: 'Network Security'},
      {name: 'Network Protocols'}
    ],
    image: '/assets/certificates/certificate1.png',
    live: "https://drive.google.com/file/d/1foTQf9Ts00OAToWeQk8ncBmM8Hh5aATS/view?usp=sharing"
  },
  {
    num: '02' , 
    course: 'Google Cloud Study Jams',
    description: "Completed the Google Cloud Study Jams course, gaining hands-on experience with cloud computing services and building practical skills in deploying cloud-based solutions.",
    outcome : [
      {name: 'Google Cloud Platform'}
    ],
    image: '/assets/certificates/certificate2.jpg',
    live: "https://drive.google.com/file/d/16s3fdduhxwn_Q39RnVM3HlAOfg1Z1kzi/view?usp=sharing"
  },
  {
    num: '03' , 
    course: 'The Joy of Computing using Python (IIT Ropar)',
    description: "The Joy of Computing using Python is an NPTEL course designed to teach the basics of Python programming. It focuses on problem-solving and practical applications, making learning enjoyable and accessible for beginners.",
    outcome : [
      {name: ' Programming Basics'},
      {name: 'Problem Solving'},
      {name: 'Real-world Applications'},
      {name: 'Code Efficiency and Data Handling'}
    ],
    image: '/assets/certificates/certificate3.jpg',
    live: "https://drive.google.com/file/d/1fbBtLqpcI6AyilSyMsCVBfCEEHSRXDt8/view?usp=sharing"
  },
  
]

const Work = () => {

  const [project , setProject] = useState(projects[0])

  const handleSlideChange = (swiper : any) => {
    //get current slide index
    const currentIndex = swiper.activeIndex;
    //update project state based on current inedex
    setProject(projects[currentIndex]);
  }


  return (
    <motion.section initial={{opacity:0}} animate = {{opacity:1 , transition: {delay:2.4 , duration: 0.4 , ease : "easeIn"}}} className=" min-h-[70vh] flex flex-col justify-center py-12 xl:px-0  " >
      <div className="container mx-auto  ">
        <div className=" flex flex-col xl:flex-row xl:gap-[30px]  ">
          <div className=" w-full xl:w-[50%] gap-[30px]  xl:h-[400px] flex flex-col xl:justify-between order-2 xl:order-none ">

            <div className=" flex flex-col gap-[30px] h-[90%]  ">
              {/* outline num */}
              <div className=" text-8xl xl:mt-[-25px] leading-none font-extrabold text-transparent text-outline  ">{project.num}</div>
            </div>
            {/* project category */}
            <h2 className=" text-[42px]  font-bold leading-none text-white group-hover:text-accent transition-all duration-500 capitalize  ">{project.course}

            </h2>
            {/* project description  */}
            <p className=" text-white/60  ">{project.description}</p>
            {/* outcome  */}
            <ul className="flex gap-1 flex-col  ">
              {project.outcome.map((item , index) => {
                return <li key={index} className=" text-lg text-accent  ">
                    {item.name}
                    {index !== project.outcome.length -1 && ','}
                </li>
              })}
            </ul>
            {/* border  */}
            <div className=" border border-white/20   "></div>
            {/* button  */}
            <div  className=" flex items-center gap-8    ">
              {/* live project button  */}
              <Link href={project.live} target="_blank">
                <TooltipProvider delayDuration={100}>
                  <Tooltip>
                    <TooltipTrigger className=" w-[60px]  h-[60px] rounded-full bg-white/5 flex justify-center items-center group  ">
                      <BsArrowUpRight className="text-white text-2xl group-hover:text-accent  "/>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Live Project</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </Link>


        
        


            </div>
          </div>


              {/* project photo */}

          <div className=" w-full xl:w-[50%] ">
            <Swiper spaceBetween={30} slidesPerView={1} 
            className=" xl:h-[520px] mb-12 "
            onSlideChange={handleSlideChange}>
              {projects.map((project , index) => {
                return <SwiperSlide key={index} className=" w-full  ">
                  <div className=" h-[350px] relative group flex justify-center items-center bg-pink-50/20 rounded-xl ">
                    {/* overlay */}
                    <div className=" absolute top-0 bottom-0 w-full h-full bg-black/5 z-10  "></div>
                    {/* image  */}
                    <div className=" relative w-full h-full   ">
                      <Image src={project.image} fill className="object-cover rounded-xl  " alt=""/>
                    </div>
                  </div>
                </SwiperSlide>
              })}
              {/* slider button  */}
              <WorkSliderBtns 
              containerStyles = " flex gap-4 absolute right-1 bottom-[calc(50%_-_22px)] xl:bottom-[calc(50%_-_142px)] z-20 w-full justify-between xl:w-max xl:justify-none  "
              btnStyles = "bg-accent hover:bg-accent-hover text primary text-[22px] w-[44px] h-[44px] flex justify-center items-center transition-all rounded-full "/>
            </Swiper>
          </div>
        </div>
      </div>
    </motion.section>
  )
}

export default Work
