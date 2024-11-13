import React from "react";
import './Header.css';

const Header = ({ title, subtitle }) => {
    return (
        <>
            <div className="header bg-gradient-info pb-50 pt-7">
                <h1 className="header-title" style={{ color: 'white' }}>
                    {title}
                </h1>
                <p className="header-subtitle" style={{ color: 'white' }}>
                    {subtitle}
                </p> 
            </div>
        </>
    );
};

export default Header;

