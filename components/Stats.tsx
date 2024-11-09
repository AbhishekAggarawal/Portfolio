"use client"

import CountUp from "react-countup"

const stats = [
    {
        num: 300,
        text: "Coding Questions Solved.."
    },
    {
        num: 20,
        text: "Technologies Mastered"
    },
    {
        num: 4,
        text: "Projects Completed"
    },
    {
        num: 2,
        text: "Years of Experience"
    },
    
]


const Stats = () => {
  return (
    <section className="pt-4 pb-12 xl:pb-6 xl:pt-0 ">
        <div className="container mx-auto">
            <div className="flex flex-wrap gap-14 max-w-[80vw] mx-auto xl:max-w-[80vw] ">
                {stats.map((item,index) => {
                    return <div className="flex-1 flex gap-2 items-center justify-center xl:justify-start" key={index}>
                        <CountUp
                        end={item.num}
                        duration={10}
                        enableScrollSpy = {true}
                        scrollSpyDelay={200}
                        scrollSpyOnce = {true}
                        className="text-4xl xl:text-6xl font-extrabold"
                        /><span className="text-3xl xl:text-5xl font-extrabold text-accent">+</span>
                        <p className={`${
                            item.text.length < 15 ? "max-w-[150px]" : "max-w-[180px] "
                        } leading-snug text-white/80 `}>{item.text}</p>
                    </div>
                })}
            </div>
        </div>
    </section>
)
}

export default Stats