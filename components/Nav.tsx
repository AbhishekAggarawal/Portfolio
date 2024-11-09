"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
    {
        name: 'home',
        path: '/'
    },
    {
        name: 'projects',
        path: '/projects'
    },
    
    {
        name: 'resume',
        path: '/resume'
    },
    {
        name: 'certificates',
        path: '/certificates'
    },
    // {
    //     name: 'services',
    //     path: '/services'
    // },
    
    {
        name: 'contact',
        path: '/contact'
    }
]
const Nav = () => {
    const pathname = usePathname();
    console.log(pathname);
  return (
    <nav className="flex gap-8">
        {links.map((link , index) => {
            return <Link href={link.path} key={index} className={`${link.path===pathname&&
                "text-accent border-b-2 border-accent"
            } capitalize font-medium hover:text-accent transition-all text-lg `}>{link.name}</Link>
        })}
    </nav>
  )
}

export default Nav