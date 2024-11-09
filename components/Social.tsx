import Link from "next/link"

import {FaGithub , FaLinkedinIn} from "react-icons/fa"
import {SiLeetcode , SiGeeksforgeeks} from "react-icons/si"


const socials = [
  {icon : <FaLinkedinIn/> , path: "https://www.linkedin.com/in/abhishek-aggarwal-2564871bb/"},
  {icon : <FaGithub/> , path: "https://github.com/AbhishekAggarawal"},
  {icon : <SiLeetcode/> , path: "https://leetcode.com/u/abhishekmonu2000/"},
  {icon : <SiGeeksforgeeks/> , path: "https://www.geeksforgeeks.org/user/abhishekmonu2000/"},

    

]

const Social = ({containerStyles , iconStyles}: any) => {
  return (
    <div className={containerStyles}>
        {socials.map((item , index) => {
            return <Link key={index} href={item.path} target="_blank" className={iconStyles}>
                {item.icon}
            </Link>
        })}
    </div>
  )
}

export default Social