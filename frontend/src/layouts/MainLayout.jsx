import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import BackButton from '../components/common/BackButton';
import Sidebar from '../components/Sidebar';

const MainLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const closeSidebar = () => {
        setIsSidebarOpen(false);
    };

    return (
        <div className="min-h-screen bg-dark-bg text-slate-100 flex flex-col relative overflow-hidden">
            {/* Global Background Glows */}
            <div className="fixed top-[-20%] right-[-10%] w-[50%] h-[50%] bg-accent-primary/5 rounded-full blur-[150px] pointer-events-none"></div>
            <div className="fixed bottom-[-20%] left-[-10%] w-[50%] h-[50%] bg-accent-secondary/5 rounded-full blur-[150px] pointer-events-none" style={{ animationDelay: '2s' }}></div>

            {/* Navbar (Fixed Header) */}
            <Navbar toggleSidebar={toggleSidebar} />

            <div className="flex flex-1 overflow-hidden relative z-10">
                {/* Sidebar (Fixed on Desktop, Drawer on Mobile) */}
                <Sidebar isOpen={isSidebarOpen} closeSidebar={closeSidebar} />

                {/* Main Content Area */}
                <main className="flex-1 w-full lg:w-[calc(100%-16rem)] overflow-y-auto overflow-x-hidden pt-8 pb-12 px-4 sm:px-6 lg:px-8 custom-scrollbar">
                    <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <BackButton />
                        {/* Nested Routes render here */}
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default MainLayout;
