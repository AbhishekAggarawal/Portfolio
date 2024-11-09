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
    category: 'SyncBoard',
    title : "project 3",
    description: "Built SyncBoard, a modern, Notion-inspired notes app using Next.js with Shadcn UI for accessible components and zustand for state management. Integrated Convex for real-time data storage, Clerk for secure authentication, and Blocknote for rich-text editing, offering users a streamlined, customizable note-taking experience enriched with themes and emoji integration.",
    stack : [
      {name: 'Next.js'},
      {name: 'Clerk'},
      {name: 'BlockNote'},
      {name: 'EdgeStore'},
      {name: 'Convex'},
    ],
    image: '/assets/work/thumb3.png',
    live: "https://sync-board-app.vercel.app/",
    github: "https://github.com/AbhishekAggarawal/SyncBoard"
    
  },
  {
    num: '02' , 
    category: 'MaskMyFeed',
    title : "project 2",
    description: "Developed an anonymous feedback app utilizing secure protocols and OpenAI API for message suggestions, enabling candid, untraceable submissions while safeguarding user privacy.",
    stack : [
      {name: 'Next.js'},
      {name: 'Tailwind.css'},
      {name: 'Node.js'},
      {name: 'OpenAi API'} 
    ],
    image: '/assets/work/thumb2.png',
    live: "https://mask-my-feed.vercel.app/",
    github: "https://github.com/AbhishekAggarawal/MaskMyFeed"
  },
  {
    num: '03' ,
    category: 'Rapid Deploy',
    title : "project 3",
    description: "Engineered a sophisticated web application that empowers users to seamlessly deploy GitHub repositories via URL, leveraging React, Node.js, and Redis for optimal performance, with AWS S3 and Cloudflare Bucket for efficient artifact storage.",
    stack : [
      {name: 'React'},
      {name: 'Node.js'},
      {name: 'Redis'},
      {name: 'Cloudflare Bucket'}
    ],
    image: '/assets/work/thumb1.png',
    live: "",
    github: "https://github.com/AbhishekAggarawal/RapidDeploy.git" 
    
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
            <h2 className=" text-[42px] xl:mt-[-10px]  font-bold leading-none text-white group-hover:text-accent transition-all duration-500 capitalize  ">{project.category}

            </h2>
            {/* project description  */}
            <p className=" text-white/60  ">{project.description}</p>
            {/* stack  */}
            <ul className="flex gap-4  ">
              {project.stack.map((item , index) => {
                return <li key={index} className="  text-xl text-accent  ">
                    {item.name}
                    {index !== project.stack.length -1 && ','}
                </li>
              })}
            </ul>
            {/* border  */}
            <div className=" border border-white/20   "></div>
            {/* button  */}
            <div  className=" flex items-center gap-8    ">
              {/* live project button  */}
              <Link href={project.live} target={project.live !== "" ? '_blank' : undefined}   >
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


                {/* github project button  */}
              <Link href={project.github} target="_blank" >
                <TooltipProvider delayDuration={100}>
                  <Tooltip>
                    <TooltipTrigger className=" w-[60px]  h-[60px] rounded-full bg-white/5 flex justify-center items-center group  ">
                      <BsGithub className="text-white text-2xl group-hover:text-accent  "/>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Github repository</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </Link>


            </div>
          </div>


              {/* project photo */}

          <div className=" w-full xl:w-[50%] ">
            <Swiper  spaceBetween={30} slidesPerView={1} 
            className=" xl:h-[520px] mb-12 "
            onSlideChange={handleSlideChange}>
              {projects.map((project , index) => {
                return <SwiperSlide key={index}  className=" w-full  ">
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