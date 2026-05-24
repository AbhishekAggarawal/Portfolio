"use client"

import {BsArrowDownRight} from "react-icons/bs"
import Link from "next/link"
import {motion} from "framer-motion"

const services = [
  {
    num: '01',
    title: 'AI System Design',
    description: 'Architect scalable machine learning applications, from data ingestion and model training to deployment and monitoring.',
    href: '/contact',
  },
  {
    num: '02',
    title: 'Data Engineering',
    description: 'Build robust ETL pipelines, data warehouses, and analytics platforms to make trusted data available for decision-making.',
    href: '/contact',
  },
];




const Services = () => {
  return (
    <section className="min-h-[80vh] flex flex-col justify-center py-12 xl:py-0">
      <div className="container mx-auto">
        <motion.div initial={{opacity:0}} animate= {{opacity:1 , transition: {delay:2.4 , duration : 0.4 , 
          ease: "easeIn"
        }}}
        className="grid grid-cols-1 md:grid-cols-2 gap-[60px]">

          {services.map((service , index) => {
            return <div key={index} className="glass-card p-8 flex flex-col justify-between group hover:border-accent/50 transition-all duration-500">
              <div>
                <div className="w-full flex justify-between items-center mb-6">
                  <div className=" text-5xl font-extrabold text-outline text-transparent group-hover:text-outline-hover
                   transition-all duration-500 ">
                    {service.num}
                  </div>
                  <Link href={service.href} 
                  className=" w-[70px] h-[70px] rounded-full bg-accent/20 hover:bg-accent group-hover:bg-accent transition-all duration-500 
                  flex justify-center items-center hover:-rotate-45 border border-accent/50 ">
                  <BsArrowDownRight className="text-accent text-3xl group-hover:text-white transition-all duration-500" />
                  </Link>
                </div>
                <h2 className=" text-[32px] font-bold leading-none text-white group-hover:text-accent transition-all duration-500 mb-4">{service.title}</h2>
                <p className=" text-white/60 group-hover:text-white/80 transition-all duration-500"> {service.description} </p>
              </div>
              <div className="border-t border-accent/20 mt-6 pt-6">
                <p className="text-accent text-sm">Get started →</p>
              </div>
            </div>
          })}

          </motion.div>

      </div>
    </section>
  )
}

export default Services