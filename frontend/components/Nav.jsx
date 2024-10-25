import React, { useState } from 'react';

const Nav = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleDropdown = () => {
        setIsOpen((prev) => !prev);
    };

    const closeDropdown = (event) => {
        if (event.target.closest('#dropdownButton') || event.target.closest('#dropdownMenu')) return;
        setIsOpen(false);
    };

    return (        
        <div className='py-2 px-3'>
            <nav className="bg-white shadow-md rounded-2xl">
            <div className="container mx-auto flex justify-between items-center p-4">
                <div className="flex items-center">
                    <a href="#" className="text-2xl font-bold text-blue-600">Brand</a>
                </div>
                <div className="hidden md:flex space-x-4">
                    <a href="#" className="text-gray-700 hover:text-blue-500">Home</a>
                    <a href="#" className="text-gray-700 hover:text-blue-500">About</a>
                    <a href="#" className="text-gray-700 hover:text-blue-500">Services</a>
                    <a href="#" className="text-gray-700 hover:text-blue-500">Contact</a>
                </div>
                <div className="md:hidden">
                    <button
                        id="dropdownButton"
                        onClick={toggleDropdown}
                        className="flex items-center justify-center p-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
                        </svg>
                    </button>
                    {isOpen && (
                        <div
                            id="dropdownMenu"
                            className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-10"
                            onClick={closeDropdown}
                        >
                            <a href="#" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Home</a>
                            <a href="#" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">About</a>
                            <a href="#" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Services</a>
                            <a href="#" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Contact</a>
                        </div>
                    )}
                </div>
            </div>
        </nav>
        </div>
            );
};

export default Nav;
