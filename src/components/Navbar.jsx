import React,{useState, useEffect} from "react";
import {AiOutlineClose, AiOutlineMenu} from 'react-icons/ai'
import {IoBag} from 'react-icons/io5'
import {FaRegUser} from 'react-icons/fa'

const Navbar = () => {
const[nav,setNav] = useState(true);

const handleNav = () => setNav(!nav)

const [width,setWidth] = useState(window.innerWidth)

useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    console.log(window.innerWidth);
    return () => window.removeEventListener("resize", handleResize);
  }, []
);

useEffect(() => {
    // Add event listener for resizing
    const handleResize = () => {
      if (window.innerWidth > 770) {
        setNav(true); // Reset nav if the screen width becomes bigger than 770
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

    return(
        
        <div className={width > 770 ? "flex flex-wrap justify-between max-w-[80%] items-center h-auto mx-auto px-4" : "flex justify-between max-w-[80%] items-center h-auto mx-auto px-4"}>
            <div onClick={handleNav} className={nav ? width < 770 ? "block" : "hidden" : "block"}>
                {!nav ? <AiOutlineClose size={20}/> : <AiOutlineMenu size={20}/>}
            </div>
            <h1 className="w-full text-3xl font-bold text-[#00df9a] m-4 text-center">Marka Logo</h1>
            <div>
                <ul className={nav ? width > 770 ?  "flex space-x-4 uppercase text-center text-sm" : "hidden" : "hidden"}>
                    <li className="p-2 hover:underline hover:py-1 transition-all duration-500">Necklace</li>
                    <li className="p-2 hover:underline hover:py-1 transition-all duration-500">Earrings</li>
                    <li className="p-2 hover:underline hover:py-1 transition-all duration-500">Bracelet</li>
                    <li className="p-2 hover:underline hover:py-1 transition-all duration-500">Contact</li>
                </ul>
            </div>
            <ul className="flex space-x-5">
                <li>{<FaRegUser size={20}/>}</li>
                <li>{<IoBag size={20}/>}</li>
            </ul>
            <div className={!nav ? 'fixed left-0 top-24 w-[60%] h-full border-r border-r-gray-900 text-black' : 'fixed left-[-100%] ease-in-out duration-500'}>
                <ul className="uppercase">
                    <li className="p-4 border-b border-gray-600">Necklace</li>
                    <li className="p-4 border-b border-gray-600">Earrings</li>
                    <li className="p-4 border-b border-gray-600">Bracelet</li>
                    <li className="p-4">Contact</li>
                </ul>
            </div>
        </div>
    )
}

export default Navbar