"use client"

import {
  FaAws,
  FaGithub,
  FaPython,
  FaDocker,
} from "react-icons/fa"

import {
  SiTensorflow,
  SiPytorch,
  SiPandas,
  SiNumpy,
  SiApachekafka,
  SiKubernetes,
  SiPostgresql,
  SiTypescript,
  SiNextdotjs,
  SiTailwindcss,
  SiNodedotjs,
  SiDocker,
  SiGit,
  

} from "react-icons/si"

const about = {
  title: "About Me",
  description: "I build data-driven AI systems, scalable analytics platforms, and production-ready pipelines. My focus is on turning complex data into reliable machine learning applications and actionable business intelligence.",

  info: [
    {
      fieldName: "Name:",
      FieldValue: "Abhishek Aggarwal"
    },
    {
      fieldName: "Phone:",
      FieldValue: "(+91) 8789830967"
    },
    {
      fieldName: "Experience:",
      FieldValue: "2+ Years"
    },
    {
      fieldName: "Nationality:",
      FieldValue: "Indian"
    },
    
    {
      fieldName: "Freelance:",
      FieldValue: "Available"
    },
    {
      fieldName: "Languages:",
      FieldValue: "English, Hindi"
    },
    {
      fieldName: "Email:",
      FieldValue: "abhishekmonu2000@gmail.com"
    },
  ]
};

const experience = {
  icon: "/assets/resume/badge.svg",
  title: "My Experience",
  items: [
    {
      company: "Google Developer Student Clubs",
      position: "AI & Data Engineer",
      duration: "Aug 2022 - Present",
      description: "Designed and deployed data pipelines for analytics and model training, improving data reliability and enabling faster feature development for predictive systems.",
    },
    {
      company: "GDSC, NIT Calicut",
      position: "Cloud Data Engineering Lead",
      duration: "Oct 2023",
      description: "Built scalable cloud workflows on Google Cloud, including managed storage and data processing services, strengthening the foundation for AI and analytics initiatives.",
    },
  ],
};


const education = {
  icon: "/assets/resume/cap.svg",
  title: "My Education",
  description: "Currently pursuing a Bachelor's degree at the esteemed National Institute of Technology Calicut (NIT Calicut), one of India’s top engineering institutes. Developing a strong technical foundation in computer science through hands-on projects, advanced coursework, and active engagement in cutting-edge technologies.",
  items: [
    {
      institute: "National Institute of Technology, Calicut",
      Degree: "Bachelor of Technology (MSE)",
      duration: "2021-Expected 2025",
      cgpa: "CGPA : 8.37/10"
    },
    {
      institute: "Lord Buddha Public School, Kota",
      Degree: "Senior Secondary Education (CBSE)",
      duration: "2019-2020",
      cgpa: "Percentage : 82.2%"
    },
  ]
};

const skills = {
  title: "My Skills",
  description: "I focus on AI engineering, data science, and pipeline automation. My toolset covers model development, analytics, cloud infrastructure, and production-ready data systems.",
  skillList: [
    {
      icon: <FaPython />,
      name: 'Python',
    },
    {
      icon: <SiNumpy />,
      name: 'NumPy',
    },
    {
      icon: <SiPandas />,
      name: 'Pandas',
    },
    {
      icon: <SiTensorflow />,
      name: 'TensorFlow',
    },
    {
      icon: <SiPytorch />,
      name: 'PyTorch',
    },
    {
      icon: <SiPostgresql />,
      name: 'PostgreSQL',
    },
    {
      icon: <SiApachekafka />,
      name: 'Kafka',
    },
    {
      icon: <SiKubernetes />,
      name: 'Kubernetes',
    },
    {
      icon: <SiDocker />,
      name: 'Docker',
    },
    {
      icon: <FaAws />,
      name: 'AWS',
    },
    {
      icon: <SiGit />,
      name: 'Git',
    },
    {
      icon: <SiTypescript />,
      name: 'TypeScript',
    },
    {
      icon: <SiNextdotjs />,
      name: 'Next.js',
    },
    {
      icon: <SiTailwindcss />,
      name: 'Tailwind CSS',
    },
    {
      icon: <FaGithub />,
      name: 'GitHub',
    },
  ],
};

import {Tabs , TabsContent , TabsList , TabsTrigger} from '@/components/ui/tabs'
import { Tooltip , TooltipContent , TooltipProvider , TooltipTrigger } from "@/components/ui/tooltip";
import { ScrollArea } from "@/components/ui/scroll-area";
import {motion} from "framer-motion"



const Resume = () => {
  return (
    <motion.div initial = {{opacity:0}} animate = {{opacity : 1 , transition: {delay:
      2.4 , duration: 0.4 , ease: "easeIn"
    }}}
    className="min-h-[80vh] flex items-center justify-center py-12 xl:py-0  " >
      <div className="container mx-auto">
        <Tabs defaultValue="experience" className="flex flex-col xl:flex-row gap-[60px] " >
          <TabsList className=" flex flex-col w-full max-w-[380px] mx-auto xl:mx-0 gap-6 ">
            <TabsTrigger value="experience">Experience</TabsTrigger>
            <TabsTrigger value="education">Education</TabsTrigger>
            <TabsTrigger value="skills">Skills</TabsTrigger>
            <TabsTrigger value="about">About Me</TabsTrigger>

          </TabsList>
          <div className=" min-h-[70vh] w-full " >
            <TabsContent value="experience" className=" w-full ">
              <div className=" flex flex-col gap-[30px] text-center xl:text-left ">
                <h3 className="text-4xl font-bold">{experience.title}</h3>
                <ScrollArea className=" h-[400px] ">
                    <ul className="grid grid-cols-1 lg:grid-cols-2 gap-[30px] ">
                      {experience.items.map((item , index) => {
                        return (
                        <li key={index} className=" bg-[#232329] h-[520px] py-6 px-10 rounded-xl flex flex-col
                         items-center lg:items-start gap-1 ">
                          <h3 className=" text-2xl max-w-[360px] min-h-[80px] text-center lg:text-left text-accent ">{item.position}</h3>
                          <div className=" flex flex-row   ">
                            <span className=" w-[6px] h-[6px] mr-4 mt-3 rounded-full bg-accent ">
                                  {/* dot */}
                            </span>
                            <p className="text-white/60" >{item.company}</p>


                          </div>
                          <span className="ml-6">{item.duration}</span>

                          <p className="max-w-[1000px] text-white/80 mx-auto xl:mx-0 mt-2 " >{item.description}</p>

                        </li>);
                      })}
                    </ul>
                </ScrollArea>
              </div>
            </TabsContent>



            <TabsContent value="education" className=" w-full ">
            <div className=" flex flex-col gap-[30px] text-center xl:text-left ">
                <h3 className="text-4xl font-bold">{education.title}</h3>
                <p className="max-w-[1000px] text-white/80 mx-auto xl:mx-0 " >{education.description}</p>

                <ScrollArea className=" h-[400px] ">
                    <ul className="grid grid-cols-1 lg:grid-cols-2 gap-[30px] ">
                      {education.items.map((item , index) => {
                        return (
                        <li key={index} className=" bg-[#232329] h-[264px] py-6 px-10 rounded-xl flex flex-col
                         items-center lg:items-start gap-1 ">
                          <h3 className=" text-xl max-w-[360px] min-h-[80px] text-center lg:text-left text-accent ">{item.Degree}</h3>
                          <div className=" flex flex-row  gap-2  ">
                            <span className=" w-[6px] h-[6px] pr-1 mr-2 mt-3 rounded-full bg-accent ">
                                  {/* dot */}
                            </span>
                            <p className="text-white/60 text-md" >{item.institute}</p>

                          </div>

                          <span className="ml-5">{item.duration}</span>
                          <p className="text-white/60 ml-5 " >{item.cgpa}</p>



                        </li>);
                      })}
                    </ul>
                </ScrollArea>
              </div>
            </TabsContent>




            <TabsContent value="skills" className=" w-full h-full mb-6 ">
              <div className="flex flex-col gap-[30px]">
                <div className="flex flex-col gap-[30px] text-center xl:text-left " >
                  <h3 className="text-4xl font-bold" >{skills.title}</h3>
                  <p className="max-w-[600px] text-white/60 mx-auto xl:mx-0  " >{skills.description}</p>
                </div>
                <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 xl:gap-[30px] " >
                  {skills.skillList.map((skill , index) => {
                    return <li key={ index}> 
                      <TooltipProvider delayDuration={100} >
                        <Tooltip>
                          <TooltipTrigger className="w-full h-[150px] bg-[#232329] rounded-xl flex justify-center items-center group " >
                              <div className="text-6xl group-hover:text-accent transition-all duration-300" >{skill.icon}</div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="capitalize " >{skill.name}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                     </li>
                  })}
                </ul>
              </div>
            </TabsContent>





            <TabsContent value="about" className=" w-full text-center xl:text-left  ">
              <div className="flex flex-col gap-[30px]" >
                <h3 className="text-4xl font-bold  " >{about.title}</h3>
                <p className="max-w-[600px] text-white/60 mx-auto xl:mx-0 "  >{about.description}</p>
                <ul className=" grid grid-cols-1 xl:grid-cols-2 gap-y-6 max-w-[620px] mx-auto xl:mx-0 " >
                  {about.info.map((item , index) => {
                    return <li key={index} className="  flex items-center justify-center xl:justify-start gap-4 ">
                        <span className=" text-white/60 ">{item.fieldName}</span>
                        <span className=" text-xl ">{item.FieldValue}</span>
                    </li>
                  })}
                </ul>
                </div> 
            </TabsContent>
            </div>
        </Tabs>
      </div>
    </motion.div>
  )
}

export default Resume
