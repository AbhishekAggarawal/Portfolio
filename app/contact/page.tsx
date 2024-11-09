"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { Select , SelectContent , SelectGroup , SelectItem ,SelectLabel ,SelectTrigger , SelectValue } from "@/components/ui/select";
import { FaPhoneAlt, FaEnvelope , FaMapMarkerAlt} from "react-icons/fa"

const info = [
  {
    icon: <FaPhoneAlt/>,
    title : "Phone" ,
    description : "(+91) 8789830967",

  },
  {
    icon: <FaEnvelope/>,
    title : "Email" ,
    description : "abhishekmonu2000@gmail.com",

  },
  {
    icon: <FaMapMarkerAlt/>,
    title : "Address" ,
    description : "Ranchi, Jharkhand, 834001",

  },
];

import {motion} from "framer-motion";
import { useState, ChangeEvent, FormEvent } from 'react';

interface FormData {
  firstname: string;
  lastname: string;
  email: string;
  number: string;
  subject: string;
  message: string;
}

const Contact = () => {
  const [formData, setFormData] = useState<FormData>({
    firstname: '',
    lastname:'',
    email: '',
    number: '',
    subject: '',
    message: '',
  });
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const response = await fetch('/api/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    const result = await response.json();
    alert(result.message);
  };
  return (
    <motion.section initial={{opacity:0}} 
    animate = {{opacity:1 , transition: {delay:2.4 , duration: 0.4 , ease : "easeIn"}}}
    className=" py-6  "
    >
      <div className="container mx-auto">
         <div className=" flex flex-col xl:flex-row gap-[30px]  ">



          {/* form */}



          <div className=" xl:w-[54%] order-2 xl:order-none ">
            <form className=" flex flex-col gap-6 p-10 bg-[#27272c] rounded-xl " onSubmit={handleSubmit}>
              <h3 className=" text-4xl text-accent  " >Let's work together</h3>
              <p className=" text-white/60  ">Driven by a passion for collaboration, I thrive in dynamic team settings where diverse perspectives come together to create innovative solutions. Feel free to connect with me here:</p>


              {/* input */}

              <div className=" grid grid-cols-1 md:grid-cols-2 gap-6 ">
                <Input name="firstname" type="text" placeholder="Firstname *" value={formData.firstname}
        onChange={handleChange}
        required  = {true} />
                <Input name="lastname" type="text" placeholder="Lastname" value={formData.lastname}
        onChange={handleChange}
          />
                <Input name="email" type="email" placeholder="Your Email address *" value={formData.email}
        onChange={handleChange}
        required = {true} />
                <Input name="number" type="tel" placeholder="Phone Number"  value={formData.number}
        onChange={handleChange}
         />

              </div>

                {/* select */}

                <Select>
                  <SelectTrigger className=" w-full   ">
                    <SelectValue placeholder = "Select a service"/>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>
                        Select a service
                      </SelectLabel>
                      <SelectItem value="est">Frontend Development</SelectItem>
                      <SelectItem value="cst">UI/UX Design</SelectItem>
                      <SelectItem value="mst">Fullstack Development</SelectItem>

                    </SelectGroup>
                  </SelectContent>
                </Select>
                <Input name="subject" type="text" placeholder="Subject" value={formData.subject}
        onChange={handleChange}
          />


                {/* textarea */}

                <Textarea name="message" className=" h-[200px]  " placeholder="Type your message here. *" value={formData.message}
        onChange={handleChange}
        required = {true}/>

                    {/* button */}
                    <Button type="submit" size= "default" className=" max-w-40 ">Send Message</Button>

            </form>

          </div>
          {/* info */}
           <div className=" flex-1 flex items-center xl:justify-end order-1 xl:order-none mb-8 xl:mb-0  ">
            <ul className=" flex flex-col gap-10  ">
              {info.map((item , index) => {
                return <li key={index} className=" flex items-center gap-6">
                  <div className=" w-[52px] h-[52px] xl:w-[72px] xl:h-[72px] bg-[#27272c] text-accent  rounded-md flex items-center justify-center  ">
                    <div className=" text-[28px]  ">{item.icon}</div>
                  </div>
                  <div className="flex-1  ">
                    <p className=" text-white/60  ">{item.title}</p>
                    <h3 className="text-xl  ">{item.description}</h3>
                  </div>
                </li>
              })}
            </ul>
           </div>
         </div>
      </div>
      </motion.section>
  )
}

export default Contact