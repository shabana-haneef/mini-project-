import React from 'react';
import { Outlet } from 'react-router-dom';
import MemberNavbar from '../../components/navbars/MemberNavbar';
import BackButton from '../../components/common/BackButton';

const MemberLayout = () => {
    return (
        <div className="min-h-screen bg-dark-bg text-slate-100 flex flex-col relative overflow-hidden">
            <div className="fixed top-[-20%] right-[-10%] w-[50%] h-[50%] bg-accent-secondary/5 rounded-full blur-[150px] pointer-events-none"></div>
            <div className="fixed bottom-[-20%] left-[-10%] w-[50%] h-[50%] bg-purple-500/5 rounded-full blur-[150px] pointer-events-none"></div>

            <MemberNavbar />

            <main className="flex-1 w-full overflow-y-auto pt-8 pb-12 px-4 sm:px-6 lg:px-8 custom-scrollbar relative z-10">
                <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <BackButton />
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default MemberLayout;
